/** Isolated real DSH Web renderer. All install/log/session paths stay in a new temp home. */
import assert from 'node:assert/strict'
import { readFile, writeFile, open, mkdtemp, mkdir } from 'node:fs/promises'
import { execFile, spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

export async function createHarness({ cli, playwright, executablePath, output, runtime = process, chromium: browserType, debugPort }) {
  const root = await mkdtemp(join(tmpdir(), 'dsh-paper-theme-'))
  await mkdir(output, { recursive: true })
  const env = { ...runtime.env, DSH_HOME: join(root, 'home'), DSH_TELEMETRY_DISABLED: '1' }
  for (const key of Object.keys(env)) if (/API_KEY|AUTH_TOKEN|ACCESS_TOKEN|NODE_PATH/.test(key)) delete env[key]
  const run = args => new Promise((resolve, reject) => execFile(runtime.execPath, [cli, ...args],
    { cwd: root, env, windowsHide: true, maxBuffer: 8 * 1024 * 1024 }, (error, stdout, stderr) =>
      error ? reject(new Error(`Isolated DSH command failed; private log directory: ${root}\n${stderr}`)) : resolve(stdout + stderr)))
  const patch = join(root, 'offline.patch.yml')
  await writeFile(patch, '- id: agent-default-model\n  config:\n    provider: paper-verification-offline\n    model: offline\n- id: ui-settings-general\n  config:\n    welcomeNoticeVersion: 2026-09-28.1\n')
  const chromium = browserType || (await import(pathToFileURL(playwright))).chromium
  const browser = await chromium.launch({ executablePath, headless: true, args: debugPort ? [`--remote-debugging-port=${debugPort}`] : [] })
  const context = await browser.newContext({ viewport: { width: 1366, height: 960 }, locale: 'zh-CN' })
  const page = await context.newPage()
  const errors = [], consoleErrors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()) })
  await page.addLocatorHandler(page.getByRole('button', { name: '继续', exact: true }), button => button.click())
  let host, generation = 0, origin
  async function stop() {
    if (host?.exitCode !== null) return
    for (const other of context.pages()) if (other !== page) await other.close()
    if (!page.isClosed()) await page.goto('about:blank')
    if (runtime.platform === 'win32') await new Promise(resolve => execFile('taskkill.exe', ['/PID', String(host.pid), '/T', '/F'], { windowsHide: true }, resolve))
    else host.kill('SIGTERM')
    await new Promise(resolve => { if (host.exitCode !== null) resolve(); else host.once('exit', resolve) })
  }
  async function start() {
    const logfile = join(root, `host-${++generation}.log`)
    const stdout = await open(logfile, 'w'), stderr = await open(join(root, `host-error-${generation}.log`), 'w')
    host = spawn(runtime.execPath, [cli, '--profile', 'web', '--patch', patch, '--no-open', '--port', origin ? new URL(origin).port : '0'],
      { cwd: root, env, windowsHide: true, stdio: ['ignore', stdout.fd, stderr.fd] })
    await stdout.close(); await stderr.close()
    let login
    for (let i = 0; i < 1200; i++) {
      assert.equal(host.exitCode, null, `Host exited; private logs in ${root}`)
      login = (await readFile(logfile, 'utf8')).match(/http:\/\/127\.0\.0\.1:\d+\/[^\s\x1b]*/)?.[0]
      if (login) break
      await delay(250)
    }
    assert(login, 'Host startup timeout')
    origin = new URL(login).origin
    await page.goto(login, { waitUntil: 'domcontentloaded' })
  }
  async function install(source) {
    await writeFile(join(root, `install-${Date.now()}.log`), await run(['plugin', '--profile', 'web', 'add', '--prod', resolve(source), '--reporter=append-only']))
  }
  return { root, output, run, install, page, context, browser, errors, consoleErrors, start, stop,
    screenshot: name => page.screenshot({ path: join(output, name + '.png'), fullPage: true }),
    close: async () => { await browser.close(); await stop() },
  }
}

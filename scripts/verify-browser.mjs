/** Run against npm tarballs in a newly created isolated DSH home. No model calls. */
import assert from 'node:assert/strict'
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { resolve, dirname, join } from 'node:path'
import { createHash } from 'node:crypto'
import { createHarness } from './browser-harness.mjs'
import { seedSession } from './seed-session.mjs'
import { verifyTheme, verifyTasks, verifyConversation, verifyDisable, verifyUninstall } from './browser-checks.mjs'

const [themePackage, tasksPackage] = process.argv.slice(2).map(path => resolve(path))
assert(themePackage && tasksPackage, 'Usage: node scripts/verify-browser.mjs <theme.tgz> <tasks.tgz>')
const cli = process.env.DSH_CLI
const playwright = process.env.PLAYWRIGHT_MODULE
const executablePath = process.env.BROWSER_EXECUTABLE
assert(cli && playwright && executablePath, 'Set DSH_CLI, PLAYWRIGHT_MODULE, BROWSER_EXECUTABLE to local installation paths')
const output = resolve(process.env.SCREENSHOT_OUTPUT || 'docs/screenshots')
const report = resolve(process.env.VERIFICATION_REPORT || 'docs/browser-verification.json')
const app = await createHarness({ cli, playwright, executablePath, output })
app.page.setDefaultTimeout(45000)
const result = { date: new Date().toISOString(), environment: {
  node: process.version, os: process.platform, arch: process.arch, browser: app.browser.version(),
  host: JSON.parse(await readFile(join(dirname(dirname(cli)), 'package.json'), 'utf8')).version,
  profile: 'web', isolation: 'new temporary DSH_HOME, original local synthetic transcript, no configured model',
}, checks: {} }
const hash = async file => createHash('sha256').update(await readFile(file)).digest('hex')
try {
  await seedSession(app.root)
  console.log('Installing theme tarball in isolated profile…')
  await app.install(themePackage)
  await app.start()
  result.checks.themeOnly = await verifyTheme(app.page, output)
  console.log('Theme-only checks passed; verifying disable…')
  result.checks.disable = await verifyDisable(app.page, output)
  await app.stop()
  await app.install(tasksPackage)
  await app.start()
  await app.page.waitForFunction(() => document.body.getAttribute('data-dsh-paper-theme') === 'paper')
  result.checks.hostRestartRestoresPaper = true
  console.log('Host restart passed; verifying task controls…')
  result.checks.tasks = await verifyTasks(app.page, output)
  result.checks.conversation = await verifyConversation(app.page, output)
  console.log('Task and conversation checks passed; uninstalling theme…')
  result.checks.uninstall = await verifyUninstall(app.page, output)
  result.pageErrors = app.errors
  result.consoleErrors = app.consoleErrors
  result.testedTarballs = { theme: await hash(themePackage), tasks: await hash(tasksPackage) }
  result.screenshots = (await readdir(output)).filter(name => name.endsWith('.png')).sort()
  result.hostFiles = {}
  const hostRoot = dirname(dirname(cli))
  for (const path of [
    'node_modules/@deepseek-ai/dsh-client-ui-theme/lib/client.js',
    'node_modules/@deepseek-ai/dsh-client-ui-theme/lib/index.js',
    'node_modules/@deepseek-ai/dsh-client-ui-settings/lib/client.js',
    'node_modules/@deepseek-ai/dsh-client-ui-layout/lib/client.js',
  ]) result.hostFiles[path] = await hash(join(hostRoot, path))
  assert.deepEqual(app.errors, [], 'Uncaught browser errors')
  assert.deepEqual(app.consoleErrors, [], 'Browser console errors')
  result.passed = true
} catch (error) {
  result.passed = false
  result.failure = error.message
  result.pageErrors = app.errors
  result.consoleErrors = app.consoleErrors
  await app.screenshot('verification-failure').catch(() => {})
  throw error
} finally {
  await writeFile(report, JSON.stringify(result, null, 2) + '\n')
  await app.close()
}
console.log(`Passed. Report: ${report}`)

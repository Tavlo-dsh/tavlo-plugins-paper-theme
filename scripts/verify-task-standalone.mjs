/** A second fresh home installs ONLY the task tarball; theme is never installed. */
import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createHarness } from './browser-harness.mjs'
import { assertNoTheme, mode, closeSettings } from './browser-checks.mjs'

const [source] = process.argv.slice(2)
assert(source, 'Usage: node scripts/verify-task-standalone.mjs <tasks.tgz>')
const app = await createHarness({ cli: process.env.DSH_CLI, playwright: process.env.PLAYWRIGHT_MODULE,
  executablePath: process.env.BROWSER_EXECUTABLE, output: resolve(process.env.SCREENSHOT_OUTPUT || 'docs/screenshots') })
const result = { date: new Date().toISOString(), freshTaskOnlyInstallation: true }
app.page.setDefaultTimeout(45000)
try {
  await app.install(resolve(source))
  await app.start()
  const page = app.page
  result.noThemeResources = await assertNoTheme(page)
  await page.getByRole('button', { name: '任务', exact: true }).click()
  await page.locator('[data-task-sync="live"]').waitFor()
  await page.getByRole('button', { name: '新建任务', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: '新建任务', exact: true })
  await dialog.locator('input[name="title"]').fill('独立任务插件 · 沿用宿主外观')
  await dialog.getByRole('button', { name: '创建任务', exact: true }).click()
  await dialog.waitFor({ state: 'detached' })
  const cards = page.locator('.dsh-tasks-root article')
  assert.equal(await cards.count(), 1)
  assert.equal(await cards.first().evaluate(el => getComputedStyle(el).backgroundImage), 'none')
  await mode(page, 'light'); await closeSettings(page)
  await app.screenshot('19-tasks-only-light')
  await mode(page, 'dark'); await closeSettings(page)
  await app.screenshot('20-tasks-only-dark')
  result.hostDarkMode = await page.locator('body').evaluate(el => el.hasAttribute('data-ds-dark-theme'))
  assert.equal(result.hostDarkMode, true)
  result.createTask = true
  result.pageErrors = app.errors
  result.consoleErrors = app.consoleErrors
  assert.deepEqual(app.errors, [])
  assert.deepEqual(app.consoleErrors, [])
  result.passed = true
} catch (error) {
  result.passed = false; result.failure = error.message
  throw error
} finally {
  await writeFile(resolve(process.env.VERIFICATION_REPORT || 'docs/tasks-standalone-verification.json'), JSON.stringify(result, null, 2) + '\n')
  await app.close()
}
console.log('Fresh task-only profile passed; both light and dark screenshots saved.')

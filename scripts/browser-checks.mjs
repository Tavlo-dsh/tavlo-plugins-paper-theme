import assert from 'node:assert/strict'
import { join } from 'node:path'

const prepared = new WeakSet()
async function preparePage(page) {
  if (prepared.has(page)) return
  prepared.add(page)
  await page.addLocatorHandler(page.getByText('开始使用', { exact: true }), async () => {
    // Setup only: a late login prompt can sit behind another host modal. Dispatch
    // its own close control so onboarding cannot intercept the feature checks.
    await page.getByRole('dialog').filter({ hasText: '开始使用' })
      .getByRole('button', { name: '关闭', exact: true }).evaluate(button => button.click())
  })
}

export async function openSettings(page) {
  await preparePage(page)
  if (await page.locator('[data-shortcut-modal="settings"]').count()) return
  // Host onboarding can arrive after the account menu opens and dismiss that menu.
  // Reopen only this navigation step; never retry an assertion or a data mutation.
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.getByRole('button', { name: '账号菜单', exact: true }).click()
    try { await page.getByText('设置', { exact: true }).click({ timeout: 2500 }); break }
    catch (error) { if (attempt === 2) throw error }
  }
  await page.locator('[data-shortcut-modal="settings"]').waitFor()
}
export async function closeSettings(page) {
  await page.locator('[data-shortcut-modal="settings"]').getByRole('button', { name: '关闭', exact: true }).click()
}
export async function appearance(page, value) {
  await openSettings(page)
  await page.getByRole('button', { name: '全局主题', exact: true }).click()
  const choice = page.locator(`input[name="dsh-paper-appearance"][value="${value}"]`)
  if (!await choice.isChecked()) await choice.click()
  await page.waitForFunction(value => document.body.getAttribute('data-dsh-paper-theme') === (value === 'paper' ? 'paper' : null), value)
  await page.getByText('已保存到当前 DSH profile，连接此宿主的页面同步生效。', { exact: true }).waitFor()
}
export async function mode(page, value) {
  await openSettings(page)
  await page.getByRole('button', { name: '通用设置', exact: true }).click()
  await page.getByRole('button', { name: value === 'dark' ? '深色' : value === 'system' ? '跟随系统' : '浅色', exact: true }).click()
  if (value !== 'system') await page.waitForFunction(value => document.documentElement.style.colorScheme === value, value)
}
export async function hostState(page) {
  return page.evaluate(() => ({
    marker: document.body.getAttribute('data-dsh-paper-theme'),
    dark: document.body.hasAttribute('data-ds-dark-theme'),
    scheme: document.documentElement.style.colorScheme,
    source: document.documentElement.getAttribute('data-ds-theme-source'),
    style: document.body.getAttribute('style'),
    base: getComputedStyle(document.body).backgroundColor,
    token: getComputedStyle(document.body).getPropertyValue('--dsw-alias-bg-base').trim(),
  }))
}

export async function verifyTheme(page, output) {
  const checks = {}
  await openSettings(page)
  await mode(page, 'light')
  await appearance(page, 'default')
  const original = await hostState(page)
  assert.equal(original.marker, null)
  assert.equal(await page.getByRole('button', { name: '任务', exact: true }).count(), 0)
  checks.standaloneDefault = true
  await page.screenshot({ path: join(output, '01-default-settings.png'), fullPage: true })
  await appearance(page, 'paper')
  const paper = await hostState(page)
  assert.equal(paper.base, 'rgb(255, 255, 255)')
  assert.equal(paper.source, original.source)
  await page.screenshot({ path: join(output, '02-paper-settings.png'), fullPage: true })
  await closeSettings(page)
  await page.screenshot({ path: join(output, '03-paper-home-light.png'), fullPage: true })
  await mode(page, 'dark')
  await closeSettings(page)
  const dark = await hostState(page)
  assert.equal(dark.base, 'rgb(21, 23, 28)')
  assert.equal(dark.dark, true)
  await page.screenshot({ path: join(output, '04-paper-home-dark.png'), fullPage: true })
  checks.lightDark = { light: paper.base, dark: dark.base }
  await mode(page, 'system')
  await page.emulateMedia({ colorScheme: 'light' })
  await page.waitForFunction(() => !document.body.hasAttribute('data-ds-dark-theme'))
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.waitForFunction(() => document.body.hasAttribute('data-ds-dark-theme'))
  checks.systemFollowsDSH = true
  await mode(page, 'light')
  await appearance(page, 'default')
  const restored = await hostState(page)
  assert.equal(restored.style, original.style)
  assert.equal(restored.base, original.base)
  checks.exactHostStyleRestored = true
  await appearance(page, 'paper')
  const radio = page.locator('input[value="paper"]')
  await radio.focus()
  await page.keyboard.press('ArrowLeft')
  await page.waitForFunction(() => !document.body.hasAttribute('data-dsh-paper-theme'))
  await page.locator('.dsh-paper-settings[aria-busy="false"]').waitFor()
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => document.body.getAttribute('data-dsh-paper-theme') === 'paper')
  await page.locator('.dsh-paper-settings[aria-busy="false"]').waitFor()
  assert.equal(await radio.evaluate(el => getComputedStyle(el).outlineStyle), 'solid')
  checks.keyboardRadio = true
  await closeSettings(page)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => document.body.getAttribute('data-dsh-paper-theme') === 'paper')
  checks.refresh = true
  // DSH authenticates each tab via sessionStorage; a same-origin opener copies it.
  const [second] = await Promise.all([
    page.context().waitForEvent('page'), page.evaluate(() => { window.open(location.href, '_blank') }),
  ])
  await second.waitForFunction(() => document.body?.getAttribute('data-dsh-paper-theme') === 'paper')
  await appearance(page, 'default')
  await second.waitForFunction(() => document.body && !document.body.hasAttribute('data-dsh-paper-theme'))
  await appearance(page, 'paper')
  await second.waitForFunction(() => document.body?.getAttribute('data-dsh-paper-theme') === 'paper')
  checks.twoPages = true
  await second.close()
  await page.setViewportSize({ width: 375, height: 812 })
  const bounds = await page.locator('.dsh-paper-settings').evaluate(el => ({ width: el.clientWidth, scroll: el.scrollWidth }))
  assert(bounds.scroll <= bounds.width)
  await page.screenshot({ path: join(output, '05-paper-settings-narrow.png'), fullPage: true })
  checks.narrowSettings = bounds
  await page.setViewportSize({ width: 1366, height: 960 })
  await closeSettings(page)
  return checks
}

export async function verifyTasks(page, output) {
  const checks = { widths: [] }
  await preparePage(page)
  await page.getByRole('button', { name: '任务', exact: true }).click()
  const root = page.locator('.dsh-tasks-root')
  await page.locator('[data-task-sync="live"]').waitFor()
  const opener = page.getByRole('button', { name: '新建任务', exact: true })
  const dialog = page.getByRole('dialog', { name: '新建任务', exact: true })
  for (const [title, stage] of [['整理本周的产品想法', '待开始'], ['完善代码阅读体验', '进行中'], ['记录全局主题的验收结果', '已完成']]) {
    if (await page.getByRole('button', { name: title, exact: true }).count()) continue
    await opener.click()
    await dialog.locator('input[name="title"]').fill(title)
    await dialog.locator('textarea').fill('把目标写清楚，保留上下文，让下一步更容易开始。此任务只写入隔离测试 home。')
    await dialog.getByRole('combobox', { name: '任务分类', exact: true }).click()
    await page.getByRole('option', { name: stage, exact: true }).click()
    await dialog.getByRole('button', { name: '创建任务', exact: true }).click()
    await dialog.waitFor({ state: 'detached' })
  }
  assert.equal(await root.locator('article').count(), 3)
  const search = root.locator('input[type="search"]')
  await search.fill('代码')
  assert.equal(await root.locator('article').count(), 1)
  await search.fill('')
  await opener.click()
  const draftTitle = dialog.locator('input[name="title"]')
  await draftTitle.fill('跨页面主题切换保留草稿')
  const draftNode = await draftTitle.elementHandle()
  const [settingsPage] = await Promise.all([
    page.context().waitForEvent('page'), page.evaluate(() => { window.open(location.href, '_blank') }),
  ])
  for (const value of ['default', 'paper']) {
    await appearance(settingsPage, value)
    await page.waitForFunction(value => document.body.getAttribute('data-dsh-paper-theme') === (value === 'paper' ? 'paper' : null), value)
    assert(await draftNode.evaluate(el => el.isConnected))
    assert.equal(await draftTitle.inputValue(), '跨页面主题切换保留草稿')
  }
  await settingsPage.close()
  await page.keyboard.press('Escape')
  checks.draftAndDOMSurviveThemeChange = true
  await mode(page, 'light')
  await appearance(page, 'paper'); await closeSettings(page)
  assert.match(await root.locator('article').first().evaluate(el => getComputedStyle(el).backgroundImage), /data:image\/png/)
  checks.lightMaterials = await verifyMaterials(root, 'light')
  await page.screenshot({ path: join(output, '07-tasks-paper-light.png'), fullPage: true })
  await appearance(page, 'default'); await closeSettings(page)
  assert.equal(await root.locator('article').first().evaluate(el => getComputedStyle(el).backgroundImage), 'none')
  await page.screenshot({ path: join(output, '08-tasks-default.png'), fullPage: true })
  for (const style of ['default', 'paper']) {
    await appearance(page, style); await closeSettings(page)
    await search.focus()
    assert.equal(await search.evaluate(el => getComputedStyle(el).outlineStyle), 'none')
    await opener.click()
    await dialog.locator('input[name="title"]').fill('切换主题后仍保留的草稿')
    assert.equal(await dialog.locator('input[name="title"]').evaluate(el => getComputedStyle(el).outlineStyle), 'none')
    const stage = dialog.getByRole('combobox', { name: '任务分类', exact: true })
    await stage.click()
    await page.keyboard.press('End'); await page.keyboard.press('Enter')
    assert.equal(await dialog.locator('input[name="stage"]').inputValue(), 'done')
    await stage.click(); await page.keyboard.press('Escape')
    assert.equal(await stage.getAttribute('aria-expanded'), 'false')
    assert(await dialog.isVisible())
    await stage.click(); await page.keyboard.press('Tab')
    assert.equal(await stage.getAttribute('aria-expanded'), 'false')
    await stage.click(); await dialog.locator('input[name="title"]').click()
    assert.equal(await stage.getAttribute('aria-expanded'), 'false')
    await stage.click()
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    await page.evaluate(() => window.dispatchEvent(new Event('blur')))
    assert.equal(await stage.getAttribute('aria-expanded'), 'false')
    await dialog.locator('input[name="title"]').focus()
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press('Tab')
      assert(await page.evaluate(() => !!document.activeElement.closest('dialog')))
    }
    await stage.click()
    await page.screenshot({ path: join(output, `09-tasks-${style}-select.png`), fullPage: true })
    await page.keyboard.press('Escape'); await page.keyboard.press('Escape')
    const card = root.locator('article').first()
    const menu = card.locator('summary')
    for (const action of ['outside', 'tab', 'escape', 'blur']) {
      await menu.click()
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      if (action === 'outside') await search.click()
      if (action === 'tab') await search.focus()
      if (action === 'escape') await page.keyboard.press('Escape')
      if (action === 'blur') await page.evaluate(() => window.dispatchEvent(new Event('blur')))
      assert.equal(await card.locator('details').evaluate(el => el.open), false, `${style} menu ${action}`)
    }
    for (const width of [1366, 1024, 768, 375]) {
      await page.setViewportSize({ width, height: 960 })
      const dimensions = await root.evaluate(el => ({ width: el.clientWidth, scrollWidth: el.scrollWidth }))
      assert(dimensions.scrollWidth <= dimensions.width + 1)
      const overlap = await root.evaluate(el => {
        const rects = [...el.querySelectorAll('.dsh-tasks-title, .dsh-tasks-search, .dsh-tasks-filter > summary, .dsh-tasks-toolbar > button')].map(node => node.getBoundingClientRect())
        return rects.some((a, i) => rects.slice(i + 1).some(b => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1))
      })
      assert.equal(overlap, false, `${style} toolbar overlap at ${width}`)
      await opener.click(); await stage.click()
      const bounds = await page.getByRole('listbox', { name: '任务分类', exact: true }).boundingBox()
      assert(bounds.x >= 0 && bounds.x + bounds.width <= width + 1 && bounds.y >= 0 && bounds.y + bounds.height <= 961)
      if (width === 375) await page.screenshot({ path: join(output, `10-tasks-${style}-narrow.png`), fullPage: true })
      await page.keyboard.press('Escape'); await page.keyboard.press('Escape')
      checks.widths.push({ style, viewport: width, ...dimensions })
    }
    await page.setViewportSize({ width: 1366, height: 960 })
  }
  checks.createSearchAndControlsBothThemes = true
  await mode(page, 'dark'); await closeSettings(page)
  checks.darkMaterials = await verifyMaterials(root, 'dark')
  await page.screenshot({ path: join(output, '11-tasks-paper-dark.png'), fullPage: true })
  await opener.click(); await dialog.getByRole('combobox', { name: '任务分类', exact: true }).click()
  await page.screenshot({ path: join(output, '12-tasks-paper-dark-select.png'), fullPage: true })
  await page.keyboard.press('Escape'); await page.keyboard.press('Escape')
  await mode(page, 'light'); await closeSettings(page)
  const card = root.locator('article').first()
  await card.locator('.dsh-tasks-card-title').click()
  const detail = page.getByRole('dialog', { name: '任务详情', exact: true })
  await detail.getByRole('button', { name: '删除任务', exact: true }).click()
  const confirmation = page.getByRole('dialog', { name: '确认删除任务？', exact: true })
  await page.screenshot({ path: join(output, '13-tasks-delete-dialog.png'), fullPage: true })
  await confirmation.getByRole('button', { name: '取消', exact: true }).click()
  assert.equal(await root.locator('article').count(), 3)
  await card.locator('summary').click()
  await card.getByRole('button', { name: '删除任务', exact: true }).click()
  await confirmation.getByRole('button', { name: '删除任务', exact: true }).click()
  await confirmation.waitFor({ state: 'detached' })
  assert.equal(await root.locator('article').count(), 2)
  checks.realDeleteCancelAndCommit = true
  return checks
}

async function verifyMaterials(root, mode) {
  const surfaces = await root.evaluate(el => {
    const read = (node, pseudo) => {
      const css = getComputedStyle(node, pseudo)
      return { color: css.backgroundColor, textured: /data:image/.test(css.backgroundImage), shadow: css.boxShadow }
    }
    return {
      desk: read(el), toolbar: read(el.querySelector('.dsh-tasks-toolbar')),
      sheet: read(el.querySelector('.dsh-tasks-col')), card: read(el.querySelector('article')),
      tapes: [...el.querySelectorAll('.dsh-tasks-col')].map(col => read(col, '::before').color),
    }
  })
  assert.equal(surfaces.desk.textured, false)
  assert.equal(surfaces.toolbar.textured, false)
  assert.equal(surfaces.sheet.textured, true)
  assert.equal(surfaces.card.textured, true)
  assert.notEqual(surfaces.card.shadow, 'none')
  assert.equal(new Set(surfaces.tapes).size, 3)
  const brightness = color => color.match(/[\d.]+/g).slice(0, 3).map(Number).reduce((a, b) => a + b, 0)
  assert(brightness(surfaces.card.color) > brightness(surfaces.sheet.color), `${mode}: cards sit above the backing sheet`)
  assert(brightness(surfaces.card.color) > brightness(surfaces.desk.color), `${mode}: cards sit above the desk`)
  return surfaces
}

export async function verifyConversation(page, output) {
  await page.setViewportSize({ width: 1366, height: 960 })
  const title = page.getByText('纸面主题 · 对话与代码验收', { exact: true }).first()
  // DSH lazily projects an imported transcript's title when it is first opened.
  if (await title.isVisible()) await title.click()
  else await page.getByText('未命名', { exact: true }).first().click()
  await page.getByRole('heading', { name: '一页清晰的工作记录', exact: true }).waitFor()
  const composer = page.locator('[data-composer-input="true"]')
  const code = page.locator('pre').filter({ hasText: 'appearance: "paper"' })
  await code.waitFor()
  await mode(page, 'light'); await appearance(page, 'paper'); await closeSettings(page)
  await page.screenshot({ path: join(output, '14-paper-conversation-light.png'), fullPage: true })
  await composer.fill('保留这份草稿：明天继续整理。')
  const composerNode = await composer.elementHandle()
  const [settingsPage] = await Promise.all([
    page.context().waitForEvent('page'), page.evaluate(() => { window.open(location.href, '_blank') }),
  ])
  for (const value of ['default', 'paper']) {
    await appearance(settingsPage, value)
    await page.waitForFunction(value => document.body.getAttribute('data-dsh-paper-theme') === (value === 'paper' ? 'paper' : null), value)
    assert(await composerNode.evaluate(el => el.isConnected))
    assert.equal(await composer.innerText(), '保留这份草稿：明天继续整理。')
  }
  await settingsPage.close()
  await composer.fill('')
  const access = page.getByRole('button', { name: '访问模式，当前：工作区内修改', exact: true })
  await access.focus()
  await page.keyboard.press('Enter')
  await page.getByRole('menu').waitFor()
  await page.screenshot({ path: join(output, '15-paper-conversation-menu.png'), fullPage: true })
  await page.keyboard.press('Escape')
  assert.equal(await page.getByRole('menu').count(), 0)
  await mode(page, 'dark'); await closeSettings(page)
  await page.screenshot({ path: join(output, '16-paper-conversation-dark.png'), fullPage: true })
  const syntax = await code.evaluate(el => {
    const style = getComputedStyle(el)
    return { foreground: style.color, background: style.backgroundColor, keyword: style.getPropertyValue('--shiki-token-keyword').trim() }
  })
  assert.equal(syntax.foreground, 'rgb(241, 244, 249)')
  assert.equal(syntax.background, 'rgb(16, 19, 24)')
  await page.setViewportSize({ width: 375, height: 812 })
  await page.waitForFunction(() => {
    const rect = document.querySelector('[data-composer-input="true"]').getBoundingClientRect()
    return rect.x >= 0 && rect.right <= 376
  })
  await composer.scrollIntoViewIfNeeded()
  const bounds = await composer.boundingBox()
  assert(bounds.x >= 0 && bounds.x + bounds.width <= 376)
  await page.screenshot({ path: join(output, '17-paper-conversation-narrow.png'), fullPage: true, animations: 'disabled' })
  await page.setViewportSize({ width: 1366, height: 960 })
  await page.getByRole('button', { name: '账号菜单', exact: true }).waitFor()
  await mode(page, 'light'); await closeSettings(page)
  return { syntheticOfflineTranscript: true, markdownAndCode: true, syntax, menuKeyboard: true, draftAndDOMSurviveThemeChange: true, narrowComposer: bounds }
}

export async function assertNoTheme(page) {
  await page.waitForFunction(() => !document.body.hasAttribute('data-dsh-paper-theme')
    && !document.querySelector('style[data-dsh-paper-settings]'))
  const remaining = await page.evaluate(() => ({
    marker: document.querySelectorAll('[data-dsh-paper-theme]').length,
    styleNodes: document.querySelectorAll('style[data-dsh-paper-settings]').length,
    tokenVariables: [...document.body.style].filter(name => name.startsWith('--dsh-paper-')).length,
  }))
  assert.deepEqual(remaining, { marker: 0, styleNodes: 0, tokenVariables: 0 })
  await openSettings(page)
  remaining.settingsEntry = await page.getByRole('button', { name: '全局主题', exact: true }).count()
  assert.equal(remaining.settingsEntry, 0)
  await closeSettings(page)
  return remaining
}

export async function verifyDisable(page, output) {
  await page.getByRole('button', { name: '插件', exact: true }).click()
  const toggle = page.getByRole('switch', { name: '启用 dsh-plugin-paper-theme', exact: true })
  if (!await toggle.isVisible()) await page.getByText('dsh-plugin-paper-theme', { exact: true }).first().click()
  assert.equal(await toggle.getAttribute('aria-checked'), 'true')
  await toggle.click()
  const removed = await assertNoTheme(page)
  await openSettings(page)
  await page.screenshot({ path: join(output, '06-disabled-settings.png'), fullPage: true })
  await closeSettings(page)
  await page.getByRole('button', { name: '插件', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('[role="switch"][aria-label="启用 dsh-plugin-paper-theme"]')?.getAttribute('aria-checked') === 'false')
  await toggle.click()
  await page.waitForFunction(() => document.body.getAttribute('data-dsh-paper-theme') === 'paper')
  return { removed, reenableRestoresSavedPaper: true }
}

export async function verifyUninstall(page, output) {
  await page.getByRole('button', { name: '插件', exact: true }).click()
  const remove = page.getByRole('button', { name: '卸载 dsh-plugin-paper-theme', exact: true })
  if (!await remove.isVisible()) await page.getByText('dsh-plugin-paper-theme', { exact: true }).first().click()
  await remove.click()
  await page.getByRole('dialog', { name: '卸载「dsh-plugin-paper-theme」？', exact: true })
    .getByRole('button', { name: '卸载', exact: true }).click()
  const removed = await assertNoTheme(page)
  await page.getByRole('button', { name: '任务', exact: true }).click()
  await page.locator('[data-task-sync="live"]').waitFor()
  const cards = page.locator('.dsh-tasks-root article')
  assert.equal(await cards.count(), 2)
  assert.equal(await cards.first().evaluate(el => getComputedStyle(el).backgroundImage), 'none')
  await page.screenshot({ path: join(output, '18-tasks-after-theme-removal.png'), fullPage: true })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: '任务', exact: true }).click()
  await page.locator('[data-task-sync="live"]').waitFor()
  assert.equal(await cards.count(), 2)
  // Existing task behavior intentionally restores a saved creation draft on reload.
  const restoredDraft = page.getByRole('dialog', { name: '新建任务', exact: true })
  if (await restoredDraft.isVisible()) {
    await page.keyboard.press('Escape')
    await restoredDraft.waitFor({ state: 'detached' })
  }
  await assertNoTheme(page)
  return { removed, withoutReload: true, tasksStandaloneAfterReload: true, remainingTasks: 2 }
}

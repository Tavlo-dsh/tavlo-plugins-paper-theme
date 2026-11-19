import assert from 'node:assert/strict'
import test from 'node:test'
import vm from 'node:vm'
import { readFile } from 'node:fs/promises'
import { setImmediate } from 'node:timers/promises'

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')
const globalMarker = 'data-dsh-paper-theme'
const taskMarker = 'data-dsh-task-appearance'
const taskSlot = 'tavlo-tasks.appearance'

function mount({ appearance = 'default', taskAppearance, status = 'ready', writable = true, supported = true, marker, taskSurface = false } = {}) {
  let plugin, state = { value: { appearance, taskAppearance }, status, writable }
  const subscriptions = new Set(), layers = new Map(), styles = new Set(), slots = new Set(), dictionaries = new Map()
  const attrs = new Map(marker === undefined ? [] : [['data-dsh-paper-theme', marker]])
  const document = {
    body: { getAttribute: name => attrs.get(name) ?? null, setAttribute: (name, value) => attrs.set(name, value), removeAttribute: name => attrs.delete(name) },
    head: { appendChild: style => styles.add(style) },
    createElement: () => { const style = { dataset: {}, remove: () => styles.delete(style) }; return style },
  }
  const effects = [], writes = [], layerChanges = []
  let behavior
  const form = {
    getSnapshot: () => state,
    subscribe(listener) { subscriptions.add(listener); return () => subscriptions.delete(listener) },
    async set(field, value) {
      writes.push([field, value])
      const accepted = behavior ? await behavior(value, field) : true
      if (accepted) update({ value: { ...state.value, [field]: value } })
      return accepted
    },
  }
  function update(patch) { state = { ...state, ...patch }; for (const listener of subscriptions) listener() }
  const theme = supported ? {
    overrideTokens(id, tokens) {
      layerChanges.push(tokens)
      layers.set(id, tokens)
      return () => {
        if (layers.get(id) !== tokens) return
        layerChanges.push(null)
        layers.delete(id)
      }
    },
  } : {}
  const ctx = {
    theme, configForms: { get: name => { assert.equal(name, 'tavlo-paper-theme'); return form } },
    effect: callback => { const dispose = callback(); effects.push(dispose); return dispose },
    locale: {
      register(ns, lang, values) { dictionaries.set(lang, values); return () => dictionaries.delete(lang) },
      bind: () => key => dictionaries.get('zh')[key],
    },
    slots: {
      inject(name, callback) {
        assert(['settings.section', taskSlot].includes(name))
        if (name !== taskSlot || taskSurface) effects.push(callback())
      },
      register(config, component) { const slot = { config, component }; slots.add(slot); return () => slots.delete(slot) },
    },
  }
  vm.runInNewContext(source, { document, window: { __ModuleLoader__: { load(module) {
    assert.equal(module.id, '@tavlo-dsh/dsh-plugin-paper-theme')
    plugin = module.factory(name => { assert.equal(name, 'react'); return { createElement: (type, props, ...children) => ({ type, props, children }) } })
  } } } })
  plugin.apply(ctx)
  const slot = [...slots][0]
  const props = slot.config.inject()
  const controller = props.hooks.preference
  const usePreference = selector => selector(controller.getSnapshot())
  return { controller, layers, layerChanges, attrs, styles, slots, subscriptions, dictionaries, writes, update,
    behavior: value => { behavior = value },
    dispose: () => { for (const dispose of effects.reverse()) dispose() },
    render: () => slot.component({ ...props, usePreference }),
    renderTask: () => [...slots].find(entry => entry.config.name === taskSlot).component({ ...props, usePreference }),
  }
}

test('fresh install leaves the host untouched and offers a separate global settings section', () => {
  const app = mount()
  assert.equal(app.layers.size, 0)
  assert.equal(app.attrs.size, 0)
  assert.equal(app.slots.size, 1)
  assert.equal(app.writes.length, 0)
  assert.equal(app.render().type, 'section')
  app.dispose()
  for (const collection of [app.layers, app.attrs, app.styles, app.slots, app.subscriptions, app.dictionaries]) assert.equal(collection.size, 0)
})

test('default → paper → default persists only its own field and releases the layer', async () => {
  const app = mount()
  await app.controller.select('paper')
  assert.equal(app.layers.size, 1)
  assert.equal(app.attrs.get('data-dsh-paper-theme'), 'paper')
  const tokens = [...app.layers.values()][0]
  assert.deepEqual({ ...tokens['--dsw-radius-lg'] }, { light: '16px', dark: '16px' })
  assert.deepEqual({ ...tokens['--dsw-radius-xl'] }, { light: '20px', dark: '20px' })
  for (const [name, modes] of Object.entries(tokens)) {
    assert.equal(typeof modes.light, 'string', name)
    assert.equal(typeof modes.dark, 'string', name)
    assert(!/font|color-scheme/.test(name))
  }
  await app.controller.select('default')
  assert.equal(app.layers.size, 0)
  assert.equal(app.attrs.size, 0)
  assert.deepEqual(app.writes, [['appearance', 'paper'], ['appearance', 'default']])
  app.dispose()
})

test('iOS changes the host palette and radii and coexists with saved paper preferences', async () => {
  const app = mount({ appearance: 'paper' })
  const paper = [...app.layers.values()][0]
  await app.controller.select('ios')
  assert.equal(app.layers.size, 1)
  assert.equal(app.attrs.get(globalMarker), 'ios')
  assert.equal(app.attrs.has(taskMarker), false)
  const ios = [...app.layers.values()][0]
  assert.equal(ios['--dsw-radius-lg'].light, '20px')
  assert.equal(ios['--dsw-radius-lg'].dark, '20px')
  assert.equal(ios['--dsw-alias-bg-base'].light, 'var(--dsh-ios-canvas)')
  assert.equal(ios['--dsh-ios-canvas'].light, '#ffffff')
  assert.equal(ios['--dsh-paper-tape'], undefined)
  assert(!Object.keys(ios).some(name => /font|color-scheme/.test(name)))
  await app.controller.select('paper')
  assert.equal(app.attrs.get(globalMarker), 'paper')
  assert.deepEqual([...app.layers.values()][0], paper)
  app.dispose()
  assert.equal(app.layers.size, 0)
  assert.equal(app.attrs.size, 0)
})

test('task appearance previews before the save and only changes the board palette', async () => {
  const app = mount({ taskSurface: true })
  const picker = () => app.renderTask().children[0].children.find(child => child.type === 'select')
  assert.equal(picker().props.value, 'inherit')
  assert.deepEqual(Array.from(picker().children[0], option => option.props.value), ['inherit', 'ios', 'paper'])
  let confirm
  app.behavior(() => new Promise(resolve => { confirm = resolve }))
  picker().props.onChange({ currentTarget: { value: 'ios' } })
  assert.equal(picker().props.value, 'ios')
  assert.equal(app.renderTask().props['aria-busy'], true)
  assert.equal(app.attrs.get(taskMarker), 'ios')
  assert.equal(app.attrs.has(globalMarker), false)
  assert.equal(app.layerChanges.length, 0)
  assert.match([...app.styles][0].textContent, /body\[data-dsh-task-appearance="ios"\] \.dsh-tasks-root \{\s*--dsh-ios-canvas: light-dark\(/)
  confirm(true)
  await setImmediate()
  assert.equal(app.renderTask().props['aria-busy'], false)
  assert.deepEqual(app.writes, [['taskAppearance', 'ios']])
  app.behavior(undefined)
  await app.controller.select('paper')
  const global = [...app.layers.values()][0]
  assert.equal(app.attrs.get(globalMarker), 'paper')
  assert.equal(app.attrs.get(taskMarker), 'ios')
  assert.equal(global['--dsw-alias-bg-base'].light, 'var(--dsh-paper-canvas)')
  assert.equal(global['--dsh-ios-canvas'], undefined)
  await app.controller.select('inherit', 'taskAppearance')
  assert.equal(app.attrs.has(taskMarker), false)
  assert.equal(app.attrs.get(globalMarker), 'paper')
  assert.deepEqual(app.layerChanges, [global])
  app.dispose()
})

test('Looseleaf tokens are emitted only on the effective-Paper editor drawer', () => {
  const app = mount({ appearance: 'paper' })
  const css = [...app.styles][0].textContent
  const selector = ':is(body[data-dsh-task-appearance="paper"], body[data-dsh-paper-theme="paper"]:not([data-dsh-task-appearance="ios"])) .dsh-tasks-editor-drawer'
  const start = css.indexOf(`\n${selector} {\n`)
  assert(start >= 0, 'Task Paper overrides any global choice; task iOS blocks global Paper')
  const end = css.indexOf('\n}', start)
  assert(end > start)
  const declarations = css.slice(start, end).trim().split('\n').slice(1).map(line => line.trim())
  assert.doesNotMatch(css.slice(0, start) + css.slice(end), /--dsh-looseleaf-/)

  const palette = [...app.layers.values()][0]
  const paper = name => {
    const { light, dark } = palette[`--dsh-paper-${name}`]
    return `light-dark(${light}, ${dark})`
  }
  assert(!Object.keys(palette).some(name => name.startsWith('--dsh-looseleaf-')))
  const tokens = {
    'control-fill': paper('surface'), 'control-line': paper('line'), 'control-ink': paper('ink'),
    muted: paper('muted'), focus: paper('accent'), hover: paper('hover'), pressed: paper('active'),
    'primary-fill': paper('accent'), 'primary-ink': paper('onAccent'),
    'overlay-fill': paper('paper'), 'overlay-shadow': `0 6px 22px ${paper('shadow')}`,
    radius: palette['--dsw-radius-sm'].light, 'radius-sm': palette['--dsw-radius-xs'].light,
  }
  assert.deepEqual(declarations, Object.entries(tokens).map(([key, value]) => `--dsh-looseleaf-${key}: ${value};`))
  app.dispose()
})

test('Looseleaf selector inputs omit the default and inherit markers', () => {
  for (const appearance of ['default', 'ios', 'paper']) {
    for (const taskAppearance of ['inherit', 'ios', 'paper']) {
      const app = mount({ appearance, taskAppearance })
      assert.equal(app.attrs.get(globalMarker), appearance === 'default' ? undefined : appearance)
      assert.equal(app.attrs.get(taskMarker), taskAppearance === 'inherit' ? undefined : taskAppearance)
      app.dispose()
    }
  }
})

test('Host changes restore both appearances; a refused task write keeps the acknowledged style', async () => {
  const app = mount({ appearance: 'ios', taskAppearance: 'paper', taskSurface: true })
  assert.equal(app.attrs.get(taskMarker), 'paper')
  const tokens = [...app.layers.values()][0]
  assert.equal(tokens['--dsw-alias-bg-base'].light, 'var(--dsh-ios-canvas)')
  assert.equal(tokens['--dsh-paper-card'], undefined)
  let reject
  app.behavior(() => new Promise(resolve => { reject = () => resolve(false) }))
  const saving = app.controller.select('ios', 'taskAppearance')
  assert.equal(app.attrs.get(taskMarker), 'ios')
  reject()
  await saving
  assert.equal(app.attrs.get(taskMarker), 'paper')
  assert.deepEqual(app.layerChanges, [tokens])
  assert(app.renderTask().children.some(child => child?.props?.role === 'alert'))
  app.update({ value: { appearance: 'ios', taskAppearance: 'ios' } })
  assert.equal(app.attrs.get(taskMarker), 'ios')
  app.update({ status: 'unavailable' })
  assert.equal(app.attrs.size, 0)
  assert.equal(app.layers.size, 0)
  app.dispose()
})

test('rapid picks preview the newest choice without flicker and coalesce queued saves per field', async () => {
  const app = mount()
  let confirm
  app.behavior(() => app.writes.length === 1 ? new Promise(resolve => { confirm = resolve }) : true)
  const saving = app.controller.select('ios')
  assert.equal(app.attrs.get(globalMarker), 'ios')
  assert.equal(app.controller.getSnapshot().savingAppearance, true)
  await app.controller.select('paper')
  assert.equal(app.attrs.get(globalMarker), 'paper')
  await app.controller.select('default')
  await app.controller.select('ios', 'taskAppearance')
  assert.equal(app.attrs.has(globalMarker), false)
  assert.equal(app.attrs.get(taskMarker), 'ios')
  assert.deepEqual(app.writes, [['appearance', 'ios']])
  app.update({ value: { appearance: 'ios' } })
  assert.equal(app.attrs.has(globalMarker), false, 'An older acknowledgement must not replace the latest preview')
  confirm(true)
  await saving
  assert.deepEqual(app.writes, [['appearance', 'ios'], ['appearance', 'default'], ['taskAppearance', 'ios']])
  assert.equal(app.attrs.has(globalMarker), false)
  assert.equal(app.attrs.get(taskMarker), 'ios')
  assert.equal(app.controller.getSnapshot().savingAppearance, false)
  assert.equal(app.controller.getSnapshot().savingTaskAppearance, false)
  app.dispose()
})

test('delayed Host load and external settings changes apply even with the settings page closed', () => {
  const app = mount({ appearance: 'paper', status: 'loading' })
  assert.equal(app.layers.size, 0)
  app.update({ status: 'ready' })
  assert.equal(app.layers.size, 1)
  app.update({ value: { appearance: 'default' } })
  assert.equal(app.layers.size, 0)
  assert.equal(app.writes.length, 0)
  app.dispose()
})

test('refresh/remount adopts stored paper and restores an existing foreign marker on cleanup', () => {
  for (let i = 0; i < 2; i++) {
    const app = mount({ appearance: 'paper', marker: 'foreign' })
    assert.equal(app.layers.size, 1)
    app.dispose()
    assert.equal(app.attrs.get('data-dsh-paper-theme'), 'foreign')
    assert.equal(app.layers.size, 0)
    assert.equal(app.subscriptions.size, 0)
  }
})

test('disposal during a pending save ignores late replies and drops subscribers', async () => {
  const app = mount()
  let complete, changes = 0
  app.controller.subscribe(() => changes++)
  app.behavior(() => new Promise(resolve => { complete = () => resolve(true) }))
  const pending = app.controller.select('paper')
  assert.equal(app.controller.getSnapshot().savingAppearance, true)
  assert.equal(app.attrs.get(globalMarker), 'paper')
  const fieldset = app.render().children.find(child => child?.type === 'fieldset')
  assert.equal(fieldset.props.disabled, false, 'Saving must retain radio keyboard focus')
  await app.controller.select('paper')
  await app.controller.select('ios')
  assert.equal(app.writes.length, 1)
  app.dispose()
  const before = changes
  complete()
  await pending
  assert.equal(changes, before)
  assert.equal(app.writes.length, 1)
  assert.equal(app.layers.size, 0)
  assert.equal(app.attrs.size, 0)
})

test('refused and failed writes keep the last confirmed appearance and expose an error', async () => {
  for (const behavior of [() => false, () => { throw new Error('offline') }]) {
    const app = mount({ appearance: 'paper' })
    app.behavior(behavior)
    await app.controller.select('default')
    assert.equal(app.controller.getSnapshot().appearanceFailed, true)
    assert.equal(app.controller.getSnapshot().savingAppearance, false)
    assert.equal(app.attrs.get(globalMarker), 'paper')
    assert.equal(app.layers.size, 1)
    app.dispose()
  }
})

test('read-only preferences can render paper but cannot write; missing interface stays inert', async () => {
  const app = mount({ appearance: 'paper', writable: false })
  assert.equal(app.layers.size, 1)
  await app.controller.select('default')
  assert.equal(app.writes.length, 0)
  app.dispose()
  const unsupported = mount({ appearance: 'paper', supported: false })
  assert.equal(unsupported.layers.size, 0)
  assert.equal(unsupported.controller.getSnapshot().supported, false)
  unsupported.dispose()
})

test('invalid preferences are not activated and losing the namespace retracts paper', async () => {
  const app = mount({ appearance: 'corrupt' })
  assert.equal(app.layers.size, 0)
  await app.controller.select('corrupt')
  assert.equal(app.writes.length, 0)
  app.update({ value: { appearance: 'paper' } })
  assert.equal(app.layers.size, 1)
  app.update({ status: 'unavailable' })
  assert.equal(app.layers.size, 0)
  app.dispose()
})

test('reading and controls retain AA text contrast in both styles and host modes', () => {
  const luminance = hex => {
    const rgb = hex.slice(1).match(/../g).map(x => parseInt(x, 16) / 255)
      .map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4)
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722
  }
  for (const appearance of ['paper', 'ios']) {
    const app = mount({ appearance })
    const tokens = [...app.layers.values()][0]
    const surfaces = ['canvas', 'paper', 'sidebar', 'surface', 'bubble', 'code']
    if (appearance === 'paper') surfaces.push('sheet', 'card')
    for (const mode of ['light', 'dark']) {
      const color = name => tokens[`--dsh-${appearance}-${name}`][mode]
      const pairs = [
        ...surfaces.flatMap(bg => [['ink', bg], ['muted', bg]]),
        ['subtle', 'paper'], ['onAccent', 'accent'], ['onAccent', 'accentHover'],
        ['accent', 'canvas'], ['accent', 'accentSoft'], ['ink', 'highlight'],
        ...['danger', 'success', 'warning', 'info'].map(name => [name, name + 'Soft']),
        ...['info', 'accent', 'muted', 'danger', 'warning', 'syntaxFunction'].map(name => [name, 'code']),
      ]
      if (appearance === 'paper') pairs.push(['subtle', 'card'], ['ink', 'markerInfo'], ['ink', 'markerSuccess'])
      for (const [fg, bg] of pairs) {
        const values = [luminance(color(fg)), luminance(color(bg))].sort((a, b) => b - a)
        const ratio = (values[0] + .05) / (values[1] + .05)
        assert(ratio >= 4.5, `${appearance} ${mode} ${fg}/${bg}: ${ratio.toFixed(2)}:1`)
      }
    }
    app.dispose()
  }
})

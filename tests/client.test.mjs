import assert from 'node:assert/strict'
import test from 'node:test'
import vm from 'node:vm'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')

function mount({ appearance = 'default', status = 'ready', writable = true, supported = true, marker } = {}) {
  let plugin, state = { value: { appearance }, status, writable }
  const subscriptions = new Set(), layers = new Map(), styles = new Set(), slots = new Set(), dictionaries = new Map()
  const attrs = new Map(marker === undefined ? [] : [['data-dsh-paper-theme', marker]])
  const document = {
    body: { getAttribute: name => attrs.get(name) ?? null, setAttribute: (name, value) => attrs.set(name, value), removeAttribute: name => attrs.delete(name) },
    head: { appendChild: style => styles.add(style) },
    createElement: () => { const style = { dataset: {}, remove: () => styles.delete(style) }; return style },
  }
  const effects = [], writes = []
  let behavior
  const form = {
    getSnapshot: () => state,
    subscribe(listener) { subscriptions.add(listener); return () => subscriptions.delete(listener) },
    async set(field, value) {
      writes.push([field, value])
      if (behavior) return behavior(value)
      update({ value: { appearance: value } })
      return true
    },
  }
  function update(patch) { state = { ...state, ...patch }; for (const listener of subscriptions) listener() }
  const theme = supported ? {
    overrideTokens(id, tokens) {
      assert(!layers.has(id), 'Only one layer per plugin')
      layers.set(id, tokens)
      return () => layers.delete(id)
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
      inject(name, callback) { assert.equal(name, 'settings.section'); effects.push(callback()) },
      register(config, component) { const slot = { config, component }; slots.add(slot); return () => slots.delete(slot) },
    },
  }
  vm.runInNewContext(source, { document, window: { __ModuleLoader__: { load(module) {
    assert.equal(module.id, 'dsh-plugin-paper-theme')
    plugin = module.factory(name => { assert.equal(name, 'react'); return { createElement: (type, props, ...children) => ({ type, props, children }) } })
  } } } })
  plugin.apply(ctx)
  const slot = [...slots][0]
  const props = slot.config.inject()
  const controller = props.hooks.preference
  return { controller, layers, attrs, styles, slots, subscriptions, dictionaries, writes, update,
    behavior: value => { behavior = value },
    dispose: () => { for (const dispose of effects.reverse()) dispose() },
    render: () => slot.component({ ...props, usePreference: selector => selector(controller.getSnapshot()) }),
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
  app.behavior(value => new Promise(resolve => { complete = () => { app.update({ value: { appearance: value } }); resolve(true) } }))
  const pending = app.controller.select('paper')
  assert.equal(app.controller.getSnapshot().pending, true)
  const fieldset = app.render().children.find(child => child?.type === 'fieldset')
  assert.equal(fieldset.props.disabled, false, 'Saving must retain radio keyboard focus')
  await app.controller.select('paper')
  assert.equal(app.writes.length, 1)
  app.dispose()
  const before = changes
  complete()
  await pending
  assert.equal(changes, before)
  assert.equal(app.layers.size, 0)
  assert.equal(app.attrs.size, 0)
})

test('refused and failed writes keep the last confirmed appearance and expose an error', async () => {
  for (const behavior of [() => false, () => { throw new Error('offline') }]) {
    const app = mount({ appearance: 'paper' })
    app.behavior(behavior)
    await app.controller.select('default')
    assert.equal(app.controller.getSnapshot().error, true)
    assert.equal(app.controller.getSnapshot().pending, false)
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

test('reading, controls and stationery retain AA text contrast in both host modes', () => {
  const app = mount({ appearance: 'paper' })
  const tokens = [...app.layers.values()][0]
  const luminance = hex => {
    const rgb = hex.slice(1).match(/../g).map(x => parseInt(x, 16) / 255)
      .map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4)
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722
  }
  for (const mode of ['light', 'dark']) {
    const color = name => tokens['--dsh-paper-' + name][mode]
    const pairs = [
      ...['canvas', 'paper', 'sidebar', 'sheet', 'card', 'bubble', 'code'].flatMap(bg => [['ink', bg], ['muted', bg]]),
      ['subtle', 'paper'], ['subtle', 'card'], ['onAccent', 'accent'], ['onAccent', 'accentHover'],
      ['accent', 'canvas'], ['accent', 'accentSoft'], ['ink', 'highlight'], ['ink', 'markerInfo'], ['ink', 'markerSuccess'],
      ...['danger', 'success', 'warning', 'info'].map(name => [name, name + 'Soft']),
      ...['info', 'accent', 'muted', 'danger', 'warning', 'syntaxFunction'].map(name => [name, 'code']),
    ]
    for (const [fg, bg] of pairs) {
      const values = [luminance(color(fg)), luminance(color(bg))].sort((a, b) => b - a)
      const ratio = (values[0] + .05) / (values[1] + .05)
      assert(ratio >= 4.5, `${mode} ${fg}/${bg}: ${ratio.toFixed(2)}:1`)
    }
  }
  app.dispose()
})

/** Nominal semantic text contrast; screenshot inspection still checks texture/materials. */
import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import vm from 'node:vm'

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')
const literal = source.match(/const PALETTE = (\{[\s\S]*?\n    \})/)[1]
const palette = vm.runInNewContext('(' + literal + ')')
const pairs = [
  ...['canvas', 'paper', 'sidebar', 'sheet', 'card', 'bubble', 'code'].flatMap(bg => [['ink', bg], ['muted', bg]]),
  ['subtle', 'paper'], ['subtle', 'card'], ['onAccent', 'accent'], ['onAccent', 'accentHover'],
  ['accent', 'canvas'], ['accent', 'accentSoft'], ['ink', 'highlight'], ['ink', 'markerInfo'], ['ink', 'markerSuccess'],
  ...['danger', 'success', 'warning', 'info'].map(name => [name, name + 'Soft']),
  ...['info', 'accent', 'muted', 'danger', 'warning', 'syntaxFunction'].map(name => [name, 'code']),
]
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(x => parseInt(x, 16) / 255)
    .map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4)
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722
}
const samples = ['light', 'dark'].flatMap((mode, i) => pairs.map(([fg, bg]) => {
  const [high, low] = [luminance(palette[fg][i]), luminance(palette[bg][i])].sort((a, b) => b - a)
  const ratio = (high + .05) / (low + .05)
  assert(ratio >= 4.5, `${mode} ${fg}/${bg}: ${ratio}`)
  return { mode, foreground: fg, background: bg, colors: [palette[fg][i], palette[bg][i]], ratio: +ratio.toFixed(2) }
}))
const result = { date: new Date().toISOString(), passed: true, minimum: Math.min(...samples.map(x => x.ratio)),
  scope: 'Nominal text token pairs only; not a full accessibility audit or textured-pixel measurement.', samples }
await writeFile(new URL('../docs/contrast-samples-0.1.2.json', import.meta.url), JSON.stringify(result, null, 2) + '\n')
console.log(`${samples.length} semantic pairs passed; minimum ${result.minimum}:1`)

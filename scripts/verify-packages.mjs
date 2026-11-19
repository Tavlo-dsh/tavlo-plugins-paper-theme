/** Inspect tarballs without extracting into any user profile. Requires local tar. */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { resolve, basename } from 'node:path'
import { createHash } from 'node:crypto'

const [testedDirectory, deliveredDirectory] = process.argv.slice(2).map(path => resolve(path))
assert(testedDirectory && deliveredDirectory, 'Usage: node scripts/verify-packages.mjs <tested directory> <delivery directory>')
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const results = []
const deliveredFiles = await readdir(deliveredDirectory)
for (const name of ['dsh-plugin-paper-theme', 'dsh-plugin-tasks']) {
  const candidates = deliveredFiles.filter(file => file.startsWith(name + '-') && file.endsWith('.tgz'))
  if (!candidates.length) continue
  assert.equal(candidates.length, 1, `Keep one version per package in the delivery directory: ${name}`)
  const archive = resolve(deliveredDirectory, candidates[0])
  const tested = resolve(testedDirectory, basename(archive))
  const list = execFileSync('tar', ['-tf', archive], { encoding: 'utf8', windowsHide: true }).trim().split(/\r?\n/)
  const readEntry = (file, entry) => execFileSync('tar', ['-xOf', file, entry], { maxBuffer: 16 * 1024 * 1024, windowsHide: true })
  assert(list.every(path => path.startsWith('package/') && !path.split('/').includes('..')))
  assert(!list.some(path => /node_modules|\.refs|\/tests\/|\.env|host-\d+\.log|verification-failure/.test(path)))
  const pkg = JSON.parse(readEntry(archive, 'package/package.json'))
  assert.equal(pkg.name, name)
  assert.equal(pkg.engines.dsh, '0.2.2-rc.1')
  assert.equal(pkg.dependencies?.react, undefined)
  assert.equal(pkg.dependencies?.[name === 'dsh-plugin-tasks' ? 'dsh-plugin-paper-theme' : 'dsh-plugin-tasks'], undefined)
  for (const file of ['package/index.js', 'package/client.js', 'package/cordis.patch.yml']) assert(list.includes(file))
  if (name === 'dsh-plugin-tasks') assert(list.includes('package/licenses/looseleaf-MIT.txt'))
  else assert(list.includes('package/LICENSE'))
  const runtime = list.filter(path => !path.startsWith('package/docs/') && !path.startsWith('package/scripts/') && !path.endsWith('README.md'))
  const runtimeHashes = {}
  for (const entry of runtime) {
    const delivered = readEntry(archive, entry)
    assert.deepEqual(delivered, readEntry(tested, entry), `Tested and delivered runtime differ: ${entry}`)
    runtimeHashes[entry.slice(8)] = hash(delivered)
  }
  const bytes = await readFile(archive)
  results.push({ package: name, file: basename(archive), bytes: bytes.length, sha256: hash(bytes),
    entryCount: list.length, runtimeIdenticalToBrowserTestedTarball: true, runtimeHashes, files: list.map(path => path.slice(8)) })
}
assert(results.length, 'No supported plugin tarballs found')
await writeFile(resolve(deliveredDirectory, 'package-verification.json'), JSON.stringify({ date: new Date().toISOString(), passed: true, packages: results }, null, 2) + '\n')
console.log(results.map(({ package: name, bytes, entryCount, sha256 }) => ({ package: name, bytes, entryCount, sha256 })))

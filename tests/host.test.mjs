import assert from 'node:assert/strict'
import test from 'node:test'
import { Config, apply } from '../index.js'

test('Host schema is opt-in, live, and rejects unknown appearance values', () => {
  assert.equal(Config({}).appearance.get(), 'default')
  assert.equal(Config({ appearance: 'paper' }).appearance.get(), 'paper')
  assert.throws(() => Config({ appearance: 'other' }))
})

test('Host settings registration retracts its generic-form policy with the owning effect', () => {
  let cleaned = false
  const fiber = {}, effects = []
  apply({ fiber, inject(names, callback) {
    assert.deepEqual(names, ['settings'])
    callback({ effect: callback => effects.push(callback()), settings: {
      configure(options, target) {
        assert.deepEqual(options, { auto: false })
        assert.equal(target, fiber)
        return () => { cleaned = true }
      },
    } })
  } })
  assert.equal(effects.length, 1)
  effects[0]()
  assert.equal(cleaned, true)
})

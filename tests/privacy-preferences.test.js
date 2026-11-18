import test from 'node:test'
import assert from 'node:assert/strict'
import { clearSitePreferences, localPreferenceKeys, sessionPreferenceKeys } from '../src/lib/privacyPreferences.js'

test('limpeza de preferencias preserva chaves alheias ao website', () => {
  const values = new Map([...localPreferenceKeys, ...sessionPreferenceKeys, 'unrelated'].map(key => [key, 'value']))
  const storage = { removeItem(key) { values.delete(key) } }
  assert.equal(clearSitePreferences(storage, storage), true)
  assert.deepEqual([...values.keys()], ['unrelated'])
  assert.equal(clearSitePreferences({ removeItem() { throw new Error('blocked') } }, storage), false)
})

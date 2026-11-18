import test from 'node:test'
import assert from 'node:assert/strict'
import { defaultComfort, normalizeComfort, readComfort } from '../src/lib/appearance.js'

test('preferencias aceitam apenas valores previstos, sem aplicar CSS arbitrario', () => {
  assert.deepEqual(normalizeComfort({ size: 'larger', contrast: true, motion: true, html: '<script>' }), { size: 'larger', contrast: true, motion: true })
  assert.deepEqual(normalizeComfort({ size: 'url(invalid)', contrast: 'false', motion: 1 }), defaultComfort)
  assert.deepEqual(normalizeComfort(null), defaultComfort)
})

test('preferencias recuperam de armazenamento bloqueado ou corrompido', () => {
  assert.deepEqual(readComfort({ getItem() { throw new Error('blocked') } }), defaultComfort)
  assert.deepEqual(readComfort({ getItem() { return '{invalid' } }), defaultComfort)
  assert.deepEqual(readComfort({ getItem() { return '{"size":"large","motion":true}' } }), { size: 'large', contrast: false, motion: true })
})

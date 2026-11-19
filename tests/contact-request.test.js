import test from 'node:test'
import assert from 'node:assert/strict'
import { sendContactRequest } from '../src/lib/contactRequest.js'
const endpoint = 'https://formspree.io/f/fixture'

test('formulario recusa destinos arbitrarios sem efetuar pedidos', async () => {
  let called = false
  for (const url of ['', 'http://formspree.io/f/example', 'https://invalid.example/collect', 'https://formspree.io/f/example?token=private']) {
    const result = await sendContactRequest(url, {}, { fetcher() { called = true } })
    assert.equal(result.reason, 'configuration')
  }
  assert.equal(called, false)
})
test('envio valida a resposta do fornecedor e nao envia cookies', async () => {
  const fetcher = async (url, options) => {
    assert.equal(url, endpoint); assert.equal(options.credentials, 'omit'); assert.equal(options.redirect, 'error'); assert.equal(options.referrerPolicy, 'no-referrer')
    assert.deepEqual(JSON.parse(options.body), { mensagem: 'Fixture' })
    return { ok: true, json: async () => ({ ok: true }) }
  }
  assert.deepEqual(await sendContactRequest(endpoint, { mensagem: 'Fixture' }, { fetcher }), { ok: true })
  assert.equal((await sendContactRequest(endpoint, {}, { fetcher: async () => ({ ok: true, json: async () => ({ errors: ['rejected'] }) }) })).reason, 'rejected')
  assert.equal((await sendContactRequest(endpoint, {}, { fetcher: async () => ({ ok: false, status: 429 }) })).reason, 'rate-limit')
  assert.equal((await sendContactRequest(endpoint, {}, { fetcher: async () => { throw new Error('offline') } })).reason, 'network')
})
test('envio interrompe uma ligacao que nao responde', async () => {
  const result = await sendContactRequest(endpoint, {}, { timeoutMs: 5, fetcher: (_, options) => new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(new Error('aborted')))) })
  assert.equal(result.reason, 'timeout')
})

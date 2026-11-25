import test from 'node:test'
import assert from 'node:assert/strict'
import { Server } from 'node:http'
import { Readable } from 'node:stream'
import { startAdmin } from '../scripts/admin-security.mjs'

test('admin local protege login, origem, sessao, CSRF, logout e tentativas', async () => {
  const previousPassword = process.env.ALCANCARI_ADMIN_PASSWORD
  process.env.ALCANCARI_ADMIN_PASSWORD = 'fixture-only-not-a-real-password-12345'
  const listen = Server.prototype.listen
  let server
  let binding
  let now = Date.now()
  try {
    // Exercise the real request handler without opening a network port.
    Server.prototype.listen = function (...args) { binding = args.slice(0, 2); return this }
    server = startAdmin({ port: 4189, title: 'Test', clock: () => now, handle(req, res, security) { security.send(200, security.csrf) } })
  } finally { Server.prototype.listen = listen }
  const password = process.env.ALCANCARI_ADMIN_PASSWORD
  if (previousPassword === undefined) delete process.env.ALCANCARI_ADMIN_PASSWORD
  else process.env.ALCANCARI_ADMIN_PASSWORD = previousPassword
  assert.deepEqual(binding, [4189, '127.0.0.1'])
  const origin = 'http://127.0.0.1:4189'
  const request = (method = 'GET', path = '/', body = {}, headers = {}) => new Promise(resolve => {
    const req = Readable.from(method === 'POST' ? [Buffer.from(new URLSearchParams(body).toString())] : [])
    Object.assign(req, { method, url: path, socket: { remoteAddress: '127.0.0.1' }, headers: { host: '127.0.0.1:4189', ...(method === 'POST' ? { origin, 'content-type': 'application/x-www-form-urlencoded' } : {}), ...headers } })
    const res = { headers: {}, headersSent: false, setHeader(key, value) { this.headers[key.toLowerCase()] = value }, writeHead(status, values = {}) { this.status = status; this.headersSent = true; Object.entries(values).forEach(([key, value]) => this.setHeader(key, value)) }, end(body) { resolve({ status: this.status, headers: this.headers, body }) } }
    server.emit('request', req, res)
  })
  let response = await request()
  assert.equal(response.headers['referrer-policy'], 'same-origin')
  assert.ok(!response.headers['content-security-policy'].includes("script-src 'unsafe-inline'"))
  const csrf = response.body.match(/name="csrf" value="([a-f0-9]+)"/)[1]
  const navigation = { 'sec-fetch-mode': 'navigate', 'sec-fetch-dest': 'document', 'sec-fetch-user': '?1' }
  for (const site of ['same-site', 'cross-site']) {
    const headers = { ...navigation, 'sec-fetch-site': site }
    const entry = await request('GET', '/', {}, headers)
    assert.equal(entry.status, 200)
    assert.match(entry.body, /Acesso reservado/)
    assert.equal((await request('GET', '/?slug=fixture', {}, headers)).status, 401)
    for (const path of ['/inventario', '/exportar', '/prever?slug=fixture', '/copias']) assert.equal((await request('GET', path, {}, headers)).status, 403)
    assert.equal((await request('GET', '/', {}, { ...headers, 'sec-fetch-dest': 'iframe' })).status, 403)
    assert.equal((await request('GET', '/', {}, { ...headers, 'sec-fetch-user': undefined })).status, 403)
    assert.equal((await request('GET', '/', {}, { ...headers, 'sec-fetch-mode': 'cors' })).status, 403)
    assert.equal((await request('POST', '/entrar', { csrf, password }, headers)).status, 403)
  }

  for (const invalidOrigin of ['null', 'https://invalid.example']) assert.equal((await request('POST', '/entrar', { csrf, password }, { origin: invalidOrigin })).status, 403)
  assert.equal((await request('GET', '/', {}, { host: 'invalid.example' })).status, 403)
  response = await request('POST', '/entrar', { csrf: 'stale', password })
  assert.equal(response.status, 403)
  assert.match(response.body, /formulário está desatualizado/)
  assert.equal((await request('POST', '/entrar', { csrf, password: 'wrong' })).status, 401)
  response = await request('POST', '/entrar', { csrf, password })
  assert.equal(response.status, 303)
  assert.match(response.headers['set-cookie'], /HttpOnly; SameSite=Strict/)
  const cookie = response.headers['set-cookie'].split(';')[0]
  response = await request('GET', '/', {}, { cookie })
  assert.equal(response.status, 200)
  assert.equal((await request('POST', '/sair', { csrf: 'wrong' }, { cookie })).status, 403)
  assert.equal((await request('POST', '/sair', { csrf: response.body }, { cookie })).status, 303)
  assert.match((await request('GET', '/', {}, { cookie })).body, /Acesso reservado/)
  response = await request('POST', '/entrar', { csrf, password })
  const idleCookie = response.headers['set-cookie'].split(';')[0]
  now += 20 * 60_000
  assert.match((await request('GET', '/', {}, { cookie: idleCookie })).body, /Acesso reservado/)
  response = await request('POST', '/entrar', { csrf, password })
  const absoluteCookie = response.headers['set-cookie'].split(';')[0]
  for (let index = 0; index < 11; index++) { now += 10 * 60_000; assert.equal((await request('GET', '/', {}, { cookie: absoluteCookie })).status, 200) }
  now += 10 * 60_000
  assert.match((await request('GET', '/', {}, { cookie: absoluteCookie })).body, /Acesso reservado/)
  for (let index = 0; index < 5; index++) await request('POST', '/entrar', { csrf, password: 'wrong' })
  assert.equal((await request('POST', '/entrar', { csrf, password })).status, 429)
})

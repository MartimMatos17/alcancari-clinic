import test from 'node:test'
import assert from 'node:assert/strict'
import { getContactLinks, getPublished, isPublicAsset, formatDate } from '../src/lib/content.js'
import { site, navigation } from '../src/content/site.js'

test('contactos por confirmar nunca produzem ligações', () => {
  assert.deepEqual(getContactLinks({ phone: { value: '+12025550123', confirmed: false }, email: { value: 'teste@example.invalid', confirmed: false } }), [])
})

test('contactos aprovados usam apenas os protocolos previstos', () => {
  const links = getContactLinks({ phone: { value: '+12025550123', confirmed: true }, whatsapp: { value: '+12025550123', confirmed: true }, email: { value: 'teste@example.invalid', confirmed: true } })
  assert.deepEqual(links.map(link => link.href), ['tel:+12025550123', 'https://wa.me/12025550123', 'mailto:teste@example.invalid'])
})

test('contactos malformados ou com parâmetros injetados são rejeitados', () => {
  for (const value of ['javascript:alert(1)', 'teste@example.invalid?bcc=outro@example.invalid', 'teste@example.invalid\r\nBcc:outro@example.invalid']) {
    assert.deepEqual(getContactLinks({ email: { value, confirmed: true } }), [])
  }
  assert.deepEqual(getContactLinks({ phone: { value: '900000000', confirmed: true }, whatsapp: { value: '+12025550123?text=alterado', confirmed: true } }), [])
})

test('rascunhos e conteúdos sem confirmação não são apresentados', () => {
  assert.deepEqual(getPublished([{ id: 1, published: true }, { id: 2, confirmed: true, published: false }, { id: 3, confirmed: true, published: true }]).map(item => item.id), [3])
})

test('imagens só podem vir de pastas públicas locais', () => {
  assert.equal(isPublicAsset('/images/clinic/sala.webp'), true)
  assert.equal(isPublicAsset('/brand/logo.svg'), true)
  for (const value of ['https://images.example.invalid/photo.jpg', '/images/../../backups/file.svg', '/backups/file.png', 'data:image/svg+xml,svg', null]) assert.equal(isPublicAsset(value), false)
})

test('datas inválidas não são apresentadas como datas reais', () => {
  assert.equal(formatDate('2026-02-30'), '')
  assert.equal(formatDate('texto'), '')
  assert.match(formatDate('2026-11-09'), /novembro/)
})

test('preparação mantém indexação desligada e as sete páginas públicas', () => {
  assert.equal(site.indexingEnabled, false)
  assert.equal(site.url, '')
  assert.deepEqual(navigation.map(item => item.path), ['/', '/clinica', '/servicos', '/equipa', '/unidades', '/novidades', '/contactos'])
})

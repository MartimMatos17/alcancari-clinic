import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { site } from '../src/content/site.js'
import { legacyRoutes, publicPaths } from '../src/content/routes.js'
import { getContactLinks, isPublicAsset } from '../src/lib/content.js'
import manifest from '../docs/sources/manifest.json' with { type: 'json' }

const normalize = text => text.replace(/\s+/g, ' ').trim()
const textOf = blocks => normalize(blocks.map(block => block.type === 'list' ? block.items.join(' ') : block.text).join(' '))
const hash = text => createHash('sha256').update(text).digest('hex')
const expected = id => manifest.entries.find(entry => entry.id === id)
function checkSource(id, text) {
  const record = expected(id)
  assert.ok(record, `Missing source record: ${id}`)
  assert.equal(hash(normalize(text)), record.textSha256, `Source text changed: ${id}`)
  assert.equal(normalize(readFileSync(new URL(`../docs/sources/${id}.txt`, import.meta.url), 'utf8')), normalize(text))
}

test('os nove serviços preservam os textos integrais das sete páginas disponíveis', () => {
  assert.equal(site.services.length, 9)
  assert.deepEqual(site.services.filter(item => item.status === 'summary-only').map(item => item.slug), ['intervencao-em-grupo', 'formacao'])
  for (const service of site.services) {
    assert.ok(service.summary.length > 100)
    if (service.status === 'complete') checkSource(service.slug === 'acupuntura' ? 'acupunctura' : service.slug, textOf(service.blocks))
    else assert.deepEqual(service.blocks, [])
  }
})

test('os 16 profissionais mantêm as biografias e qualificações sem cortes', () => {
  assert.equal(site.team.length, 16)
  for (const person of site.team) {
    assert.ok(person.name && person.role)
    checkSource(person.id, textOf(person.blocks))
  }
  assert.ok(textOf(site.team.find(person => person.id === 'vania-peixoto').blocks).length > 2000)
})

test('o blog mantém os 12 excertos sem inventar artigos, autores ou datas', () => {
  assert.equal(site.posts.length, 12)
  for (const post of site.posts) {
    assert.equal(post.status, 'excerpt-only')
    assert.equal(post.author, null)
    assert.equal(post.date, null)
    checkSource(post.slug, `${post.category} ${post.title} ${textOf(post.blocks)}`)
  }
})

test('apresentação, moradas e horários preservam as fontes e a divergência de sábado', () => {
  checkSource('apresentacao', `${site.clinic.intro} ${textOf(site.clinic.blocks)}`)
  checkSource('a-clinica', textOf(site.clinic.practicalBlocks))
  assert.equal(site.units.length, 2)
  for (const unit of site.units) {
    checkSource(`unidade-${unit.id}`, textOf(unit.blocks))
    assert.ok(unit.hours.includes('Sábado: 09:00 às 14:00'))
    assert.ok(unit.mapUrl.startsWith('https://share.google/'))
  }
  assert.match(textOf(site.clinic.practicalBlocks), /Sábado: Conforme marcação/)
})

test('rotas únicas e redirecionamentos levam apenas a páginas públicas existentes', () => {
  assert.equal(publicPaths.length, 47)
  assert.equal(new Set(publicPaths).size, publicPaths.length)
  for (const destination of Object.values(legacyRoutes)) assert.ok(publicPaths.includes(destination), destination)
  for (const path of publicPaths) assert.doesNotMatch(path, /\/(login|dashboard|admin|api)(\/|$)/)
})

test('contactos e ligações oficiais correspondem à fonte consultada', () => {
  assert.deepEqual(getContactLinks(site.contacts).map(link => link.href), ['tel:+351934779548', 'https://wa.me/351934779548', 'mailto:alcancari.terapias@gmail.com'])
  assert.deepEqual(site.officialLinks.map(link => link.href), ['https://www.instagram.com/clinica.alcancari/', 'https://www.facebook.com/alcancari', 'https://www.livroreclamacoes.pt/Inicio/'])
})

test('imagens configuradas têm ficheiro local real e texto alternativo', () => {
  const images = [site.images.home, site.images.clinic, ...[...site.services, ...site.team, ...site.posts, ...site.units].map(item => item.image)].filter(Boolean)
  for (const image of images) {
    assert.equal(isPublicAsset(image.src), true)
    assert.ok(image.alt)
    assert.ok(existsSync(new URL(`../public${image.src}`, import.meta.url)), image.src)
  }
})

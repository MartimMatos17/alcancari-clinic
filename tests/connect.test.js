import test from 'node:test'
import assert from 'node:assert/strict'
import { site } from '../src/content/site.js'
import { createConnectCatalog, filterProfessionals, professionalAreas, confirmedProfessionalServices, filterConnectPosts, toggleSelection } from '../src/lib/connect.js'
import { createFavoritesStore, parseFavorites, sanitizeFavorites, FAVORITES_KEY } from '../src/lib/favorites.js'

const catalog = createConnectCatalog(site)
const service = { type: 'service', id: site.services[0].slug }
const person = { type: 'professional', id: site.team[0].id }
function storage() {
  const data = new Map()
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) }
}

test('favoritos aceitam só identificadores públicos de serviços e profissionais', () => {
  assert.deepEqual(sanitizeFavorites([service, service, { ...person, name: 'Não guardar', symptoms: 'Não guardar' }, { type: 'unit', id: site.units[0].id }, { type: 'service', id: 'desconhecido' }, null, 'texto', {}], catalog), [service, person])
  for (const raw of ['{', 'null', '3', '{}', '"texto"']) assert.deepEqual(parseFavorites(raw, catalog), [])
})

test('favoritos persistem, removem e sincronizam sem guardar outros dados', () => {
  const memory = storage()
  const store = createFavoritesStore(catalog, () => memory)
  let updates = 0
  const unsubscribe = store.subscribe(() => updates++)
  store.toggle({ ...service, name: 'Dado descartado' })
  store.toggle(person)
  assert.deepEqual(JSON.parse(memory.getItem(FAVORITES_KEY)), [service, person])
  assert.deepEqual(createFavoritesStore(catalog, () => memory).getSnapshot().items, [service, person])
  store.toggle(service)
  assert.deepEqual(store.getSnapshot().items, [person])
  memory.setItem(FAVORITES_KEY, JSON.stringify([service]))
  store.sync()
  assert.deepEqual(store.getSnapshot().items, [service])
  memory.removeItem(FAVORITES_KEY)
  store.sync()
  assert.deepEqual(store.getSnapshot().items, [])
  unsubscribe()
  store.toggle(person)
  assert.equal(updates, 5)
})

test('armazenamento bloqueado mantém os favoritos em memória e permite removê-los', () => {
  const store = createFavoritesStore(catalog, () => { throw new Error('Bloqueado') })
  store.toggle(service)
  store.toggle(person)
  assert.deepEqual(store.getSnapshot(), { items: [service, person], persistent: false })
  store.sync()
  assert.deepEqual(store.getSnapshot().items, [service, person])
  store.toggle(service)
  assert.deepEqual(store.getSnapshot().items, [person])
})

test('falha de quota preserva escolhas temporárias e recupera a persistência', () => {
  const memory = storage()
  let fail = true
  const restricted = { getItem: memory.getItem, setItem: (...args) => { if (fail) throw new Error('Quota'); memory.setItem(...args) } }
  const store = createFavoritesStore(catalog, () => restricted)
  store.toggle(service)
  store.toggle(person)
  assert.equal(store.getSnapshot().persistent, false)
  fail = false
  store.toggle(service)
  assert.deepEqual(store.getSnapshot(), { items: [person], persistent: true })
  assert.deepEqual(JSON.parse(memory.getItem(FAVORITES_KEY)), [person])
})

test('alterações de outras abas são preservadas ao guardar novos favoritos', () => {
  const memory = storage()
  const first = createFavoritesStore(catalog, () => memory)
  const second = createFavoritesStore(catalog, () => memory)
  first.toggle(service)
  second.toggle(person)
  first.sync()
  assert.deepEqual(first.getSnapshot().items, [service, person])
  const previous = first.getSnapshot()
  first.toggle({ type: 'post', id: site.posts[0].slug })
  assert.equal(first.getSnapshot(), previous)
})

test('pesquisa ignora acentos, maiúsculas e ordem dos termos sem pesquisar qualificações', () => {
  assert.deepEqual(filterProfessionals(site.team, { query: '  MAIA ines ' }).map(item => item.id), ['ines-maia'])
  assert.equal(filterProfessionals(site.team, { query: 'PSICOLOGA' }).length, 4)
  assert.equal(filterProfessionals(site.team, { query: 'Fisioterapia' }).length, 0)
  assert.equal(filterProfessionals(site.team, { query: 'ines', area: 'Psicóloga' }).length, 0)
})

test('áreas respeitam os cargos confirmados e unificam diferenças de capitalização', () => {
  assert.equal(professionalAreas(site.team).length, 3)
  const sample = [...site.team, { id: 'rascunho', name: 'Outro', role: 'Nova área', confirmed: true, published: false }]
  assert.equal(professionalAreas(sample).length, 3)
  assert.equal(filterProfessionals(sample).length, 16)
  assert.equal(filterProfessionals(site.team, { favorites: [] }).length, 0)
  assert.deepEqual(filterProfessionals(site.team, { favorites: [service, person] }).map(item => item.id), [person.id])
})

test('não se inferem relações clínicas a partir de profissões ou qualificações', () => {
  for (const member of site.team) assert.deepEqual(confirmedProfessionalServices(member, site.services), [])
  const linked = { ...site.team[0], serviceSlugs: [service.id, 'inexistente'] }
  assert.deepEqual(confirmedProfessionalServices(linked, site.services).map(item => item.slug), [service.id])
  assert.deepEqual(confirmedProfessionalServices({ ...linked, confirmed: false }, site.services), [])
  assert.deepEqual(confirmedProfessionalServices(linked, site.services.map(item => ({ ...item, published: false }))), [])
})

test('conteúdos relacionados exigem menção explícita da área no título ou categoria', () => {
  assert.equal(filterConnectPosts(site.posts).length, 12)
  assert.equal(filterConnectPosts(site.posts, { title: 'Terapia Ocupacional' }).length, 1)
  assert.equal(filterConnectPosts(site.posts, { title: 'Fisioterapia' }).length, 0)
  assert.equal(filterConnectPosts(site.posts, { title: '' }).length, 0)
})

test('o percurso combina coleções, permite retirar escolhas e usa rotas reais', () => {
  const chosen = toggleSelection(toggleSelection([], service), person)
  assert.deepEqual(toggleSelection(chosen, service), [person])
  assert.equal(catalog.length, 39)
  for (const item of catalog) assert.match(item.to, /^\/(servicos|equipa|unidades|novidades)\/[a-z0-9-]+$/)
})

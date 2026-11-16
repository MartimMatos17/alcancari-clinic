import { getPublished } from './content.js'

export const normalizeSearch = value => String(value || '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLocaleLowerCase('pt-PT')

export function professionalAreas(members) {
  return [...new Map(getPublished(members).filter(member => member.role)
    .map(member => [normalizeSearch(member.role), member.role])).entries()]
    .sort((a, b) => a[1].localeCompare(b[1], 'pt-PT'))
}

export function filterProfessionals(members, { query = '', area = '', favorites = null } = {}) {
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean)
  return getPublished(members).filter(member =>
    (!area || normalizeSearch(member.role) === normalizeSearch(area)) &&
    (!favorites || favorites.some(item => item.type === 'professional' && item.id === member.id)) &&
    words.every(word => normalizeSearch(`${member.name} ${member.role}`).includes(word))
  )
}

// A qualification or a mention in a biography is not a service assignment.
export function confirmedProfessionalServices(member, services) {
  if (!member.confirmed || !member.published || !Array.isArray(member.serviceSlugs)) return []
  return getPublished(services).filter(service => member.serviceSlugs.includes(service.slug))
}

export function filterConnectPosts(posts, service = null) {
  const published = getPublished(posts)
  if (!service) return published
  const title = normalizeSearch(service.title)
  if (!title) return []
  return published.filter(post => normalizeSearch(`${post.title} ${post.category || ''}`).includes(title))
}

export function createConnectCatalog(site) {
  return [
    ...getPublished(site.services).map(entry => ({ type: 'service', id: entry.slug, title: entry.title, to: `/servicos/${entry.slug}`, entry })),
    ...getPublished(site.team).map(entry => ({ type: 'professional', id: entry.id, title: entry.name, to: `/equipa/${entry.id}`, entry })),
    ...getPublished(site.units).map(entry => ({ type: 'unit', id: entry.id, title: entry.name, to: `/unidades/${entry.id}`, entry })),
    ...getPublished(site.posts).map(entry => ({ type: 'post', id: entry.slug, title: entry.title, to: `/novidades/${entry.slug}`, entry })),
  ]
}

export const connectKey = item => `${item.type}:${item.id}`

export function toggleSelection(items, item) {
  return items.some(value => connectKey(value) === connectKey(item))
    ? items.filter(value => connectKey(value) !== connectKey(item))
    : [...items, { type: item.type, id: item.id }]
}

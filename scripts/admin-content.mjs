import { readFileSync, mkdirSync, lstatSync, writeFileSync, renameSync, unlinkSync, chmodSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createHash, randomBytes } from 'node:crypto'
import { join } from 'node:path'
import { adminRoot } from './admin-security.mjs'
import { media } from '../src/content/media.js'
import { isPublicAsset } from '../src/lib/content.js'

export const sections = [
  { key: 'services', label: 'Serviços', path: 'servicos', name: 'title' },
  { key: 'team', label: 'Equipa', path: 'equipa', name: 'name' },
  { key: 'posts', label: 'Publicações', path: 'novidades', name: 'title' },
  { key: 'units', label: 'Unidades', path: 'unidades', name: 'name' },
]
export const states = { draft: 'Em edição', review: 'Para revisão', ready: 'Revisto' }
export const revision = value => createHash('sha256').update(JSON.stringify(value ?? null)).digest('hex')
const directory = fileURLToPath(new URL('backups/admin-drafts', adminRoot))
const file = join(directory, 'posts.json')
function checkPaths() {
  for (const path of [fileURLToPath(new URL('backups', adminRoot)), directory, file]) {
    try { if (lstatSync(path).isSymbolicLink()) throw new Error('Ligação simbólica recusada.') } catch (error) { if (error.code !== 'ENOENT') throw error }
  }
}
export function readDrafts() {
  checkPaths()
  try {
    const drafts = JSON.parse(readFileSync(file, 'utf8'))
    if (!drafts || typeof drafts !== 'object' || Array.isArray(drafts)) throw new Error('Formato de rascunhos inválido.')
    return drafts
  } catch (error) { if (error.code === 'ENOENT') return {}; throw error }
}
export function catalogs() {
  return sections.map(section => ({ ...section, entries: JSON.parse(readFileSync(new URL(`src/content/${section.key}.json`, adminRoot), 'utf8')) }))
}
export function postCatalog() { return catalogs().find(section => section.key === 'posts').entries }
export function contentIssues(section, entry) {
  const image = media[section.key]?.[entry.slug || entry.id]
  const issues = []
  if (!image || !isPublicAsset(image.src)) issues.push('Imagem por definir')
  else {
    if (!image.alt?.trim()) issues.push('Texto alternativo em falta')
    if (!existsSync(new URL(`public${image.src}`, adminRoot))) issues.push('Ficheiro de imagem em falta')
  }
  if (section.key === 'posts' && entry.status === 'excerpt-only') issues.push('Apenas excerto disponível')
  if (!(entry.title || entry.name)?.trim()) issues.push('Título ou nome em falta')
  return issues
}
export function saveDraft(slug, next, expected, sourceExpected, action = 'save') {
  const original = postCatalog().find(post => post.slug === slug)
  if (!original || ['__proto__', 'constructor', 'prototype'].includes(slug)) return { code: 400, message: 'Publicação desconhecida.' }
  const drafts = readDrafts()
  const current = Object.hasOwn(drafts, slug) ? drafts[slug] : null
  if (revision(current) !== expected || revision(original) !== sourceExpected) return { code: 409, message: 'Este conteúdo mudou noutra janela ou no ficheiro original. Copie as alterações que deseja conservar e atualize a página antes de continuar.' }
  let fields = next
  if (action === 'original') fields = { title: original.title, category: original.category, summary: original.summary, status: 'draft', note: '' }
  if (action === 'restore') {
    const snapshot = current?.history?.find(item => item.id === next.restoreId)
    if (!snapshot) return { code: 400, message: 'Versão não encontrada.' }
    fields = { title: snapshot.title, category: snapshot.category, summary: snapshot.summary, note: snapshot.note || '', status: 'draft' }
  }
  const limits = { title: 180, category: 100, summary: 1500, note: 1000 }
  for (const [name, limit] of Object.entries(limits)) {
    if (typeof fields[name] !== 'string' || fields[name].length > limit || (name !== 'note' && !fields[name].trim()) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(fields[name])) return { code: 400, message: 'Campos inválidos ou demasiado longos.' }
  }
  if (!Object.hasOwn(states, fields.status)) return { code: 400, message: 'Estado editorial inválido.' }
  const history = Array.isArray(current?.history) ? current.history : []
  const snapshot = current ? [{ id: randomBytes(12).toString('hex'), title: current.title, category: current.category, summary: current.summary, note: current.note || '', status: Object.hasOwn(states, current.status) ? current.status : 'draft', updatedAt: current.updatedAt || null }] : []
  drafts[slug] = { title: fields.title.trim(), category: fields.category.trim(), summary: fields.summary.trim(), note: fields.note.trim(), status: fields.status, updatedAt: new Date().toISOString(), action, history: [...snapshot, ...history].slice(0, 20) }
  checkPaths()
  mkdirSync(directory, { recursive: true, mode: 0o700 })
  checkPaths()
  chmodSync(directory, 0o700)
  const temporary = join(directory, `.posts-${randomBytes(16).toString('hex')}.tmp`)
  try {
    writeFileSync(temporary, JSON.stringify(drafts, null, 2) + '\n', { mode: 0o600, flag: 'wx' })
    renameSync(temporary, file)
  } finally { try { unlinkSync(temporary) } catch (error) { if (error.code !== 'ENOENT') throw error } }
  return { code: 200 }
}

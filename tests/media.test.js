import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import inventory from '../docs/media-inventory.json' with { type: 'json' }
import assignments from '../docs/media-assignments.json' with { type: 'json' }
import { media } from '../src/content/media.js'

const byPath = new Map(inventory.map(image => [image.localPath, image]))
test('as 111 imagens locais mantêm os bytes e hashes dos originais recuperados', () => {
  assert.equal(inventory.length, 111)
  assert.equal(new Set(inventory.map(image => image.sha256)).size, inventory.length)
  for (const image of inventory) {
    const bytes = readFileSync(new URL(`../public${image.localPath}`, import.meta.url))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), image.sha256, image.localPath)
    assert.equal(bytes.length, image.bytes)
    assert.ok(image.width > 0 && image.height > 0)
    assert.match(image.localPath, /^\/images\/(branding|equipa|servicos|unidades|clinica|blog)\/[a-z0-9-]+\.(png|jpg|webp|avif)$/)
    assert.match(image.sourceUrl, /^https:\/\/alcancari\.com\/wp-content\/uploads\//)
    assert.ok(image.pages.length && image.originalFileName && image.archivePath)
  }
})
test('só os 11 perfis com retrato público identificável recebem fotografia', () => {
  assert.equal(Object.values(media.team).filter(Boolean).length, 11)
  assert.deepEqual(Object.entries(media.team).filter(([, image]) => !image).map(([key]) => key), ['sofia-costa', 'joana-simoes', 'joana-bessa', 'filipa-lima', 'isabel-lourenco'])
  for (const [id, image] of Object.entries(media.team)) if (image) {
    const source = assignments.find(entry => entry.key === `team.${id}`)
    assert.equal(source.evidence, 'Same named public profile/modal')
    assert.ok(byPath.get(image.src).associations.includes(`team.${id}`))
  }
  assert.equal(media.services['intervencao-em-grupo'], null)
})
test('as associações e galerias usam apenas os ficheiros inventariados', () => {
  for (const source of assignments) for (const image of source.images) {
    assert.ok(byPath.has(image.src), image.src)
    assert.equal(image.width, byPath.get(image.src).width)
    assert.equal(image.height, byPath.get(image.src).height)
    assert.ok(image.alt)
  }
  assert.equal(media.galleries.units['leca-da-palmeira'].length, 19)
  assert.equal(media.galleries.units['sao-mamede-de-infesta'].length, 6)
  assert.equal(Object.values(media.posts).filter(Boolean).length, 12)
  for (const src of [media.brand, media.brandFooter, media.favicon]) assert.equal(byPath.get(src).category, 'branding')
})
test('os retratos com resolução limitada ficam registados sem ampliação artificial', () => {
  assert.deepEqual([media.team['ines-maia'].width, media.team['ines-maia'].height], [300, 300])
  assert.deepEqual([media.team['vania-peixoto'].width, media.team['vania-peixoto'].height], [410, 410])
  assert.equal(inventory.filter(image => image.lowResolution && image.category !== 'branding').length, 24)
})

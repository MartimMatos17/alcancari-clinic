
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { media } from '../src/content/media.js'

const PUBLIC_DIR = resolve('public')
const IMAGE_PATH = /^\/images\/(branding|equipa|servicos|unidades|clinica|blog)\/[a-z0-9-]+\.(webp|jpg|jpeg|png|svg)$/i

function getImagePath(src) {
  assert.match(src, IMAGE_PATH)

  const file = resolve(PUBLIC_DIR, `.${src}`)

  assert.ok(
    file.startsWith(PUBLIC_DIR + sep),
    `Caminho fora da pasta pública: ${src}`
  )

  return file
}

function checkImage(image) {
  assert.ok(image && typeof image === 'object')
  assert.equal(typeof image.src, 'string')
  assert.ok(image.alt && typeof image.alt === 'string')
  assert.ok(image.width > 0)
  assert.ok(image.height > 0)

  const file = getImagePath(image.src)

  assert.ok(existsSync(file), `Imagem em falta: ${image.src}`)

  const bytes = readFileSync(file)
  assert.ok(bytes.length > 0, `Imagem vazia: ${image.src}`)

  if (image.src.endsWith('.webp')) {
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF')
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP')
  }

  return image.src
}

test('as imagens configuradas existem e são ficheiros válidos', () => {
  const images = [
    media.home,
    media.clinic,
    ...Object.values(media.team),
    ...Object.values(media.services),
    ...Object.values(media.units),
    ...Object.values(media.posts),
    ...media.galleries.clinic,
    ...Object.values(media.galleries.services).flat(),
    ...Object.values(media.galleries.units).flat(),
  ].filter(Boolean)

  assert.ok(images.length > 0)

  for (const image of images) {
    checkImage(image)
  }
})

test('os perfis da equipa preservam as fotografias atribuídas', () => {
  const portraits = Object.entries(media.team)
    .filter(([, image]) => image)

  assert.equal(portraits.length, 11)

  const withoutPortrait = Object.entries(media.team)
    .filter(([, image]) => !image)
    .map(([id]) => id)

  assert.deepEqual(withoutPortrait, [
    'sofia-costa',
    'joana-simoes',
    'joana-bessa',
    'filipa-lima',
    'isabel-lourenco',
  ])

  for (const [id, image] of portraits) {
    checkImage(image)

    const filename = image.src.split('/').pop()

    assert.ok(
      filename.startsWith(`${id}-`),
      `Verificar retrato de ${id}: ${image.src}`
    )
  }
})

test('as associações e galerias utilizam imagens locais existentes', () => {
  assert.equal(media.galleries.units['leca-da-palmeira'].length, 19)
  assert.equal(media.galleries.units['sao-mamede-de-infesta'].length, 6)

  assert.equal(
    Object.values(media.posts).filter(Boolean).length,
    12
  )

  assert.equal(media.services['intervencao-em-grupo'], null)

  for (const source of [
    media.brand,
    media.brandFooter,
    media.favicon,
  ]) {
    assert.equal(typeof source, 'string')
    assert.ok(source.startsWith('/images/branding/'))
    assert.ok(existsSync(getImagePath(source)))
  }

  for (const gallery of [
    media.galleries.clinic,
    ...Object.values(media.galleries.services),
    ...Object.values(media.galleries.units),
  ]) {
    assert.ok(Array.isArray(gallery))

    for (const image of gallery) {
      checkImage(image)
    }
  }
})

test('os retratos de baixa resolução mantêm dimensões declaradas', () => {
  assert.deepEqual(
    [media.team['ines-maia'].width, media.team['ines-maia'].height],
    [300, 300]
  )

  assert.deepEqual(
    [media.team['vania-peixoto'].width, media.team['vania-peixoto'].height],
    [410, 410]
  )
})

import { media } from './media'

// Presentation only: official service text and shared image assignments stay intact.
// Sources and selection notes: docs/SERVICES_DESIGN.md.
const fromGallery = (slug, index) => media.galleries.services[slug][index]
export const serviceSpace = {
  ...media.galleries.clinic.find(image => image.src.includes('031f2689')),
  alt: 'Sala da unidade de Leça da Palmeira, com equipamentos de movimento e materiais de brincar',
  caption: 'Leça da Palmeira · espaço da clínica',
}

const selections = {
  fisioterapia: fromGallery('fisioterapia', 0),
  acupuntura: fromGallery('acupuntura', 0),
  psicologia: fromGallery('psicologia', 1),
  'terapia-da-fala': media.services['terapia-da-fala'],
  'terapia-ocupacional': fromGallery('terapia-ocupacional', 1),
  floortime: fromGallery('floortime', 0),
  'integracao-sensorial': fromGallery('integracao-sensorial', 0),
  'intervencao-em-grupo': serviceSpace,
  formacao: media.services.formacao,
}

const illustrations = new Set([
  'fisioterapia-10727039.jpg', 'fisioterapia-0197c4d5.jpg', 'fisioterapia-ce39101f.jpg',
  'acupunctura-4c035b65.jpg', 'acupunctura-0946c68f.jpg', 'acupunctura-7776195e.jpg',
  'psicologia-d66a81e8.jpg', 'psicologia-77aed2ed.jpg', 'formacao-29ddf704.jpg',
  'terapia-ocupacional-6d2ba1fe.jpg', 'terapia-ocupacional-5a9b80e3.jpg',
  'terapia-ocupacional-da46f9d8.jpg', 'terapia-ocupacional-5068fb03.jpg',
  'terapia-ocupacional-888a9ea4.jpg', 'terapia-ocupacional-89e09fd1.jpg',
  'terapia-ocupacional-e559e890.jpg', 'terapia-ocupacional-6bf441ee.jpg',
])

export function serviceImageCaption(image) {
  if (image.caption) return image.caption
  return illustrations.has(image.src.split('/').pop())
    ? 'Imagem ilustrativa · arquivo do site'
    : 'Arquivo de imagens · Alcançari'
}

export function serviceImage(service) {
  return selections[service.slug] || service.image || serviceSpace
}

export function serviceGallery(service) {
  return [...(media.galleries.services[service.slug] || [])].sort((a, b) =>
    Number(illustrations.has(a.src.split('/').pop())) - Number(illustrations.has(b.src.split('/').pop()))
  )
}

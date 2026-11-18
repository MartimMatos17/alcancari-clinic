import { getPublished } from './content.js'
export function contactSelection(params, services, units) {
  const service = getPublished(services).find(item => item.slug === params.get('servico'))
  const unit = getPublished(units).find(item => item.id === params.get('unidade'))
  return {
    requestType: service || unit || params.get('tipo') === 'marcacao' ? 'marcacao' : 'informacoes',
    service: service?.title || '',
    unit: unit?.name.replace(/^Unidade\s+/i, '') || '',
  }
}

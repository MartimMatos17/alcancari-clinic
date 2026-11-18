import test from 'node:test'
import assert from 'node:assert/strict'
import { contactSelection } from '../src/lib/contactSelection.js'
const services = [{ slug: 'service', title: 'Serviço aprovado', confirmed: true, published: true }, { slug: 'private', title: 'Não publicado', confirmed: true, published: false }]
const units = [{ id: 'unit', name: 'Unidade Exemplo', confirmed: true, published: true }]

test('contacto conserva apenas escolhas de servicos e unidades publicadas', () => {
  assert.deepEqual(contactSelection(new URLSearchParams('servico=service&unidade=unit&email=private@example.invalid'), services, units), { requestType: 'marcacao', service: 'Serviço aprovado', unit: 'Exemplo' })
  assert.deepEqual(contactSelection(new URLSearchParams('servico=private&unidade=%3Cscript%3E'), services, units), { requestType: 'informacoes', service: '', unit: '' })
  assert.equal(contactSelection(new URLSearchParams('tipo=marcacao'), services, units).requestType, 'marcacao')
})


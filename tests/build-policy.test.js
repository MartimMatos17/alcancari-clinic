import test from 'node:test'
import assert from 'node:assert/strict'
import { checkPublicFiles } from '../scripts/check-build.mjs'

const index = { name: 'index.html', content: '<!doctype html><html lang="pt-PT"></html>' }

test('o build aceita HTML e recursos estáticos públicos', () => {
  assert.equal(checkPublicFiles([index, { name: 'assets/app.js', content: 'console.log("público")' }, { name: 'images/clinic/space.webp', content: '' }]).files, 3)
})

test('o build rejeita configurações privadas, código antigo e mapas de código', () => {
  for (const name of ['.env', 'backend/server.js', 'backups/recovery.tar.gz', 'database/schema.sql', 'assets/app.js.map', 'images/schema.sql']) {
    assert.throws(() => checkPublicFiles([index, { name, content: '' }]))
  }
})

test('o build rejeita sinais de configuração privada sem expor o valor', () => {
  assert.throws(() => checkPublicFiles([index, { name: 'assets/app.js', content: 'JWT_SECRET=sintetico' }]), /Conteúdo privado/)
})

test('o orçamento de JavaScript evita regressões significativas', () => {
  assert.throws(() => checkPublicFiles([index, { name: 'assets/app.js', content: 'x'.repeat(512_001) }]), /orçamento/)
})

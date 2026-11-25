import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, statSync, symlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createDraftStore, revision, catalogs, contentIssues } from '../scripts/admin-content.mjs'

test('rascunhos preservam originais, conflitos, permissoes e copias recuperaveis', () => {
  const root = mkdtempSync(join(tmpdir(), 'alcancari-drafts-'))
  const source = join(root, 'src/content/posts.json')
  const path = join(root, 'backups/admin-drafts/posts.json')
  const original = { slug: 'fixture', title: 'Original', category: 'Teste', summary: 'Resumo original' }
  try {
    mkdirSync(join(root, 'src/content'), { recursive: true })
    for (const name of ['posts','services','team','units']) writeFileSync(join(root, `src/content/${name}.json`), JSON.stringify(name === 'posts' ? [original] : []))
    const store = createDraftStore(pathToFileURL(root + '/'))
    const first = { title: 'Primeira edição', category: 'Teste', summary: 'Resumo editado', note: '', status: 'draft' }
    assert.equal(store.saveDraft('fixture', first, revision(null), revision(original)).code, 200)
    const saved = store.readDrafts().fixture
    assert.equal(store.saveDraft('fixture', first, revision(null), revision(original)).code, 409)
    assert.equal(store.saveDraft('fixture', { ...first, title: 'Segunda edição', status: 'review' }, revision(saved), revision(original)).code, 200)
    assert.equal(store.readDrafts().fixture.history[0].title, first.title)
    const copy = store.listBackups()[0]
    assert.ok(copy)
    assert.equal(statSync(path).mode & 0o777, 0o600)
    assert.equal(statSync(join(root, 'backups/admin-drafts/copies', copy)).mode & 0o777, 0o600)
    assert.equal(store.restoreBackup('../posts.json', store.diskVersion()).code, 400)
    assert.equal(store.restoreBackup(copy, 'stale').code, 409)
    writeFileSync(path, '{damaged')
    assert.throws(() => store.readDrafts())
    assert.equal(store.restoreBackup(copy, store.diskVersion()).code, 200)
    assert.equal(store.readDrafts().fixture.title, first.title)
    assert.deepEqual(JSON.parse(readFileSync(source)), [original])
    for (let index = 0; index < 23; index++) {
      const current = store.readDrafts().fixture
      assert.equal(store.saveDraft('fixture', { ...first, title: `Edição ${index}` }, revision(current), revision(original)).code, 200)
    }
    assert.equal(store.listBackups().length, 20)
    assert.equal(store.readDrafts().fixture.history.length, 20)
    const existing = readFileSync(path)
    rmSync(path)
    const outside = join(root, 'outside.json'); writeFileSync(outside, existing)
    symlinkSync(outside, path)
    assert.throws(() => store.readDrafts(), /simbólica/)
  } finally { rmSync(root, { recursive: true, force: true }) }
})


test('o radar administrativo identifica os serviços sem texto detalhado', () => {
  const section = catalogs().find(section => section.key === 'services')
  const pending = section.entries.filter(entry => contentIssues(section, entry).includes('Apenas resumo disponível'))
  assert.deepEqual(pending.map(entry => entry.slug), ['intervencao-em-grupo', 'formacao'])
  assert.ok(pending.every(entry => entry.blocks.length === 0))
})

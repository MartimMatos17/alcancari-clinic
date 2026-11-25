import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, statSync, chmodSync, rmSync, readdirSync, symlinkSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createCipheriv, createDecipheriv, scryptSync, randomBytes } from 'node:crypto'
import { EventEmitter } from 'node:events'
import { spawnSync } from 'node:child_process'
import { exportBackup, verifyBackup, recoverBackup, prepareRecovery, readPassword } from '../scripts/admin-backup.mjs'
import { createDraftStore, revision } from '../scripts/admin-content.mjs'

const password = 'fixture-only-external-backup-passphrase'
const magic = Buffer.from('ALCANCARI-BACKUP\0\x01', 'binary')
const saltStart = magic.length
const nonceStart = saltStart + 16
const headerSize = nonceStart + 12
const copy = 'drafts-1700000000000-abcdef0123456789.json'
const original = { slug: 'fixture', title: 'Original', category: 'Teste', summary: 'Resumo original' }
const draft = { title: 'Edição temporária', category: 'Teste', summary: 'Resumo de teste isolado', note: 'Nota privada de teste', status: 'draft', history: [] }

function fixture(run) {
  const directory = mkdtempSync(join(tmpdir(), 'alcancari-encrypted-test-'))
  const project = join(directory, 'project')
  const base = join(project, 'backups/admin-drafts')
  mkdirSync(join(project, 'src/content'), { recursive: true })
  for (const name of ['posts', 'services', 'team', 'units']) writeFileSync(join(project, `src/content/${name}.json`), JSON.stringify(name === 'posts' ? [original] : []))
  for (const path of [join(project, 'backups'), base, join(base, 'copies')]) mkdirSync(path, { mode: 0o700 })
  const content = JSON.stringify({ fixture: draft })
  writeFileSync(join(base, 'posts.json'), content, { mode: 0o600 })
  writeFileSync(join(base, 'copies', copy), content, { mode: 0o600 })
  const options = { directory, project, base, root: pathToFileURL(project + '/'), destination: join(directory, 'copy.acbk'), password }
  try { return run(options) } finally { rmSync(directory, { recursive: true, force: true }) }
}
const kdf = (password, salt) => scryptSync(password, salt, 32, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 })

test('exportação autenticada preserva fontes, varia sal/nonce e recupera ficheiros privados sem sobrescrever', () => fixture(options => {
  const current = join(options.base, 'posts.json')
  const saved = readFileSync(current)
  const previous = statSync(current)
  assert.equal(exportBackup(options).files, 2)
  assert.equal(statSync(options.destination).mode & 0o777, 0o600)
  const encrypted = readFileSync(options.destination)
  assert.ok(!encrypted.includes(Buffer.from(draft.note)))
  assert.ok(!encrypted.includes(Buffer.from(password)))
  // Check compatibility with the standard native AES-GCM primitives independently.
  const key = kdf(password, encrypted.subarray(saltStart, nonceStart))
  const decipher = createDecipheriv('aes-256-gcm', key, encrypted.subarray(nonceStart, headerSize), { authTagLength: 16 })
  decipher.setAAD(encrypted.subarray(0, headerSize)); decipher.setAuthTag(encrypted.subarray(-16))
  const payload = JSON.parse(Buffer.concat([decipher.update(encrypted.subarray(headerSize, -16)), decipher.final()]))
  key.fill(0)
  assert.equal(payload.files.length, 2)
  assert.equal(verifyBackup({ archive: options.destination, password }).files, 2)
  const second = join(options.directory, 'other.acbk')
  exportBackup({ ...options, destination: second })
  assert.notDeepEqual(readFileSync(second), encrypted)
  assert.throws(() => exportBackup(options), /já existe/)
  assert.deepEqual(readFileSync(options.destination), encrypted)
  const recovered = join(options.directory, 'recovered')
  assert.equal(recoverBackup({ ...options, archive: options.destination, destination: recovered }).files, 2)
  assert.deepEqual(readFileSync(join(recovered, 'posts.json')), saved)
  assert.deepEqual(readFileSync(join(recovered, 'copies', copy)), saved)
  for (const path of [recovered, join(recovered, 'copies')]) assert.equal(statSync(path).mode & 0o777, 0o700)
  for (const path of [join(recovered, 'posts.json'), join(recovered, 'copies', copy)]) assert.equal(statSync(path).mode & 0o777, 0o600)
  assert.throws(() => recoverBackup({ ...options, archive: options.destination, destination: recovered }), /já existe/)
  assert.deepEqual(readFileSync(current), saved)
  assert.equal(statSync(current).mtimeMs, previous.mtimeMs)
  assert.deepEqual(readFileSync(join(options.base, 'copies', copy)), saved)
  assert.deepEqual(readdirSync(join(options.base, 'copies')), [copy])
}))

test('palavra-passe errada, truncagem e alterações no cabeçalho, texto cifrado ou tag nunca escrevem dados', () => fixture(options => {
  exportBackup(options)
  const original = readFileSync(options.destination)
  const recovered = join(options.directory, 'must-not-exist')
  assert.throws(() => recoverBackup({ ...options, archive: options.destination, password: 'incorrect-fixture-passphrase-only', destination: recovered }), /incorreta ou arquivo corrompido/)
  assert.equal(existsSync(recovered), false)
  const damaged = join(options.directory, 'damaged.acbk')
  for (const offset of [0, saltStart, nonceStart, headerSize, original.length - 1]) {
    const changed = Buffer.from(original); changed[offset] ^= 1
    writeFileSync(damaged, changed)
    assert.throws(() => recoverBackup({ ...options, archive: damaged, destination: recovered }))
    assert.equal(existsSync(recovered), false)
  }
  writeFileSync(damaged, original.subarray(0, 40))
  assert.throws(() => verifyBackup({ archive: damaged, password }), /inválido/)
}))

test('arquivos autenticados com caminhos de fuga ou repetidos são recusados antes da extração', () => fixture(options => {
  for (const files of [
    [{ path: '../escape.json', content: '{}' }],
    [{ path: '/absolute.json', content: '{}' }],
    [{ path: 'posts.json', content: '{}' }, { path: 'posts.json', content: '{}' }],
    [{ path: 'posts.json', content: '{corrupted' }],
  ]) {
    const header = Buffer.concat([magic, randomBytes(16), randomBytes(12)])
    const key = kdf(password, header.subarray(saltStart, nonceStart))
    const cipher = createCipheriv('aes-256-gcm', key, header.subarray(-12), { authTagLength: 16 })
    cipher.setAAD(header)
    const plain = Buffer.from(JSON.stringify({ format: 'alcancari-admin-drafts-v1', files }))
    writeFileSync(options.destination, Buffer.concat([header, cipher.update(plain), cipher.final(), cipher.getAuthTag()]))
    key.fill(0)
    const recovered = join(options.directory, 'must-not-exist')
    assert.throws(() => recoverBackup({ ...options, archive: options.destination, destination: recovered }))
    assert.equal(existsSync(recovered), false)
  }
  assert.equal(existsSync(join(options.directory, 'escape.json')), false)
}))

test('fontes inseguras, ligações simbólicas e destinos no projeto são recusados sem alterações', () => fixture(options => {
  assert.throws(() => exportBackup({ ...options, destination: join(options.project, 'public-copy.acbk') }), /fora do projeto/)
  chmodSync(join(options.base, 'posts.json'), 0o644)
  assert.throws(() => exportBackup(options), /permissões inseguras/)
  assert.equal(statSync(join(options.base, 'posts.json')).mode & 0o777, 0o644)
  chmodSync(join(options.base, 'posts.json'), 0o600)
  chmodSync(join(options.base, 'copies'), 0o755)
  assert.throws(() => exportBackup(options), /Diretório privado inseguro/)
  chmodSync(join(options.base, 'copies'), 0o700)
  const link = join(options.directory, 'link.acbk')
  symlinkSync(join(options.base, 'posts.json'), link)
  assert.throws(() => exportBackup({ ...options, destination: link }), /já existe/)
  const prior = readFileSync(join(options.base, 'posts.json'))
  rmSync(join(options.base, 'posts.json'))
  symlinkSync(join(options.base, 'copies', copy), join(options.base, 'posts.json'))
  assert.throws(() => exportBackup(options))
  assert.deepEqual(readFileSync(join(options.base, 'copies', copy)), prior)
  assert.equal(existsSync(options.destination), false)
}))

test('recuperação prepara uma nova candidata e o Editor conserva conflitos e cópias anteriores', () => fixture(options => {
  exportBackup(options)
  const recovered = join(options.directory, 'recovered')
  recoverBackup({ ...options, archive: options.destination, destination: recovered })
  const current = join(options.base, 'posts.json')
  const before = readFileSync(current)
  const { name } = prepareRecovery({ directory: recovered, root: options.root })
  assert.notEqual(name, copy)
  assert.deepEqual(readFileSync(current), before)
  assert.equal(statSync(join(options.base, 'copies', name)).mode & 0o777, 0o600)
  const store = createDraftStore(options.root)
  assert.ok(store.listBackups().includes(name))
  assert.equal(store.restoreBackup(name, 'stale').code, 409)
  assert.equal(store.saveDraft('fixture', { ...draft, title: 'Após exportação' }, revision(store.readDrafts().fixture), revision(original)).code, 200)
  assert.equal(store.restoreBackup(name, store.diskVersion()).code, 200)
  assert.equal(store.readDrafts().fixture.title, draft.title)
  assert.deepEqual(readFileSync(join(options.base, 'copies', copy)), before)
  assert.deepEqual(JSON.parse(readFileSync(join(options.project, 'src/content/posts.json'))), [original])
  writeFileSync(join(recovered, 'posts.json'), JSON.stringify({ unknown: draft }))
  assert.throws(() => prepareRecovery({ directory: recovered, root: options.root }), /desconhecidas/)
}))

test('palavras-passe fracas e entrada não interativa falham sem expor segredos', async () => {
  fixture(options => {
    assert.throws(() => exportBackup({ ...options, password: 'short' }), /20 a 1024/)
    assert.equal(existsSync(options.destination), false)
  })
  await assert.rejects(readPassword('Prompt', { isTTY: false }, { isTTY: false }), /terminal interativo/)
  const command = spawnSync(process.execPath, ['scripts/admin-backup.mjs', 'verificar', '/nonexistent.acbk'], { input: password, encoding: 'utf8' })
  assert.equal(command.status, 1)
  assert.ok(!(command.stdout + command.stderr).includes(password))
})

test('entrada oculta suporta Unicode, correção e cancelamento e repõe o terminal', async () => {
  const input = new EventEmitter()
  Object.assign(input, { isTTY: true, isRaw: false, setRawMode(value) { this.isRaw = value }, resume() {}, pause() {} })
  let printed = ''
  const output = { isTTY: true, write(value) { printed += value } }
  const pending = readPassword('Prompt: ', input, output)
  await new Promise(resolve => setImmediate(resolve))
  input.emit('keypress', 'á'); input.emit('keypress', 'x'); input.emit('keypress', undefined, { name: 'backspace' })
  input.emit('keypress', undefined, { name: 'return' })
  assert.equal(await pending, 'á')
  assert.equal(printed, 'Prompt: \n')
  assert.equal(input.isRaw, false)
  const cancelled = readPassword('Prompt: ', input, output)
  const rejection = assert.rejects(cancelled, /cancelada/)
  await new Promise(resolve => setImmediate(resolve))
  input.emit('keypress', undefined, { ctrl: true, name: 'c' })
  await rejection
  assert.equal(input.isRaw, false)
})

test('exportação e extração continuam privadas com umask permissiva', () => fixture(options => {
  const previous = process.umask(0)
  try {
    exportBackup(options)
    const recovered = join(options.directory, 'private-recovery')
    recoverBackup({ ...options, archive: options.destination, destination: recovered })
    assert.equal(statSync(options.destination).mode & 0o777, 0o600)
    for (const path of [recovered, join(recovered, 'copies')]) assert.equal(statSync(path).mode & 0o777, 0o700)
    assert.equal(statSync(join(recovered, 'posts.json')).mode & 0o777, 0o600)
  } finally { process.umask(previous) }
}))

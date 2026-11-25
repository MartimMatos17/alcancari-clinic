import {
  constants, openSync, closeSync, fstatSync, fchmodSync, fsyncSync,
  writeFileSync, readSync, lstatSync, readdirSync, mkdirSync, realpathSync, linkSync, unlinkSync,
} from 'node:fs'
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto'
import { dirname, basename, join, resolve, relative, isAbsolute } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { adminRoot } from './admin-security.mjs'
import { postCatalog } from './admin-content.mjs'

// Versioned container; encryption and authentication are provided by Node/OpenSSL.
const MAGIC = Buffer.from('ALCANCARI-BACKUP\0\x01', 'binary')
const HEADER_SIZE = MAGIC.length + 16 + 12
const TAG_SIZE = 16
const MAX_FILE = 16 * 1024 * 1024
const MAX_ARCHIVE = 64 * 1024 * 1024
const MAX_FILES = 256
const copyPattern = /^drafts-\d{13}-[a-f0-9]{16}\.json$/
const validName = name => name === 'posts.json' || /^copies\//.test(name) && copyPattern.test(name.slice(7))
class BackupError extends Error {}
const fail = message => { throw new BackupError(message) }
const rootPath = root => realpathSync(root instanceof URL ? fileURLToPath(root) : root)
const inside = (path, root) => { const part = relative(root, path); return !part || part !== '..' && !part.startsWith('../') && !isAbsolute(part) }

function privateDirectory(path) {
  const info = lstatSync(path)
  if (!info.isDirectory() || info.isSymbolicLink() || (info.mode & 0o777) !== 0o700) fail('Diretório privado inseguro; nada foi alterado.')
}
function readRegular(path, maximum, privateFile = false) {
  const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK)
  try {
    const before = fstatSync(fd)
    if (!before.isFile() || before.nlink !== 1 || before.size > maximum || privateFile && (before.mode & 0o777) !== 0o600) fail('Ficheiro inválido, demasiado grande ou com permissões inseguras.')
    // Bounded allocation/read even if another process grows the file after fstat.
    const buffer = Buffer.alloc(before.size + 1)
    let size = 0, count
    while (size < buffer.length && (count = readSync(fd, buffer, size, buffer.length - size, null)) > 0) size += count
    const content = buffer.subarray(0, size)
    const after = fstatSync(fd)
    if (content.length !== before.size || before.size !== after.size || before.mtimeMs !== after.mtimeMs || before.ctimeMs !== after.ctimeMs) fail('Os dados mudaram durante a leitura. Feche o Editor e tente novamente.')
    return content
  } finally { closeSync(fd) }
}
function writeNew(path, content) {
  const fd = openSync(path, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600)
  try {
    fchmodSync(fd, 0o600)
    if ((fstatSync(fd).mode & 0o777) !== 0o600) fail('O disco não garante permissões privadas; operação recusada.')
    writeFileSync(fd, content); fsyncSync(fd)
  }
  catch (error) { unlinkSync(path); throw error }
  finally { closeSync(fd) }
}
function syncDirectory(path) {
  const fd = openSync(path, constants.O_RDONLY | constants.O_DIRECTORY)
  try { fsyncSync(fd) } finally { closeSync(fd) }
}
function newExternalPath(destination, root) {
  const requested = resolve(destination)
  const parent = realpathSync(dirname(requested))
  const target = join(parent, basename(requested))
  // Also exclude the actual project when tests supply an isolated data root.
  if ([rootPath(root), rootPath(adminRoot)].some(project => inside(target, project))) fail('Escolha um destino fora do projeto, num diretório já existente.')
  try { lstatSync(target); fail('O destino já existe. Escolha outro nome; nada será substituído.') }
  catch (error) { if (error.code !== 'ENOENT') throw error }
  return target
}
function passwordKey(password, salt) {
  if (typeof password !== 'string' || [...password].length < 20 || password.length > 1024) fail('Utilize uma palavra-passe exclusiva com 20 a 1024 caracteres.')
  return scryptSync(password, salt, 32, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 })
}
function validateDrafts(text) {
  const drafts = JSON.parse(text)
  if (!drafts || typeof drafts !== 'object' || Array.isArray(drafts)) fail('Formato de rascunhos inválido.')
  for (const [slug, entry] of Object.entries(drafts)) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || ['constructor', 'prototype'].includes(slug) || !entry || typeof entry !== 'object' || Array.isArray(entry)) fail('Formato de rascunhos inválido.')
    for (const [key, maximum] of Object.entries({ title: 180, category: 100, summary: 1500 })) {
      if (typeof entry[key] !== 'string' || !entry[key].trim() || entry[key].length > maximum) fail('Campos de rascunho inválidos.')
    }
    if (entry.note !== undefined && (typeof entry.note !== 'string' || entry.note.length > 1000)) fail('Nota de rascunho inválida.')
    if (entry.history !== undefined && (!Array.isArray(entry.history) || entry.history.length > 20)) fail('Histórico de rascunho inválido.')
  }
  return drafts
}
function snapshot(root) {
  const project = rootPath(root)
  const base = join(project, 'backups/admin-drafts')
  privateDirectory(join(project, 'backups'))
  privateDirectory(base)
  const files = []
  for (const name of readdirSync(base).sort()) {
    if (name === 'copies') {
      privateDirectory(join(base, name))
      for (const copy of readdirSync(join(base, name)).sort()) {
        if (!copyPattern.test(copy)) fail('Ficheiro inesperado nas cópias. Feche o Editor e verifique a pasta.')
        files.push({ path: `copies/${copy}` })
      }
    } else if (name === 'posts.json') files.push({ path: name })
    else fail('Ficheiro inesperado nos rascunhos. Feche o Editor e verifique a pasta.')
  }
  if (!files.some(file => file.path === 'posts.json') || files.length > MAX_FILES) fail('Sem rascunhos atuais ou demasiadas cópias para exportar.')
  let total = 0
  for (const file of files) {
    file.content = readRegular(join(base, file.path), MAX_FILE, true).toString('utf8')
    total += Buffer.byteLength(file.content)
    if (total > MAX_ARCHIVE / 2) fail('Cópia demasiado grande; operação recusada.')
    validateDrafts(file.content)
  }
  return files
}
function validatePayload(payload) {
  if (payload?.format !== 'alcancari-admin-drafts-v1' || !Array.isArray(payload.files) || !payload.files.length || payload.files.length > MAX_FILES) fail('Formato de arquivo inválido.')
  const names = new Set()
  for (const file of payload.files) {
    if (!file || typeof file.path !== 'string' || !validName(file.path) || names.has(file.path) || typeof file.content !== 'string' || Buffer.byteLength(file.content) > MAX_FILE) fail('Conteúdo ou caminho de arquivo inválido.')
    names.add(file.path)
    validateDrafts(file.content)
  }
  if (!names.has('posts.json')) fail('Faltam os rascunhos atuais no arquivo.')
  return payload
}
function decryptArchive(archive, password) {
  const encrypted = readRegular(archive, MAX_ARCHIVE)
  if (encrypted.length <= HEADER_SIZE + TAG_SIZE || !encrypted.subarray(0, MAGIC.length).equals(MAGIC)) fail('Arquivo inválido ou versão não suportada.')
  const header = encrypted.subarray(0, HEADER_SIZE)
  const key = passwordKey(password, header.subarray(MAGIC.length, MAGIC.length + 16))
  let partial, plain
  try {
    const decipher = createDecipheriv('aes-256-gcm', key, header.subarray(-12), { authTagLength: TAG_SIZE })
    decipher.setAAD(header)
    decipher.setAuthTag(encrypted.subarray(-TAG_SIZE))
    try {
      partial = decipher.update(encrypted.subarray(HEADER_SIZE, -TAG_SIZE))
      plain = Buffer.concat([partial, decipher.final()])
    } catch { fail('Palavra-passe incorreta ou arquivo corrompido. Nada foi recuperado.') }
    return validatePayload(JSON.parse(plain.toString('utf8')))
  } finally { key.fill(0); partial?.fill(0); plain?.fill(0) }
}

export function exportBackup({ destination, password, root = adminRoot }) {
  const target = newExternalPath(destination, root)
  const files = snapshot(root)
  const plain = Buffer.from(JSON.stringify({ format: 'alcancari-admin-drafts-v1', createdAt: new Date().toISOString(), files }))
  if (plain.length > MAX_ARCHIVE - HEADER_SIZE - TAG_SIZE) fail('Cópia demasiado grande; operação recusada.')
  const header = Buffer.concat([MAGIC, randomBytes(16), randomBytes(12)])
  const key = passwordKey(password, header.subarray(MAGIC.length, MAGIC.length + 16))
  const temporary = join(dirname(target), `.alcancari-${randomBytes(16).toString('hex')}.tmp`)
  let created = false
  try {
    const cipher = createCipheriv('aes-256-gcm', key, header.subarray(-12), { authTagLength: TAG_SIZE })
    cipher.setAAD(header)
    const encrypted = Buffer.concat([header, cipher.update(plain), cipher.final(), cipher.getAuthTag()])
    // Detect concurrent edits before publishing a snapshot. No local source is written.
    if (JSON.stringify(snapshot(root)) !== JSON.stringify(files)) fail('Os rascunhos mudaram. Feche o Editor e repita a exportação.')
    writeNew(temporary, encrypted)
    created = true
    // Exclusive publication: unlike rename, link cannot overwrite an existing target.
    linkSync(temporary, target)
    syncDirectory(dirname(target))
    return { path: target, files: files.length }
  } finally {
    key.fill(0); plain.fill(0)
    if (created) unlinkSync(temporary)
  }
}
export function verifyBackup({ archive, password }) {
  const payload = decryptArchive(archive, password)
  return { files: payload.files.length, createdAt: payload.createdAt }
}
export function recoverBackup({ archive, password, destination, root = adminRoot }) {
  const target = newExternalPath(destination, root)
  // Authenticate all bytes and validate all paths before creating any plaintext file.
  const payload = decryptArchive(archive, password)
  mkdirSync(target, { mode: 0o700 })
  privateDirectory(target)
  for (const file of payload.files) {
    if (file.path.startsWith('copies/') && !readdirSync(target).includes('copies')) mkdirSync(join(target, 'copies'), { mode: 0o700 })
    writeNew(join(target, file.path), file.content)
  }
  if (payload.files.some(file => file.path.startsWith('copies/'))) syncDirectory(join(target, 'copies'))
  syncDirectory(target)
  syncDirectory(dirname(target))
  return { path: target, files: payload.files.length }
}
// An explicit second step only adds a new candidate. The Editor still requires
// authentication, CSRF, confirmation and conflict checks to restore that candidate.
export function prepareRecovery({ directory, root = adminRoot }) {
  const recovered = realpathSync(directory)
  if ([rootPath(root), rootPath(adminRoot)].some(project => inside(recovered, project))) fail('Selecione a pasta de recuperação externa, fora do projeto.')
  privateDirectory(recovered)
  const content = readRegular(join(recovered, 'posts.json'), MAX_FILE, true)
  const drafts = validateDrafts(content.toString('utf8'))
  const known = new Set(postCatalog(root).map(post => post.slug))
  if (Object.keys(drafts).some(slug => !known.has(slug))) fail('A cópia contém publicações desconhecidas neste projeto. Reveja-a antes de continuar.')
  const base = join(rootPath(root), 'backups/admin-drafts')
  privateDirectory(dirname(base)); privateDirectory(base)
  const copies = join(base, 'copies')
  try { mkdirSync(copies, { mode: 0o700 }) } catch (error) { if (error.code !== 'EEXIST') throw error }
  privateDirectory(copies)
  const name = `drafts-${Date.now()}-${randomBytes(8).toString('hex')}.json`
  writeNew(join(copies, name), content)
  syncDirectory(copies)
  return { name }
}

export async function readPassword(label, input = process.stdin, output = process.stderr) {
  if (!input.isTTY || !output.isTTY) fail('É necessário um terminal interativo; palavras-passe em argumentos, ficheiros ou pipes não são aceites.')
  const { emitKeypressEvents } = await import('node:readline')
  emitKeypressEvents(input)
  output.write(label)
  const wasRaw = input.isRaw
  input.setRawMode(true); input.resume()
  return new Promise((resolvePassword, reject) => {
    let value = ''
    const finish = error => {
      input.removeListener('keypress', onKey)
      input.setRawMode(Boolean(wasRaw)); input.pause(); output.write('\n')
      if (error) { value = ''; reject(error) } else resolvePassword(value)
    }
    function onKey(text, key = {}) {
      if (key.ctrl && ['c', 'd'].includes(key.name)) return finish(new BackupError('Operação cancelada.'))
      if (key.name === 'return' || key.name === 'enter') return finish()
      if (key.name === 'backspace') value = [...value].slice(0, -1).join('')
      else if (text && !key.ctrl && !key.meta && !/[\x00-\x1f\x7f]/.test(text)) {
        if (value.length + text.length > 1024) return finish(new BackupError('Palavra-passe demasiado longa.'))
        value += text
      }
    }
    input.on('keypress', onKey)
  })
}
async function main() {
  const [command, source, destination, ...extra] = process.argv.slice(2)
  if (extra.length || !source || !['exportar', 'verificar', 'recuperar', 'preparar'].includes(command) || (command === 'recuperar' ? !destination : destination !== undefined)) {
    fail('Uso: node scripts/admin-backup.mjs exportar DESTINO.acbk | verificar ARQUIVO.acbk | recuperar ARQUIVO.acbk PASTA_NOVA | preparar PASTA_RECUPERADA')
  }
  if (command === 'preparar') {
    const { name } = prepareRecovery({ directory: source })
    console.log(`Cópia adicionada: ${name}. No Editor, abra «Cópias de segurança» e confirme a recuperação. Os rascunhos atuais não foram alterados.`)
    return
  }
  const password = await readPassword('Palavra-passe da cópia (não aparece no ecrã): ')
  if (command === 'exportar' && password !== await readPassword('Repetir palavra-passe: ')) fail('As palavras-passe não coincidem. Nada foi exportado.')
  if (command === 'exportar') {
    const result = exportBackup({ destination: source, password })
    console.log(`Cópia cifrada criada (${result.files} ficheiros). Execute «verificar» com o arquivo guardado antes de o retirar.`)
  } else if (command === 'verificar') {
    const result = verifyBackup({ archive: source, password })
    console.log(`Integridade e cifragem verificadas: ${result.files} ficheiros. Nenhum dado foi escrito.`)
  } else {
    const result = recoverBackup({ archive: source, password, destination })
    console.log(`Recuperação isolada concluída: ${result.files} ficheiros privados. Reveja-os e utilize «preparar» para disponibilizar uma cópia no Editor.`)
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => {
    // Never print crypto/OS errors, paths, draft contents or a supplied password.
    console.error(error instanceof BackupError ? error.message : 'Operação não concluída. Verifique a integridade do arquivo, as permissões e o suporte do disco. Os backups existentes foram preservados.')
    process.exitCode = 1
  })
}

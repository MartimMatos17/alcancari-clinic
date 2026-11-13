import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function checkPublicFiles(files) {
  const allowed = /^(index\.html|robots\.txt|favicon\.svg|assets\/[a-zA-Z0-9._-]+\.(js|css)|(?:images|brand)\/(?:[a-zA-Z0-9_/-]+\.(avif|webp|png|jpe?g|svg)|(?:[a-zA-Z0-9_/-]+\/)?\.gitkeep))$/
  for (const file of files) {
    if (!allowed.test(file.name) || /(^|\/)(backups|backend|database|node_modules|\.git)(\/|$)|(^|\/)\.env(?:\.|$)|\.map$/.test(file.name)) {
      throw new Error(`Ficheiro não permitido no build público: ${file.name}`)
    }
    if (/postgres(?:ql)?:\/\/|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:DATABASE_URL|JWT_SECRET|SMTP_PASS|POSTGRES_PASSWORD)\b/.test(file.content)) {
      throw new Error(`Conteúdo privado detetado em ${file.name}; valor omitido.`)
    }
  }
  if (!files.some(file => file.name === 'index.html')) throw new Error('Falta index.html no build.')
  const javascriptBytes = files.filter(file => file.name.endsWith('.js')).reduce((sum, file) => sum + Buffer.byteLength(file.content), 0)
  if (javascriptBytes > 512_000) throw new Error('O JavaScript público ultrapassa o orçamento de 500 KiB.')
  return { files: files.length, javascriptBytes }
}

async function collect(directory, prefix = '') {
  const result = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = `${prefix}${entry.name}`
    const absolute = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Ligação simbólica não permitida: ${name}`)
    if (entry.isDirectory()) result.push(...await collect(absolute, `${name}/`))
    else result.push({ name, content: await readFile(absolute, 'utf8') })
  }
  return result
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = checkPublicFiles(await collect(path.resolve('dist')))
    console.log(`Build público verificado: ${result.files} ficheiros; ${(result.javascriptBytes / 1024).toFixed(1)} KiB de JavaScript no total.`)
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}

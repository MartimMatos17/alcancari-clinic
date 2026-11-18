import { createServer } from 'node:http'
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto'

const digest = value => createHash('sha256').update(String(value)).digest()
const equal = (a, b) => timingSafeEqual(digest(a), digest(b))
export const adminRoot = new URL('../', import.meta.url)

// Local administrative tools only. Do not expose these HTTP servers via a proxy,
// tunnel or public interface. Online administration requires HTTPS and managed MFA.
export function startAdmin({ port, title, handle }) {
  const origin = `http://127.0.0.1:${port}`
  const password = process.env.ALCANCARI_ADMIN_PASSWORD || randomBytes(24).toString('base64url')
  if (password.length < 20) throw new Error('ALCANCARI_ADMIN_PASSWORD deve ter pelo menos 20 caracteres.')
  const passwordHash = digest(password)
  const sessions = new Map()
  const cookieName = `alcancari_admin_${port}`
  const loginCsrf = randomBytes(32).toString('hex')
  let failures = 0
  let blockedUntil = 0
  const cookie = (value, age) => `${cookieName}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${age}`
  const server = createServer(async (req, res) => {
    const nonce = randomBytes(18).toString('base64')
    const now = Date.now()
    for (const [key, value] of sessions) if (now > value.expires || now - value.last > 20 * 60_000) sessions.delete(key)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store, max-age=0')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    // Preserve Origin on local form POSTs; still omit referrers to other origins.
    res.setHeader('Referrer-Policy', 'same-origin')
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
    res.setHeader('Content-Security-Policy', `default-src 'none'; style-src 'nonce-${nonce}'; style-src-attr 'unsafe-inline'; script-src 'nonce-${nonce}'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'; connect-src 'none'`)
    const send = (code, text) => { res.writeHead(code); res.end(text) }
    const redirect = () => { res.writeHead(303, { Location: '/' }); res.end() }
    const loginPage = (message = '') => `<!doctype html><html lang="pt-PT"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Administração Alcançari</title><style nonce="${nonce}">*{box-sizing:border-box}body{margin:0;background:#eff4ef;color:#173f4a;font:16px system-ui;min-height:100dvh;display:grid;place-items:center;padding:24px}main{width:min(100%,440px);padding:36px;background:#fff;border:1px solid #d5e1d9;border-radius:20px;box-shadow:0 24px 80px #173f4a12}small{letter-spacing:.12em;color:#147c91}h1{font:400 38px Georgia}p{line-height:1.7;color:#5c7378}label{display:block;margin-top:24px}input,button{width:100%;padding:14px;border:1px solid #b8ccc2;border-radius:9px;font:inherit;margin-top:10px}button{background:#173f4a;color:white;cursor:pointer}:focus-visible{outline:3px solid #147c91;outline-offset:4px}</style><main><small>ALCANÇARI / ADMINISTRAÇÃO LOCAL</small><h1>Acesso reservado.</h1>${message ? `<p role="alert">${message}</p>` : ''}<p>Utilize a palavra-passe configurada no ambiente ou o código temporário apresentado no terminal ao iniciar o painel.</p><form method="post" action="/entrar"><input type="hidden" name="csrf" value="${loginCsrf}"><label for="password">Palavra-passe</label><input type="password" id="password" name="password" autocomplete="current-password" required maxlength="1024"><button>Entrar no painel</button></form><p>A sessão termina após 20 minutos de inatividade ou, no máximo, 2 horas.</p></main></html>`
    try {
      if (req.headers.host !== `127.0.0.1:${port}` || req.socket.remoteAddress !== '127.0.0.1' || ['cross-site', 'same-site'].includes(req.headers['sec-fetch-site']) || (req.headers.origin && req.headers.origin !== origin)) return send(403, `<!doctype html><html lang="pt-PT"><meta charset="utf-8"><title>Abrir painel no navegador</title><h1>Não foi possível validar a origem do pedido.</h1><p>Abra <a href="${origin}/">${origin}/</a> diretamente no Safari ou Chrome, atualize a página e utilize o código mais recente do terminal. O navegador integrado pode alterar a origem do formulário.</p></html>`)
      if (!['GET', 'POST'].includes(req.method)) { res.setHeader('Allow', 'GET, POST'); return send(405, 'Método não permitido.') }
      let params
      if (req.method === 'POST') {
        if (req.headers.origin !== origin || !/^application\/x-www-form-urlencoded(?:;|$)/i.test(req.headers['content-type'] || '')) return send(403, 'Pedido recusado.')
        const chunks = []
        let size = 0
        for await (const chunk of req) {
          size += chunk.length
          if (size > 40000) return send(413, 'Pedido demasiado grande.')
          chunks.push(chunk)
        }
        params = new URLSearchParams(Buffer.concat(chunks).toString('utf8'))
        for (const key of new Set(params.keys())) if (params.getAll(key).length !== 1) return send(400, 'Pedido inválido.')
      }
      const sessionId = (req.headers.cookie || '').split(';').map(value => value.trim()).find(value => value.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1)
      const session = sessions.get(sessionId)
      if (req.method === 'POST' && req.url === '/entrar') {
        if (!equal(params.get('csrf'), loginCsrf)) return send(403, loginPage('O painel foi reiniciado ou o formulário está desatualizado. Introduza o código mais recente do terminal neste formulário atualizado.'))
        if (blockedUntil > now) { res.setHeader('Retry-After', String(Math.ceil((blockedUntil - now) / 1000))); return send(429, 'Demasiadas tentativas. Aguarde 15 minutos.') }
        if (!timingSafeEqual(digest(params.get('password') || ''), passwordHash)) {
          if (++failures >= 5) { blockedUntil = now + 15 * 60_000; failures = 0 }
          return send(401, loginPage('Código incorreto. Utilize o código mais recente apresentado no terminal deste painel.'))
        }
        failures = 0
        if (sessionId) sessions.delete(sessionId)
        if (sessions.size >= 10) sessions.delete(sessions.keys().next().value)
        const id = randomBytes(32).toString('hex')
        sessions.set(id, { csrf: randomBytes(32).toString('hex'), expires: now + 2 * 60 * 60_000, last: now })
        res.setHeader('Set-Cookie', cookie(id, 7200))
        return redirect()
      }
      if (!session) {
        if (req.method === 'GET' && req.url === '/entrar') return redirect()
        if (req.method !== 'GET' || req.url !== '/') return send(401, loginPage('A sessão expirou. Entre novamente. Qualquer alteração não submetida permanece por guardar.'))
        return send(200, loginPage())
      }
      session.last = now
      if (req.method === 'POST' && !equal(params.get('csrf'), session.csrf)) return send(403, 'Pedido recusado. Atualize a página e tente novamente.')
      if (req.method === 'POST' && req.url === '/sair') {
        sessions.delete(sessionId)
        res.setHeader('Set-Cookie', cookie('', 0))
        return redirect()
      }
      await handle(req, res, { nonce, csrf: session.csrf, params, send, redirect })
    } catch {
      if (!res.headersSent) send(500, 'Não foi possível concluir a operação. Os conteúdos publicados não foram alterados.')
      else res.end()
      console.error('Falha no painel administrativo; detalhes privados omitidos.')
    }
  })
  server.requestTimeout = 15_000
  server.headersTimeout = 10_000
  server.timeout = 20_000
  server.maxHeadersCount = 40
  server.on('error', () => { console.error('Não foi possível iniciar o painel local. Verifique se a porta está disponível.'); process.exitCode = 1 })
  server.listen(port, '127.0.0.1', () => {
    console.log(`${title}: ${origin}/`)
    if (!process.env.ALCANCARI_ADMIN_PASSWORD) console.log(`Código temporário de acesso (não partilhar): ${password}`)
  })
  return server
}

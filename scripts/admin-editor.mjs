import { createServer } from 'node:http'
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const HOST = '127.0.0.1'
const PORT = 4175
const ORIGIN = `http://${HOST}:${PORT}`

const source = join(process.cwd(), 'src/content/posts.json')
const draftDir = join(process.cwd(), 'backups/admin-drafts')
const draftFile = join(draftDir, 'posts.json')

const escape = value => String(value ?? '').replace(
  /[&<>"']/g,
  character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;',
  })[character]
)

function getPosts() {
  return JSON.parse(readFileSync(source, 'utf8'))
}

function getDrafts() {
  try {
    return JSON.parse(readFileSync(draftFile, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return {}
    throw error
  }
}

function render(message = '') {
  const posts = getPosts()
  const drafts = getDrafts()

  const options = posts.map(post => `
    <option value="${escape(post.slug)}">
      ${escape(post.title)}
    </option>
  `).join('')

  const cards = posts.map(post => {
    const draft = drafts[post.slug]
    return `
      <article>
        <div>
          <strong>${escape(post.title)}</strong>
          <p>${escape(post.category)}</p>
        </div>
        <span>${draft ? 'Rascunho guardado' : 'Original'}</span>
      </article>
    `
  }).join('')

  const data = JSON.stringify(posts.map(post => ({
    slug: post.slug,
    title: drafts[post.slug]?.title ?? post.title,
    category: drafts[post.slug]?.category ?? post.category,
    summary: drafts[post.slug]?.summary ?? post.summary,
  }))).replace(/</g, '\\u003c')

  return `<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Alcançari — Editor Local</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: system-ui, sans-serif;
    background: #f3f8f6;
    color: #173f4a;
  }
  header {
    padding: 25px 5%;
    background: #173f4a;
    color: white;
  }
  header small { display: block; opacity: .7; margin-top: 5px; }
  main { max-width: 1100px; margin: auto; padding: 45px 22px; }
  h1 {
    font: 400 clamp(32px,5vw,52px) Georgia,serif;
    margin: 0 0 15px;
  }
  .intro { color: #62787a; line-height: 1.8; }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
    margin-top: 32px;
  }
  .panel {
    min-width: 0;
    border: 1px solid #e1ebe8;
    border-radius: 20px;
    padding: 28px;
    background: white;
  }
  label { display: block; margin: 18px 0 8px; font-weight: 650; }
  input, select, textarea {
    width: 100%;
    padding: 13px;
    border: 1px solid #cbdedb;
    border-radius: 10px;
    background: white;
    color: #173f4a;
    font: inherit;
  }
  textarea { min-height: 165px; resize: vertical; line-height: 1.65; }
  button {
    margin-top: 22px;
    padding: 15px 23px;
    border: 0;
    border-radius: 30px;
    background: #147c91;
    color: white;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }
  button:hover { background: #173f4a; }
  article {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 15px 0;
    border-bottom: 1px solid #e7eeeb;
  }
  article p { margin: 6px 0 0; color: #718487; font-size: 12px; }
  article span { color: #147c91; font-size: 11px; white-space: nowrap; }
  .notice {
    padding: 15px;
    border-radius: 10px;
    background: #e4f3ef;
    color: #285c56;
  }
  @media(max-width:750px) {
    .grid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
<header>
  <strong>ALCANÇARI / ADMIN</strong>
  <small>Editor local de conteúdos — apenas rascunhos</small>
</header>
<main>
  <h1>Gerir publicações.</h1>
  <p class="intro">
    Edita títulos, categorias e resumos.
    As alterações ficam guardadas apenas no teu Mac.
  </p>
  ${message ? `<p class="notice" role="status">${escape(message)}</p>` : ''}
  <div class="grid">
    <section class="panel">
      <h2>Editar publicação</h2>
      <form method="POST" action="/guardar">
        <label for="post">Publicação</label>
        <select id="post" name="slug" required>${options}</select>

        <label for="title">Título</label>
        <input id="title" name="title" maxlength="180" required>

        <label for="category">Categoria</label>
        <input id="category" name="category" maxlength="100" required>

        <label for="summary">Resumo</label>
        <textarea id="summary" name="summary"
          maxlength="1500" required></textarea>

        <button type="submit">Guardar rascunho</button>
      </form>
    </section>
    <section class="panel">
      <h2>Publicações existentes</h2>
      ${cards}
    </section>
  </div>
</main>
<script type="application/json" id="post-data">${data}</script>
<script>
  const posts = JSON.parse(
    document.getElementById('post-data').textContent
  );
  const select = document.getElementById('post');
  const fields = ['title', 'category', 'summary'];

  function populate() {
    const post = posts.find(item => item.slug === select.value);
    if (!post) return;
    fields.forEach(name => {
      document.getElementById(name).value = post[name] || '';
    });
  }
  select.addEventListener('change', populate);
  populate();
</script>
</body>
</html>`
}

createServer(async (req, res) => {
  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy':
      "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  }

  try {
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, headers)
      return res.end(render())
    }

    if (req.method === 'POST' && req.url === '/guardar') {
      if (
        req.headers.origin !== ORIGIN ||
        !req.headers['content-type']?.startsWith(
          'application/x-www-form-urlencoded'
        )
      ) {
        res.writeHead(403)
        return res.end('Pedido recusado')
      }

      let body = ''
      for await (const chunk of req) {
        body += chunk.toString()
        if (body.length > 10000) {
          res.writeHead(413)
          return res.end('Pedido demasiado grande')
        }
      }

      const params = new URLSearchParams(body)
      const slug = params.get('slug')
      const post = getPosts().find(item => item.slug === slug)

      if (!post) {
        res.writeHead(400)
        return res.end('Publicação desconhecida')
      }

      const title = (params.get('title') || '').trim()
      const category = (params.get('category') || '').trim()
      const summary = (params.get('summary') || '').trim()

      if (
        !title || !category || !summary ||
        title.length > 180 ||
        category.length > 100 ||
        summary.length > 1500
      ) {
        res.writeHead(400)
        return res.end('Dados inválidos')
      }

      const drafts = getDrafts()
      drafts[slug] = { title, category, summary }

      mkdirSync(draftDir, { recursive: true, mode: 0o700 })
      writeFileSync(
        draftFile,
        JSON.stringify(drafts, null, 2) + '\n',
        { encoding: 'utf8', mode: 0o600 }
      )

      res.writeHead(303, {
        Location: '/',
        'Cache-Control': 'no-store',
      })
      return res.end()
    }

    res.writeHead(404)
    res.end('Não encontrado')
  } catch (error) {
    console.error('Erro no editor:', error.message)
    res.writeHead(500)
    res.end('Erro interno')
  }
}).listen(PORT, HOST, () => {
  console.log(`Editor Alcançari: ${ORIGIN}/`)
})

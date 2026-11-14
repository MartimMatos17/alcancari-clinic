import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const HOST = '127.0.0.1'
const PORT = 4174

const sections = [
  { label: 'Serviços', file: 'services.json', icon: '✦' },
  { label: 'Profissionais', file: 'team.json', icon: '◉' },
  { label: 'Publicações', file: 'posts.json', icon: '▤' },
  { label: 'Unidades', file: 'units.json', icon: '⌂' },
]

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

function getData() {
  return sections.map(section => {
    const path = join(process.cwd(), 'src', 'content', section.file)
    const data = JSON.parse(readFileSync(path, 'utf8'))

    return {
      ...section,
      entries: Array.isArray(data) ? data : [],
    }
  })
}

function renderPage() {
  const data = getData()
  const total = data.reduce((sum, item) => sum + item.entries.length, 0)
  const maximum = Math.max(1, ...data.map(item => item.entries.length))

  const cards = data.map(item => `
    <article class="card">
      <div class="card-top">
        <span>${item.label}</span>
        <span class="symbol">${item.icon}</span>
      </div>
      <strong>${item.entries.length}</strong>
      <small>Registos no projeto</small>
    </article>
  `).join('')

  const chart = data.map(item => `
    <div class="chart-row">
      <div class="chart-label">
        <span>${item.label}</span>
        <strong>${item.entries.length}</strong>
      </div>
      <div class="track">
        <div class="bar" style="width:${
          (item.entries.length / maximum) * 100
        }%"></div>
      </div>
    </div>
  `).join('')

  const catalogs = data.map(item => `
    <section class="panel">
      <div class="panel-heading">
        <h2>${item.label}</h2>
        <span class="pill">${item.entries.length} registos</span>
      </div>
      <div class="catalog">
        ${item.entries.map((entry, index) => `
          <div class="catalog-item">
            <span class="index">${String(index + 1).padStart(2, '0')}</span>
            <span>${escapeHtml(
              entry.title || entry.name || entry.slug ||
              entry.id || `Registo ${index + 1}`
            )}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `).join('')

  return `<!doctype html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Alcançari Admin — Dashboard Local</title>
  <style>
    :root {
      font-family: system-ui, sans-serif;
      background: #f4f8f7;
      color: #183d46;
    }
    * { box-sizing: border-box; }
    body { margin: 0; }
    .layout { display: grid; grid-template-columns: 235px minmax(0,1fr); min-height: 100vh; }
    aside {
      background: #153e48;
      color: white;
      padding: 30px 22px;
    }
    .brand { font-size: 20px; font-weight: 750; letter-spacing: .03em; }
    .brand small { display: block; opacity: .55; font-size: 12px; margin-top: 6px; }
    nav { margin-top: 55px; display: grid; gap: 9px; }
    nav a {
      color: #e4eeee;
      text-decoration: none;
      padding: 14px 15px;
      border-radius: 12px;
    }
    nav a:hover, nav a:first-child { background: #28616b; }
    main { min-width: 0; padding: clamp(22px, 4vw, 60px); max-width: 1500px; width: 100%; }
    .eyebrow { color: #147c91; font-size: 12px; font-weight: 750; letter-spacing: .13em; }
    h1 { font: 400 clamp(36px, 5vw, 58px) Georgia, serif; margin: 13px 0 12px; }
    .subtitle { color: #718486; line-height: 1.7; }
    .cards {
      display: grid;
      grid-template-columns: repeat(4, minmax(0,1fr));
      gap: 16px;
      margin-top: 38px;
    }
    .card, .panel {
      background: white;
      border: 1px solid #e2ebe8;
      border-radius: 20px;
      padding: 25px;
      box-shadow: 0 5px 24px #153e4807;
    }
    .card-top, .chart-label, .panel-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
    }
    .card-top { color: #667d7f; font-size: 13px; }
    .symbol { color: #147c91; font-size: 22px; }
    .card > strong {
      display: block;
      font-size: 49px;
      margin: 15px 0 4px;
      color: #147c91;
    }
    small { color: #89999a; }
    .panel { margin-top: 20px; }
    h2 { font-size: 19px; margin: 0 0 22px; }
    .chart-row { margin: 20px 0; }
    .chart-label { margin-bottom: 10px; font-size: 14px; }
    .track { height: 11px; background: #eaf1ee; border-radius: 20px; overflow: hidden; }
    .bar { height: 100%; background: #16879b; border-radius: 20px; }
    .catalog {
      display: grid;
      grid-template-columns: repeat(2, minmax(0,1fr));
      gap: 10px;
    }
    .catalog-item {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 13px;
      background: #f6faf8;
      border-radius: 10px;
      padding: 13px;
      font-size: 13px;
      overflow-wrap: anywhere;
    }
    .index { color: #147c91; font-weight: 750; }
    .pill { font-size: 12px; color: #147c91; background: #e7f4f2; padding: 8px 12px; border-radius: 20px; }
    .notice { background: #e7f4f2; color: #38676c; padding: 18px; border-radius: 12px; line-height: 1.7; }
    @media (max-width: 1050px) {
      .cards { grid-template-columns: repeat(2,1fr); }
    }
    @media (max-width: 650px) {
      .layout { grid-template-columns: 1fr; }
      aside { padding: 20px; }
      nav { margin-top: 15px; display: flex; overflow-x: auto; }
      nav a { white-space: nowrap; }
      .catalog { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="layout">
    <aside>
      <div class="brand">
        ALCANÇARI
        <small>ADMINISTRAÇÃO LOCAL</small>
      </div>
      <nav aria-label="Secções do painel">
        <a href="#dashboard">Dashboard</a>
        <a href="#distribuicao">Distribuição</a>
        <a href="#conteudos">Conteúdos</a>
        <a href="#estado">Estado</a>
      </nav>
    </aside>

    <main id="dashboard">
      <span class="eyebrow">PAINEL DE CONTROLO</span>
      <h1>Visão geral.</h1>
      <p class="subtitle">
        ${total} registos de conteúdo disponíveis no projeto.
        Dados lidos diretamente dos ficheiros locais.
      </p>

      <div class="cards">${cards}</div>

      <section class="panel" id="distribuicao">
        <h2>Distribuição dos conteúdos</h2>
        ${chart}
      </section>

      <div id="conteudos">${catalogs}</div>

      <section class="panel" id="estado">
        <h2>Estado das integrações</h2>
        <p class="notice">
          Painel local ativo. Estatísticas de visitantes e pedidos
          de contacto ainda não estão ligados. Nenhum dado de
          pacientes é armazenado neste painel.
        </p>
      </section>
    </main>
  </div>
</body>
</html>`
}

createServer((req, res) => {
  if (req.method !== 'GET' || !['/', '/#dashboard'].includes(req.url)) {
    res.writeHead(404)
    res.end('Página não encontrada')
    return
  }

  try {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy':
        "default-src 'none'; style-src 'unsafe-inline'",
    })
    res.end(renderPage())
  } catch (error) {
    console.error('Erro ao carregar conteúdos:', error.message)
    res.writeHead(500)
    res.end('Não foi possível carregar o painel.')
  }
}).listen(PORT, HOST, () => {
  console.log(`Alcançari Admin: http://${HOST}:${PORT}/`)
})

import { readFileSync, readdirSync, realpathSync } from 'node:fs'
import { join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { adminRoot } from './admin-security.mjs'
import { postCatalog, readDrafts } from './admin-content.mjs'
import { escape } from './admin-ui.mjs'
import { media } from '../src/content/media.js'
import { isPublicAsset, formatDate } from '../src/lib/content.js'

function styles(root) {
  const directory = fileURLToPath(new URL('dist/assets', root))
  return readdirSync(directory).filter(name => /^(index|blog-editorial)-[a-zA-Z0-9_-]+\.css$/.test(name)).sort((a, b) => Number(b.startsWith('index-')) - Number(a.startsWith('index-')) || a.localeCompare(b))
}
function blocksHtml(blocks = []) {
  return blocks.map((block, index) => {
    if (block.type === 'heading') { const tag = block.level === 3 ? 'h3' : 'h2'; return `<${tag} id="section-${index}">${escape(block.text)}</${tag}>` }
    if (block.type === 'list') { const tag = block.ordered ? 'ol' : 'ul'; return `<${tag}>${(block.items || []).map(item => `<li>${escape(item)}</li>`).join('')}</${tag}>` }
    return `<p>${escape(block.text)}</p>`
  }).join('')
}
export function articlePreview(slug, { nonce, root = adminRoot, posts = postCatalog(), drafts = readDrafts() }) {
  const original = posts.find(post => post.slug === slug)
  if (!original) return { code: 404, body: 'Publicação não encontrada.' }
  let css
  try { css = styles(root); if (!css.some(name => name.startsWith('index-')) || !css.some(name => name.startsWith('blog-editorial-'))) throw new Error() }
  catch { return { code: 503, body: 'Pré-visualização indisponível. Execute npm run build neste projeto e volte a abrir esta página. Nenhum rascunho foi alterado.' } }
  const saved = Object.hasOwn(drafts, slug) ? drafts[slug] : null
  const entry = { ...original, title: saved?.title ?? original.title, category: saved?.category ?? original.category, summary: saved?.summary ?? original.summary }
  const image = media.posts[slug]
  const imageHtml = image && isPublicAsset(image.src) ? `<figure class="media-frame"><img src="/preview-media${image.src}" alt="${escape(image.alt)}" width="${image.width}" height="${image.height}" style="width:100%;height:100%;object-fit:cover"></figure>` : ''
  const date = formatDate(original.date)
  const words = (original.blocks || []).map(block => [block.text, ...(block.items || [])].filter(Boolean).join(' ')).join(' ').split(/\s+/).filter(Boolean).length
  const time = words < 200 ? 'Menos de 1 min de leitura' : `${Math.ceil(words / 200)} min de leitura`
  const body = `<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escape(entry.title)} · Pré-visualização local</title>${css.map(name => `<link rel="stylesheet" href="/preview-assets/${name}">`).join('')}<style nonce="${nonce}">.preview-banner{background:#173f4a;color:#fff;padding:16px max(20px,calc((100vw - 1200px)/2));display:flex;align-items:center;justify-content:space-between;gap:20px;font:13px/1.7 system-ui}.preview-banner a{color:#fff;text-decoration:underline}.preview-card{max-width:600px;margin:0 auto 70px;padding:28px;border:1px solid #d5dfd0;border-radius:12px}.preview-card h2{font-size:2rem;margin-block:18px}.preview-card p{font-size:.9rem}.preview-card>small{font:11px system-ui;letter-spacing:.08em}.preview-back{display:inline-flex;padding:12px 0;font:13px system-ui}@media(max-width:640px){.preview-banner{flex-direction:column;align-items:start}.preview-card{margin-inline:20px}}</style></head><body><header class="preview-banner"><span><strong>PRÉ-VISUALIZAÇÃO LOCAL</strong> · ${saved ? 'Rascunho guardado' : 'Original, sem rascunho'} · Nada foi publicado.</span><a href="/?slug=${encodeURIComponent(slug)}">Voltar ao editor</a></header><main class="blog-editorial blog-article"><article><header class="container-shell blog-article__header"><p class="blog-kicker">${escape(entry.category)}</p><h1>${escape(entry.title)}</h1><div class="blog-meta">${date ? `<time>${escape(date)}</time>` : ''}<span>${time}</span>${original.status === 'excerpt-only' ? '<span>Excerto</span>' : ''}</div></header><div class="container-shell blog-article__cover">${imageHtml}</div><div class="container-shell blog-reading-layout"><aside class="blog-reading-aside"><p class="blog-kicker">Nesta leitura</p><p>${escape(entry.category)}</p><a class="preview-back" href="/?slug=${encodeURIComponent(slug)}">Voltar à edição ↗</a></aside><div class="blog-prose"><div class="rich-content">${blocksHtml(original.blocks)}</div>${original.status === 'excerpt-only' ? '<aside class="source-note"><p>Este é o excerto disponível no blog da clínica. O artigo completo ainda não está disponível nesta página.</p></aside>' : ''}</div></div></article><section class="preview-card"><small>PRÉ-VISUALIZAÇÃO DO RESUMO EDITORIAL</small><h2>${escape(entry.title)}</h2><p>${escape(entry.summary)}</p><p style="margin-top:20px">O resumo é usado na apresentação do Blog. O texto do artigo acima permanece igual ao original.</p></section></main></body></html>`
  return { code: 200, body }
}
export function previewResource(pathname, root = adminRoot) {
  let directory, relative, type
  if (pathname.startsWith('/preview-assets/')) {
    relative = pathname.slice('/preview-assets/'.length)
    if (!styles(root).includes(relative)) return null
    directory = fileURLToPath(new URL('dist/assets', root)); type = 'text/css; charset=utf-8'
  } else if (pathname.startsWith('/preview-media/')) {
    const src = pathname.slice('/preview-media'.length)
    if (!isPublicAsset(src)) return null
    directory = fileURLToPath(new URL('public', root)); relative = src.slice(1)
    const extension = src.split('.').pop()
    type = { webp:'image/webp', jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', avif:'image/avif', svg:'image/svg+xml' }[extension]
  } else return null
  const real = realpathSync(join(directory, relative))
  if (!real.startsWith(realpathSync(directory) + sep)) return null
  return { body: readFileSync(real), type }
}

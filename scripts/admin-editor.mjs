import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { startAdmin } from './admin-security.mjs'
import { postCatalog, readDrafts, saveDraft, revision, states, listBackups, restoreBackup, diskVersion } from './admin-content.mjs'
import { shell, escape, dateLabel } from './admin-ui.mjs'

const PORT = 4175
const fields = ['title', 'category', 'summary', 'note']
const labels = { title: 'Título', category: 'Categoria', summary: 'Resumo', note: 'Nota interna de revisão' }
const limits = { title: 180, category: 100, summary: 1500, note: 1000 }
function render(security, slug, message = '') {
  const posts = postCatalog()
  const drafts = readDrafts()
  const original = posts.find(post => post.slug === slug) || posts[0]
  if (!original) return shell({ ...security, title: 'Estúdio editorial', subtitle: 'Ainda não existem publicações disponíveis para edição.', body: '', editor: true })
  const current = Object.hasOwn(drafts, original.slug) ? drafts[original.slug] : null
  const draft = { ...original, note: '', ...current }
  const tokens = `<input type="hidden" name="csrf" value="${security.csrf}"><input type="hidden" name="slug" value="${escape(original.slug)}"><input type="hidden" name="version" value="${revision(current)}"><input type="hidden" name="sourceVersion" value="${revision(original)}">`
  const history = Array.isArray(current?.history) ? current.history : []
  const body = `<div class="actions"><a class="button" href="/copias">Cópias de segurança</a><a class="button" href="/exportar">Exportar rascunhos JSON ↓</a><span class="badge">${Object.keys(drafts).filter(key => posts.some(post => post.slug === key)).length} publicações com rascunho</span></div>
  ${message ? `<p class="notice" role="status">${escape(message)}</p>` : ''}
  <section class="panel"><label for="post">Escolher publicação</label><select id="post">${posts.map(post => `<option value="${escape(post.slug)}" ${post.slug === original.slug ? 'selected' : ''}>${escape(post.title)}${Object.hasOwn(drafts, post.slug) ? ' · ' + (states[drafts[post.slug]?.status] || 'Em edição') : ' · Original'}</option>`).join('')}</select><p class="status-line">${current ? 'Última gravação: ' + dateLabel(current.updatedAt) : 'A editar a partir do original. Ainda sem rascunho.'}</p></section>
  <div class="columns"><section class="panel"><div class="section-head"><h2>A sua edição</h2><span class="badge" id="save-status">Sem alterações por guardar</span></div><form id="editor-form" method="post" action="/guardar">${tokens}
  ${fields.map(name => `<div class="field"><label for="${name}">${labels[name]} <span class="counter" id="count-${name}"></span></label>${['summary', 'note'].includes(name) ? `<textarea id="${name}" name="${name}" maxlength="${limits[name]}" ${name !== 'note' ? 'required' : ''}>${escape(draft[name])}</textarea>` : `<input id="${name}" name="${name}" maxlength="${limits[name]}" required value="${escape(draft[name])}">`}${name === 'note' ? '<small>Apenas para revisão editorial. Não introduza informações de pacientes ou credenciais.</small>' : ''}</div>`).join('')}
  <div class="field"><label for="status">Estado de trabalho</label><select id="status" name="status">${Object.entries(states).map(([key, label]) => `<option value="${key}" ${(current?.status || 'draft') === key ? 'selected' : ''}>${label}</option>`).join('')}</select><small>«Revisto» organiza o trabalho editorial; não publica o conteúdo nem representa aprovação clínica.</small></div><div class="actions"><button class="primary" id="save-button">Guardar rascunho</button><button type="button" id="reset-fields">Repor campos guardados</button></div><p class="status-line" role="status" id="edit-status">Atalho para guardar: Ctrl+S / ⌘S.</p></form></section>
  <section class="panel"><h2>Pré-visualização em tempo real</h2><div class="preview"><span class="overline" id="preview-category"></span><h3 id="preview-title"></h3><p id="preview-summary"></p></div><p class="muted">Apresentação do título e resumo em rascunho. O texto completo do artigo permanece no original.</p><h3>Revisão rápida</h3><ul class="muted" id="review-checks"></ul>${original.status === 'excerpt-only' ? '<p class="notice warning">A origem contém apenas um excerto. Este editor não cria nem completa o texto do artigo.</p>' : ''}</section></div>
  <section class="panel"><h2>Original e rascunho, lado a lado</h2><div class="comparison"><div><p class="overline">ORIGINAL NO PROJETO</p>${['title', 'category', 'summary'].map(name => `<h3>${labels[name]}</h3><p>${escape(original[name])}</p>`).join('')}</div><div id="comparison-draft"><p class="overline">EDIÇÃO ATUAL</p>${['title', 'category', 'summary'].map(name => `<h3>${labels[name]}</h3><p id="compare-${name}"></p>`).join('')}</div></div><details style="margin-top:22px"><summary>Consultar texto original completo disponível</summary>${(original.blocks || []).map(block => block.type === 'list' ? `<ul>${block.items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>` : `<p style="white-space:pre-wrap;line-height:1.8">${escape(block.text)}</p>`).join('')}</details></section>
  <section class="panel" id="historico"><div class="section-head"><h2>Histórico recuperável</h2><span class="badge">${history.length} / 20 versões anteriores</span></div><p class="muted">Cada gravação conserva a versão anterior. Restaurar cria um novo rascunho em edição e preserva o historial, até ao limite de 20 versões.</p>${history.length ? history.map(snapshot => `<details class="history"><summary>${escape(dateLabel(snapshot.updatedAt))} · ${escape(snapshot.title)} · ${escape(states[snapshot.status] || 'Em edição')}</summary><p>${escape(snapshot.summary)}</p><p class="muted">Nota: ${escape(snapshot.note || 'Sem nota interna.')}</p><form method="post" action="/restaurar" data-confirm="Restaurar esta versão como rascunho? A edição guardada atual ficará no histórico.">${tokens}<input type="hidden" name="restoreId" value="${escape(snapshot.id)}"><button>Restaurar esta versão</button></form></details>`).join('') : '<p class="muted">As versões anteriores aparecem aqui a partir da segunda gravação.</p>'}<form method="post" action="/original" data-confirm="Criar um rascunho a partir do original? O rascunho guardado atual ficará no histórico.">${tokens}<button>Recuperar os campos do original</button></form></section>`
  const script = `const data = JSON.parse(document.getElementById('admin-data').textContent);
const form = document.getElementById('editor-form');
const fields = ['title','category','summary','note'];
const selector = document.getElementById('post');
const initial = Object.fromEntries([...new FormData(form)]);
let dirty = false;
function update() {
  dirty = [...new FormData(form)].some(([key, value]) => initial[key] !== value);
  document.getElementById('save-status').textContent = dirty ? 'Alterações por guardar' : 'Sem alterações por guardar';
  fields.forEach(name => { const value = document.getElementById(name).value; document.getElementById('count-' + name).textContent = value.length + ' / ' + document.getElementById(name).maxLength; if (name !== 'note') { document.getElementById('preview-' + name).textContent = value; const comparison = document.getElementById('compare-' + name); comparison.textContent = value; comparison.classList.toggle('changed', value !== data.original[name]); } });
  const checks = [document.getElementById('title').value.trim() ? '✓ Título preenchido' : '○ Preencha o título', document.getElementById('category').value.trim() ? '✓ Categoria preenchida' : '○ Preencha a categoria', document.getElementById('summary').value.trim() ? '✓ Resumo preenchido' : '○ Preencha o resumo', 'Texto do artigo preservado no original'];
  const list = document.getElementById('review-checks'); list.replaceChildren(...checks.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
}
update(); form.addEventListener('input', update); form.addEventListener('change', update);
form.addEventListener('submit', () => { dirty = false; document.getElementById('save-button').disabled = true; document.getElementById('edit-status').textContent = 'A guardar…'; });
window.addEventListener('pageshow', () => { document.getElementById('save-button').disabled = false; update(); });
selector.addEventListener('change', () => { if (dirty && !confirm('Tem alterações por guardar. Mudar de publicação?')) { selector.value = data.original.slug; return; } dirty = false; window.location.href = '/?slug=' + encodeURIComponent(selector.value); });
document.getElementById('reset-fields').addEventListener('click', () => { if (dirty && !confirm('Repor os campos tal como estavam ao abrir a página?')) return; fields.concat('status').forEach(name => { document.getElementById(name).value = initial[name]; }); update(); });
window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
window.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); if (!document.getElementById('save-button').disabled) form.requestSubmit(); } });
document.querySelectorAll('form[data-confirm]').forEach(target => target.addEventListener('submit', event => { if ((dirty && !confirm('As alterações por guardar serão perdidas. Continuar?')) || !confirm(target.dataset.confirm)) event.preventDefault(); else dirty = false; }));`
  return shell({ ...security, title: 'O seu estúdio editorial.', subtitle: 'Escreva, compare, reveja e recupere versões. Cada alteração continua em rascunho.', body, script, data: { original }, editor: true })
}
export function editorHandler(req, res, security) {
  const url = new URL(req.url, 'http://127.0.0.1:4175')
  if (req.method === 'GET' && url.pathname === '/copias') {
    const version = diskVersion()
    const backups = listBackups()
    const body = `<section class="panel"><h2>Recuperação dos rascunhos</h2><p class="muted">Até 20 cópias locais independentes. Cada gravação guarda o ficheiro anterior. Recuperar substitui todos os rascunhos, conserva uma cópia do estado atual e nunca altera os artigos publicados. Estas cópias no mesmo disco não substituem uma cópia externa.</p>${backups.length ? backups.map(name => `<form class="row" method="post" action="/recuperar-copia"><div><strong>${escape(dateLabel(Number(name.split('-')[1])))}</strong><small>${escape(name)}</small></div><input type="hidden" name="csrf" value="${security.csrf}"><input type="hidden" name="version" value="${version}"><input type="hidden" name="backup" value="${escape(name)}"><label><input type="checkbox" required name="confirm" value="yes"> Confirmo a substituição de todos os rascunhos</label><button>Recuperar cópia</button></form>`).join('') : '<p class="notice">Ainda não existem cópias independentes. São criadas antes de substituir um ficheiro de rascunhos existente.</p>'}<a class="button" href="/">Voltar ao editor</a></section>`
    return security.send(200, shell({ ...security, editor: true, title: 'Cópias de segurança.', subtitle: 'Recuperação local, incluindo quando o ficheiro principal está danificado.', body }))
  }
  if (req.method === 'POST' && url.pathname === '/recuperar-copia') {
    if (security.params.get('confirm') !== 'yes') return security.send(400, 'Confirmação necessária.')
    const result = restoreBackup(security.params.get('backup'), security.params.get('version'))
    if (result.code !== 200) return security.send(result.code, escape(result.message))
    res.writeHead(303, { Location: '/' }); return res.end()
  }
  if (req.method === 'GET' && url.pathname === '/exportar') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="alcancari-rascunhos.json"')
    return security.send(200, JSON.stringify({ exportedAt: new Date().toISOString(), scope: 'local-editorial-drafts', drafts: readDrafts() }, null, 2))
  }
  if (req.method === 'GET' && url.pathname === '/') {
    try { return security.send(200, render(security, url.searchParams.get('slug'), url.searchParams.get('guardado') === '1' ? 'Rascunho guardado. O site publicado não foi alterado.' : '')) }
    catch { return security.send(500, shell({ ...security, editor: true, title: 'Não foi possível abrir o editor.', subtitle: 'Os dados não foram alterados. Se o ficheiro de rascunhos estiver danificado, pode recuperar uma cópia independente.', body: '<section class="panel"><a class="button" href="/copias">Abrir recuperação de cópias de segurança</a></section>' })) }
  }
  if (req.method !== 'POST' || !['/guardar', '/original', '/restaurar'].includes(url.pathname)) return security.send(404, 'Página não encontrada.')
  const params = security.params
  const allowed = ['csrf', 'slug', 'version', 'sourceVersion', 'restoreId', 'status', ...fields]
  if ([...params.keys()].some(key => !allowed.includes(key))) return security.send(400, 'Dados inválidos.')
  const action = url.pathname === '/original' ? 'original' : url.pathname === '/restaurar' ? 'restore' : 'save'
  const next = Object.fromEntries(fields.concat('status', 'restoreId').map(name => [name, params.get(name) || '']))
  const result = saveDraft(params.get('slug'), next, params.get('version'), params.get('sourceVersion'), action)
  if (result.code !== 200) return security.send(result.code, shell({ ...security, editor: true, title: 'A alteração não foi guardada.', subtitle: result.message, body: `<section class="panel"><h2>Conserve a sua edição</h2><p class="muted">Copie estes campos antes de atualizar a página. Nenhum conteúdo publicado foi alterado.</p>${fields.map(name => `<label>${labels[name]}<textarea readonly>${escape(next[name])}</textarea></label>`).join('')}<a class="button" href="/?slug=${encodeURIComponent(params.get('slug') || '')}">Atualizar conteúdo</a></section>` }))
  res.writeHead(303, { Location: `/?slug=${encodeURIComponent(params.get('slug'))}&guardado=1` }); res.end()
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) startAdmin({ port: PORT, title: 'Estúdio editorial Alcançari', handle: editorHandler })

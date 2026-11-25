import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { startAdmin } from './admin-security.mjs'
import { catalogs, readDrafts, contentIssues, states } from './admin-content.mjs'
import { shell, escape, dateLabel } from './admin-ui.mjs'

function inventory() {
  const drafts = readDrafts()
  return catalogs().flatMap(section => section.entries.map(entry => ({
    key: section.key, type: section.label, id: entry.slug || entry.id,
    title: entry[section.name], published: entry.confirmed === true && entry.published === true,
    path: `/${section.path}/${entry.slug || entry.id}`, category: entry.category || entry.role || '',
    issues: contentIssues(section, entry),
    draft: section.key === 'posts' && Object.hasOwn(drafts, entry.slug) ? drafts[entry.slug] : null,
  })))
}
function render(security) {
  const records = inventory()
  const sections = catalogs()
  const drafts = records.filter(item => item.draft)
  const pending = records.filter(item => item.issues.length)
  const changes = [...drafts].sort((a, b) => (Date.parse(b.draft.updatedAt) || 0) - (Date.parse(a.draft.updatedAt) || 0)).slice(0, 8)
  const stats = [{ title: 'Conteúdos no projeto', count: records.length, note: 'Serviços, equipa, unidades e Blog' }, { title: 'Publicados no catálogo', count: records.filter(item => item.published).length, note: 'Confirmados e marcados como publicados' }, { title: 'Rascunhos editoriais', count: drafts.length, note: `${drafts.filter(item => item.draft.status === 'review').length} para revisão · ${drafts.filter(item => item.draft.status === 'ready').length} revistos` }, { title: 'Conteúdos a verificar', count: pending.length, note: 'Excertos ou informação de apresentação em falta' }]
  const body = `<div class="actions"><a href="http://127.0.0.1:4175/" class="button primary">Abrir estúdio editorial ↗</a><a href="/inventario" class="button">Exportar inventário JSON ↓</a><button type="button" id="refresh">Atualizar indicadores</button></div><div class="stats">${stats.map(stat => `<article class="stat"><span>${escape(stat.title)}</span><strong>${stat.count}</strong><span>${escape(stat.note)}</span></article>`).join('')}</div>
  <div class="columns"><section class="panel"><h2>O próximo passo editorial</h2><p class="muted">Uma fila de trabalho baseada nos rascunhos guardados. Sem publicação automática.</p>${drafts.length ? ['review', 'draft', 'ready'].map(status => { const items = drafts.filter(item => (item.draft.status || 'draft') === status); return `<details ${status === 'review' ? 'open' : ''}><summary style="padding-block:12px">${states[status]} <span class="tag">${items.length}</span></summary>${items.length ? items.map(item => `<div class="row"><div><strong>${escape(item.draft.title)}</strong><p>${escape(dateLabel(item.draft.updatedAt))}</p></div><a class="button" href="http://127.0.0.1:4175/?slug=${encodeURIComponent(item.id)}">Rever ↗</a></div>`).join('') : '<p class="muted">Sem rascunhos neste estado.</p>'}</details>` }).join('') : '<div class="notice"><strong>Pronto para a primeira edição.</strong><p>Abra o estúdio, escolha uma publicação e guarde um rascunho. A fila de revisão aparece aqui.</p></div>'}</section>
  <section class="panel"><h2>Mapa dos conteúdos</h2>${sections.map(section => { const entries = records.filter(item => item.key === section.key); const count = entries.filter(item => item.published).length; return `<div class="metric-row"><div><span>${section.label}</span><strong>${count} / ${entries.length} publicados</strong></div><progress class="progress" value="${count}" max="${Math.max(1, entries.length)}" aria-label="${section.label}: ${count} publicados de ${entries.length}"></progress></div>` }).join('')}<p class="muted">Estes números descrevem os ficheiros do projeto. Não são estatísticas de visitas, consultas ou pacientes.</p></section></div>
  <section class="panel" id="qualidade"><div class="section-head"><h2>Radar de revisão</h2><span class="badge">Verificação local de apresentação</span></div><p class="muted">Verifica imagens atribuídas, ficheiros existentes, texto alternativo, serviços com apenas resumo e publicações que têm apenas excertos. Não avalia a qualidade clínica dos textos.</p><div class="actions">${['Imagem por definir', 'Ficheiro de imagem em falta', 'Texto alternativo em falta', 'Apenas resumo disponível', 'Apenas excerto disponível'].map(issue => `<button type="button" data-issue="${escape(issue)}">${escape(issue)} · ${records.filter(item => item.issues.includes(issue)).length}</button>`).join('')}</div></section>
  <section class="panel" id="catalogo"><div class="section-head"><h2>Biblioteca de conteúdos</h2><span class="badge">${records.length} registos</span></div><div class="filters"><div><label for="search">Pesquisar título, pessoa ou categoria</label><input type="search" id="search" placeholder="O que pretende encontrar?"></div><div><label for="type">Tipo de conteúdo</label><select id="type"><option value="">Todos</option>${sections.map(section => `<option value="${section.key}">${section.label}</option>`).join('')}</select></div><div><label for="state">Estado</label><select id="state"><option value="">Todos</option><option value="published">Publicados</option><option value="unpublished">Não publicados</option><option value="draft">Com rascunho</option><option value="review">Para revisão</option><option value="ready">Revistos</option><option value="issues">A verificar</option></select></div></div><div class="actions" style="margin-top:16px"><button type="button" id="clear">Limpar filtros</button><span class="status-line" id="result-count" role="status"></span></div><div class="table-scroll"><table><thead><tr><th scope="col">Conteúdo</th><th scope="col">Tipo</th><th scope="col">Estado</th><th scope="col">Revisão de apresentação</th><th scope="col">Ação</th></tr></thead><tbody>${records.map((item, index) => `<tr data-record="${index}"><td><strong>${escape(item.title)}</strong><small>${escape(item.category)}</small></td><td>${escape(item.type)}</td><td><span class="tag">${item.published ? 'Publicado' : 'Não publicado'}</span>${item.draft ? `<span class="tag">${escape(states[item.draft.status] || 'Em edição')}</span>` : ''}</td><td>${item.issues.length ? item.issues.map(issue => `<span class="tag warn">${escape(issue)}</span>`).join('') : '<span class="tag">Sem pendências nestas verificações</span>'}</td><td>${item.key === 'posts' ? `<a href="http://127.0.0.1:4175/?slug=${encodeURIComponent(item.id)}">Editar rascunho ↗</a>` : '<small>Consulta no catálogo</small>'}</td></tr>`).join('')}</tbody></table></div><p id="empty" class="notice" hidden>Nenhum conteúdo corresponde aos filtros. Experimente limpar a pesquisa.</p></section>
  <div class="columns"><section class="panel"><h2>Últimas edições guardadas</h2>${changes.length ? changes.map(item => `<div class="row"><div><strong>${escape(item.draft.title)}</strong><p>${escape(dateLabel(item.draft.updatedAt))} · ${escape(states[item.draft.status] || 'Em edição')}</p><small>${item.draft.history?.length || 0} versões anteriores</small></div><a href="http://127.0.0.1:4175/?slug=${encodeURIComponent(item.id)}">Histórico ↗</a></div>`).join('') : '<p class="muted">Ainda não existem rascunhos guardados.</p>'}<p class="muted">Mostra a última edição de cada publicação, não um registo de auditoria de utilizadores.</p></section><section class="panel"><h2>Estado operacional</h2><div class="row"><span>Ligação</span><span class="tag">Apenas 127.0.0.1</span></div><div class="row"><span>Publicação automática</span><span class="tag">Desativada</span></div><div class="row"><span>Dados de pacientes</span><span class="tag">Não geridos</span></div><div class="row"><span>Instagram</span><span class="tag">${process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_ACCOUNT_ID && process.env.META_GRAPH_VERSION ? 'Variáveis presentes; API não verificada' : 'Configuração externa pendente'}</span></div><p class="muted">O estado do Instagram considera apenas a presença das variáveis neste processo. Este painel não contacta a API nem apresenta credenciais.</p><p class="muted">Atualizado em ${escape(dateLabel(new Date().toISOString()))}.</p></section></div>`
  const script = `const records = JSON.parse(document.getElementById('admin-data').textContent);
const search = document.getElementById('search'), type = document.getElementById('type'), state = document.getElementById('state');
const rows = [...document.querySelectorAll('[data-record]')];
let issue = '';
const normalize = value => value.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLocaleLowerCase('pt-PT');
function filter() {
 const query = normalize(search.value.trim()); let count = 0;
 rows.forEach(row => { const item = records[Number(row.dataset.record)]; const matchesState = !state.value || (state.value === 'published' && item.published) || (state.value === 'unpublished' && !item.published) || (state.value === 'draft' && item.draft) || (['review','ready'].includes(state.value) && item.draft?.status === state.value) || (state.value === 'issues' && item.issues.length); row.hidden = !((!type.value || item.key === type.value) && matchesState && (!issue || item.issues.includes(issue)) && normalize([item.title,item.category,item.draft?.title || ''].join(' ')).includes(query)); if (!row.hidden) count++; });
 document.getElementById('result-count').textContent = count + ' de ' + records.length + ' registos' + (issue ? ' · ' + issue : ''); document.getElementById('empty').hidden = count > 0;
 document.querySelectorAll('[data-issue]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.issue === issue)));
}
search.addEventListener('input', filter); type.addEventListener('change', filter); state.addEventListener('change', filter);
document.querySelectorAll('[data-issue]').forEach(button => button.addEventListener('click', () => { issue = issue === button.dataset.issue ? '' : button.dataset.issue; state.value = issue ? 'issues' : ''; filter(); document.getElementById('catalogo').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); search.focus({preventScroll:true}); }));
document.getElementById('clear').addEventListener('click', () => { search.value = ''; type.value = ''; state.value = ''; issue = ''; filter(); search.focus(); });
document.getElementById('refresh').addEventListener('click', () => location.reload()); filter();`
  // Send only presentation fields to the browser, not internal editorial notes/history.
  const data = records.map(({ key, title, category, published, issues, draft }) => ({ key, title, category, published, issues, draft: draft ? { title: draft.title, status: draft.status || 'draft' } : null }))
  return shell({ ...security, title: 'O trabalho importante, à vista.', subtitle: 'Conteúdos, pendências e rascunhos num centro de controlo com dados reais do projeto.', body, script, data })
}
export function dashboardHandler(req, res, security) {
  if (req.method !== 'GET') return security.send(405, 'Método não permitido.')
  if (req.url === '/inventario') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="alcancari-inventario.json"')
    return security.send(200, JSON.stringify({ exportedAt: new Date().toISOString(), records: inventory().map(({ draft, ...item }) => ({ ...item, draftStatus: draft?.status || (draft ? 'draft' : null) })) }, null, 2))
  }
  if (req.url !== '/') return security.send(404, 'Página não encontrada.')
  return security.send(200, render(security))
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) startAdmin({ port: 4174, title: 'Alcançari Admin', handle: dashboardHandler })

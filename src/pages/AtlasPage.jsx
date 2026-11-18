import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { createConnectCatalog, connectKey, normalizeSearch } from '../lib/connect'
import { FavoriteButton } from '../components/ConnectFavorites'
import MediaPlaceholder from '../components/MediaPlaceholder'
import Icon from '../components/Icon'
import usePageMeta from '../hooks/usePageMeta'
import '../styles/atlas.css'

const catalog = createConnectCatalog(site)
const groups = [
  { id: 'service', title: 'Serviços', note: 'Áreas de intervenção', symbol: '✳', color: '#b4d9ca' },
  { id: 'professional', title: 'Pessoas', note: 'A equipa da clínica', symbol: '◉', color: '#e9c29c' },
  { id: 'unit', title: 'Espaços', note: 'As nossas unidades', symbol: '⌂', color: '#b6cde9' },
  { id: 'post', title: 'Leituras', note: 'Blog e novidades', symbol: '✧', color: '#d4c0e4' },
]
const pageSize = 8
export default function AtlasPage() {
  usePageMeta('Atlas Alcançari', 'Uma forma visual de explorar os serviços, as pessoas, os espaços e as leituras da Alcançari.')
  const [groupId, setGroupId] = useState('service')
  const [query, setQuery] = useState('')
  const [view, setView] = useState('map')
  const [page, setPage] = useState(0)
  const [selection, setSelection] = useState('')
  const [seen, setSeen] = useState([])
  const buttons = useRef([])
  const group = groups.find(item => item.id === groupId)
  const results = catalog.filter(item => item.type === groupId && normalizeSearch([item.title, item.entry.role, item.entry.summary, item.entry.category, item.entry.address].join(' ')).includes(normalizeSearch(query)))
  const visible = results.slice(page * pageSize, (page + 1) * pageSize)
  const selected = visible.find(item => connectKey(item) === selection) || visible[0]
  const choose = item => { const key = connectKey(item); setSelection(key); setSeen(previous => previous.includes(key) ? previous : [...previous, key]) }
  const changeGroup = id => { setGroupId(id); setQuery(''); setPage(0); setSelection('') }
  const pages = Math.ceil(results.length / pageSize)
  const description = selected && (selected.entry.summary || selected.entry.role || [selected.entry.address, selected.entry.postalCode].filter(Boolean).join(', '))
  return <div className="atlas" style={{ '--atlas-accent': group.color }}>
    <header className="atlas-hero container-shell"><div><p className="atlas-eyebrow"><span aria-hidden="true">✦</span> UMA OUTRA FORMA DE EXPLORAR</p><h1>O seu próximo<br /><em>ponto de descoberta.</em></h1><p>Uma clínica. Muitos caminhos para a conhecer.<br />Escolha um universo e descubra o que existe em cada ponto.</p></div><div className="atlas-stamp" aria-hidden="true"><span>ALCANÇARI</span><strong>a.</strong><span>ATLAS / DESCOBRIR</span></div></header>
    <section className="container-shell atlas-experience" aria-label="Explorador Atlas">
      <nav className="atlas-universes" aria-label="Universos do Atlas">{groups.map((item, index) => <button key={item.id} type="button" aria-pressed={groupId === item.id} onClick={() => changeGroup(item.id)} style={{ '--group-color': item.color }}><span className="atlas-universe-symbol" aria-hidden="true">{item.symbol}</span><span><small>0{index + 1} / {catalog.filter(entry => entry.type === item.id).length} pontos</small><strong>{item.title}</strong><span>{item.note}</span></span><Icon name="diagonal" /></button>)}</nav>
      <div className="atlas-workspace"><div className="atlas-toolbar"><label><span className="atlas-eyebrow">ENCONTRE UM PONTO</span><input type="search" value={query} placeholder={`Pesquisar ${group.title.toLocaleLowerCase('pt-PT')}…`} onChange={event => { setQuery(event.target.value); setPage(0); setSelection('') }} /></label><div className="atlas-view" role="group" aria-label="Apresentação dos resultados"><button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}>Constelação</button><button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>Lista</button></div></div>
        <p className="atlas-result-count" role="status">{results.length} {results.length === 1 ? 'ponto disponível' : 'pontos disponíveis'} em {group.title.toLocaleLowerCase('pt-PT')}{pages > 1 ? ` · Página ${page + 1} de ${pages}` : ''}</p>
        <div className="atlas-discovery"><div className={`atlas-map atlas-map--${view}`} aria-label={`Selecionar ${group.title.toLocaleLowerCase('pt-PT')}`}>
          {view === 'map' && <div className="atlas-map-decoration" aria-hidden="true"><svg viewBox="0 0 600 560" preserveAspectRatio="none"><ellipse cx="300" cy="280" rx="220" ry="210" />{visible.map((item, index) => { const angle = index / visible.length * Math.PI * 2 - Math.PI / 2; return <line key={connectKey(item)} x1="300" y1="280" x2={300 + Math.cos(angle) * 210} y2={280 + Math.sin(angle) * 195} /> })}</svg><div className="atlas-map-center"><span>{group.symbol}</span><strong>{group.title}</strong><small>Escolha um ponto</small></div></div>}
          {visible.map((item, index) => { const angle = index / visible.length * Math.PI * 2 - Math.PI / 2; const active = selected && connectKey(item) === connectKey(selected); return <button key={connectKey(item)} ref={element => { buttons.current[index] = element }} type="button" className={`atlas-node${active ? ' is-selected' : ''}${seen.includes(connectKey(item)) ? ' is-seen' : ''}`} style={{ '--node-x': `${50 + Math.cos(angle) * 35}%`, '--node-y': `${50 + Math.sin(angle) * 35}%` }} aria-pressed={Boolean(active)} aria-controls="atlas-inspector" onClick={() => choose(item)} onKeyDown={event => { if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) return; event.preventDefault(); const next = (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + visible.length) % visible.length; buttons.current[next]?.focus(); choose(visible[next]) }}><span className="atlas-node__portrait">{item.entry.image ? <MediaPlaceholder image={item.entry.image} label={item.title} /> : <span aria-hidden="true">{group.symbol}</span>}</span><span className="atlas-node__name">{item.title}</span><span className="atlas-node__marker" aria-hidden="true">{active ? '●' : seen.includes(connectKey(item)) ? '✓' : '↗'}</span></button> })}
          {!visible.length && <div className="atlas-empty"><span aria-hidden="true">✧</span><h2>Outro ponto de partida.</h2><p>Não encontrámos resultados para esta pesquisa.</p><button type="button" onClick={() => { setQuery(''); setPage(0) }}>Limpar pesquisa</button></div>}
        </div>
        <aside className="atlas-inspector" id="atlas-inspector" aria-label="Detalhes do ponto selecionado">{selected ? <><div className="atlas-inspector__image" key={connectKey(selected)}><MediaPlaceholder image={selected.entry.image} label={selected.title} /><span>{group.title} / {String(catalog.filter(item => item.type === groupId).findIndex(item => connectKey(item) === connectKey(selected)) + 1).padStart(2, '0')}</span></div><div className="atlas-inspector__body"><p className="atlas-eyebrow" role="status">A EXPLORAR: {selected.title}</p><h2>{selected.title}</h2>{description && <p className="atlas-inspector__description">{description}</p>}<Link className="atlas-open" to={selected.to}>Abrir {selected.type === 'professional' ? 'perfil' : selected.type === 'post' ? 'publicação' : selected.type === 'unit' ? 'unidade' : 'serviço'}<Icon name="arrow" /></Link>{['service', 'professional'].includes(selected.type) && <FavoriteButton type={selected.type} id={selected.id} title={selected.title} />}<button className="atlas-next" type="button" disabled={visible.length < 2} onClick={() => choose(visible[(visible.indexOf(selected) + 1) % visible.length])}>Descobrir outro ponto <span aria-hidden="true">↗</span></button></div></> : <p className="atlas-inspector__body">Experimente outra pesquisa para descobrir mais conteúdos.</p>}</aside></div>
        <footer className="atlas-map-footer"><p><span aria-hidden="true">✦</span> {seen.length} {seen.length === 1 ? 'ponto explorado' : 'pontos explorados'} nesta página</p>{pages > 1 && <nav aria-label="Páginas de resultados"><button type="button" disabled={page === 0} onClick={() => { setPage(page - 1); setSelection('') }}>← Anterior</button><button type="button" disabled={page + 1 >= pages} onClick={() => { setPage(page + 1); setSelection('') }}>Seguinte →</button></nav>}</footer>
      </div>
    </section>
    <div className="container-shell atlas-bottom"><p>Explore livremente, ao seu ritmo. Os pontos estão agrupados por tipo de conteúdo.</p><Link to="/contactos">Prefere conversar com a equipa? <Icon name="diagonal" /></Link></div>
  </div>
}

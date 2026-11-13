import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { getPublished } from '../lib/content'
import { Modal } from './UtilityActions'
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-PT')
export default function GlobalSearch({ onOpen }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const groups = [{ title: 'Serviços', items: site.services, path: '/servicos/', name: 'title' }, { title: 'Equipa', items: site.team, path: '/equipa/', name: 'name' }, { title: 'Novidades', items: site.posts, path: '/novidades/', name: 'title' }].map(group => ({ ...group, results: query.trim() ? getPublished(group.items).filter(item => normalize([item[group.name], item.summary, item.role, item.category, ...(item.blocks || []).flatMap(block => [block.text, ...(block.items || [])])].join(' ')).includes(normalize(query.trim()))) : [] }))
  const count = groups.reduce((total, group) => total + group.results.length, 0)
  return <><button className="global-search-toggle" type="button" aria-label="Abrir pesquisa global" aria-haspopup="dialog" aria-expanded={open} onClick={() => { setQuery(''); setOpen(true); onOpen?.() }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg></button>{open && <Modal label="Pesquisa global" onClose={() => setOpen(false)} className="global-search"><h2>O que procura?</h2><label htmlFor="global-search-input">Pesquisar serviços, equipa e novidades</label><input id="global-search-input" type="search" autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Escreva para pesquisar…" /><p role="status" aria-live="polite">{query.trim() ? `${count} resultados encontrados.` : 'Comece por escrever um nome ou tema.'}</p><div className="global-search-results">{groups.filter(group => group.results.length).map(group => <section key={group.path}><h3>{group.title}</h3><ul>{group.results.map(item => <li key={item.slug || item.id}><Link to={`${group.path}${item.slug || item.id}`} onClick={() => setOpen(false)}>{item[group.name]}<small>{item.role || item.category}</small></Link></li>)}</ul></section>)}</div></Modal>}</>
}

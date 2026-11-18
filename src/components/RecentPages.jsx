import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { site } from '../content/site'
import { getPublished } from '../lib/content'
import MediaPlaceholder from './MediaPlaceholder'
import Icon from './Icon'

const storageKey = 'alcancari-recent-pages-v1'
const catalog = [
  ...getPublished(site.services).map(item => ({ ...item, title: item.title, category: 'Serviço', path: `/servicos/${item.slug}` })),
  ...getPublished(site.team).map(item => ({ ...item, title: item.name, category: 'Equipa', path: `/equipa/${item.id}` })),
  ...getPublished(site.units).map(item => ({ ...item, title: item.name, category: 'Unidade', path: `/unidades/${item.id}` })),
  ...getPublished(site.posts).map(item => ({ ...item, category: 'Blog', path: `/novidades/${item.slug}` })),
]
function readHistory() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(storageKey) || '[]')
    return Array.isArray(stored) ? [...new Set(stored)].filter(path => catalog.some(item => item.path === path)).slice(0, 6) : []
  } catch { return [] }
}
export default function RecentPages() {
  const { pathname } = useLocation()
  const [history, setHistory] = useState(readHistory)
  const [enabled, setEnabled] = useState(() => { try { return sessionStorage.getItem(`${storageKey}-paused`) !== 'true' } catch { return false } })
  const [status, setStatus] = useState('')
  useEffect(() => {
    if (!enabled || !catalog.some(item => item.path === pathname)) return
    setHistory(previous => {
      const next = [pathname, ...previous.filter(path => path !== pathname)].slice(0, 6)
      try { sessionStorage.setItem(storageKey, JSON.stringify(next)) } catch { /* Navigation remains available. */ }
      return next
    })
  }, [pathname, enabled])
  const visible = history.filter(path => path !== pathname).slice(0, 3).map(path => catalog.find(item => item.path === path)).filter(Boolean)
  if (!visible.length && !status && enabled) return null
  return <section className="recent-pages" aria-labelledby="recent-pages-title"><div className="container-shell"><header className="recent-pages__heading"><div><p className="recent-pages__eyebrow">O SEU PERCURSO</p><h2 id="recent-pages-title">Continue de onde ficou.</h2><p>As páginas recentes ficam apenas neste separador, durante esta sessão.</p></div><div className="recent-pages__actions"><button type="button" onClick={() => { setHistory([]); try { sessionStorage.removeItem(storageKey) } catch { /* Optional storage. */ } setStatus('Páginas recentes apagadas.') }}>Limpar recentes</button><button type="button" aria-pressed={!enabled} onClick={() => { const next = !enabled; setEnabled(next); if (!next) { setHistory([]); try { sessionStorage.removeItem(storageKey) } catch { /* Optional storage. */ } } try { sessionStorage.setItem(`${storageKey}-paused`, String(!next)) } catch { /* Optional storage. */ } setStatus(next ? 'Páginas recentes ativadas.' : 'Registo de páginas recentes em pausa.') }}>{enabled ? 'Pausar registo' : 'Retomar registo'}</button></div></header><p className="recent-pages__status" role="status">{status}</p>{visible.length > 0 && <div className="recent-pages__grid">{visible.map(item => <Link className="recent-pages__card" key={item.path} to={item.path}>{item.image && <MediaPlaceholder image={item.image} label={item.title} />}<span className="recent-pages__copy"><small>{item.category}</small><strong>{item.title}</strong></span><Icon name="diagonal" /></Link>)}</div>}</div></section>
}

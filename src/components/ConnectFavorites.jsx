import { useRef } from 'react'
import { Link } from 'react-router-dom'
import useFavorites, { connectCatalog } from '../hooks/useFavorites'
import { connectKey } from '../lib/connect.js'
import '../styles/connect.css'

export function FavoriteButton({ type, id, title }) {
  const { items, toggle, persistent } = useFavorites()
  const active = items.some(item => item.type === type && item.id === id)
  return <button type="button" className="ac-favorite" aria-pressed={active}
    aria-label={`${active ? 'Remover dos favoritos' : 'Guardar nos favoritos'}: ${title}`}
    onClick={() => toggle({ type, id })}>
    <span aria-hidden="true">{active ? '♥' : '♡'}</span>
    {active ? 'Guardado' : 'Guardar'}
    {!persistent && <small> · nesta sessão</small>}
  </button>
}

export function FavoritesCollection() {
  const { items, toggle, persistent } = useFavorites()
  const heading = useRef(null)
  const saved = items.map(item => connectCatalog.find(entry => connectKey(entry) === connectKey(item))).filter(Boolean)
  return <div className="ac-favorites">
    <h3 ref={heading} tabIndex={-1}>O que quer voltar a encontrar.</h3>
    <p className="ac-muted" role="status">{persistent
      ? 'Favoritos guardados apenas neste navegador. Sem conta e sem dados pessoais.'
      : 'O navegador não permite guardar. Os seus favoritos ficam disponíveis apenas nesta sessão.'}</p>
    <p className="ac-count" role="status">{saved.length} {saved.length === 1 ? 'favorito' : 'favoritos'}</p>
    {saved.length ? <ul className="ac-saved-list">{saved.map(item => <li key={connectKey(item)}>
      <div><span className="ac-eyebrow">{item.type === 'service' ? 'Serviço' : 'Profissional'}</span><Link to={item.to}>{item.title} <span aria-hidden="true">↗</span></Link></div>
      <button className="ac-text-button" type="button" aria-label={`Remover dos favoritos: ${item.title}`} onClick={() => { toggle(item); heading.current?.focus({ preventScroll: true }) }}>Remover</button>
    </li>)}</ul> : <div className="ac-empty"><span aria-hidden="true">♡</span><h4>Uma coleção à sua medida.</h4><p>Use «Guardar» nos serviços e profissionais para os encontrar aqui.</p><div className="ac-links"><Link to="/servicos">Explorar serviços ↗</Link><Link to="/equipa">Conhecer a equipa ↗</Link></div></div>}
  </div>
}

export default function ConnectFavorites() {
  const { items } = useFavorites()
  return <details className="ac-favorites-drawer">
    <summary>Alcançari Connect <span>Os meus favoritos · {items.length}</span></summary>
    <FavoritesCollection />
  </details>
}

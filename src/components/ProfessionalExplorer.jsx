import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { confirmedProfessionalServices, filterProfessionals, professionalAreas } from '../lib/connect.js'
import useFavorites from '../hooks/useFavorites'
import MediaPlaceholder from './MediaPlaceholder'
import { FavoriteButton } from './ConnectFavorites'
import '../styles/connect.css'

export default function ProfessionalExplorer({ selected = [], onSelect }) {
  const [query, setQuery] = useState('')
  const [area, setArea] = useState('')
  const [onlySaved, setOnlySaved] = useState(false)
  const { items } = useFavorites()
  const searchId = useId()
  const areas = professionalAreas(site.team)
  const visible = filterProfessionals(site.team, { query, area, favorites: onlySaved ? items : null })

  function clearFilters() { setQuery(''); setArea(''); setOnlySaved(false) }

  return <div className="ac-professionals">
    <div className="ac-search-row">
      <div className="ac-search"><label htmlFor={searchId}>Encontre uma pessoa ou uma área</label>
        <input id={searchId} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Ex.: Inês ou Terapia da Fala" autoComplete="off" maxLength={100} />
      </div>
      <label className="ac-checkbox"><input type="checkbox" checked={onlySaved} onChange={event => setOnlySaved(event.target.checked)} />Só os meus favoritos</label>
    </div>
    <div className="ac-filters" role="group" aria-label="Filtrar pela área publicada no perfil">
      <button type="button" aria-pressed={!area} onClick={() => setArea('')}>Todas as áreas</button>
      {areas.map(([id, label]) => <button key={id} type="button" aria-pressed={area === id} onClick={() => setArea(id)}>{label}</button>)}
    </div>
    <div className="ac-results-bar"><p className="ac-count" role="status">{visible.length} {visible.length === 1 ? 'profissional' : 'profissionais'}</p>
      {(query || area || onlySaved) && <button type="button" className="ac-text-button" onClick={clearFilters}>Limpar filtros</button>}
    </div>
    {visible.length ? <div className="ac-people-grid">{visible.map(member => {
      const services = confirmedProfessionalServices(member, site.services)
      const chosen = selected.some(item => item.type === 'professional' && item.id === member.id)
      const excerpt = member.blocks?.find(block => block.type === 'paragraph' && block.text)?.text
      return <article className="ac-person" key={member.id}>
        <Link to={`/equipa/${member.id}`} className="ac-person__portrait">
          <MediaPlaceholder image={member.image} label={member.name} variant="sage" />
        </Link>
        <div className="ac-person__body">
          <p className="ac-eyebrow">{member.role}</p>
          <h3><Link to={`/equipa/${member.id}`}>{member.name}</Link></h3>
          <details className="ac-person__preview"><summary>Conhecer de perto <span aria-hidden="true">+</span></summary>
            {excerpt ? <p>{excerpt}</p> : <p>Conheça a informação disponível no perfil deste profissional.</p>}
            {services.length > 0 && <nav aria-label={`Serviços associados a ${member.name}`} className="ac-links">{services.map(service => <Link key={service.slug} to={`/servicos/${service.slug}`}>{service.title} ↗</Link>)}</nav>}
            <Link className="ac-profile-link" to={`/equipa/${member.id}`}>Perfil e qualificações ↗</Link>
          </details>
          <div className="ac-person__actions">
            <FavoriteButton type="professional" id={member.id} title={member.name} />
            {onSelect && <button className="ac-select" type="button" aria-pressed={chosen} aria-label={`${chosen ? 'Retirar do' : 'Adicionar ao'} percurso: ${member.name}`} onClick={() => onSelect({ type: 'professional', id: member.id })}>{chosen ? '✓ No percurso' : '+ No percurso'}</button>}
          </div>
        </div>
      </article>
    })}</div> : <div className="ac-empty"><span aria-hidden="true">↗</span><h3>Há mais pessoas para conhecer.</h3><p>Não encontrámos profissionais com estes filtros. Experimente outra área ou um nome diferente.</p><button className="ac-button" type="button" onClick={clearFilters}>Ver toda a equipa</button></div>}
  </div>
}

import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { getPublished } from '../lib/content'
import { connectKey, filterConnectPosts, toggleSelection } from '../lib/connect.js'
import useFavorites, { connectCatalog } from '../hooks/useFavorites'
import MediaPlaceholder from './MediaPlaceholder'
import ProfessionalExplorer from './ProfessionalExplorer'
import { FavoriteButton, FavoritesCollection } from './ConnectFavorites'
import '../styles/connect.css'

const steps = ['Descobrir', 'Ler', 'Escolher', 'O seu resumo']
const destinations = [
  { id: 'service', label: 'Os serviços', title: 'Conhecer as nossas áreas.', text: 'Explore os serviços e a informação publicada pela clínica.', number: '01' },
  { id: 'professional', label: 'As pessoas', title: 'Encontrar quem está deste lado.', text: 'Conheça os rostos, os percursos e as áreas da equipa.', number: '02' },
  { id: 'unit', label: 'Os espaços', title: 'Imaginar a próxima visita.', text: 'Descubra as duas unidades e prepare a sua chegada.', number: '03' },
]
const typeLabels = { service: 'Serviços', professional: 'Profissionais', unit: 'Unidades', post: 'Conteúdos' }
const services = getPublished(site.services)

function SelectionCard({ item, selected, onSelect }) {
  return <article className="ac-discovery-card">
    {item.entry.image && <div className="ac-discovery-card__image"><MediaPlaceholder image={item.entry.image} label={item.title} /></div>}
    <div className="ac-discovery-card__body">
      <p className="ac-eyebrow">{typeLabels[item.type]}</p>
      <h4><Link to={item.to}>{item.title}</Link></h4>
      <p>{item.entry.summary || item.entry.address}</p>
      {item.entry.postalCode && <p>{item.entry.postalCode}</p>}
      <Link className="ac-profile-link" to={item.to}>{item.type === 'unit' ? 'Fotografias e informação' : 'Conhecer este serviço'} ↗</Link>
      <div className="ac-card-actions">
        <button className="ac-select" type="button" aria-pressed={selected} aria-label={`${selected ? 'Retirar do' : 'Adicionar ao'} percurso: ${item.title}`} onClick={() => onSelect(item)}>{selected ? '✓ No percurso' : '+ No percurso'}</button>
        {item.type === 'service' && <FavoriteButton type={item.type} id={item.id} title={item.title} />}
      </div>
    </div>
  </article>
}

export default function ClinicExplorer() {
  const [step, setStep] = useState(0)
  const [intent, setIntent] = useState('')
  const [collection, setCollection] = useState('service')
  const [topic, setTopic] = useState('')
  const [selection, setSelection] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)
  const { items } = useFavorites()
  const heading = useRef(null)
  const section = useRef(null)
  const focusAfterChange = useRef(false)
  const topicId = useId()
  const chosen = connectCatalog.filter(item => selection.some(value => connectKey(value) === connectKey(item)))
  const chosenPlaces = chosen.filter(item => item.type !== 'post')
  const posts = filterConnectPosts(site.posts, services.find(service => service.slug === topic))

  useEffect(() => {
    if (focusAfterChange.current) {
      heading.current?.focus({ preventScroll: true })
      heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
      focusAfterChange.current = false
    }
  }, [step, showFavorites])

  useEffect(() => {
    if (window.location.hash !== '#alcancari-connect') return
    const frame = requestAnimationFrame(() => section.current?.scrollIntoView({ block: 'start' }))
    return () => cancelAnimationFrame(frame)
  }, [])

  function goTo(next) { focusAfterChange.current = true; setStep(next) }
  function toggle(item) { setSelection(current => toggleSelection(current, item)) }
  function switchView(next) { focusAfterChange.current = true; setShowFavorites(next) }
  function restart() { setIntent(''); setSelection([]); setTopic(''); setCollection('service'); goTo(0) }

  const titles = ['O que pretende conhecer?', 'Uma boa descoberta começa por aqui.', 'Dê forma ao seu percurso.', 'O seu próximo ponto de partida.']

  return <section ref={section} id="alcancari-connect" className="ac-connect" aria-labelledby="ac-connect-title">
    <div className="container-shell">
      <header className="ac-connect__header">
        <div><p className="ac-eyebrow">ALCANÇARI CONNECT</p><h2 id="ac-connect-title">Ligações que começam<br /><em>com uma descoberta.</em></h2></div>
        <div className="ac-connect__intro"><p>Serviços, pessoas e ideias. Crie um percurso de descoberta ao seu ritmo e guarde o que quer voltar a encontrar.</p><span>Quatro etapas. A sua curiosidade.</span></div>
      </header>

      <div className="ac-workspace">
        <div className="ac-view-switch" role="group" aria-label="Alcançari Connect">
          <button type="button" aria-pressed={!showFavorites} onClick={() => switchView(false)}>O meu percurso <span aria-hidden="true">↗</span></button>
          <button type="button" aria-pressed={showFavorites} onClick={() => switchView(true)}>Favoritos <span>{items.length}</span></button>
        </div>
        {showFavorites ? <div className="ac-panel"><h3 ref={heading} tabIndex={-1} className="ac-step-title">As suas ligações guardadas.</h3><FavoritesCollection /><button className="ac-button" type="button" onClick={() => switchView(false)}>Continuar o percurso →</button></div> : <>
          <ol className="ac-steps" aria-label="Etapas do percurso">{steps.map((label, index) => <li key={label}>
            <button type="button" aria-current={index === step ? 'step' : undefined} disabled={index > step} onClick={() => goTo(index)}><span>{String(index + 1).padStart(2, '0')}</span>{label}</button>
          </li>)}</ol>
          <div className="ac-panel">
            <div className="ac-step-heading"><p className="ac-eyebrow">{String(step + 1).padStart(2, '0')} / 04 · {steps[step]}</p><h3 className="ac-step-title" ref={heading} tabIndex={-1}>{titles[step]}</h3></div>
            <div className="ac-step-content" key={step}>
              {step === 0 && <>
                <p className="ac-muted">Escolha um ponto de partida. Mais à frente pode combinar serviços, profissionais e unidades.</p>
                <div className="ac-destinations" role="group" aria-label="O que pretende conhecer?">{destinations.map(option => <button key={option.id} type="button" aria-pressed={intent === option.id} onClick={() => { setIntent(option.id); setCollection(option.id) }}>
                  <span className="ac-destination-top"><span>{option.number}</span><span aria-hidden="true">{intent === option.id ? '✓' : '↗'}</span></span><span className="ac-eyebrow">{option.label}</span><strong>{option.title}</strong><span>{option.text}</span>
                </button>)}</div>
                <p className="ac-footnote">Um percurso para conhecer a clínica. Não é uma avaliação nem uma recomendação clínica.</p>
              </>}

              {step === 1 && <>
                <p className="ac-muted">Explore o Blog e inclua as leituras que lhe despertam curiosidade. Este passo é opcional.</p>
                <div className="ac-topic"><label htmlFor={topicId}>Conteúdos que mencionam uma área</label><select id={topicId} value={topic} onChange={event => setTopic(event.target.value)}><option value="">Todos os conteúdos</option>{services.map(service => <option key={service.slug} value={service.slug}>{service.title}</option>)}</select></div>
                <p className="ac-count" role="status">{posts.length} {posts.length === 1 ? 'conteúdo disponível' : 'conteúdos disponíveis'}</p>
                {posts.length ? <div className="ac-reading-grid">{posts.map(post => {
                  const active = selection.some(item => item.type === 'post' && item.id === post.slug)
                  return <article className="ac-reading" key={post.slug}><p className="ac-eyebrow">{post.category || 'Blog'}</p><h4><Link to={`/novidades/${post.slug}`}>{post.title}</Link></h4><p>{post.summary}</p><div className="ac-card-actions"><Link className="ac-profile-link" to={`/novidades/${post.slug}`}>Ler excerto ↗</Link><button type="button" className="ac-select" aria-pressed={active} aria-label={`${active ? 'Retirar do' : 'Incluir no'} resumo: ${post.title}`} onClick={() => toggle({ type: 'post', id: post.slug })}>{active ? '✓ Incluído' : '+ No resumo'}</button></div></article>
                })}</div> : <div className="ac-empty"><h4>Há outras leituras para descobrir.</h4><p>Não existem conteúdos publicados que mencionem esta área no título ou na categoria.</p><button className="ac-button" type="button" onClick={() => setTopic('')}>Explorar todo o Blog</button></div>}
              </>}

              {step === 2 && <>
                <p className="ac-muted">Adicione ao percurso o que quer conhecer melhor. Pode combinar as três coleções e guardar favoritos para mais tarde.</p>
                <div className="ac-filters ac-collections" role="group" aria-label="Escolher coleção">{destinations.map(option => <button key={option.id} type="button" aria-pressed={collection === option.id} onClick={() => setCollection(option.id)}>{typeLabels[option.id]} <span>{chosen.filter(item => item.type === option.id).length || ''}</span></button>)}</div>
                {collection === 'professional' ? <ProfessionalExplorer selected={selection} onSelect={toggle} /> : <div className="ac-discovery-grid">{connectCatalog.filter(item => item.type === collection).map(item => <SelectionCard key={connectKey(item)} item={item} selected={selection.some(value => connectKey(value) === connectKey(item))} onSelect={toggle} />)}</div>}
              </>}

              {step === 3 && <>
                <p className="ac-muted">Um roteiro com as suas escolhas. Abra cada página para conhecer mais ou fale com a nossa equipa.</p>
                <div className="ac-summary">{Object.entries(typeLabels).map(([type, label]) => {
                  const group = chosen.filter(item => item.type === type)
                  if (!group.length) return null
                  return <section key={type} aria-label={label}><h4>{label}<span>{group.length}</span></h4><ul>{group.map(item => <li key={connectKey(item)}><Link to={item.to}>{item.title} <span aria-hidden="true">↗</span></Link><div>{['service', 'professional'].includes(type) && <FavoriteButton type={type} id={item.id} title={item.title} />}<button type="button" className="ac-text-button" aria-label={`Retirar do resumo: ${item.title}`} onClick={() => { toggle(item); heading.current?.focus({ preventScroll: true }) }}>Retirar</button></div></li>)}</ul></section>
                })}</div>
                {!chosen.length && <div className="ac-empty"><h4>O seu percurso está em aberto.</h4><p>Volte à seleção para acrescentar as suas próximas descobertas.</p><button className="ac-button" type="button" onClick={() => goTo(2)}>Escolher páginas</button></div>}
                <div className="ac-summary-cta"><div><h4>Podemos continuar esta conversa?</h4><p>Contacte a equipa para esclarecer dúvidas. As suas escolhas não são enviadas à clínica.</p></div><Link className="ac-button" to="/contactos">Falar com a Alcançari ↗</Link></div>
                <p className="ac-footnote">O percurso termina ao sair desta página. Para voltar a encontrar serviços e profissionais, use os favoritos.</p>
              </>}
            </div>
            <div className="ac-step-footer">
              {step > 0 ? <button className="ac-text-button" type="button" onClick={() => goTo(step - 1)}>← Voltar</button> : <span className="ac-footnote">Sem login. Sem formulários pessoais.</span>}
              <p className="ac-count" role="status">{chosen.length ? `${chosen.length} ${chosen.length === 1 ? 'escolha no percurso' : 'escolhas no percurso'}` : 'Escolha ao seu ritmo'}</p>
              {step < 3 ? <button className="ac-button" type="button" disabled={(step === 0 && !intent) || (step === 2 && !chosenPlaces.length)} onClick={() => goTo(step + 1)}>{step === 2 ? 'Ver o meu resumo' : step === 1 ? 'Escolher páginas' : 'Continuar'} →</button> : <button className="ac-text-button" type="button" onClick={restart}>Começar de novo ↗</button>}
            </div>
          </div>
        </>}
      </div>
      <nav className="ac-direct-links" aria-label="Explorar diretamente"><span>Prefere explorar livremente?</span><Link to="/servicos">Serviços ↗</Link><Link to="/equipa">Equipa ↗</Link><Link to="/unidades">Unidades ↗</Link><Link to="/contactos">Contactos ↗</Link></nav>
    </div>
  </section>
}

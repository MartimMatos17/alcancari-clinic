import { lazy, Suspense, useEffect, useRef, useState } from 'react'

import { Link } from 'react-router-dom'
import { content, site } from '../content/site'
import { getPublished } from '../lib/content'
import usePageMeta from '../hooks/usePageMeta'
import MediaPlaceholder from '../components/MediaPlaceholder'
import Icon from '../components/Icon'
import '../styles/home-redesign.css'
import ClinicFAQ from '../components/ClinicFAQ'
import VirtualTour from '../components/VirtualTour'

const ClinicExplorer = lazy(() => import('../components/ClinicExplorer'))
const DiscoveryWall = lazy(() => import('../components/DiscoveryWall'))
const FirstVisitJourney = lazy(() => import('../components/FirstVisitJourney'))

export default function HomePage() {
  usePageMeta()
  const [exploreOpened, setExploreOpened] = useState(false)
  const [wallOpened, setWallOpened] = useState(false)
  const [visitOpened, setVisitOpened] = useState(false)
  const connectRef = useRef(null)
  const wallRef = useRef(null)
  const visitRef = useRef(null)

  useEffect(() => {
    const reveal = () => {
      const target = { '#alcancari-connect': connectRef, '#pessoas-da-alcancari': wallRef, '#primeira-visita': visitRef }[window.location.hash]?.current
      if (target) { target.open = true; target.querySelector('summary')?.focus({ preventScroll: true }); target.scrollIntoView({ block: 'start' }) }
    }
    reveal()
    window.addEventListener('hashchange', reveal)
    return () => window.removeEventListener('hashchange', reveal)
  }, [])

  const copy = content.home
  const services = getPublished(site.services)
  const posts = getPublished(site.posts).slice(0, 3)
  const people = getPublished(site.team).filter(member => member.image).filter((member, index, all) => all.findIndex(other => other.role.toLocaleLowerCase('pt-PT') === member.role.toLocaleLowerCase('pt-PT')) === index).slice(0, 2)


  return (
    <div className="alc-home">

      {/* Apresentação principal */}
      <section className="alc-home-hero">
        <div className="container-shell alc-home-hero-grid">
          <div className="alc-home-hero-copy">
            <p className="alc-home-eyebrow">
              <span className="alc-home-dot" />
              {copy.eyebrow}
            </p>

            <h1>
              {copy.titleLead}
              <br />
              {copy.titleBridge}{' '}
              <em>{copy.titleEmphasis}</em>
            </h1>

            <p className="alc-home-hero-description">
              {copy.intro}
            </p>

            <div className="alc-home-actions">
              <Link
                to="/servicos"
                className="alc-home-button alc-home-button-primary"
              >
                Explorar os serviços
              </Link>

              <Link
                to="/contactos"
                className="alc-home-button alc-home-button-outline"
              >
                Falar com a clínica
              </Link>
            </div>

            <div className="alc-home-hero-foot">
              <span className="alc-home-foot-line" />
              <span>
                Um espaço para conhecer, crescer e cuidar.
                <small>
                  Leça da Palmeira · São Mamede de Infesta
                </small>
              </span>
            </div>
          </div>

          <div className="alc-home-hero-visual">
            <div className="alc-home-photo-shape" aria-hidden="true" />

            <div className="alc-home-hero-photo">
              <MediaPlaceholder
                image={site.images.home}
                label="Clínica Alcançari"
                eager
              />
            </div>

            <div className="alc-home-photo-label">
              <span className="alc-home-dot" />
              A Alcançari, de perto.
            </div>
          </div>
        </div>
      </section>

      <nav className="container-shell alc-home-shortcuts" aria-label="Encontre o seu ponto de partida">
        {[{ to: '/servicos', title: 'Serviços', text: 'Áreas de intervenção' }, { to: '/equipa', title: 'Equipa', text: 'Os nossos profissionais' }, { to: '/unidades', title: 'Unidades', text: 'Espaços, moradas e horários' }, { to: '/contactos', title: 'Contactos', text: 'Fale com a clínica' }].map(item => <Link key={item.to} to={item.to} className="alc-home-shortcut"><span><strong>{item.title}</strong><small>{item.text}</small></span></Link>)}
      </nav>

      <nav className="container-shell alc-home-page-nav" aria-label="Explorar esta página">
        <span>Nesta página</span>
        <a href="#a-clinica">A clínica</a><a href="#areas-de-intervencao">Serviços</a>
        <a href="#pessoas-da-alcancari">O mural</a>
        <a href="#primeira-visita">Primeira visita</a><a href="#os-nossos-espacos">Unidades</a><a href="#ideias-e-novidades">Blog</a>
      </nav>

      {/* Sobre a clínica */}
      <section className="alc-home-about" id="a-clinica">
        <div className="container-shell alc-home-about-grid">
          <div>
            <p className="alc-home-eyebrow">A NOSSA CLÍNICA</p>
            <h2>{copy.aboutTitle}</h2>
          </div>

          <div className="alc-home-about-content">
            <p>{copy.aboutText}</p>
            <Link className="alc-home-inline-link" to="/clinica">
              Descobrir a Alcançari
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* Serviços em destaque */}
      <section className="container-shell alc-home-section" id="areas-de-intervencao">
        <div className="alc-home-section-heading">
          <div>
            <p className="alc-home-eyebrow">O QUE FAZEMOS</p>
            <h2>
              Diferentes caminhos.
              <br />
              <em>O mesmo cuidado.</em>
            </h2>
          </div>

          <Link className="alc-home-inline-link" to="/servicos">
            Explorar os serviços
            <Icon name="arrow" />
          </Link>
        </div>

        <div className="alc-home-service-grid">
          {services.slice(0, 3).map((service, index) => (
            <Link
              to={`/servicos/${service.slug}`}
              key={service.slug}
              className="alc-home-service-card"
            >
              <div className="alc-home-service-image">
                {service.image ? (
                  <MediaPlaceholder
                    image={service.image}
                    label={service.title}
                  />
                ) : (
                  <div className="alc-home-image-fallback">
                    Clínica Alcançari
                  </div>
                )}

                <span className="alc-home-service-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="alc-home-service-info">
                <div>
                  <h3>{service.title}</h3>
                  {service.summary && <p>{service.summary}</p>}
                </div>
                <span className="alc-home-card-arrow" aria-hidden="true">
                  <Icon name="arrow" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </section>
      <section className="alc-home-people" aria-labelledby="home-people-title">
        <div className="container-shell alc-home-people__layout">
          <div className="alc-home-people__intro">
            <p className="alc-home-eyebrow">A NOSSA EQUIPA</p>
            <h2 id="home-people-title">Conheça quem está <em>deste lado.</em></h2>
            <p>Conheça os profissionais, as suas áreas de intervenção e os seus percursos.</p>
            <Link className="alc-home-inline-link" to="/equipa">Conhecer toda a equipa</Link>
          </div>
          <div className="alc-home-people__grid">
            {people.map(member => <article className="alc-home-person" key={member.id}>
              <Link className="alc-home-person__photo" to={`/equipa/${member.id}`}><MediaPlaceholder image={member.image} label={member.name} /></Link>
              <div className="alc-home-person__body"><p>{member.role}</p><h3><Link to={`/equipa/${member.id}`}>{member.name}</Link></h3></div>
            </article>)}
          </div>
        </div>
      </section>

      {/* Unidades */}
      <section className="alc-home-units" id="os-nossos-espacos">
        <div className="container-shell alc-home-units-grid">
          <div>
            <p className="alc-home-eyebrow">OS NOSSOS ESPAÇOS</p>
            <h2>
              Sempre com espaço
              <br />
              <em>para acolher.</em>
            </h2>
          </div>

          <div>
            <p>
              Conheça os espaços da Alcançari e prepare
              a sua próxima visita.
            </p>

            <Link to="/unidades" className="alc-home-inline-link">
              Conhecer as unidades
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
        <div className="container-shell">
          <VirtualTour
            units={getPublished(site.units)}
            galleries={site.galleries.units}
            preview
          />
        </div>
      </section>

      <div className="container-shell alc-home-visit-wrap">
        <details ref={visitRef} id="primeira-visita" className="alc-home-visit alc-home-explore-optional" onToggle={event => { if (event.currentTarget.open) setVisitOpened(true) }}>
          <summary><span><strong>Preparar a primeira visita</strong><small>Um guia interativo com etapas e uma checklist para a sua visita.</small></span><span aria-hidden="true">+</span></summary>
          <Suspense fallback={<p role="status">A preparar o guia…</p>}>{visitOpened && <FirstVisitJourney id="guia-primeira-visita" />}</Suspense>
        </details>
      </div>

      {/* Publicações do Blog */}
      <section className="container-shell alc-home-section alc-home-news" id="ideias-e-novidades">
        <div className="alc-home-section-heading">
          <div>
            <p className="alc-home-eyebrow">BLOG E NOVIDADES</p>
            <h2>
              Ideias, histórias
              <br />
              <em>e descobertas.</em>
            </h2>
          </div>

          <Link className="alc-home-inline-link" to="/novidades">
            Explorar o Blog
            <Icon name="arrow" />
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="alc-home-news-grid">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/novidades/${post.slug}`}
                className="alc-home-news-card"
              >
                <div className="alc-home-news-image">
                  {post.image ? (
                    <MediaPlaceholder
                      image={post.image}
                      label={post.title}
                    />
                  ) : (
                    <div className="alc-home-image-fallback">
                      Notas da Alcançari
                    </div>
                  )}
                </div>

                <div className="alc-home-news-content">
                  {post.category && (
                    <p className="alc-home-eyebrow">{post.category}</p>
                  )}

                  <h3>{post.title}</h3>

                  {post.summary && <p>{post.summary}</p>}

                  <span className="alc-home-inline-link">
                    Ler publicação
                    <Icon name="arrow" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="alc-home-empty">
            As novidades da clínica estarão disponíveis em breve.
          </p>
        )}
      </section>

      <section className="container-shell alc-home-discover" aria-labelledby="home-discover-title">
        <div className="alc-home-atlas-link">
          <span><p className="alc-home-eyebrow">AO SEU RITMO</p><h2 id="home-discover-title">Há mais para <em>descobrir.</em></h2><small>Explore serviços, pessoas, espaços e leituras de outra forma.</small></span>
          <Link className="alc-home-button alc-home-button-outline" to="/atlas">Entrar no Atlas</Link>
        </div>
        <div className="alc-home-discover__options">
          <details ref={wallRef} className="alc-home-mural-optional alc-home-explore-optional" onToggle={event => { if (event.currentTarget.open) setWallOpened(true) }}>
            <summary><span><strong>O mural da Alcançari</strong><small>Fotografias, pessoas e leituras. Escolha um olhar.</small></span><span aria-hidden="true">+</span></summary>
            <Suspense fallback={<p role="status">A preparar o mural…</p>}>{wallOpened && <DiscoveryWall />}</Suspense>
          </details>
          <details ref={connectRef} className="alc-home-connect-optional alc-home-explore-optional" onToggle={event => { if (event.currentTarget.open) setExploreOpened(true) }}>
            <summary><span><strong>Alcançari Connect</strong><small>Combine conteúdos e guarde o que quer voltar a encontrar.</small></span><span aria-hidden="true">+</span></summary>
            <Suspense fallback={<p role="status">A preparar o seu percurso…</p>}>{exploreOpened && <ClinicExplorer />}</Suspense>
          </details>
        </div>
      </section>

      {/* Perguntas frequentes */}

      <ClinicFAQ />

      {/* Contactos */}
      <section className="alc-home-cta">
        <div className="container-shell alc-home-cta-inner">
          <div>
            <p className="alc-home-eyebrow">ESTAMOS AQUI PARA SI</p>
            <h2>
              Uma conversa pode ser
              <br />
              <em>um bom começo.</em>
            </h2>
            <p>
              Entre em contacto com a nossa equipa
              para esclarecer as suas dúvidas.
            </p>
          </div>

          <Link
            to="/contactos"
            className="alc-home-button alc-home-button-primary"
          >
            Falar com a Alcançari
            <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </div>
  )
}

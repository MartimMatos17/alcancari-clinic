
import { Link } from 'react-router-dom'
import { content, site } from '../content/site'
import { getPublished } from '../lib/content'
import usePageMeta from '../hooks/usePageMeta'
import MediaPlaceholder from '../components/MediaPlaceholder'
import Icon from '../components/Icon'
import '../styles/home-redesign.css'
import ClinicExplorer from '../components/ClinicExplorer'
import ClinicFAQ from '../components/ClinicFAQ'

export default function HomePage() {
  usePageMeta()

  const copy = content.home
  const services = getPublished(site.services)
  const posts = getPublished(site.posts).slice(0, 3)

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
                to="/clinica"
                className="alc-home-button alc-home-button-primary"
              >
                Conhecer a clínica
                <Icon name="arrow" />
              </Link>

              <Link
                to="/contactos"
                className="alc-home-button alc-home-button-outline"
              >
                Falar connosco
                <Icon name="arrow" />
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

      {/* Sobre a clínica */}
      <section className="alc-home-about">
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
      <section className="container-shell alc-home-section">
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
            Explorar os nove serviços
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

        <div className="alc-home-more-services">
          <p>Conheça todas as áreas de intervenção da clínica.</p>
          <Link to="/servicos" className="alc-home-inline-link">
            Ver todos os serviços
            <Icon name="arrow" />
          </Link>
        </div>
      </section>
      {/* Experiência interativa */}
      <ClinicExplorer />
      {/* Unidades */}
      <section className="alc-home-units">
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

            <div className="alc-home-unit-names">
              <span>Leça da Palmeira</span>
              <span>São Mamede de Infesta</span>
            </div>

            <Link to="/unidades" className="alc-home-inline-link">
              Conhecer as unidades
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* Publicações do Blog */}
      <section className="container-shell alc-home-section alc-home-news">
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

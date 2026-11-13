
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { content, site } from '../content/site'
import { getPublished } from '../lib/content'
import usePageMeta from '../hooks/usePageMeta'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import {
  ServiceCard,
  ServiceContact,
  ServicePhoto,
} from '../components/ServiceElements'
import ServiceExplorer, {
  filterServices,
} from '../components/ServiceExplorer'
import { serviceSpace } from '../content/servicePresentation'
import '../styles/services-redesign.css'

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState('todos')

  const services = getPublished(site.services)
  const visibleServices = filterServices(services, activeCategory)

  usePageMeta('Serviços', content.services.intro)

  return (
    <div className="services-design">
      <section className="sv-overview-hero sv-shell">
        <div className="sv-overview-hero__copy">
          <p className="sv-eyebrow">
            <span className="sv-dot" />
            Clínica Alcançari · Serviços
          </p>

          <h1>
            Cada pessoa,
            <br />
            <em>
              um caminho
              <br />
              único.
            </em>
          </h1>

          <p className="sv-lead">
            {content.services.intro}
          </p>

          <a className="sv-text-link" href="#explorar-servicos">
            Explorar os serviços
            <span className="sv-round-arrow">
              <Icon className="sv-arrow-down" />
            </span>
          </a>
        </div>

        <div className="sv-overview-hero__visual">
          <ServicePhoto image={serviceSpace} eager />

          <div className="sv-overview-hero__note">
            <span>
              {String(services.length).padStart(2, '0')}
            </span>
            <p>
              Os nossos
              <br />
              serviços
            </p>
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <nav
          className="sv-directory sv-shell"
          aria-label="Explorar serviços por nome"
        >
          <span className="sv-eyebrow">
            Encontre o seu serviço
          </span>

          <div>
            {services.map((service, index) => (
              <Link
                key={service.slug}
                to={`/servicos/${service.slug}`}
              >
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {service.title}

                <Icon name="diagonal" />
              </Link>
            ))}
          </div>
        </nav>
      )}

      <section
        id="explorar-servicos"
        className="sv-collection sv-shell"
        aria-labelledby="services-collection-title"
      >
        <div className="sv-section-heading">
          <div>
            <p className="sv-eyebrow">
              As nossas áreas
            </p>

            <h2 id="services-collection-title">
              Descubra como
              <br />
              <em>podemos ajudar.</em>
            </h2>
          </div>

          <p>
            Explore as diferentes áreas de intervenção
            e conheça o acompanhamento disponibilizado
            pela nossa equipa.
          </p>
        </div>

        {services.length > 0 && (
          <ServiceExplorer
            active={activeCategory}
            onChange={setActiveCategory}
            count={visibleServices.length}
          />
        )}

        {services.length > 0 ? (
          <div className="sv-collection__grid">
            {visibleServices.map(service => {
              const index = services.findIndex(
                item => item.slug === service.slug
              )

              return (
                <ServiceCard
                  key={service.slug}
                  service={service}
                  index={index}
                />
              )
            })}
          </div>
        ) : (
          <EmptyState
            title={content.services.emptyTitle}
            text={content.services.emptyText}
          />
        )}
      </section>

      <ServiceContact />
    </div>
  )
}

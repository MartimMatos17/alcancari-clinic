
import { Link } from 'react-router-dom'
import Icon from './Icon'
import {
  serviceImage,
  serviceImageCaption,
} from '../content/servicePresentation'

export function ServicePhoto({
  image,
  eager = false,
  className = '',
}) {
  return (
    <figure className={`sv-photo ${className}`}>
      <div className="sv-photo__frame">
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding="async"
        />
      </div>

      <figcaption>
        {serviceImageCaption(image)}
      </figcaption>
    </figure>
  )
}

export function ServiceCard({
  service,
  index,
  compact = false,
}) {
  const featured =
    service.slug === 'formacao' && !compact

  return (
    <article
      className={`sv-card${
        compact ? ' sv-card--compact' : ''
      }${
        featured ? ' sv-card--featured' : ''
      }`}
      id={
        compact
          ? undefined
          : `servico-${service.slug}`
      }
    >
      <Link
        className="sv-card__link"
        to={`/servicos/${service.slug}`}
        aria-label={`Conhecer ${service.title}`}
      >
        <div className="sv-card__visual">
          <ServicePhoto
            image={serviceImage(service)}
          />

          <span
            className="sv-card__number"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <span
            className="sv-card__arrow"
            aria-hidden="true"
          >
            <Icon name="diagonal" />
          </span>
        </div>

        <div className="sv-card__copy">
          <h3>{service.title}</h3>

          {!compact && service.summary && (
            <p>{service.summary}</p>
          )}

          <span className="sv-text-link">
            Conhecer este serviço
            <Icon name="arrow" />
          </span>
        </div>
      </Link>
    </article>
  )
}

export function ServiceContact({ detail = false }) {
  return (
    <section
      className="sv-contact"
      aria-labelledby="service-contact-title"
    >
      <div className="sv-shell sv-contact__inner">
        <div>
          <p className="sv-eyebrow">
            Estamos aqui para si
          </p>

          <h2 id="service-contact-title">
            {detail ? (
              <>
                Gostaria de
                <br />
                <em>saber mais?</em>
              </>
            ) : (
              <>
                Tem alguma dúvida?
                <br />
                <em>Vamos conversar.</em>
              </>
            )}
          </h2>

          <p>
            {detail
              ? 'Entre em contacto com a nossa equipa para esclarecer as suas dúvidas.'
              : 'A nossa equipa está disponível para esclarecer questões sobre os serviços da clínica.'}
          </p>
        </div>

        <Link
          className="sv-button sv-button--light"
          to="/contactos"
        >
          {detail
            ? 'Contactar a clínica'
            : 'Entrar em contacto'}

          <Icon name="diagonal" />
        </Link>
      </div>
    </section>
  )
}

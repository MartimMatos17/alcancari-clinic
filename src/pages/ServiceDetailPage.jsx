import { ShareButton } from '../components/UtilityActions'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import SourceNote from '../components/SourceNote'
import ServiceGallery from '../components/ServiceGallery'
import { ServiceCard, ServiceContact, ServicePhoto } from '../components/ServiceElements'
import { serviceImage, serviceGallery } from '../content/servicePresentation'

// Preserve the original order, wording and section IDs, including repeated headings.
function ServiceBody({ blocks, galleryId }) {
  const elements = []
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index]
    if (index === 0 && block.type === 'heading') continue
    if (`section-${index}` === galleryId) continue
    if (block.type === 'heading') {
      const Heading = block.level === 3 ? 'h3' : 'h2'
      elements.push(<Heading id={`section-${index}`} key={index}>{block.text}</Heading>)
    } else if (block.type === 'list') {
      const lists = []
      const start = index
      while (blocks[index]?.type === 'list') {
        const item = blocks[index]
        const List = item.ordered ? 'ol' : 'ul'
        lists.push(<List key={index}>{item.items.map((text, i) => <li key={i}>{text}</li>)}</List>)
        index++
      }
      index--
      elements.push(<div className="sv-reading__lists" key={start}>{lists}</div>)
    } else {
      elements.push(<p className={block.text?.startsWith('►') ? 'sv-reading__point' : undefined} key={index}>{block.text}</p>)
    }
  }
  return <div className="sv-reading">{elements}</div>
}

export default function ServiceDetailPage({ entry, services }) {
  const current = services.findIndex(service => service.slug === entry.slug)
  const gallery = serviceGallery(entry)
  const galleryHeading = entry.blocks.findIndex(block => block.type === 'heading' && block.text === 'Galeria')
  const galleryId = galleryHeading >= 0 && gallery.length ? `section-${galleryHeading}` : 'service-gallery'
  const sections = entry.blocks.map((block, index) => ({ ...block, index }))
    .filter(block => block.type === 'heading' && block.level !== 3 && block.index > 0)
  const related = Array.from({ length: Math.min(3, services.length - 1) }, (_, offset) => services[(current + offset + 1) % services.length])
  const next = services[(current + 1) % services.length]
  const previous = services[(current - 1 + services.length) % services.length]

  return <div className="service-page" data-service={entry.slug}>
    <div className="sv-shell">
      <nav className="sv-breadcrumb" aria-label="Percurso de navegação"><Link to="/servicos"><Icon className="sv-arrow-back" />Todos os serviços</Link><span aria-hidden="true">/</span><span aria-current="page">{entry.title}</span></nav>
      <section className="sv-detail-hero" aria-labelledby="service-title">
        <div className="sv-detail-hero__copy">
          <p className="sv-eyebrow"><span className="sv-dot" />Os nossos serviços<span className="sv-detail-hero__number">{String(current + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}</span></p>
          <h1 id="service-title">{entry.title}</h1><ShareButton title={entry.title} />
          <p className="sv-lead">{entry.summary}</p>
          <div className="sv-detail-hero__actions"><Link className="sv-button" to="/contactos">Contactar a clínica<Icon name="diagonal" /></Link>{entry.blocks.length > 0 && <a className="sv-text-link" href="#sobre-servico">Conhecer o serviço<Icon className="sv-arrow-down" /></a>}</div>
        </div>
        <div className="sv-detail-hero__visual">
          <ServicePhoto image={serviceImage(entry)} eager />
          {gallery.length > 0 && <a className="sv-gallery-shortcut" href={`#${galleryId}`}><span aria-hidden="true"><Icon name="plus" /></span>Explorar a galeria<small>{String(gallery.length).padStart(2, '0')} imagens</small></a>}
        </div>
      </section>
    </div>

    <section className={`sv-service-body sv-shell${entry.blocks.length ? '' : ' sv-service-body--short'}`} id="sobre-servico" aria-label={`Informação sobre ${entry.title}`}>
      <aside className="sv-service-body__aside">
        <div className="sv-page-index">
          <p className="sv-eyebrow">Nesta página</p>
          <nav aria-label="Secções deste serviço">
            <a href="#service-title">{entry.title}</a>
            {sections.map(section => <a key={section.index} href={`#section-${section.index}`}>{section.text}</a>)}
            {gallery.length > 0 && galleryHeading < 0 && <a href={`#${galleryId}`}>Galeria</a>}
            <a href="#service-contact-title">Contactar a clínica</a>
          </nav>
          <Link className="sv-text-link" to="/servicos">Todos os serviços<Icon name="arrow" /></Link>
        </div>
      </aside>
      <article className="sv-service-body__article">
        <ServiceBody blocks={entry.blocks} galleryId={galleryId} />
        <SourceNote entry={entry} />
      </article>
    </section>

    <ServiceGallery images={gallery} title={entry.title} id={galleryId} />
    <ServiceContact detail />

    <section className="sv-related sv-shell" aria-labelledby="service-related-title">
      <div className="sv-section-heading"><div><p className="sv-eyebrow">Continue a explorar</p><h2 id="service-related-title">Outros serviços<br /><em>da clínica.</em></h2></div><Link className="sv-text-link" to="/servicos">Ver todos os serviços<Icon name="arrow" /></Link></div>
      <div className="sv-related__grid">{related.map(service => <ServiceCard key={service.slug} service={service} compact index={services.indexOf(service)} />)}</div>
      {services.length > 1 && <nav className="sv-pagination" aria-label="Navegar entre serviços"><Link to={`/servicos/${previous.slug}`}><Icon className="sv-arrow-back" /><span><small>Serviço anterior</small>{previous.title}</span></Link><Link to={`/servicos/${next.slug}`}><span><small>Serviço seguinte</small>{next.title}</span><Icon /></Link></nav>}
    </section>
  </div>
}

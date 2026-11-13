import MediaGallery from '../components/MediaGallery'
import { Link } from 'react-router-dom'
import { content, site } from '../content/site'
import usePageMeta from '../hooks/usePageMeta'
import PageIntro from '../components/PageIntro'
import MediaPlaceholder from '../components/MediaPlaceholder'
import ExploreLinks from '../components/ExploreLinks'
import RichContent from '../components/RichContent'
import Icon from '../components/Icon'

export default function ClinicPage() {
  usePageMeta('A clínica', content.clinic.intro)
  return <><PageIntro {...content.clinic} />
    <section className="container-shell split-section"><MediaPlaceholder image={site.images.clinic} label="Os espaços da Alcançari" variant="sage" /><div className="split-copy"><p className="eyebrow">Clínica Alcançari</p><h2>{content.clinic.detailTitle}</h2><RichContent blocks={site.clinic.blocks} /><Link className="text-link" to="/equipa">Conhecer a equipa<Icon name="arrow" /></Link></div></section>
    <section className="container-shell section-space"><div className="section-heading"><div><p className="eyebrow">Perto das famílias</p><h2>Duas unidades para nos encontrarmos.</h2></div><Link className="text-link" to="/unidades">Ver espaços e horários<Icon name="arrow" /></Link></div><div className="clinic-addresses">{site.units.map(unit => <Link key={unit.id} to={`/unidades/${unit.id}`}><h3>{unit.name}</h3><p>{unit.address}<br />{unit.postalCode}</p></Link>)}</div></section>
    <section className="container-shell"><MediaGallery images={site.galleries.clinic} label="Fotografias dos nossos espaços" /></section>
    <section className="welcome-section"><div className="container-shell welcome-grid"><h2>Atendimento</h2><div><RichContent blocks={site.clinic.practicalBlocks.filter(block => block.type === 'paragraph')} /><p className="contact-note">As páginas das unidades indicam sábado das 09:00 às 14:00. Confirme a disponibilidade com a clínica.</p><Link className="text-link" to="/contactos">Consultar contactos<Icon name="arrow" /></Link></div></div></section>
    <section className="section-space container-shell"><h2 className="mb-10">Continue a conhecer-nos.</h2><ExploreLinks /></section>
  </>
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { getPublished } from '../lib/content'
import MediaPlaceholder from './MediaPlaceholder'
import Icon from './Icon'
import '../styles/discovery-wall.css'

const collections = [
  { id: 'spaces', label: 'Os espaços', items: getPublished(site.units).flatMap(unit => [unit.image, ...(site.galleries.units?.[unit.id] || [])].filter((image, index, all) => image && all.findIndex(other => other?.src === image.src) === index).slice(0, 3).map(image => ({ image, title: unit.name, subtitle: 'Conhecer esta unidade', to: `/unidades/${unit.id}` }))) },
  { id: 'people', label: 'As pessoas', items: getPublished(site.team).filter(item => item.image).map(item => ({ image: item.image, title: item.name, subtitle: item.role, to: `/equipa/${item.id}` })) },
  { id: 'stories', label: 'As leituras', items: getPublished(site.posts).filter(item => item.image).map(item => ({ image: item.image, title: item.title, subtitle: item.category, to: `/novidades/${item.slug}` })) },
].filter(collection => collection.items.length)

export default function DiscoveryWall() {
  const [selected, setSelected] = useState(collections[0]?.id)
  const collection = collections.find(item => item.id === selected)
  if (!collection) return null
  return <section className="discovery-wall" id="pessoas-da-alcancari" aria-labelledby="discovery-wall-title"><div className="container-shell">
    <header className="discovery-wall__heading"><div><p className="alc-home-eyebrow">O MURAL DA ALCANÇARI</p><h2 id="discovery-wall-title">Há mais para descobrir.<br /><em>Escolha um olhar.</em></h2></div><p>Os espaços que nos recebem, as pessoas que nos acompanham e as ideias que partilhamos.</p></header>
    <div className="discovery-wall__filters" role="group" aria-label="Escolher o conteúdo do mural">{collections.map((item, index) => <button type="button" key={item.id} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)} aria-controls="discovery-wall-grid"><span aria-hidden="true">0{index + 1}</span>{item.label}<Icon name="diagonal" /></button>)}</div>
    <p className="discovery-wall__status" role="status">{collection.label} · {Math.min(5, collection.items.length)} sugestões para explorar</p>
    <div className="discovery-wall__grid" id="discovery-wall-grid" key={selected}>{collection.items.slice(0, 5).map((item, index) => <Link key={`${item.image.src}-${index}`} to={item.to} className={`discovery-wall__tile${selected === 'people' ? ' discovery-wall__tile--portrait' : ''}`}><MediaPlaceholder image={item.image} label={item.title} /><div className="discovery-wall__caption"><div><span>{item.subtitle}</span><h3>{item.title}</h3></div><span className="discovery-wall__arrow"><Icon name="diagonal" /></span></div></Link>)}</div>
    <div className="discovery-wall__foot"><span>Um pouco da Alcançari, de perto.</span><Link to={selected === 'spaces' ? '/unidades' : selected === 'people' ? '/equipa' : '/novidades'}>Continuar a explorar <Icon name="arrow" /></Link></div>
  </div></section>
}

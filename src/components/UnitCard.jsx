import { CopyButton } from './UtilityActions'
import { Link } from 'react-router-dom'
import MediaPlaceholder from './MediaPlaceholder'
import Icon from './Icon'

export default function UnitCard({ unit, detail = false }) {
  return <article className="split-section" id={unit.id}>
    <MediaPlaceholder image={unit.image} label={unit.name} />
    <div className="split-copy"><p className="eyebrow">As nossas unidades</p><h2>{unit.name}</h2>
      <address>{unit.address}<br />{unit.postalCode}</address><CopyButton text={`${unit.address}, ${unit.postalCode}`} />
      <h3>Atendimento</h3><ul>{unit.hours.map(line => <li key={line}>{line}</li>)}</ul>
      <p className="contact-note">Confirme o atendimento de sábado diretamente com a clínica.</p>
      <a className="text-link" href={unit.mapUrl} target="_blank" rel="noopener noreferrer">Ver no mapa<Icon name="diagonal" /></a>
      {!detail && <Link className="text-link unit-detail-link" to={`/unidades/${unit.id}`}>Conhecer a unidade<Icon name="arrow" /></Link>}
    </div>
  </article>
}


import '../styles/service-explorer.css'

const categories = [
  {
    id: 'todos',
    label: 'Todos os serviços',
    slugs: null,
  },
  {
    id: 'comunicacao',
    label: 'Comunicação',
    slugs: ['terapia-da-fala', 'intervencao-em-grupo'],
  },
  {
    id: 'movimento',
    label: 'Movimento e autonomia',
    slugs: [
      'fisioterapia',
      'terapia-ocupacional',
      'integracao-sensorial',
    ],
  },
  {
    id: 'bem-estar',
    label: 'Bem-estar e interação',
    slugs: ['psicologia', 'floortime'],
  },
  {
    id: 'outras',
    label: 'Outras áreas',
    slugs: ['acupuntura', 'formacao'],
  },
]

export function filterServices(services, active) {
  const selected =
    categories.find(category => category.id === active) ||
    categories[0]

  if (!selected.slugs) return services

  return services.filter(service =>
    selected.slugs.includes(service.slug)
  )
}

export default function ServiceExplorer({
  active,
  onChange,
  count,
}) {
  return (
    <div className="sv-explorer">
      <div className="sv-explorer__intro">
        <div>
          <p className="sv-eyebrow">
            UMA FORMA DIFERENTE DE EXPLORAR
          </p>

          <h2>
            Por onde gostaria
            <br />
            <em>de começar?</em>
          </h2>
        </div>

        <p>
          Escolha uma área para descobrir os serviços
          da Alcançari. Pode explorar todos livremente.
        </p>
      </div>

      <div
        className="sv-explorer__filters"
        role="group"
        aria-label="Filtrar serviços por área"
      >
        {categories.map(category => (
          <button
            type="button"
            key={category.id}
            className={`sv-explorer__filter ${
              active === category.id ? 'is-active' : ''
            }`}
            aria-pressed={active === category.id}
            onClick={() => onChange(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <p className="sv-explorer__count" role="status">
        {count}
        {count === 1
          ? ' serviço disponível'
          : ' serviços disponíveis'}
      </p>

      <p className="sv-explorer__note">
        As categorias organizam a apresentação dos serviços.
        Não constituem recomendações clínicas.
      </p>
    </div>
  )
}

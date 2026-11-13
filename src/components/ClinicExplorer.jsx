
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import '../styles/clinic-explorer.css'

const options = [
  {
    id: 'servicos',
    label: 'Os serviços',
    icon: 'heart',
    number: '01',
    title: 'Um caminho para cada pessoa.',
    description:
      'Conheça as diferentes áreas de intervenção e descubra os serviços disponibilizados pela Alcançari.',
    link: '/servicos',
    action: 'Explorar serviços',
  },
  {
    id: 'equipa',
    label: 'A equipa',
    icon: 'users',
    number: '02',
    title: 'Pessoas que fazem a diferença.',
    description:
      'Conheça os profissionais da clínica, as suas áreas de atuação e os seus percursos.',
    link: '/equipa',
    action: 'Conhecer a equipa',
  },
  {
    id: 'unidades',
    label: 'As unidades',
    icon: 'map-pin',
    number: '03',
    title: 'Espaços para se sentir bem.',
    description:
      'Explore os espaços da Alcançari em Leça da Palmeira e São Mamede de Infesta.',
    link: '/unidades',
    action: 'Conhecer as unidades',
  },
  {
    id: 'contactos',
    label: 'Contactos',
    icon: 'message-circle',
    number: '04',
    title: 'Uma conversa é um bom começo.',
    description:
      'Fale com a equipa para obter informações sobre os serviços ou preparar a sua visita.',
    link: '/contactos',
    action: 'Entrar em contacto',
  },
]

export default function ClinicExplorer() {
  const [active, setActive] = useState('servicos')
  const selected =
    options.find(option => option.id === active) || options[0]

  return (
    <section
      className="alc-discover"
      aria-labelledby="alc-discover-title"
    >
      <div className="container-shell">
        <div className="alc-discover__heading">
          <p className="alc-home-eyebrow">
            DESCUBRA A ALCANÇARI
          </p>

          <h2 id="alc-discover-title">
            Por onde gostaria
            <br />
            <em>de começar?</em>
          </h2>

          <p>
            Descubra o que procura ao seu ritmo,
            de forma simples e intuitiva.
          </p>
        </div>

        <div className="alc-discover__layout">
          <div
            className="alc-discover__options"
            role="group"
            aria-label="Escolha o que pretende conhecer"
          >
            {options.map(option => (
              <button
                key={option.id}
                type="button"
                className={`alc-discover__option ${
                  active === option.id ? 'is-active' : ''
                }`}
                aria-pressed={active === option.id}
                onClick={() => setActive(option.id)}
              >
                <span className="alc-discover__option-number">
                  {option.number}
                </span>

                <span>{option.label}</span>

                <span
                  className="alc-discover__option-arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </button>
            ))}
          </div>

          <div
            className="alc-discover__panel"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="alc-discover__panel-top">
              <span>CLÍNICA ALCANÇARI</span>
              <span>{selected.number} / 04</span>
            </div>

            <div
              className="alc-discover__symbol"
              aria-hidden="true"
            >
              {selected.number}
            </div>

            <div className="alc-discover__panel-content">
              <h3>{selected.title}</h3>
              <p>{selected.description}</p>

              <Link
                className="alc-discover__link"
                to={selected.link}
              >
                {selected.action}
                <Icon name="arrow" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

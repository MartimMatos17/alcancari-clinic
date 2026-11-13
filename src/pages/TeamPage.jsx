
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { content, site } from '../content/site'
import { getPublished } from '../lib/content'
import usePageMeta from '../hooks/usePageMeta'
import PageIntro from '../components/PageIntro'
import MediaPlaceholder from '../components/MediaPlaceholder'
import Icon from '../components/Icon'
import '../styles/team-redesign.css'

const normalize = value =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('pt-PT')

export default function TeamPage() {
  const [role, setRole] = useState('Todas')
  const [search, setSearch] = useState('')

  const members = getPublished(site.team)

  const roles = [...new Map(
    members
      .filter(member => member.role)
      .map(member => [normalize(member.role), member.role])
  ).entries()]
    .sort((a, b) => a[1].localeCompare(b[1], 'pt-PT'))

  const query = normalize(search)

  const visible = members.filter(member => {
    const matchesRole =
      role === 'Todas' || normalize(member.role) === role

    const matchesSearch =
      !query ||
      normalize(`${member.name} ${member.role}`).includes(query)

    return matchesRole && matchesSearch
  })

  usePageMeta('Corpo Clínico', content.team.intro)

  return (
    <div className="alc-team">
      <PageIntro {...content.team} />

      <section className="container-shell alc-team__section">
        <div className="alc-team__intro">
          <div>
            <p className="alc-team__eyebrow">
              AS PESSOAS DA ALCANÇARI
            </p>

            <h2>
              Conheça a nossa
              <br />
              <em>equipa.</em>
            </h2>
          </div>

          <p>
            Conheça os profissionais, as suas áreas
            de intervenção e os seus percursos.
          </p>
        </div>

        <div className="alc-team__toolbar alc-team__toolbar--search">
          <div className="alc-team__search">
            <label htmlFor="team-search">
              Pesquisar profissionais
            </label>

            <div className="alc-team__search-box">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="10.8" cy="10.8" r="7.2" />
                <path d="m16.2 16.2 5 5" />
              </svg>

              <input
                id="team-search"
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Nome ou especialidade..."
                autoComplete="off"
              />
            </div>
          </div>

          <div className="alc-team__filter">
            <label htmlFor="specialty">
              Filtrar por especialidade
            </label>

            <select
              id="specialty"
              value={role}
              onChange={event => setRole(event.target.value)}
            >
              <option value="Todas">
                Todas as especialidades
              </option>

              {roles.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <p
            className="alc-team__count"
            role="status"
            aria-live="polite"
          >
            <strong>{visible.length}</strong>
            {visible.length === 1
              ? ' profissional encontrado'
              : ' profissionais encontrados'}
          </p>
        </div>

        {visible.length > 0 ? (
          <div className="alc-team__grid">
            {visible.map((member, index) => (
              <Link
                to={`/equipa/${member.id}`}
                key={member.id}
                className="alc-team__card"
                aria-label={`Conhecer ${member.name}`}
              >
                <div className="alc-team__photo">
                  <MediaPlaceholder
                    image={member.image}
                    label={member.name}
                    variant="sage"
                  />

                  <span className="alc-team__number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="alc-team__card-info">
                  <span className="alc-team__role">
                    {member.role}
                  </span>

                  <h3>{member.name}</h3>

                  <span className="alc-team__card-action">
                    Conhecer profissional
                    <Icon name="arrow" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="alc-team__empty alc-team__empty--search">
            <h3>Não encontrámos profissionais.</h3>

            <p>
              Experimente pesquisar outro nome
              ou selecionar todas as especialidades.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch('')
                setRole('Todas')
              }}
            >
              Limpar pesquisa e filtros
            </button>
          </div>
        )}
      </section>

      <section className="alc-team__contact">
        <div className="container-shell alc-team__contact-inner">
          <div>
            <p className="alc-team__eyebrow">
              ESTAMOS AQUI PARA SI
            </p>

            <h2>
              Há sempre espaço
              <br />
              <em>para conversar.</em>
            </h2>

            <p>
              Entre em contacto com a clínica para
              esclarecer dúvidas sobre os nossos serviços.
            </p>
          </div>

          <Link to="/contactos" className="alc-team__button">
            Entrar em contacto
            <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </div>
  )
}

import { ShareButton } from '../components/UtilityActions'

import { Link, useParams } from 'react-router-dom'
import { site } from '../content/site'
import { getPublished } from '../lib/content'
import usePageMeta from '../hooks/usePageMeta'
import PageIntro from '../components/PageIntro'
import RichContent from '../components/RichContent'
import MediaPlaceholder from '../components/MediaPlaceholder'
import SourceNote from '../components/SourceNote'
import NotFoundPage from './NotFoundPage'
import Icon from '../components/Icon'
import '../styles/team-redesign.css'

export default function TeamDetailPage() {
  const { slug } = useParams()

  const members = getPublished(site.team)
  const member = members.find(item => item.id === slug)

  usePageMeta(
    member?.name || 'Página não encontrada',
    member?.role,
    { notFound: !member }
  )

  if (!member) return <NotFoundPage />

  const otherMembers = members
    .filter(item => item.id !== member.id)
    .slice(0, 3)

  return (
    <div className="alc-profile">
      <PageIntro
        eyebrow="A nossa equipa"
        title={member.name}
        intro={member.role}
      />

      <article className="container-shell alc-profile__article"><ShareButton title={member.name} />
        <div className="alc-profile__layout">

          <aside className="alc-profile__sidebar">
            <div className="alc-profile__portrait">
              <MediaPlaceholder
                image={member.image}
                label={member.name}
                variant="sage"
              />
            </div>

            <div className="alc-profile__identity">
              <p className="alc-team__eyebrow">
                CORPO CLÍNICO
              </p>

              <h2>{member.name}</h2>
              <p>{member.role}</p>
            </div>
          </aside>

          <div className="alc-profile__content">
            <p className="alc-team__eyebrow">
              CONHEÇA O PERCURSO
            </p>

            <h2>Biografia e qualificações</h2>

            <div className="alc-profile__biography">
              <RichContent blocks={member.blocks} />
            </div>

            <SourceNote entry={member} />

            {site.contacts.whatsapp?.value && (
              <div className="alc-profile__contact-box">
                <div>
                  <p className="alc-team__eyebrow">
                    PRECISA DE MAIS INFORMAÇÕES?
                  </p>

                  <h3>Gostaria de saber mais?</h3>

                  <p>
                    Contacte a clínica para esclarecer
                    dúvidas sobre o acompanhamento
                    disponibilizado pela nossa equipa.
                  </p>
                </div>

                <a
                  className="alc-profile__whatsapp"
                  href={`https://wa.me/${String(
                    site.contacts.whatsapp.value
                  ).replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Olá! Gostaria de obter informações sobre o acompanhamento na Clínica Alcançari com ${member.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="whatsapp" />
                  Pedir informações
                </a>
              </div>
            )}


            <Link
              className="alc-profile__back"
              to="/equipa"
            >
              <Icon name="arrow" />
              Voltar à equipa
            </Link>
          </div>
        </div>
      </article>

      {otherMembers.length > 0 && (
        <section className="container-shell alc-profile__others">
          <div className="alc-profile__others-heading">
            <div>
              <p className="alc-team__eyebrow">
                CONTINUE A CONHECER-NOS
              </p>
              <h2>Mais pessoas da nossa equipa.</h2>
            </div>

            <Link to="/equipa" className="alc-profile__all">
              Ver toda a equipa
              <Icon name="arrow" />
            </Link>
          </div>

          <div className="alc-profile__others-grid">
            {otherMembers.map(person => (
              <Link
                to={`/equipa/${person.id}`}
                key={person.id}
                className="alc-profile__other-card"
              >
                <div className="alc-profile__other-image">
                  <MediaPlaceholder
                    image={person.image}
                    label={person.name}
                    variant="sage"
                  />
                </div>

                <div>
                  <small>{person.role}</small>
                  <h3>{person.name}</h3>
                  <span>Conhecer perfil <Icon name="arrow" /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

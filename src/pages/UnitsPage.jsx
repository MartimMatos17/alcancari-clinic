import { ShareButton } from '../components/UtilityActions'

import { Link, useParams } from 'react-router-dom'
import { content, site } from '../content/site'
import { getPublished } from '../lib/content'
import usePageMeta from '../hooks/usePageMeta'
import PageIntro from '../components/PageIntro'
import UnitCard from '../components/UnitCard'
import MediaGallery from '../components/MediaGallery'
import SourceNote from '../components/SourceNote'
import NotFoundPage from './NotFoundPage'
import Icon from '../components/Icon'
import '../styles/units-redesign.css'

export default function UnitsPage() {
  const { slug } = useParams()

  const allUnits = getPublished(site.units)
  const selected = slug
    ? allUnits.find(unit => unit.id === slug)
    : null

  usePageMeta(
    selected?.name || 'Unidades',
    content.units.intro,
    { notFound: Boolean(slug && !selected) }
  )

  if (slug && !selected) return <NotFoundPage />

  const units = selected ? [selected] : allUnits

  return (
    <div className="alc-units">
      <PageIntro
        {...content.units}
        title={selected ? selected.name : content.units.title}
      />

      <section className="container-shell alc-units__section">
        <div className="alc-units__intro">
          <div>
            <p className="alc-units__eyebrow">
              OS NOSSOS ESPAÇOS
            </p>

            <h2>
              Um espaço para
              <br />
              <em>se sentir bem.</em>
            </h2>
          </div>

          <p>
            Conheça as nossas unidades, descubra os espaços
            e encontre informações para preparar a sua visita.
          </p>
        </div>

        <div className="alc-units__list">
          {units.map((unit, index) => {
            const gallery = site.galleries.units?.[unit.id] || []

            return (
              <section
                className="alc-units__item"
                key={unit.id}
                aria-label={unit.name}
              >
                <div className="alc-units__item-heading">
                  <span className="alc-units__number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <h3>{unit.name}</h3>
                </div>

                <div className="alc-units__card">
                  <UnitCard
                    unit={unit}
                    detail={Boolean(selected)}
                  />
                </div>

                {gallery.length > 0 && (
                  <div className="alc-units__gallery">
                    <div className="alc-units__gallery-heading">
                      <div>
                        <p className="alc-units__eyebrow">
                          CONHEÇA OS ESPAÇOS
                        </p>
                        <h4>Por dentro da nossa unidade.</h4>
                      </div>

                      <span>
                        {gallery.length}
                        {gallery.length === 1
                          ? ' fotografia'
                          : ' fotografias'}
                      </span>
                    </div>

                    <MediaGallery
                      images={gallery}
                      label={`Ver fotografias de ${unit.name}`}
                    />
                  </div>
                )}

                {selected && <SourceNote entry={unit} />}{selected && <ShareButton title={selected.name} />}

                {!selected && (
                  <Link
                    className="alc-units__detail-link"
                    to={`/unidades/${unit.id}`}
                  >
                    Conhecer esta unidade
                    <Icon name="arrow" />
                  </Link>
                )}
              </section>
            )
          })}
        </div>

        {selected && (
          <Link className="alc-units__back" to="/unidades">
            <Icon name="arrow" />
            Voltar a todas as unidades
          </Link>
        )}
      </section>

      <section className="alc-units__contact">
        <div className="container-shell alc-units__contact-inner">
          <div>
            <p className="alc-units__eyebrow">
              PREPARE A SUA VISITA
            </p>

            <h2>
              Estamos à sua espera.
              <br />
              <em>Vamos conversar?</em>
            </h2>

            <p>
              Contacte a equipa para obter informações
              e esclarecer dúvidas antes da sua visita.
            </p>
          </div>

          <Link to="/contactos" className="alc-units__button">
            Falar com a clínica
            <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </div>
  )
}

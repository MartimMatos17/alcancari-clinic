
import { Link } from 'react-router-dom'
import { content } from '../content/site'
import usePageMeta from '../hooks/usePageMeta'
import PageIntro from '../components/PageIntro'
import ProfessionalExplorer from '../components/ProfessionalExplorer'
import ConnectFavorites from '../components/ConnectFavorites'
import Icon from '../components/Icon'
import '../styles/team-redesign.css'

export default function TeamPage() {
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
              Profissionais e áreas
              <br />
              <em>de intervenção.</em>
            </h2>
          </div>

          <p>
            Conheça os profissionais, as suas áreas
            de intervenção e os seus percursos.
          </p>
        </div>

        <ConnectFavorites />
        <ProfessionalExplorer />
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

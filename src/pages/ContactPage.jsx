
import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'
import ContactExperience from '../components/ContactExperience'
import Icon from '../components/Icon'

export default function ContactPage() {
  usePageMeta(
    'Contactos',
    'Entre em contacto com a Clínica Alcançari.'
  )

  return (
    <>
      <ContactExperience />

      <section className="container-shell page-content">
        <div className="contact-bottom">
          <div>
            <p className="eyebrow">Uma próxima visita</p>
            <h2>Conheça os nossos espaços.</h2>

            <Link className="text-link" to="/unidades">
              Consultar unidades
              <Icon name="arrow" />
            </Link>
          </div>

          <div className="contact-information">
            <h2>Informação útil</h2>

            <details>
              <summary>
                Como posso pedir uma marcação?
              </summary>
              <p>
                Pode contactar a clínica por telefone,
                WhatsApp, email ou através do formulário.
                A equipa confirmará a disponibilidade.
              </p>
            </details>

            <details>
              <summary>
                Posso enviar informações clínicas pelo formulário?
              </summary>
              <p>
                Não. Para proteger a sua privacidade,
                não envie dados de saúde através deste formulário.
                Contacte diretamente a clínica.
              </p>
            </details>
          </div>
        </div>
      </section>
    </>
  )
}


import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/clinic-faq.css'

const questions = [
  {
    question: 'Onde fica a Clínica Alcançari?',
    answer:
      'A clínica tem duas unidades: Leça da Palmeira e São Mamede de Infesta.',
    link: '/unidades',
    linkText: 'Conhecer as unidades',
  },
  {
    question: 'Que serviços estão disponíveis?',
    answer:
      'A Alcançari disponibiliza diferentes áreas de intervenção. Pode conhecer os nove serviços e consultar a informação de cada um.',
    link: '/servicos',
    linkText: 'Explorar os serviços',
  },
  {
    question: 'Como posso entrar em contacto?',
    answer:
      'Pode contactar a clínica através do telefone, WhatsApp, email ou formulário disponível no site.',
    link: '/contactos',
    linkText: 'Ver contactos',
  },
  {
    question: 'Posso conhecer os profissionais?',
    answer:
      'Sim. Na página Equipa encontra os profissionais apresentados pela clínica e as informações disponíveis sobre cada um.',
    link: '/equipa',
    linkText: 'Conhecer a equipa',
  },
  {
    question: 'Como posso pedir informações sobre uma marcação?',
    answer:
      'Pode enviar o seu pedido através da página Contactos. A equipa poderá esclarecer as suas dúvidas sobre o processo de marcação.',
    link: '/contactos',
    linkText: 'Pedir informações',
  },
]

export default function ClinicFAQ() {
  const [search, setSearch] = useState('')
  const [opened, setOpened] = useState(null)

  const normalized = search
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

  const results = questions.filter(item => {
    const text = `${item.question} ${item.answer}`
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()

    return text.includes(normalized)
  })

  return (
    <section className="alc-faq" aria-labelledby="alc-faq-title">
      <div className="container-shell">
        <div className="alc-faq__heading">
          <div>
            <p className="alc-home-eyebrow">
              ESTAMOS AQUI PARA AJUDAR
            </p>
            <h2 id="alc-faq-title">
              Tem alguma dúvida?
              <br />
              <em>Encontre a resposta.</em>
            </h2>
          </div>

          <p>
            Consulte as respostas às perguntas mais comuns
            e descubra onde encontrar mais informações.
          </p>
        </div>

        <div className="alc-faq__content">
          <div className="alc-faq__search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Pesquisar uma dúvida..."
              aria-label="Pesquisar perguntas frequentes"
            />
          </div>

          <div className="alc-faq__list">
            {results.map(item => {
              const isOpen = opened === item.question

              return (
                <article className="alc-faq__item" key={item.question}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-${questions.indexOf(item)}`}
                      onClick={() =>
                        setOpened(isOpen ? null : item.question)
                      }
                    >
                      <span>{item.question}</span>
                      <span aria-hidden="true">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                  </h3>

                  {isOpen && (
                    <div
                      id={`faq-${questions.indexOf(item)}`}
                      className="alc-faq__answer"
                    >
                      <p>{item.answer}</p>
                      <Link to={item.link}>
                        {item.linkText} ↗
                      </Link>
                    </div>
                  )}
                </article>
              )
            })}
          </div>

          {results.length === 0 && (
            <div className="alc-faq__empty" role="status">
              <p>Não encontrámos uma resposta para essa pesquisa.</p>
              <Link to="/contactos">
                Fale diretamente com a equipa ↗
              </Link>
            </div>
          )}

          <div className="alc-faq__footer">
            <span>Não encontrou o que procurava?</span>
            <Link to="/contactos">
              Estamos aqui para ajudar ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}


import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { getPublished } from '../lib/content'
import '../styles/alcancari-interactions.css'
import '../styles/appointment-form.css'


const EMAIL = site.contacts.email.value
const PHONE = site.contacts.phone.value


const LOCATIONS = [
  {
    name: 'Leça da Palmeira',
    address: 'Rua Francisco Sá Carneiro, 307, Leça da Palmeira',
  },
  {
    name: 'São Mamede de Infesta',
    address: 'Avenida Conde, 5981, São Mamede de Infesta',
  },
]

const initial = {
  name: '',
  email: '',
  phone: '',
  requestType: 'informacoes',
  service: '',
  unit: '',
  contactPreference: 'email',
  subject: '',
  message: '',
  consent: false,
  website: '',
}

export default function ContactExperience({
  endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT || '',
  email = EMAIL,
  phone = PHONE,
  locations = LOCATIONS,
}) {
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const services = getPublished(site.services)
  const enabled =
    /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)

  const isAppointment = form.requestType === 'marcacao'

  function change(event) {
    const { name, type, checked, value } = event.target

    setForm(previous => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (status !== 'sending') {
      setError('')
      if (status !== 'idle') setStatus('idle')
    }
  }

  async function submit(event) {
    event.preventDefault()

    if (!enabled || status === 'sending') return

    if (!form.consent) {
      setError('Confirma que leste a informação de privacidade.')
      return
    }

    if (form.website) {
      setError('Não foi possível enviar o pedido.')
      return
    }

    if (isAppointment && (!form.service || !form.unit)) {
      setError('Seleciona o serviço e a unidade pretendidos.')
      return
    }

    if (
      isAppointment &&
      form.contactPreference === 'telefone' &&
      !form.phone.trim()
    ) {
      setError('Indica um número de telefone para contacto.')
      return
    }

    setError('')
    setStatus('sending')

    const payload = {
      nome: form.name.trim(),
      email: form.email.trim(),
      telefone: form.phone.trim(),
      assunto: isAppointment
        ? 'Pedido de marcação'
        : form.subject,
      mensagem: form.message.trim(),
      tipo_pedido: isAppointment
        ? 'Pedido de marcação'
        : 'Informações gerais',
      _subject: isAppointment
        ? 'Novo pedido de marcação — Alcançari'
        : 'Novo contacto — Alcançari',
    }

    if (isAppointment) {
      payload.servico = form.service
      payload.unidade_preferida = form.unit
      payload.contacto_preferido =
        form.contactPreference === 'telefone'
          ? 'Telefone'
          : 'Email'
    }

    const controller = new AbortController()
    const timeout = setTimeout(
      () => controller.abort(),
      12000
    )

    try {
      const result = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      if (!result.ok) {
        throw new Error('Pedido não aceite')
      }

      setStatus('success')
      setForm(initial)
    } catch {
      setStatus('error')
      setError(
        'Não foi possível enviar o pedido. Tenta novamente ou contacta-nos por telefone ou email.'
      )
    } finally {
      clearTimeout(timeout)
    }
  }

  return (
    <div className="alc-contact">
      <section className="alc-contact__hero">
        <div
          className="alc-contact__blob alc-contact__blob--one"
          aria-hidden="true"
        />
        <div
          className="alc-contact__blob alc-contact__blob--two"
          aria-hidden="true"
        />

        <div className="alc-contact__wrap alc-contact__hero-inner">
          <span className="alc-contact__eyebrow">
            Estamos aqui para si
          </span>

          <h1>
            Vamos <em>conversar?</em>
          </h1>

          <p>
            Uma pergunta, uma dúvida ou um primeiro contacto:
            estamos disponíveis para ajudar.
          </p>
        </div>
      </section>

      <section
        className="alc-contact__wrap alc-contact__grid"
        aria-label="Contactar a clínica"
      >
        <div className="alc-contact__details">
          <div className="alc-contact__intro">
            <span className="alc-contact__eyebrow">
              Fale connosco
            </span>

            <h2>Cuidar começa com uma conversa.</h2>

            <p>
              Escolha o meio de contacto mais conveniente.
              Evite enviar informação clínica sensível
              neste formulário.
            </p>
          </div>

          <a
            className="alc-contact__detail"
            href={`tel:${phone.replace(/\D/g, '')}`}
          >
            <span
              className="alc-contact__detail-icon"
              aria-hidden="true"
            >
              ☎
            </span>

            <span>
              <small>Telefone</small>
              <strong>{phone}</strong>
            </span>

            <span aria-hidden="true">↗</span>
          </a>

          <a
            className="alc-contact__detail"
            href={`mailto:${email}`}
          >
            <span
              className="alc-contact__detail-icon"
              aria-hidden="true"
            >
              ✉
            </span>

            <span>
              <small>Email</small>
              <strong>{email}</strong>
            </span>

            <span aria-hidden="true">↗</span>
          </a>

          <div className="alc-contact__locations">
            <h3>As nossas unidades</h3>

            {locations.map(place => (
              <div
                className="alc-contact__location"
                key={place.name}
              >
                <span aria-hidden="true">⌖</span>

                <div>
                  <strong>{place.name}</strong>
                  <p>{place.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="alc-contact__form-card">
          <span className="alc-contact__eyebrow">
            Fale com a nossa equipa
          </span>

          <h2>Como podemos ajudar?</h2>

          <p className="alc-contact__form-sub">
            Escolha o tipo de pedido e preencha os seus dados.
          </p>

          {status === 'success' && (
            <p
              className="alc-contact__notice alc-contact__notice--success"
              role="status"
            >
              Pedido enviado com sucesso! A equipa entrará
              em contacto assim que possível.
              Se pediu uma marcação, esta ainda não está confirmada.
            </p>
          )}

          {!enabled && (
            <p
              className="alc-contact__notice"
              role="status"
            >
              O formulário ainda não está ligado ao serviço
              de email. Contacte-nos por telefone ou email.
            </p>
          )}

{status === 'sending' && (
  <p role="status" aria-live="polite">
    Estamos a enviar o seu pedido…
  </p>
)}

          
<form
  onSubmit={submit}
  className="alc-contact__form"
  aria-busy={status === 'sending'}
>

            <fieldset className="alc-appointment__type">
              <legend>O que pretende fazer?</legend>

              <label
                className={
                  `alc-appointment__choice ${
                    !isAppointment ? 'is-selected' : ''
                  }`
                }
              >
                <input
                  type="radio"
                  name="requestType"
                  value="informacoes"
                  checked={!isAppointment}
                  onChange={change}
                />
                <span>Pedir informações</span>
              </label>

              <label
                className={
                  `alc-appointment__choice ${
                    isAppointment ? 'is-selected' : ''
                  }`
                }
              >
                <input
                  type="radio"
                  name="requestType"
                  value="marcacao"
                  checked={isAppointment}
                  onChange={change}
                />
                <span>Pedir uma marcação</span>
              </label>
            </fieldset>

            {isAppointment ? (
              <div className="alc-appointment__fields">
                <div className="alc-contact__field">
                  <label htmlFor="alc-service">
                    Serviço pretendido <b>*</b>
                  </label>

                  <select
                    id="alc-service"
                    name="service"
                    value={form.service}
                    onChange={change}
                    required
                  >
                    <option value="">
                      Selecione um serviço
                    </option>

                    {services.map(service => (
                      <option
                        key={service.slug}
                        value={service.title}
                      >
                        {service.title}
                      </option>
                    ))}

                    <option value="Ainda não sei">
                      Ainda não sei
                    </option>
                  </select>
                </div>

                <div className="alc-contact__field">
                  <label htmlFor="alc-unit">
                    Unidade preferida <b>*</b>
                  </label>

                  <select
                    id="alc-unit"
                    name="unit"
                    value={form.unit}
                    onChange={change}
                    required
                  >
                    <option value="">
                      Selecione uma unidade
                    </option>

                    {locations.map(place => (
                      <option
                        key={place.name}
                        value={place.name}
                      >
                        {place.name}
                      </option>
                    ))}

                    <option value="Sem preferência">
                      Sem preferência
                    </option>
                  </select>
                </div>

                <fieldset className="alc-appointment__preference">
                  <legend>
                    Como prefere ser contactado?
                  </legend>

                  <label>
                    <input
                      type="radio"
                      name="contactPreference"
                      value="email"
                      checked={
                        form.contactPreference === 'email'
                      }
                      onChange={change}
                    />
                    Email
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="contactPreference"
                      value="telefone"
                      checked={
                        form.contactPreference === 'telefone'
                      }
                      onChange={change}
                    />
                    Telefone
                  </label>
                </fieldset>

                <div
                  className="alc-appointment__summary"
                  aria-live="polite"
                >
                  <strong>Resumo do pedido</strong>

                  <p>
                    {form.service || 'Serviço por escolher'}
                    {' · '}
                    {form.unit || 'Unidade por escolher'}
                    {' · '}
                    {form.contactPreference === 'telefone'
                      ? 'Contacto por telefone'
                      : 'Contacto por email'}
                  </p>

                  <small>
                    Este pedido não constitui uma marcação
                    confirmada.
                  </small>
                </div>
              </div>
            ) : (
              <div className="alc-contact__field">
                <label htmlFor="alc-subject">
                  Assunto <b>*</b>
                </label>

                <select
                  id="alc-subject"
                  name="subject"
                  value={form.subject}
                  onChange={change}
                  required
                >
                  <option value="">
                    Selecione um assunto
                  </option>
                  <option value="Informações gerais">
                    Informações gerais
                  </option>
                  <option value="Serviços da clínica">
                    Serviços da clínica
                  </option>
                  <option value="Pedido de contacto">
                    Pedido de contacto
                  </option>
                  <option value="Outro assunto">
                    Outro assunto
                  </option>
                </select>
              </div>
            )}

            <div className="alc-contact__field">
              <label htmlFor="alc-name">
                Nome completo <b>*</b>
              </label>

              <input
                id="alc-name"
                name="name"
                value={form.name}
                onChange={change}
                minLength={2}
                maxLength={120}
                autoComplete="name"
                required
                placeholder="O seu nome"
              />
            </div>

            <div className="alc-contact__cols">
              <div className="alc-contact__field">
                <label htmlFor="alc-email">
                  Email <b>*</b>
                </label>

                <input
                  id="alc-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={change}
                  autoComplete="email"
                  maxLength={254}
                  required
                  placeholder="nome@exemplo.pt"
                />
              </div>

              <div className="alc-contact__field">
                <label htmlFor="alc-phone">
                  Telefone
                  {isAppointment &&
                    form.contactPreference === 'telefone'
                    ? ' *'
                    : ' (opcional)'}
                </label>

                <input
                  id="alc-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={change}
                  maxLength={30}
                  autoComplete="tel"
                  required={
                    isAppointment &&
                    form.contactPreference === 'telefone'
                  }
                  placeholder="9XX XXX XXX"
                />
              </div>
            </div>

            <div className="alc-contact__field">
              <label htmlFor="alc-message">
                Mensagem <b>*</b>
              </label>

              <textarea
                id="alc-message"
                name="message"
                value={form.message}
                onChange={change}
                minLength={10}
                maxLength={1500}
                rows={5}
                required
                placeholder="Escreva a sua mensagem sem incluir dados de saúde…"
              />
            </div>

            <div
              className="alc-contact__honeypot"
              aria-hidden="true"
            >
              <label htmlFor="alc-website">
                Website
              </label>

              <input
                id="alc-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={change}
              />
            </div>

            <label className="alc-contact__consent">
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={change}
                required
              />

              <span>
                Li a{' '}
                <Link to="/privacidade">
                  informação de privacidade
                </Link>{' '}
                e compreendo como será tratado este pedido
                de contacto. <b>*</b>
              </span>
            </label>

            {error && (
              <p
                className="alc-contact__notice alc-contact__notice--error"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              className="alc-contact__send"
              type="submit"
              disabled={
                !enabled || status === 'sending'
              }
            >
              {status === 'sending'
                ? 'A enviar…'
                : isAppointment
                  ? 'Enviar pedido de marcação'
                  : 'Enviar mensagem'}

              <span aria-hidden="true">↗</span>
            </button>

            <small className="alc-contact__footnote">
              * Campos obrigatórios. Não envie informações
              clínicas ou dados de saúde. Este formulário
              não se destina a situações de emergência.
            </small>
          </form>
        </div>
      </section>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { site } from '../content/site'
import '../styles/contact-widget.css'

const WhatsAppLogo = ({ size = 25 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M16.03 2.5A13.43 13.43 0 0 0 4.43 22.7L2.5 29.5l6.97-1.83a13.5 13.5 0 1 0 6.56-25.17Zm0 24.5c-2.25 0-4.45-.61-6.36-1.77l-.46-.27-4.13 1.08 1.1-4.01-.3-.49A11.15 11.15 0 1 1 16.03 27Zm6.13-8.34c-.34-.17-1.98-.98-2.28-1.09-.31-.11-.53-.17-.75.17-.22.34-.86 1.09-1.05 1.31-.19.23-.39.26-.73.09a9.1 9.1 0 0 1-2.68-1.66 10.12 10.12 0 0 1-1.86-2.32c-.2-.34-.02-.52.15-.69.15-.15.34-.39.5-.58.17-.2.22-.34.34-.57.11-.23.05-.43-.03-.6-.08-.17-.74-1.79-1.02-2.45-.27-.65-.55-.56-.75-.57h-.64c-.23 0-.59.08-.9.43-.31.34-1.17 1.15-1.17 2.8s1.2 3.23 1.37 3.46c.17.23 2.38 3.64 5.77 5.11.81.35 1.44.56 1.93.72.81.26 1.55.22 2.13.14.65-.1 1.98-.81 2.26-1.59.28-.79.28-1.46.2-1.59-.09-.14-.31-.22-.65-.39Z" />
  </svg>
)

const ContactIcon = ({ name }) => {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  if (name === 'phone') {
    return (
      <svg {...common}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5.08 3h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.68 2.8a2 2 0 0 1-.45 2.11L9.04 10.9a16 16 0 0 0 4.06 4.06l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.68A2 2 0 0 1 22 16.92Z" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  )
}

export default function WhatsAppWidget({
  phone = import.meta.env.VITE_WHATSAPP_NUMBER ||
    site.contacts.whatsapp.value,
  message = 'Olá! Gostaria de obter informações sobre os serviços da Alcançari.',
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const closeRef = useRef(null)
  const location = useLocation()

  const whatsappDigits = String(phone || '').replace(/\D/g, '')
  const whatsappValid = /^\d{9,15}$/.test(whatsappDigits)

  const phoneValue = site.contacts.phone.value
  const emailValue = site.contacts.email.value

  const whatsappUrl =
    `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return

    closeRef.current?.focus()

    const onKeyDown = event => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }

    const onPointerDown = event => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div className="alc-contact-widget" ref={rootRef}>
      {open && (
        <section
          id="alc-contact-panel"
          className="alc-contact__panel"
          aria-label="Contactos da Clínica Alcançari"
        >
          <div className="alc-contact__header">
            <div className="alc-contact__identity">
             <span className="alc-contact__symbol">
  <img
    src={site.brand.logo}
    alt=""
    width="45"
    height="45"
  />
</span>

              <div>
                <strong>Clínica Alcançari</strong>
                <span>Estamos aqui para ajudar</span>
              </div>
            </div>

            <button
              ref={closeRef}
              type="button"
              className="alc-contact__close"
              aria-label="Fechar contactos"
              onClick={() => {
                setOpen(false)
                buttonRef.current?.focus()
              }}
            >
              ×
            </button>
          </div>

          <div className="alc-contact__body">
            <p className="alc-contact__welcome">
              Olá! Como podemos ajudar?
            </p>

            <p className="alc-contact__description">
              Escolha a forma mais cómoda de falar
              com a nossa equipa.
            </p>

            <div className="alc-contact__options">
              {whatsappValid && (
                <a
                  href={whatsappUrl}
                  className="alc-contact__option"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  <span className="alc-contact__option-icon alc-contact__option-icon--whatsapp">
                    <WhatsAppLogo size={23} />
                  </span>

                  <span className="alc-contact__option-copy">
                    <strong>WhatsApp</strong>
                    <small>Enviar uma mensagem</small>
                  </span>

                  <span className="alc-contact__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              )}

              {phoneValue && (
                <a
                  href={`tel:${phoneValue}`}
                  className="alc-contact__option"
                  onClick={() => setOpen(false)}
                >
                  <span className="alc-contact__option-icon alc-contact__option-icon--phone">
                    <ContactIcon name="phone" />
                  </span>

                  <span className="alc-contact__option-copy">
                    <strong>Telefonar</strong>
                    <small>934 779 548</small>
                  </span>

                  <span className="alc-contact__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              )}

              {emailValue && (
                <a
                  href={`mailto:${emailValue}`}
                  className="alc-contact__option"
                  onClick={() => setOpen(false)}
                >
                  <span className="alc-contact__option-icon alc-contact__option-icon--email">
                    <ContactIcon name="mail" />
                  </span>

                  <span className="alc-contact__option-copy">
                    <strong>Email</strong>
                    <small>{emailValue}</small>
                  </span>

                  <span className="alc-contact__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              )}
            </div>

            <p className="alc-contact__footnote">
              Responderemos assim que possível.
            </p>
          </div>
        </section>
      )}

      <button
        ref={buttonRef}
        type="button"
        className={`alc-contact__toggle ${
          open ? 'is-open' : ''
        }`}
        aria-label={
          open
            ? 'Fechar centro de contactos'
            : 'Abrir centro de contactos'
        }
        aria-expanded={open}
        aria-controls="alc-contact-panel"
        onClick={() => setOpen(value => !value)}
      >
        {open ? (
          <span className="alc-contact__cross" aria-hidden="true">
            ×
          </span>
        ) : (
          <WhatsAppLogo size={29} />
        )}
      </button>
    </div>
  )
}

import GlobalSearch from './GlobalSearch'
import ScrollReveal from './ScrollReveal'
import '../styles/microinteractions.css'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { navigation, site } from '../content/site'
import { isPublicAsset } from '../lib/content'
import Icon from './Icon'
import '../styles/layout-redesign.css'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const menuButton = useRef(null)
  const main = useRef(null)
  const previousPath = useRef(location.pathname)

  useEffect(() => {
    setOpen(false)

    if (previousPath.current !== location.pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      main.current?.focus({ preventScroll: true })
    }

    previousPath.current = location.pathname
  }, [location.pathname])

  useEffect(() => {
    if (!open) return

    const closeOnEscape = event => {
      if (event.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }

    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const phone = site.contacts.phone.value
  const email = site.contacts.email.value

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Saltar para o conteúdo
      </a>

      <div className="site-kicker alc-layout-kicker">
        <span>Clínica Alcançari</span>
        <span>Leça da Palmeira · São Mamede de Infesta</span>
      </div>

      <header className="site-header alc-layout-header">
        <div className="nav-shell alc-layout-nav">
          <Link
            className="wordmark alc-layout-brand"
            to="/"
            aria-label="Alcançari — página inicial"
          >
            {isPublicAsset(site.brand.logo) ? (
              <img
                src={site.brand.logo}
                alt={site.brand.logoAlt}
                width="475"
                height="433"
              />
            ) : (
              <>
                <span>
                  alcançari<span className="brand-dot">.</span>
                </span>
                <small>CLÍNICA</small>
              </>
            )}
          </Link>

          <GlobalSearch onOpen={() => setOpen(false)} />
          <button
            ref={menuButton}
            type="button"
            className="menu-toggle alc-layout-toggle"
            aria-expanded={open}
            aria-controls="navegacao-principal"
            aria-label={
              open
                ? 'Fechar menu de navegação'
                : 'Abrir menu de navegação'
            }
            onClick={() => setOpen(value => !value)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>

          <nav
            id="navegacao-principal"
            className={`main-nav alc-layout-links ${open ? 'is-open' : ''}`}
            aria-label="Navegação principal"
          >
            {navigation.map(item => (
              <NavLink
                key={item.path}
                end={item.path === '/'}
                to={item.path}
                className={({ isActive }) =>
                  `${item.path === '/contactos'
                    ? 'nav-contact alc-layout-contact'
                    : 'nav-link alc-layout-link'
                  }${isActive ? ' active' : ''}`
                }
                onClick={() => setOpen(false)}
              >
                {item.label}

                {item.path === '/contactos' && (
                  <Icon name="diagonal" />
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main id="conteudo" ref={main} tabIndex={-1}>
                <ScrollReveal />
        <Suspense
          fallback={
            <p
              className="container-shell loading-message"
              role="status"
            >
              A carregar a página…
            </p>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      <footer className="site-footer alc-layout-footer">
        <div className="container-shell alc-layout-footer-main">
          <div className="alc-layout-footer-about">
            <Link
              to="/"
              className="alc-layout-footer-brand"
              aria-label="Alcançari — página inicial"
            >
              {isPublicAsset(site.brand.footerLogo) ? (
                <img
                  src={site.brand.footerLogo}
                  alt="Clínica Alcançari"
                  width="500"
                  height="500"
                  loading="lazy"
                />
              ) : (
                <span>Alcançari</span>
              )}
            </Link>

            <p>
              Um espaço dedicado ao cuidado,
              ao acompanhamento e ao desenvolvimento.
            </p>

            <div className="alc-layout-footer-units">
              <span>Leça da Palmeira</span>
              <span>São Mamede de Infesta</span>
            </div>
          </div>

          <nav
            className="alc-layout-footer-navigation"
            aria-label="Navegação do rodapé"
          >
            <h2>Explorar</h2>

            {navigation
              .filter(item => item.path !== '/')
              .map(item => (
                <Link key={item.path} to={item.path}>
                  {item.label}
                </Link>
              ))}
          </nav>

          <div className="alc-layout-footer-contact">
            <h2>Fale connosco</h2>

            <a
              className="alc-layout-footer-phone"
              href={`tel:${phone}`}
            >
              {phone.replace(/^\+351/, '').replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}
              <Icon name="arrow" />
            </a>

            <a
              className="alc-layout-footer-email"
              href={`mailto:${email}`}
            >
              {email}
            </a>

            <Link
              className="alc-layout-footer-button"
              to="/contactos"
            >
              Entrar em contacto
              <Icon name="arrow" />
            </Link>

            <div className="alc-layout-footer-social">
              {site.officialLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="container-shell alc-layout-footer-bottom">
          <span>
            © {new Date().getFullYear()} Clínica Alcançari
          </span>

          <div>
            <Link to="/privacidade">
              Política de privacidade
            </Link>

            <a href="#conteudo">
              Voltar ao início ↑
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}

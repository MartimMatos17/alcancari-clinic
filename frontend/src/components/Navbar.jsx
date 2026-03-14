import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Mail, MapPin, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import LanguageToggle from './LanguageToggle'

const SERVICES = [
  { label: 'Fisioterapia',         href: '/servicos/fisioterapia' },
  { label: 'Psicologia',           href: '/servicos/psicologia' },
  { label: 'Terapia da Fala',      href: '/servicos/terapia-fala' },
  { label: 'Terapia Ocupacional',  href: '/servicos/terapia-ocupacional' },
  { label: 'Floortime',            href: '/servicos/floortime' },
  { label: 'Integração Sensorial', href: '/servicos/integracao-sensorial' },
  { label: 'Acupuntura',           href: '/servicos/acupuntura' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [servOpen, setServOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { t } = useTranslation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false); setServOpen(false) }, [location])

  const linkClass = (href) =>
    `text-sm font-medium transition-colors hover:text-teal-600 ${location.pathname === href ? 'text-teal-700' : 'text-gray-600'}`

  return (
    <>
      {/* Top bar */}
      <div className="bg-teal-700 text-white text-sm py-2 px-4 hidden md:block">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <a href="tel:934779548" className="flex items-center gap-1.5 hover:text-teal-200 transition-colors">
              <Phone size={13} /> 934 779 548
            </a>
            <a href="mailto:alcancari.terapias@gmail.com" className="flex items-center gap-1.5 hover:text-teal-200 transition-colors">
              <Mail size={13} /> alcancari.terapias@gmail.com
            </a>
          </div>
          <div className="flex gap-4 items-center text-teal-200 text-xs">
            <span className="flex items-center gap-1"><MapPin size={11} /> Leça da Palmeira</span>
            <span className="flex items-center gap-1"><MapPin size={11} /> São Mamede de Infesta</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header className={`sticky top-0 z-40 bg-white transition-shadow ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-teal-700 rounded-xl flex items-center justify-center font-display font-bold text-white text-lg">A</div>
            <span className="font-display font-semibold text-teal-900 text-lg">Alcançari</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className={linkClass('/')}>{t('nav.home')}</Link>

            <div className="relative" onMouseEnter={() => setServOpen(true)} onMouseLeave={() => setServOpen(false)}>
              <button className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-teal-600 ${location.pathname.startsWith('/servicos') ? 'text-teal-700' : 'text-gray-600'}`}>
                {t('nav.services')} <ChevronDown size={14} className={`transition-transform ${servOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {servOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-52 z-50">
                    {SERVICES.map(s => (
                      <Link key={s.href} to={s.href}
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                        {s.label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <Link to="/servicos" className="block px-4 py-2.5 text-sm text-teal-600 font-semibold hover:bg-teal-50">
                        Ver todos →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/sobre" className={linkClass('/sobre')}>{t('nav.about')}</Link>
            <Link to="/blog" className={linkClass('/blog')}>{t('nav.blog')}</Link>
            <Link to="/faq" className={linkClass('/faq')}>{t('nav.faq')}</Link>
            <Link to="/contacto" className={linkClass('/contacto')}>{t('nav.contact')}</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageToggle />
            <Link to="/dashboard" className="text-sm text-gray-500 hover:text-teal-600 font-medium transition-colors">
              {t('nav.area')}
            </Link>
            <Link to="/marcacao"
              className="bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md">
              {t('nav.book')}
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden">
              <div className="px-4 py-4 space-y-1">
                <Link to="/" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl">{t('nav.home')}</Link>
                <div>
                  <button onClick={() => setServOpen(!servOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-xl">
                    {t('nav.services')} <ChevronDown size={14} className={servOpen ? 'rotate-180' : ''} />
                  </button>
                  {servOpen && (
                    <div className="pl-4 space-y-1 mt-1">
                      {SERVICES.map(s => (
                        <Link key={s.href} to={s.href} className="block px-3 py-2 text-sm text-gray-500 hover:text-teal-600 rounded-xl">
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link to="/sobre" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-xl">{t('nav.about')}</Link>
                <Link to="/blog" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-xl">{t('nav.blog')}</Link>
                <Link to="/faq" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-xl">{t('nav.faq')}</Link>
                <Link to="/contacto" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-xl">{t('nav.contact')}</Link>
                <div className="pt-3 space-y-2 border-t border-gray-100">
                  <div className="px-3"><LanguageToggle /></div>
                  <Link to="/dashboard" className="block px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-xl">{t('nav.area')}</Link>
                  <Link to="/marcacao" className="block bg-teal-700 text-white text-sm font-semibold px-4 py-3 rounded-xl text-center">
                    {t('nav.book')}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

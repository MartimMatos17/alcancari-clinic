import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Mail, MapPin, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

const SERVICES = [
  { label: 'Fisioterapia',        href: '/servicos/fisioterapia' },
  { label: 'Psicologia',          href: '/servicos/psicologia' },
  { label: 'Terapia da Fala',     href: '/servicos/terapia-fala' },
  { label: 'Terapia Ocupacional', href: '/servicos/terapia-ocupacional' },
  { label: 'Floortime',           href: '/servicos/floortime' },
  { label: 'Integração Sensorial',href: '/servicos/integracao-sensorial' },
  { label: 'Acupuntura',          href: '/servicos/acupuntura' },
]

export default function Navbar() {
  const [open, setOpen]         = useState(false)
  const [servOpen, setServOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false); setServOpen(false) }, [location])

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
          <div className="flex gap-6 items-center text-teal-200">
            <span className="flex items-center gap-1"><MapPin size={12} /> Leça da Palmeira</span>
            <span className="flex items-center gap-1"><MapPin size={12} /> São Mamede de Infesta</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header className={clsx(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      )}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg group-hover:bg-teal-700 transition-colors">
                A
              </div>
              <span className="font-display text-xl font-semibold text-teal-800">
                Alcançari
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavLink to="/" className={({ isActive }) => clsx('px-4 py-2 rounded-full text-sm font-medium transition-colors', isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50')}>
                Início
              </NavLink>

              {/* Services dropdown */}
              <div className="relative" onMouseEnter={() => setServOpen(true)} onMouseLeave={() => setServOpen(false)}>
                <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-teal-700 hover:bg-teal-50 transition-colors">
                  Serviços <ChevronDown size={14} className={clsx('transition-transform', servOpen && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {servOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-sand-100 py-2 overflow-hidden"
                    >
                      {SERVICES.map(s => (
                        <Link key={s.href} to={s.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                          {s.label}
                        </Link>
                      ))}
                      <div className="border-t border-sand-100 mt-2 pt-2">
                        <Link to="/servicos" className="block px-4 py-2.5 text-sm font-medium text-teal-600 hover:bg-teal-50">
                          Ver todos →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink to="/sobre" className={({ isActive }) => clsx('px-4 py-2 rounded-full text-sm font-medium transition-colors', isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50')}>
                A Clínica
              </NavLink>
              <NavLink to="/blog" className={({ isActive }) => clsx('px-4 py-2 rounded-full text-sm font-medium transition-colors', isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50')}>
                Blog
              </NavLink>
              <NavLink to="/contacto" className={({ isActive }) => clsx('px-4 py-2 rounded-full text-sm font-medium transition-colors', isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50')}>
                Contacto
              </NavLink>
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-500 hover:text-teal-700 transition-colors px-3 py-2">
                Área Clínica
              </Link>
              <Link to="/marcacao" className="btn-primary text-sm">
                Marcar Consulta
              </Link>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-teal-50">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-sand-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {[['/', 'Início'], ['/sobre', 'A Clínica'], ['/blog', 'Blog'], ['/contacto', 'Contacto']].map(([href, label]) => (
                  <Link key={href} to={href} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                    {label}
                  </Link>
                ))}
                <div className="pt-2 pb-1 border-t border-sand-100 space-y-2">
                  <Link to="/login" className="block px-4 py-2 text-sm text-gray-500">Área Clínica</Link>
                  <Link to="/marcacao" className="btn-primary block text-center text-sm">Marcar Consulta</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

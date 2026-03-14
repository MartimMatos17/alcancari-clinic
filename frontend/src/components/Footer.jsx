import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-teal-900 text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">A</div>
              <span className="font-display text-xl font-semibold">Alcançari</span>
            </div>
            <p className="text-teal-200 text-sm leading-relaxed max-w-xs">
              Clínica terapêutica pediátrica multidisciplinar com presença em Leça da Palmeira e São Mamede de Infesta.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/alcancari.terapias" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-teal-800 hover:bg-teal-700 rounded-xl flex items-center justify-center transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://www.facebook.com/alcancari" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-teal-800 hover:bg-teal-700 rounded-xl flex items-center justify-center transition-colors">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Serviços */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-teal-400">Serviços</h3>
            {['Fisioterapia', 'Psicologia', 'Terapia da Fala', 'Terapia Ocupacional', 'Floortime'].map(s => (
              <Link key={s} to={`/servicos/${s.toLowerCase().replace(/ /g, '-')}`}
                className="block text-teal-200 hover:text-white text-sm transition-colors">{s}</Link>
            ))}
          </div>

          {/* Links + Contactos */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-teal-400">Clínica</h3>
            {[
              { label: 'Sobre nós', to: '/sobre' },
              { label: 'Blog', to: '/blog' },
              { label: 'FAQ', to: '/faq' },
              { label: 'Contacto', to: '/contacto' },
              { label: 'Marcar consulta', to: '/marcacao' },
              { label: 'Privacidade', to: '/privacidade' },
            ].map(l => (
              <Link key={l.to} to={l.to} className="block text-teal-200 hover:text-white text-sm transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contactos — linha separada */}
        <div className="mt-10 pt-8 border-t border-teal-800">
          <div className="flex flex-wrap gap-4 sm:gap-8 mb-6">
            <a href="tel:934779548" className="flex items-center gap-2 text-teal-200 hover:text-white text-sm transition-colors">
              <Phone size={14} /> 934 779 548
            </a>
            <a href="mailto:alcancari.terapias@gmail.com" className="flex items-center gap-2 text-teal-200 hover:text-white text-sm transition-colors">
              <Mail size={14} /> alcancari.terapias@gmail.com
            </a>
            <div className="flex items-center gap-2 text-teal-300 text-sm">
              <MapPin size={14} /> Leça da Palmeira · São Mamede de Infesta
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-teal-400 text-xs">
            <p>© {new Date().getFullYear()} Alcançari. {t('footer.rights')}</p>
            <div className="flex gap-4">
              <Link to="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
              <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

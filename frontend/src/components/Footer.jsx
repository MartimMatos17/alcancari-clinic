import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-teal-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center font-bold text-lg">A</div>
            <span className="font-display text-xl font-semibold">Alcançari</span>
          </div>
          <p className="text-teal-200 text-sm leading-relaxed max-w-xs">
            Clínica terapêutica pediátrica multidisciplinar com presença em Leça da Palmeira e São Mamede de Infesta.
          </p>
          <div className="flex gap-3 pt-2">
            <a href="#" className="w-9 h-9 bg-teal-800 hover:bg-teal-700 rounded-xl flex items-center justify-center transition-colors">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-9 h-9 bg-teal-800 hover:bg-teal-700 rounded-xl flex items-center justify-center transition-colors">
              <Facebook size={16} />
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-teal-400">Serviços</h3>
          {['Fisioterapia', 'Psicologia', 'Terapia da Fala', 'Terapia Ocupacional', 'Floortime', 'Integração Sensorial'].map(s => (
            <Link key={s} to={`/servicos/${s.toLowerCase().replace(/ /g, '-')}`}
              className="block text-teal-200 hover:text-white text-sm transition-colors">{s}</Link>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-teal-400">Contactos</h3>
          <div className="space-y-3 text-sm text-teal-200">
            <a href="tel:934779548" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={14} /> 934 779 548
            </a>
            <a href="mailto:alcancari.terapias@gmail.com" className="flex items-start gap-2 hover:text-white transition-colors">
              <Mail size={14} className="mt-0.5 flex-shrink-0" /> alcancari.terapias@gmail.com
            </a>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 flex-shrink-0 text-teal-400" />
              <div>
                <p>Leça da Palmeira</p>
                <p>São Mamede de Infesta</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-teal-800 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-2 text-teal-400 text-xs">
          <p>© {new Date().getFullYear()} Alcançari. Todos os direitos reservados.</p>
          <p>Desenvolvido com ❤️ para as famílias</p>
        </div>
      </div>
    </footer>
  )
}

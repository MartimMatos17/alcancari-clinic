import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { i18n } = useTranslation()
  const isEN = i18n.language?.startsWith('en')

  return (
    <div className="min-h-screen bg-[#fdf9f3] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-lg">

        {/* Número grande */}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}>
          <p className="font-display text-[10rem] leading-none text-teal-100 font-bold select-none">
            404
          </p>
        </motion.div>

        <div className="space-y-3 -mt-8">
          <h1 className="font-display text-3xl text-teal-800 font-bold">
            {isEN ? 'Page not found' : 'Página não encontrada'}
          </h1>
          <p className="text-gray-400 leading-relaxed">
            {isEN
              ? "The page you're looking for doesn't exist or has been moved."
              : 'A página que procura não existe ou foi movida.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link to="/"
            className="inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold px-8 py-3.5 rounded-full transition-all shadow-lg">
            <Home size={16} /> {isEN ? 'Go home' : 'Página inicial'}
          </Link>
          <button onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border-2 border-teal-200 text-teal-700 font-semibold px-8 py-3.5 rounded-full hover:bg-teal-50 transition-all">
            <ArrowLeft size={16} /> {isEN ? 'Go back' : 'Voltar atrás'}
          </button>
        </div>

        {/* Links úteis */}
        <div className="pt-4">
          <p className="text-gray-400 text-sm mb-3">
            {isEN ? 'Maybe you were looking for:' : 'Talvez estivesse à procura de:'}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: isEN ? 'Services' : 'Serviços', href: '/servicos' },
              { label: isEN ? 'About' : 'A Clínica', href: '/sobre' },
              { label: isEN ? 'Contact' : 'Contacto', href: '/contacto' },
              { label: isEN ? 'Book' : 'Marcação', href: '/marcacao' },
            ].map(l => (
              <Link key={l.href} to={l.href}
                className="text-sm text-teal-600 hover:text-teal-800 font-medium px-4 py-2 bg-teal-50 hover:bg-teal-100 rounded-full transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

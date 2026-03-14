import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const current = i18n.language?.substring(0, 2) || 'pt'

  const toggle = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang)
  }

  return (
    <div className="flex items-center bg-gray-100 rounded-full p-0.5 gap-0.5">
      {['pt', 'en'].map(lang => (
        <button key={lang} onClick={() => toggle(lang)}
          className={`relative px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            current === lang ? 'text-white' : 'text-gray-500 hover:text-gray-700'
          }`}>
          {current === lang && (
            <motion.div layoutId="lang-pill"
              className="absolute inset-0 bg-teal-700 rounded-full"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{lang.toUpperCase()}</span>
        </button>
      ))}
    </div>
  )
}

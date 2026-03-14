import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Heart, Star, Users, Phone, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const SERVICES = [
  { slug: 'fisioterapia',         name: 'Fisioterapia',         emoji: '🏃', color: '#e0f2fe', accent: '#0369a1' },
  { slug: 'psicologia',           name: 'Psicologia',           emoji: '🧠', color: '#f3e8ff', accent: '#7c3aed' },
  { slug: 'terapia-fala',         name: 'Terapia da Fala',      emoji: '🗣️', color: '#dcfce7', accent: '#16a34a' },
  { slug: 'terapia-ocupacional',  name: 'Terapia Ocupacional',  emoji: '🤲', color: '#ffedd5', accent: '#ea580c' },
  { slug: 'floortime',            name: 'Floortime',            emoji: '🎮', color: '#fce7f3', accent: '#db2777' },
  { slug: 'integracao-sensorial', name: 'Integração Sensorial', emoji: '🌀', color: '#e0e7ff', accent: '#4f46e5' },
  { slug: 'acupuntura',           name: 'Acupuntura',           emoji: '🌿', color: '#ccfbf1', accent: '#0d9488' },
  { slug: 'intervencao-grupo',    name: 'Grupo',                emoji: '👥', color: '#fef9c3', accent: '#ca8a04' },
  { slug: 'formacao',             name: 'Formação',             emoji: '📚', color: '#f1f5f9', accent: '#475569' },
]

const TESTIMONIALS = [
  { text: 'A equipa da Alcançari transformou a vida do nosso filho. Em 6 meses de terapia ocupacional, os progressos foram extraordinários.', author: 'Mãe de um utente, 7 anos' },
  { text: 'Profissionais excecionais que tratam cada criança de forma única. Sinto-me sempre acompanhada nesta jornada.', author: 'Pai de uma utente, 5 anos' },
  { text: 'A terapeuta da fala foi incansável. O meu filho hoje comunica de forma que nunca imaginei ser possível.', author: 'Mãe de um utente, 4 anos' },
]

const STATS = [
  { value: '500+', label: 'Famílias apoiadas', icon: <Heart size={18} /> },
  { value: '16',   label: 'Especialistas',     icon: <Users size={18} /> },
  { value: '10+',  label: 'Anos de experiência', icon: <Star size={18} /> },
]

export default function HomePage() {
  const { t } = useTranslation()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])

  return (
    <div className="bg-[#fdf9f3] overflow-hidden">

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1800&q=85"
            alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f3d38]/95 via-[#0f3d38]/80 to-[#0f3d38]/50" />
        </motion.div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
          <div className="max-w-2xl space-y-6 sm:space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-teal-200 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                {t('home.hero_badge')}
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold leading-[1.05]">
              A clínica<br />
              <span className="text-teal-300 italic">terapêutica</span><br />
              do seu filho
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-white/75 text-base sm:text-lg leading-relaxed max-w-lg">
              {t('home.hero_sub')}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/marcacao"
                className="inline-flex items-center justify-center gap-2 bg-white text-teal-800 font-semibold px-7 py-4 rounded-full hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm sm:text-base">
                {t('home.book_btn')} <ArrowRight size={16} />
              </Link>
              <Link to="/sobre"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-7 py-4 rounded-full hover:bg-white/10 transition-all text-sm sm:text-base">
                {t('home.meet_team')}
              </Link>
            </motion.div>

            {/* Stats mobile-friendly */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="flex gap-6 sm:gap-8 pt-4">
              {STATS.map((s, i) => (
                <div key={i} className="text-center sm:text-left">
                  <p className="font-display text-2xl sm:text-3xl text-white font-bold">{s.value}</p>
                  <p className="text-white/50 text-xs sm:text-sm mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 30C360 60 720 0 1080 30C1260 45 1380 20 1440 30V60H0V30Z" fill="#fdf9f3"/></svg>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="py-16 sm:py-24 bg-[#fdf9f3]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16 space-y-3">
            <p className="text-teal-600 text-sm font-semibold uppercase tracking-widest">O que fazemos</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-teal-900">{t('services.title')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">{t('services.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
            {SERVICES.map((s, i) => (
              <motion.div key={s.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link to={`/servicos/${s.slug}`}
                  className="group block p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-transparent hover:border-current transition-all hover:shadow-lg hover:-translate-y-1"
                  style={{ background: s.color }}>
                  <span className="text-3xl sm:text-4xl block mb-3">{s.emoji}</span>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-800 group-hover:text-gray-900">{s.name}</h3>
                  <span className="text-xs font-semibold mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: s.accent }}>
                    {t('services.learn_more')} <ArrowRight size={11} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTEMUNHOS */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16 space-y-3">
            <p className="text-teal-600 text-sm font-semibold uppercase tracking-widest">O que dizem as famílias</p>
            <h2 className="font-display text-3xl sm:text-4xl text-teal-900">Histórias reais</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#fdf9f3] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base italic">"{t.text}"</p>
                <p className="text-gray-400 text-xs sm:text-sm font-semibold">— {t.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 sm:py-24 bg-[#fdf9f3]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-6 sm:space-y-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="space-y-4">
            <p className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Pronto para começar?</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-teal-900 leading-tight">
              Dê o primeiro passo<br />
              <span className="text-teal-600 italic">para o futuro do seu filho</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              A nossa equipa está disponível para responder a todas as suas questões e ajudá-lo a encontrar o apoio certo.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/marcacao"
              className="inline-flex items-center justify-center gap-2 bg-teal-700 text-white font-semibold px-8 py-4 rounded-full hover:bg-teal-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Marcar Consulta <ArrowRight size={16} />
            </Link>
            <a href="tel:934779548"
              className="inline-flex items-center justify-center gap-2 border-2 border-teal-700 text-teal-700 font-semibold px-8 py-4 rounded-full hover:bg-teal-50 transition-all">
              <Phone size={16} /> 934 779 548
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 sm:gap-8 pt-4">
            {['Equipa certificada', 'Seguros aceites', 'Leça & São Mamede', 'Seg–Sáb'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
                <CheckCircle size={14} className="text-teal-500 flex-shrink-0" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  )
}

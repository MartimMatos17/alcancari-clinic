import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Heart, Star, Users, Phone } from 'lucide-react'

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

export default function HomePage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  return (
    <div className="bg-[#fdf9f3] overflow-hidden">

      {/* ═══════════════════════════════════════════
          HERO — editorial split layout
      ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">

        {/* Fundo paralax */}
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1800&q=85"
            alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f3d38]/95 via-[#0f3d38]/75 to-transparent" />
        </motion.div>

        {/* Linha decorativa vertical */}
        <div className="absolute left-[42%] top-0 bottom-0 w-px bg-white/10 z-10 hidden lg:block" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Esquerda — texto principal */}
            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
                <div className="inline-flex items-center gap-2 border border-teal-400/40 text-teal-300 text-xs font-semibold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  Clínica Terapêutica Pediátrica
                </div>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
                className="font-display font-bold leading-[1.05] text-white"
                style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
                A clínica<br />
                <span className="text-teal-300 italic">terapêutica</span><br />
                do seu filho
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
                className="text-white/70 text-lg leading-relaxed max-w-md">
                Uma equipa multidisciplinar que intervém onde a criança vive, brinca e aprende — com presença em Leça da Palmeira e São Mamede de Infesta.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
                className="flex flex-wrap gap-4">
                <Link to="/marcacao"
                  className="group bg-teal-400 hover:bg-teal-300 text-teal-900 font-bold px-8 py-4 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-teal-900/30 hover:-translate-y-0.5">
                  Marcar Consulta
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/sobre"
                  className="border border-white/30 text-white hover:bg-white/10 font-medium px-8 py-4 rounded-full transition-all backdrop-blur-sm">
                  Conhecer a clínica
                </Link>
              </motion.div>

              {/* Stats inline */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                className="flex gap-8 pt-4 border-t border-white/10">
                {[['500+', 'Famílias'], ['16+', 'Terapeutas'], ['10+', 'Anos']].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-display text-2xl text-white font-bold">{n}</p>
                    <p className="text-white/50 text-xs">{l}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Direita — cards flutuantes */}
            <div className="hidden lg:block relative h-[500px]">
              {/* Card principal */}
              <motion.div
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ delay: 0, duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 right-0 bg-white/15 backdrop-blur-md border border-white/20 rounded-3xl p-6 w-64 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-teal-400/20 flex items-center justify-center text-xl">🧠</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Psicologia</p>
                    <p className="text-white/50 text-xs">Disponível hoje</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#fbbf24" className="text-amber-400" />)}
                  <span className="text-white/60 text-xs ml-1">5.0</span>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.8 }}
                className="absolute bottom-32 left-0 bg-teal-400 rounded-3xl p-5 w-56 shadow-2xl"
                style={{ animation: 'float2 6s ease-in-out infinite' }}
              >
                <p className="text-teal-900 font-bold text-3xl font-display">500+</p>
                <p className="text-teal-800 text-sm mt-1">Famílias que confiam em nós</p>
                <div className="flex mt-3 -space-x-2">
                  {['bg-teal-600', 'bg-teal-700', 'bg-teal-800', 'bg-teal-900'].map((c, i) => (
                    <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-teal-400 flex items-center justify-center`}>
                      <span className="text-white text-xs">👤</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
                className="absolute bottom-8 right-8 bg-white rounded-3xl p-5 w-48 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={16} className="text-rose-500" fill="#f43f5e" />
                  <span className="text-gray-700 text-xs font-semibold">Avaliação</span>
                </div>
                <p className="font-display text-2xl text-gray-800 font-bold">4.9 ★</p>
                <p className="text-gray-400 text-xs">baseado em 200+ avaliações</p>
              </motion.div>
            </div>

          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full">
            <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="#fdf9f3"/>
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVIÇOS — scroll horizontal pill tags
      ═══════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-teal-600 text-xs font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-8 h-px bg-teal-400 inline-block" /> O que fazemos
              </p>
              <h2 className="font-display font-bold text-teal-900 leading-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                Serviços<br />
                <span className="text-teal-600 italic">especializados</span>
              </h2>
            </motion.div>
            <Link to="/servicos" className="group flex items-center gap-2 text-teal-700 font-semibold text-sm hover:gap-4 transition-all">
              Ver todos os serviços <ArrowUpRight size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Grid assimétrico */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {SERVICES.map((s, i) => (
              <motion.div key={s.slug}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className={i === 0 ? 'col-span-2 row-span-2' : ''}>
                <Link to={"/servicos/" + s.slug}
                  className="group flex flex-col justify-between rounded-3xl p-5 h-full min-h-[120px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  style={{ backgroundColor: s.color }}>
                  <div className="flex items-start justify-between">
                    <span className={i === 0 ? 'text-4xl' : 'text-2xl'}>{s.emoji}</span>
                    <ArrowUpRight size={i === 0 ? 20 : 14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: s.accent }} />
                  </div>
                  <div>
                    <p className={`font-display font-bold leading-snug ${i === 0 ? 'text-xl' : 'text-sm'}`} style={{ color: s.accent }}>
                      {s.name}
                    </p>
                    {i === 0 && <p className="text-sm mt-2 text-gray-600 leading-relaxed">Promover, prevenir e restaurar a capacidade funcional de cada criança.</p>}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MISSÃO — texto grande + foto lateral
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Foto com sobreposição */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="relative">
              <div className="relative rounded-[2.5rem] overflow-hidden h-[520px]">
                <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=85"
                  alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-5">
                    <p className="text-white font-display text-lg font-bold">"Cada criança tem o seu ritmo"</p>
                    <p className="text-white/70 text-sm mt-1">— Equipa Alcançari</p>
                  </div>
                </div>
              </div>
              {/* Badge flutuante */}
              <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-6 bg-teal-400 rounded-3xl px-6 py-4 shadow-xl">
                <p className="font-display text-3xl text-teal-900 font-bold">10+</p>
                <p className="text-teal-800 text-xs">Anos de experiência</p>
              </motion.div>
            </motion.div>

            {/* Texto */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="space-y-8">
              <div>
                <p className="text-teal-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <span className="w-8 h-px bg-teal-400" /> A nossa missão
                </p>
                <h2 className="font-display font-bold text-teal-900 leading-tight mb-6"
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                  Um espaço criado<br />
                  <span className="text-teal-600 italic">a pensar em si</span>
                </h2>
                <p className="text-gray-500 leading-relaxed text-lg">
                  Acreditamos que cada criança é única. A nossa equipa multidisciplinar trabalha em parceria com as famílias para garantir que cada criança atinge o seu pleno potencial.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: '❤️', title: 'Família no centro', desc: 'Envolvemos sempre a família em todo o processo terapêutico.' },
                  { icon: '🌟', title: 'Excelência clínica', desc: 'Práticas baseadas em evidência científica e formação contínua.' },
                  { icon: '🤝', title: 'Equipa multidisciplinar', desc: 'Profissionais de várias áreas que trabalham em conjunto.' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-teal-50 transition-colors">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-teal-800">{item.title}</p>
                      <p className="text-gray-400 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link to="/sobre" className="group inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold px-8 py-4 rounded-full transition-all shadow-lg hover:-translate-y-0.5">
                Conhecer a equipa <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTEMUNHOS — cards em scroll
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-[#fdf9f3] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-teal-600 text-xs font-bold uppercase tracking-[0.2em] mb-3">O que dizem as famílias</p>
            <h2 className="font-display font-bold text-teal-900" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
              Histórias que nos <span className="text-teal-600 italic">inspiram</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#fbbf24" className="text-amber-400" />)}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                    <Heart size={14} fill="white" className="text-white" />
                  </div>
                  <p className="text-sm text-gray-400">{t.author}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          UNIDADES — dois cards lado a lado
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-teal-600 text-xs font-bold uppercase tracking-[0.2em] mb-3">Onde estamos</p>
            <h2 className="font-display font-bold text-teal-900" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
              Duas unidades, <span className="text-teal-600 italic">perto de si</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: 'Leça da Palmeira', address: 'Rua Francisco Sá Carneiro, 307', emoji: '🏖️', img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80' },
              { name: 'São Mamede de Infesta', address: 'Avenida Conde, 5981', emoji: '🌿', img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80' },
            ].map((u, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="group relative rounded-3xl overflow-hidden h-64 cursor-pointer">
                <img src={u.img} alt={u.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 via-teal-900/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-2xl">{u.emoji}</span>
                  <h3 className="font-display text-xl text-white font-bold mt-1">{u.name}</h3>
                  <p className="text-teal-200 text-sm">{u.address}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA FINAL — bold e memorável
      ═══════════════════════════════════════════ */}
      <section className="py-32 bg-teal-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full border border-white" style={{ transform: 'translate(-50%, -50%)' }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full border border-white" style={{ transform: 'translate(50%, 50%)' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-teal-300 text-xs font-bold uppercase tracking-[0.2em] mb-6">Dê o primeiro passo</p>
            <h2 className="font-display font-bold text-white leading-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              O futuro do seu filho<br />
              <span className="text-teal-300 italic">começa aqui</span>
            </h2>
            <p className="text-teal-200 text-lg max-w-xl mx-auto mb-10">
              Marque uma consulta ou entre em contacto. A nossa equipa está pronta para ajudar.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/marcacao"
                className="group bg-teal-400 hover:bg-teal-300 text-teal-900 font-bold px-10 py-5 rounded-full text-lg transition-all shadow-2xl shadow-teal-900/50 hover:-translate-y-1 flex items-center gap-2">
                Marcar Consulta
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="tel:934779548"
                className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-10 py-5 rounded-full text-lg transition-all backdrop-blur-sm flex items-center gap-2">
                <Phone size={18} /> 934 779 548
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

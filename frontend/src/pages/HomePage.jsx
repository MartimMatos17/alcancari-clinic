import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Users, Building2, Star, Phone } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

const SERVICES_LIST = [
  { icon: '🏃', name: 'Fisioterapia',         slug: 'fisioterapia',          color: 'bg-blue-50 text-blue-700' },
  { icon: '🧠', name: 'Psicologia',            slug: 'psicologia',            color: 'bg-purple-50 text-purple-700' },
  { icon: '🗣️', name: 'Terapia da Fala',       slug: 'terapia-fala',          color: 'bg-green-50 text-green-700' },
  { icon: '🤲', name: 'Terapia Ocupacional',   slug: 'terapia-ocupacional',   color: 'bg-orange-50 text-orange-700' },
  { icon: '🎮', name: 'Floortime',             slug: 'floortime',             color: 'bg-pink-50 text-pink-700' },
  { icon: '🌀', name: 'Integração Sensorial',  slug: 'integracao-sensorial',  color: 'bg-indigo-50 text-indigo-700' },
  { icon: '🌿', name: 'Acupuntura',            slug: 'acupuntura',            color: 'bg-teal-50 text-teal-700' },
  { icon: '👥', name: 'Intervenção em Grupo',  slug: 'intervencao-grupo',     color: 'bg-amber-50 text-amber-700' },
]

const STATS = [
  { value: '10+', label: 'Anos de Experiência' },
  { value: '500+', label: 'Famílias Apoiadas' },
  { value: '2', label: 'Unidades Clínicas' },
  { value: '15+', label: 'Profissionais' },
]

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

export default function HomePage() {
  const { data: posts = [] } = useQuery({
    queryKey: ['blog-latest'],
    queryFn: () => api.get('/blog').then(r => r.data.slice(0, 3))
  })

  return (
    <div className="overflow-hidden">
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-sand-50 via-white to-teal-50">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute bottom-0 -left-16 w-64 h-64 bg-sand-200 rounded-full opacity-50 blur-2xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-16 items-center relative">
          {/* Left */}
          <motion.div {...fadeUp} className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-sm font-medium px-4 py-2 rounded-full border border-teal-200">
              <Heart size={14} className="fill-teal-500 text-teal-500" />
              Clínica Pediátrica de Referência no Porto
            </div>

            <h1 className="font-display text-5xl lg:text-6xl text-teal-900 leading-tight">
              A clínica<br />
              <span className="text-teal-600 italic">terapêutica</span><br />
              do seu filho
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Um espaço criado a pensar nas crianças e nas suas famílias, com uma equipa multidisciplinar que intervém onde a criança vive, brinca e aprende.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/marcacao" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                Marcar Consulta <ArrowRight size={16} />
              </Link>
              <Link to="/sobre" className="btn-outline flex items-center gap-2 text-base">
                Conhecer a Clínica
              </Link>
            </div>

            {/* Quick contact */}
            <a href="tel:934779548" className="inline-flex items-center gap-3 text-gray-500 hover:text-teal-700 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-teal-100 group-hover:bg-teal-200 flex items-center justify-center transition-colors">
                <Phone size={16} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Fale connosco</p>
                <p className="font-semibold text-gray-700">934 779 548</p>
              </div>
            </a>
          </motion.div>

          {/* Right - Photo collage */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main photo placeholder - replace with real photos */}
              <div className="absolute top-0 right-0 w-64 h-72 rounded-3xl overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-teal-200 to-teal-400 flex items-center justify-center text-white text-6xl">
                  🧒
                </div>
                {/* <img src="/images/hero-1.jpg" alt="Terapia" className="w-full h-full object-cover" /> */}
              </div>
              <div className="absolute bottom-8 left-0 w-52 h-60 rounded-3xl overflow-hidden shadow-xl rotate-3">
                <div className="w-full h-full bg-gradient-to-br from-sand-200 to-sand-400 flex items-center justify-center text-6xl">
                  👩‍⚕️
                </div>
                {/* <img src="/images/hero-2.jpg" alt="Profissional" className="w-full h-full object-cover" /> */}
              </div>
              <div className="absolute top-16 left-16 w-44 h-44 rounded-3xl overflow-hidden shadow-lg -rotate-2">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center text-5xl">
                  🎯
                </div>
                {/* <img src="/images/hero-3.jpg" alt="Sessão" className="w-full h-full object-cover" /> */}
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-4 right-4 bg-white rounded-2xl shadow-lg px-4 py-3 border border-sand-100"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['🧒', '👦', '👧'].map((e, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-lg border-2 border-white">{e}</div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Crianças acompanhadas</p>
                    <p className="font-bold text-teal-700">500+ famílias</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
                <p className="font-display text-4xl font-bold text-teal-600">{s.value}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────── */}
      <section className="py-24 bg-sand-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp} className="space-y-6">
              <span className="text-teal-600 text-sm font-semibold uppercase tracking-wide">Sobre a Alcançari</span>
              <h2 className="section-title">Uma equipa a pensar<br />no desenvolvimento<br />da sua criança</h2>
              <p className="text-gray-600 leading-relaxed">
                A Alcançari tem uma equipa multidisciplinar preparada para ouvir e compreender as suas dúvidas, para as enquadrar numa avaliação especializada e, em conjunto, delinear um plano terapêutico consoante as suas necessidades.
              </p>
              <p className="text-gray-600 leading-relaxed">
                O nosso objetivo é sempre ajudar a criança a ter um melhor desempenho nas atividades de vida diária, no brincar, nas aprendizagens escolares, na comunicação e na interação social.
              </p>
              <div className="flex gap-4 pt-2">
                <Link to="/sobre" className="btn-primary">Conhecer a Equipa</Link>
                <Link to="/contacto" className="btn-outline">Falar Connosco</Link>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Heart, title: 'Abordagem Centrada', desc: 'Na criança e na família, respeitando cada contexto de vida.', color: 'bg-pink-50 text-pink-600' },
                { icon: Users, title: 'Equipa Multidisciplinar', desc: 'Profissionais de múltiplas áreas a trabalhar em conjunto.', color: 'bg-blue-50 text-blue-600' },
                { icon: Building2, title: 'Duas Unidades', desc: 'Em Leça da Palmeira e São Mamede de Infesta.', color: 'bg-teal-50 text-teal-600' },
                { icon: Star, title: 'Intervenção Natural', desc: 'Em casa, creche, jardim de infância e escola.', color: 'bg-amber-50 text-amber-600' },
              ].map((item, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 + 0.2 }}
                  className="card p-5 hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                    <item.icon size={18} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-teal-600 text-sm font-semibold uppercase tracking-wide">O que fazemos</span>
            <h2 className="section-title mt-2">Os nossos serviços</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SERVICES_LIST.map((s, i) => (
              <motion.div key={s.slug} {...fadeUp} transition={{ delay: i * 0.05 }}>
                <Link to={`/servicos/${s.slug}`}
                  className="card p-5 flex flex-col items-center text-center gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
                  <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {s.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{s.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/servicos" className="btn-outline inline-flex items-center gap-2">
              Ver todos os serviços <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BLOG ──────────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="py-24 bg-teal-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div {...fadeUp} className="flex items-end justify-between mb-12">
              <div>
                <span className="text-teal-300 text-sm font-semibold uppercase tracking-wide">Recursos e Dicas</span>
                <h2 className="font-display text-3xl md:text-4xl text-white mt-2">Blog Alcançari</h2>
              </div>
              <Link to="/blog" className="text-teal-300 hover:text-white text-sm flex items-center gap-1 transition-colors hidden md:flex">
                Ver todos <ArrowRight size={14} />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.div key={post.id} {...fadeUp} transition={{ delay: i * 0.1 }}>
                  <Link to={`/blog/${post.slug}`} className="block group">
                    <div className="rounded-2xl overflow-hidden mb-4 aspect-video bg-teal-700">
                      {post.cover_image_url ? (
                        <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📝</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {post.tags?.[0] && (
                        <span className="text-teal-300 text-xs font-semibold uppercase">{post.tags[0]}</span>
                      )}
                      <h3 className="font-display text-lg text-white group-hover:text-teal-300 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-teal-300 text-sm line-clamp-2">{post.excerpt}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-teal-600 to-teal-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div {...fadeUp} className="space-y-6">
            <h2 className="font-display text-4xl md:text-5xl text-white leading-tight">
              Pronto para dar<br />o primeiro passo?
            </h2>
            <p className="text-teal-200 text-lg">
              A nossa equipa está pronta para o ajudar. Marque uma consulta hoje.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Link to="/marcacao" className="bg-white text-teal-700 font-semibold px-8 py-4 rounded-full hover:bg-teal-50 transition-colors shadow-lg">
                Marcar Consulta
              </Link>
              <a href="tel:934779548" className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
                <Phone size={16} /> 934 779 548
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

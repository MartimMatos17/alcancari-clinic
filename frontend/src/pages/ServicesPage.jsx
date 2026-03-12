import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const SERVICES = [
  { slug: 'fisioterapia',        name: 'Fisioterapia',         emoji: '🏃', color: 'from-blue-500 to-teal-400',    light: 'bg-blue-50',   text: 'text-blue-700',   desc: 'Promover, prevenir e restaurar a capacidade funcional e de movimento.' },
  { slug: 'psicologia',          name: 'Psicologia',            emoji: '🧠', color: 'from-purple-500 to-pink-400',  light: 'bg-purple-50', text: 'text-purple-700', desc: 'Apoio emocional, comportamental e cognitivo para crianças e famílias.' },
  { slug: 'terapia-fala',        name: 'Terapia da Fala',       emoji: '🗣️', color: 'from-green-500 to-teal-400',   light: 'bg-green-50',  text: 'text-green-700',  desc: 'Avaliação e intervenção em comunicação, linguagem e fala.' },
  { slug: 'terapia-ocupacional', name: 'Terapia Ocupacional',   emoji: '🤲', color: 'from-orange-500 to-amber-400', light: 'bg-orange-50', text: 'text-orange-700', desc: 'Promover a independência e participação nas atividades do dia a dia.' },
  { slug: 'floortime',           name: 'Floortime',             emoji: '🎮', color: 'from-pink-500 to-rose-400',    light: 'bg-pink-50',   text: 'text-pink-700',   desc: 'Abordagem de desenvolvimento baseada na relação e no jogo.' },
  { slug: 'integracao-sensorial',name: 'Integração Sensorial',  emoji: '🌀', color: 'from-indigo-500 to-purple-400',light: 'bg-indigo-50', text: 'text-indigo-700', desc: 'Intervenção nas dificuldades de processamento sensorial.' },
  { slug: 'acupuntura',          name: 'Acupuntura',            emoji: '🌿', color: 'from-teal-500 to-green-400',   light: 'bg-teal-50',   text: 'text-teal-700',   desc: 'Técnica milenar para promover o equilíbrio e bem-estar.' },
  { slug: 'intervencao-grupo',   name: 'Intervenção em Grupo',  emoji: '👥', color: 'from-amber-500 to-orange-400', light: 'bg-amber-50',  text: 'text-amber-700',  desc: 'Sessões terapêuticas em grupo para desenvolver competências sociais.' },
  { slug: 'formacao',            name: 'Formação',              emoji: '📚', color: 'from-slate-500 to-teal-500',   light: 'bg-slate-50',  text: 'text-slate-700',  desc: 'Formações para profissionais e famílias sobre desenvolvimento infantil.' },
]

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 py-24 px-4 text-center relative overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-3xl mx-auto">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">O que fazemos</p>
          <h1 className="font-display text-5xl md:text-6xl text-white font-bold mb-6">Os nossos serviços</h1>
          <p className="text-teal-200 text-lg max-w-xl mx-auto">Uma equipa multidisciplinar com serviços especializados para apoiar o desenvolvimento da sua criança.</p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 30C360 60 720 0 1080 30C1260 45 1380 20 1440 30V60H0V30Z" fill="#fdf9f3"/></svg>
        </div>
      </section>
      <section className="py-20 bg-sand-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div key={s.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link to={"/servicos/" + s.slug} className="card p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full">
                  <div className={"w-14 h-14 rounded-2xl bg-gradient-to-br " + s.color + " flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform"}>{s.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl text-teal-800 mb-2">{s.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                  <div className={"flex items-center gap-1 " + s.text + " text-sm font-medium group-hover:gap-2 transition-all"}>
                    Saber mais <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card p-12 bg-gradient-to-br from-teal-600 to-teal-800">
            <h2 className="font-display text-3xl text-white mb-4">Não sabe por onde começar?</h2>
            <p className="text-teal-200 mb-8">Fale connosco e ajudamo-lo a perceber qual o serviço mais adequado para a sua criança.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contacto" className="bg-white text-teal-700 font-semibold px-8 py-3 rounded-full hover:bg-teal-50 transition-colors">Falar Connosco</Link>
              <Link to="/marcacao" className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white/10 transition-colors">Marcar Consulta</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

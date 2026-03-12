import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Phone, ArrowRight, Heart, Users, Award, Sparkles } from 'lucide-react'

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
const fadeLeft = { initial: { opacity: 0, x: -40 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
const fadeRight = { initial: { opacity: 0, x: 40 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }

const ROLE_COLORS = {
  'Terapeuta Ocupacional': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', dot: 'bg-orange-400' },
  'Psicóloga':             { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', dot: 'bg-purple-400' },
  'Terapeuta da Fala':     { bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-200',  dot: 'bg-green-400'  },
  'Fisioterapeuta':        { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200',   dot: 'bg-blue-400'   },
}

const TEAM = [
  { name: 'Alexandra Fernandes',  role: 'Terapeuta Ocupacional', photo: null },
  { name: 'Andreia Machado',      role: 'Terapeuta Ocupacional', photo: null },
  { name: 'Fabiana Rocha',        role: 'Terapeuta Ocupacional', photo: null },
  { name: 'Inês Maia',            role: 'Terapeuta Ocupacional', photo: null },
  { name: 'Inês Henriques',       role: 'Terapeuta Ocupacional', photo: null },
  { name: 'Maria Oliveira Silva', role: 'Terapeuta Ocupacional', photo: null },
  { name: 'Sofia Costa',          role: 'Terapeuta Ocupacional', photo: null },
  { name: 'Joana Simões',         role: 'Terapeuta Ocupacional', photo: null },
  { name: 'Joana Bessa',          role: 'Psicóloga',             photo: null },
  { name: 'Joana Martins',        role: 'Psicóloga',             photo: null },
  { name: 'Filipa Lima',          role: 'Psicóloga',             photo: null },
  { name: 'Maria João Cunha',     role: 'Psicóloga',             photo: null },
  { name: 'Isabel Lourenço',      role: 'Terapeuta da Fala',     photo: null },
  { name: 'Luísa Perdiz',         role: 'Terapeuta da Fala',     photo: null },
  { name: 'Sónia Teixeira',       role: 'Terapeuta da Fala',     photo: null },
  { name: 'Vânia Peixoto',        role: 'Terapeuta da Fala',     photo: null },
]

function Avatar({ name, photo }) {
  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('')
  if (photo) return <img src={photo} alt={name} className="w-full h-full object-cover" />
  return (
    <div className="w-full h-full bg-gradient-to-br from-teal-400 via-teal-500 to-teal-700 flex items-center justify-center">
      <span className="text-white font-bold text-xl">{initials}</span>
    </div>
  )
}

export default function AboutPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div className="overflow-hidden bg-[#fdf9f3]">

      <section ref={heroRef} className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=85" alt="Clínica Alcançari" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/70 to-transparent" />
        </motion.div>
        <motion.div style={{ opacity: heroOpacity }} className="relative max-w-6xl mx-auto px-6 w-full">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-teal-300 text-sm font-semibold uppercase tracking-[0.2em] mb-6">✦ Conheça-nos</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }} className="font-display text-6xl md:text-7xl lg:text-8xl text-white font-bold leading-[1.05] mb-8 max-w-2xl">
            A Clínica<br /><span className="text-teal-300 italic">Alcançari</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="text-white/80 text-xl max-w-lg leading-relaxed mb-10">
            Uma equipa multidisciplinar que intervém onde a criança vive, brinca e aprende.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-wrap gap-4">
            <Link to="/marcacao" className="bg-white text-teal-700 font-semibold px-8 py-4 rounded-full hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
              Marcar Consulta <ArrowRight size={16} />
            </Link>
            <a href="#equipa" className="border-2 border-white/40 text-white px-8 py-4 rounded-full hover:bg-white/10 transition-all backdrop-blur-sm">Conhecer a equipa</a>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-12 right-8 hidden lg:flex flex-col gap-3">
          {[{ value: '16+', label: 'Profissionais', icon: <Users size={16} /> },{ value: '500+', label: 'Famílias', icon: <Heart size={16} /> },{ value: '10+', label: 'Anos de exp.', icon: <Award size={16} /> }].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }} className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 flex items-center gap-3">
              <div className="text-teal-300">{s.icon}</div>
              <div><p className="text-white font-bold text-lg leading-none">{s.value}</p><p className="text-white/60 text-xs">{s.label}</p></div>
            </motion.div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none"><path d="M0 40C360 80 720 0 1080 40C1260 60 1380 20 1440 40V80H0V40Z" fill="#fdf9f3"/></svg>
        </div>
      </section>

      <section className="py-28 bg-[#fdf9f3]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeLeft} className="space-y-7">
              <div className="flex items-center gap-2"><div className="h-px w-8 bg-teal-400" /><span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">A nossa missão</span></div>
              <h2 className="font-display text-4xl md:text-5xl text-teal-900 leading-tight">Um espaço criado<br /><span className="text-teal-600 italic">a pensar em si</span></h2>
              <p className="text-gray-600 text-lg leading-relaxed">A Alcançari é uma clínica terapêutica pediátrica multidisciplinar com presença em Leça da Palmeira e São Mamede de Infesta. A nossa equipa intervém onde a criança vive, brinca e aprende.</p>
              <p className="text-gray-500 leading-relaxed">Acreditamos que cada criança é única e merece uma abordagem individualizada. Trabalhamos em parceria estreita com as famílias para garantir que cada criança atinge o seu pleno potencial.</p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {[{ icon: '❤️', label: 'Família no centro', desc: 'Envolvemos sempre a família' },{ icon: '🌟', label: 'Excelência clínica', desc: 'Práticas baseadas em evidência' },{ icon: '🤝', label: 'Multidisciplinar', desc: 'Equipa integrada e colaborativa' },{ icon: '🌱', label: 'Crescimento', desc: 'Potencial de cada criança' }].map((v, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.1 }} className="bg-white rounded-2xl p-4 border border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-2xl">{v.icon}</span>
                    <p className="font-semibold text-teal-800 text-sm mt-2">{v.label}</p>
                    <p className="text-gray-400 text-xs mt-1">{v.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeRight} className="relative h-[560px]">
              <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80" className="absolute top-0 left-0 w-64 h-72 object-cover rounded-3xl shadow-xl" alt="" />
              <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=80" className="absolute top-8 right-0 w-56 h-56 object-cover rounded-3xl shadow-xl" alt="" />
              <img src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&q=80" className="absolute bottom-0 left-12 w-60 h-64 object-cover rounded-3xl shadow-xl" alt="" />
              <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&q=80" className="absolute bottom-10 right-4 w-48 h-52 object-cover rounded-3xl shadow-xl" alt="" />
              <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl px-5 py-4 text-center z-10">
                <p className="font-display text-3xl text-teal-700 font-bold">500+</p>
                <p className="text-xs text-gray-400 mt-1">Famílias apoiadas</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="equipa" className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} className="mb-16">
            <div className="flex items-center gap-2 mb-4"><div className="h-px w-8 bg-teal-400" /><span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Os nossos profissionais</span></div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 className="font-display text-4xl md:text-5xl text-teal-900 leading-tight max-w-lg">Uma equipa<br /><span className="text-teal-600 italic">apaixonada</span></h2>
              <p className="text-gray-500 max-w-sm leading-relaxed text-sm">Profissionais especializados em desenvolvimento infantil, unidos por um objetivo comum.</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              {Object.entries(ROLE_COLORS).map(([role, c]) => (
                <div key={role} className={"flex items-center gap-2 " + c.bg + " " + c.text + " px-4 py-2 rounded-full text-xs font-semibold border " + c.border}>
                  <div className={"w-2 h-2 rounded-full " + c.dot} />{role}
                </div>
              ))}
            </div>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {TEAM.map((member, i) => {
              const colors = ROLE_COLORS[member.role] || { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', dot: 'bg-teal-400' }
              return (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03, duration: 0.4 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }} className="bg-white rounded-3xl p-5 text-center border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-default">
                  <div className={"w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 ring-2 ring-offset-2 " + colors.border}>
                    <Avatar name={member.name} photo={member.photo} />
                  </div>
                  <h3 className="font-semibold text-teal-900 text-sm leading-snug mb-2">{member.name}</h3>
                  <div className={"inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full " + colors.bg + " " + colors.text + " border " + colors.border}>
                    <div className={"w-1.5 h-1.5 rounded-full " + colors.dot} />{member.role}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-28 bg-teal-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 border-2 border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-64 h-64 border-2 border-white rounded-full" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} className="mb-16">
            <div className="flex items-center gap-2 mb-4"><div className="h-px w-8 bg-teal-400" /><span className="text-teal-300 text-sm font-semibold uppercase tracking-widest">Onde estamos</span></div>
            <h2 className="font-display text-4xl md:text-5xl text-white leading-tight">As nossas<br /><span className="text-teal-300 italic">duas unidades</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { name: 'Leça da Palmeira', icon: '🏖️', address: 'Rua Francisco Sá Carneiro, 307', postal: '4450-676 Leça da Palmeira', hours: ['Seg–Sex: 09h–20h','Sábado: 09h–14h','Domingo: Fechado'], mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3003.5!2d-8.6980!3d41.2043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDEyJzE1LjUiTiA4wrA0MSw1Mi44Ilc!5e0!3m2!1spt!2spt!4v1700000001', photos: ['https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&q=80','https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80','https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80','https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80'] },
              { name: 'São Mamede de Infesta', icon: '🌿', address: 'Avenida Conde, 5981', postal: '4465-098 São Mamede de Infesta', hours: ['Seg–Sex: 09h–20h','Sábado: 09h–14h','Domingo: Fechado'], mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3002.1!2d-8.6274!3d41.2205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDEzJzEzLjgiTiA4wrAzNyw0Mi42Ilc!5e0!3m2!1spt!2spt!4v1700000002', photos: ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80','https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80','https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&q=80','https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80'] }
            ].map((unit, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2, duration: 0.7 }}
                className="bg-white/8 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-white/25 transition-all">
                <div className="grid grid-cols-4 gap-0.5 h-36">
                  {unit.photos.map((p, j) => <img key={j} src={p} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />)}
                </div>
                <div className="p-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{unit.icon}</span>
                    <div><p className="text-teal-300 text-xs font-semibold uppercase tracking-widest">Unidade</p><h3 className="font-display text-xl text-white">{unit.name}</h3></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3"><MapPin size={15} className="text-teal-400 mt-0.5 flex-shrink-0" /><p className="text-teal-100 text-sm">{unit.address}<br />{unit.postal}</p></div>
                    <div className="flex items-start gap-3"><Clock size={15} className="text-teal-400 mt-0.5 flex-shrink-0" /><div className="text-teal-100 text-sm space-y-0.5">{unit.hours.map((h, j) => <p key={j}>{h}</p>)}</div></div>
                  </div>
                  <div className="rounded-2xl overflow-hidden h-44 border border-white/10">
                    <iframe src={unit.mapSrc} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title={unit.name} />
                  </div>
                  <a href={"https://maps.google.com/?q=" + encodeURIComponent(unit.address + ' ' + unit.postal)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-3 rounded-2xl transition-colors">
                    <MapPin size={14} /> Ver no Google Maps
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#fdf9f3]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeUp} className="space-y-7">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-600 px-4 py-2 rounded-full text-sm font-semibold"><Sparkles size={14} /> Pronto para começar?</div>
            <h2 className="font-display text-4xl md:text-5xl text-teal-900 leading-tight">Dê o primeiro passo<br /><span className="text-teal-600 italic">para o futuro do seu filho</span></h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">A nossa equipa está disponível para responder a todas as suas questões e ajudá-lo a encontrar o apoio certo.</p>
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Link to="/marcacao" className="bg-teal-700 text-white font-semibold px-10 py-4 rounded-full hover:bg-teal-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                Marcar Consulta <ArrowRight size={16} />
              </Link>
              <a href="tel:934779548" className="border-2 border-teal-700 text-teal-700 font-semibold px-10 py-4 rounded-full hover:bg-teal-50 transition-all flex items-center gap-2">
                <Phone size={16} /> 934 779 548
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

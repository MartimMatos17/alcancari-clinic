import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Users, Clock, ArrowLeft, Phone } from 'lucide-react'

const SERVICES_DATA = {
  'fisioterapia': {
    name: 'Fisioterapia',
    tagline: 'Movimento e desenvolvimento para cada criança',
    color: 'from-blue-600 to-teal-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    emoji: '🏃',
    heroImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
    description: 'A Fisioterapia Pediátrica é centrada na criança e na família. A intervenção baseia-se no domínio do conhecimento científico infantil e das situações patológicas que podem ocorrer nos primeiros anos de vida.',
    fullDescription: 'Como existe uma grande diversidade anatómica e fisiológica nos órgãos e sistemas dos mais pequenos, o foco da fisioterapia pediátrica é adaptado a cada criança, à sua faixa etária e ao seu desenvolvimento.',
    areas: ['Alterações Neuromotoras','Alterações Neuromusculares','Intervenção em Pré-Termo','Bronquiolite e Atelectasias','Fibrose Quística','Pneumonia e Pneumopatias','Torcicolos Congénitos','Fraturas e Alterações Posturais','Paralisia Cerebral','Espinha Bífida','Atraso do Desenvolvimento'],
    duration: '50 minutos',
    ageRange: '0 — 18 anos',
    images: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80','https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80'],
  },
  'psicologia': {
    name: 'Psicologia',
    tagline: 'Apoio emocional e desenvolvimento saudável',
    color: 'from-purple-600 to-pink-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    emoji: '🧠',
    heroImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80',
    description: 'A Psicologia trabalha o desenvolvimento emocional, comportamental e cognitivo da criança, apoiando também as famílias neste percurso.',
    fullDescription: 'A intervenção psicológica é individualizada e adaptada às necessidades de cada criança e família. Trabalhamos de forma integrada com os outros profissionais da equipa.',
    areas: ['Ansiedade e Fobias','Perturbações do Comportamento','Dificuldades de Aprendizagem','Perturbação do Espectro do Autismo','PHDA','Gestão Emocional','Autoestima','Apoio Parental','Luto e Situações de Crise','Perturbações do Sono'],
    duration: '50 minutos',
    ageRange: '3 — 18 anos',
    images: ['https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&q=80','https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80'],
  },
  'terapia-fala': {
    name: 'Terapia da Fala',
    tagline: 'Comunicar melhor, crescer mais',
    color: 'from-green-600 to-teal-500',
    lightColor: 'bg-green-50',
    textColor: 'text-green-700',
    emoji: '🗣️',
    heroImage: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&q=80',
    description: 'A Terapia da Fala avalia e intervém em todas as perturbações da comunicação humana, incluindo a fala, linguagem, voz, fluência e deglutição.',
    fullDescription: 'O terapeuta da fala trabalha com a criança e a família para desenvolver competências comunicativas fundamentais para o sucesso escolar e social.',
    areas: ['Atraso de Linguagem','Perturbações Articulatórias','Gaguez e Fluência','Perturbações da Voz','Dificuldades de Leitura e Escrita','Perturbação do Espectro do Autismo','Perturbações da Deglutição','Comunicação Aumentativa'],
    duration: '50 minutos',
    ageRange: '0 — 18 anos',
    images: ['https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&q=80','https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80'],
  },
  'terapia-ocupacional': {
    name: 'Terapia Ocupacional',
    tagline: 'Independência e participação no dia a dia',
    color: 'from-orange-500 to-amber-400',
    lightColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    emoji: '🤲',
    heroImage: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=80',
    description: 'A Terapia Ocupacional promove a participação da criança nas suas ocupações diárias: brincar, aprender, cuidar de si e interagir socialmente.',
    fullDescription: 'O terapeuta ocupacional avalia o desempenho da criança nas atividades do dia a dia e desenvolve estratégias personalizadas para promover a sua autonomia.',
    areas: ['Atividades de Vida Diária','Integração Sensorial','Competências de Escrita','Perturbação do Espectro do Autismo','Paralisia Cerebral','Dificuldades de Aprendizagem','PHDA','Adaptações e Produtos de Apoio'],
    duration: '50 minutos',
    ageRange: '0 — 18 anos',
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80','https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80'],
  },
  'floortime': {
    name: 'Floortime',
    tagline: 'Desenvolvimento através da relação e do jogo',
    color: 'from-pink-500 to-rose-400',
    lightColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    emoji: '🎮',
    heroImage: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=1200&q=80',
    description: 'O Floortime é uma abordagem de desenvolvimento baseada na relação, que utiliza o jogo como veículo para promover o desenvolvimento emocional e cognitivo.',
    fullDescription: 'Desenvolvido pelo Dr. Stanley Greenspan, o Floortime segue os interesses da criança e usa o jogo para construir capacidades emocionais e intelectuais.',
    areas: ['Perturbação do Espectro do Autismo','Atraso do Desenvolvimento','Dificuldades de Comunicação','Regulação Emocional','Competências Sociais','Relação Pais-Filho','Processamento Sensorial'],
    duration: '50 minutos',
    ageRange: '1 — 12 anos',
    images: ['https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80','https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80'],
  },
  'integracao-sensorial': {
    name: 'Integração Sensorial',
    tagline: 'Processar o mundo para crescer melhor',
    color: 'from-indigo-600 to-purple-500',
    lightColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    emoji: '🌀',
    heroImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&q=80',
    description: 'A Integração Sensorial avalia e intervém nas dificuldades de processamento sensorial que afetam o comportamento, aprendizagem e participação da criança.',
    fullDescription: 'Muitas crianças têm dificuldade em processar e organizar a informação sensorial do ambiente. A terapia ajuda o sistema nervoso a processar essa informação de forma mais eficaz.',
    areas: ['Hipersensibilidade Sensorial','Hiposensibilidade Sensorial','Dificuldades de Coordenação','Problemas de Atenção','Perturbação do Espectro do Autismo','Dificuldades de Aprendizagem','Comportamentos Desafiantes'],
    duration: '50 minutos',
    ageRange: '0 — 12 anos',
    images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80','https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80'],
  },
  'acupuntura': {
    name: 'Acupuntura',
    tagline: 'Equilíbrio natural para o bem-estar',
    color: 'from-teal-600 to-green-500',
    lightColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    emoji: '🌿',
    heroImage: 'https://images.unsplash.com/photo-1611077544132-8f3de5d2f45b?w=1200&q=80',
    description: 'A Acupuntura é uma técnica milenar da Medicina Tradicional Chinesa que utiliza agulhas finas para estimular pontos específicos do corpo.',
    fullDescription: 'Na Alcançari, a acupuntura é adaptada para crianças e famílias, utilizando técnicas suaves e não invasivas como abordagem complementar.',
    areas: ['Dores e Tensões Musculares','Ansiedade e Stress','Perturbações do Sono','Dores de Cabeça','Problemas Digestivos','Reforço do Sistema Imunitário','Apoio em Reabilitação'],
    duration: '50 minutos',
    ageRange: '5 — 18 anos',
    images: ['https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80','https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80'],
  },
  'intervencao-grupo': {
    name: 'Intervenção em Grupo',
    tagline: 'Crescer juntos, aprender em comunidade',
    color: 'from-amber-500 to-orange-400',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    emoji: '👥',
    heroImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
    description: 'A Intervenção em Grupo trabalha de forma integrada na avaliação e acompanhamento de grupos, promovendo a aprendizagem e interação social.',
    fullDescription: 'Os grupos terapêuticos são uma forma poderosa de desenvolver competências sociais e emocionais num ambiente seguro e estruturado.',
    areas: ['Competências Sociais','Regulação Emocional','Comunicação e Expressão','Resolução de Conflitos','Autoconhecimento','Cooperação em Equipa','Grupos de Pais'],
    duration: '60 minutos',
    ageRange: '4 — 16 anos',
    images: ['https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80','https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80'],
  },
  'formacao': {
    name: 'Formação',
    tagline: 'Capacitar profissionais e famílias',
    color: 'from-slate-600 to-teal-600',
    lightColor: 'bg-slate-50',
    textColor: 'text-slate-700',
    emoji: '📚',
    heroImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
    description: 'Trabalhamos na conceção e dinamização de formações, partilhando saberes e competências para capacitar profissionais e famílias.',
    fullDescription: 'As nossas formações são desenhadas com base nas necessidades reais dos participantes, combinando teoria e prática.',
    areas: ['Desenvolvimento Infantil','Necessidades Educativas Especiais','Comunicação com Crianças','Gestão de Comportamento','Sensibilização para PEA','Parentalidade Positiva','Formações à Medida'],
    duration: 'Variável',
    ageRange: 'Profissionais e Famílias',
    images: ['https://images.unsplash.com/photo-1558008258-3256797b43f3?w=600&q=80','https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80'],
  },
}

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } }

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const service = SERVICES_DATA[slug]

  if (!service) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="font-display text-2xl text-teal-800 mb-4">Serviço não encontrado</h1>
        <Link to="/servicos" className="btn-primary">Ver todos os serviços</Link>
      </div>
    </div>
  )

  return (
    <div className="overflow-hidden">
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={service.heroImage} alt={service.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <Link to="/servicos" className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
          <ArrowLeft size={16} /> Todos os Serviços
        </Link>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-16 w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full mb-4">
              <span className="text-xl">{service.emoji}</span> {service.name}
            </div>
            <h1 className="font-display text-5xl md:text-6xl text-white font-bold leading-tight mb-4">{service.tagline}</h1>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full">
                <Clock size={14} /> {service.duration}
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full">
                <Users size={14} /> {service.ageRange}
              </div>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 30C360 60 720 0 1080 30C1260 45 1380 20 1440 30V60H0V30Z" fill="#fdf9f3"/></svg>
        </div>
      </section>

      <section className="py-20 bg-sand-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp} className="space-y-6">
              <div className={"inline-flex items-center gap-2 " + service.lightColor + " " + service.textColor + " px-4 py-2 rounded-full text-sm font-semibold"}>
                {service.emoji} {service.name}
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-teal-800 leading-tight">O que é a<br />{service.name}?</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{service.description}</p>
              <p className="text-gray-600 leading-relaxed">{service.fullDescription}</p>
              <Link to="/marcacao" className="btn-primary inline-flex items-center gap-2">
                Marcar Consulta <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src={service.images[0]} alt={service.name} className="w-full h-64 object-cover rounded-3xl shadow-lg" />
                <img src={service.images[1]} alt={service.name} className="w-full h-64 object-cover rounded-3xl shadow-lg mt-8" />
              </div>
              <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className={"absolute -bottom-4 -left-4 " + service.lightColor + " border-2 rounded-2xl px-5 py-3 shadow-lg"}>
                <p className="text-xs text-gray-500">Duração da sessão</p>
                <p className={"font-bold " + service.textColor}>{service.duration}</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className={"py-20 bg-gradient-to-br " + service.color}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-4">Áreas de Intervenção</h2>
            <p className="text-white/80 max-w-xl mx-auto">Trabalhamos com uma vasta gama de condições, sempre com uma abordagem individualizada.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {service.areas.map((area, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4 text-white hover:bg-white/25 transition-colors">
                <CheckCircle size={18} className="flex-shrink-0 text-white/80" />
                <span className="text-sm font-medium">{area}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl text-teal-800 mb-4">Como funciona?</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Avaliação Inicial', desc: 'Começamos por uma avaliação detalhada da criança e das preocupações da família para definir as necessidades e objetivos.', icon: '🔍' },
              { step: '02', title: 'Plano Terapêutico', desc: 'Desenhamos um plano de intervenção personalizado, em conjunto com a família, ajustado às necessidades e contexto de vida.', icon: '📋' },
              { step: '03', title: 'Intervenção e Acompanhamento', desc: 'As sessões decorrem num ambiente seguro e estimulante, com envolvimento ativo da família no processo terapêutico.', icon: '⭐' },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.15 }} className="card p-8 text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className={"text-xs font-bold " + service.textColor + " mb-2"}>PASSO {item.step}</div>
                <h3 className="font-display text-xl text-teal-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-teal-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div {...fadeUp} className="space-y-6">
            <p className="text-teal-300 text-sm font-semibold uppercase tracking-wide">{service.name}</p>
            <h2 className="font-display text-3xl md:text-4xl text-white">Pronto para dar o primeiro passo?</h2>
            <p className="text-teal-200">A nossa equipa está pronta para ajudar. Entre em contacto ou marque já a sua consulta.</p>
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Link to="/marcacao" className="bg-white text-teal-700 font-semibold px-8 py-4 rounded-full hover:bg-teal-50 transition-colors shadow-lg flex items-center gap-2">
                Marcar Consulta <ArrowRight size={16} />
              </Link>
              <a href="tel:934779548" className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
                <Phone size={16} /> 934 779 548
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-sand-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h3 className="font-display text-2xl text-teal-800">Outros Serviços</h3>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(SERVICES_DATA).filter(([s]) => s !== slug).slice(0, 6).map(([s, data]) => (
              <Link key={s} to={"/servicos/" + s}
                className={"flex items-center gap-2 " + data.lightColor + " " + data.textColor + " px-5 py-3 rounded-full text-sm font-medium hover:shadow-md transition-all hover:-translate-y-0.5"}>
                {data.emoji} {data.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

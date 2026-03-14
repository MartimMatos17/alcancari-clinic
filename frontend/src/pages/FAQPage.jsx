import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const FAQS = [
  {
    category: 'Consultas e Marcações',
    items: [
      { q: 'Como posso marcar uma consulta?', a: 'Pode marcar consulta através do nosso formulário online, por telefone (934 779 548), por email (alcancari.terapias@gmail.com) ou via WhatsApp. Respondemos em menos de 24 horas.' },
      { q: 'Qual é a duração de uma consulta?', a: 'As sessões têm geralmente 45 a 50 minutos. A primeira consulta (avaliação inicial) pode ter uma duração ligeiramente superior, entre 60 a 90 minutos, para recolher toda a informação necessária.' },
      { q: 'Com que frequência devem ser as sessões?', a: 'A frequência ideal é determinada pelo terapeuta após a avaliação inicial e depende das necessidades específicas de cada criança. Na maioria dos casos, recomendamos sessões semanais para garantir a continuidade terapêutica.' },
      { q: 'Posso cancelar ou remarcar uma consulta?', a: 'Sim. Pedimos que qualquer cancelamento ou remarcação seja feito com pelo menos 24 horas de antecedência. Cancelamentos em cima da hora podem ser faturados.' },
    ]
  },
  {
    category: 'Serviços e Terapias',
    items: [
      { q: 'Como sei qual a terapia mais adequada para o meu filho?', a: 'Na primeira consulta, fazemos uma avaliação completa das necessidades da criança. Com base nessa avaliação, recomendamos os serviços mais adequados — que podem incluir uma ou mais terapias em simultâneo.' },
      { q: 'O que é a Integração Sensorial?', a: 'A Integração Sensorial é uma abordagem da Terapia Ocupacional que trabalha a forma como o sistema nervoso recebe e processa informação sensorial. É especialmente útil em crianças com hipersensibilidade, hiposensibilidade ou dificuldades de regulação emocional.' },
      { q: 'O que é o Floortime?', a: 'O Floortime (DIR/Floortime) é uma abordagem de intervenção para crianças com perturbações do desenvolvimento, nomeadamente autismo. Baseia-se em seguir a liderança da criança, descendo ao seu nível para criar momentos de interação e comunicação genuínos.' },
      { q: 'Trabalham com adultos?', a: 'A Alcançari é uma clínica especializada em pediatria. O nosso foco são crianças e adolescentes. Para casos específicos de adultos jovens em transição, consulte-nos para perceber se podemos ajudar.' },
    ]
  },
  {
    category: 'Seguros e Pagamentos',
    items: [
      { q: 'Aceitam seguros de saúde?', a: 'Sim, trabalhamos com os principais seguros de saúde e subsistemas. Recomendamos que confirme com a sua seguradora a cobertura para as especialidades pretendidas antes da consulta. Emitimos sempre recibo para efeitos de reembolso.' },
      { q: 'Quais os métodos de pagamento aceites?', a: 'Aceitamos numerário, transferência bancária e multibanco. O pagamento é efetuado no momento da consulta.' },
      { q: 'As consultas têm IVA?', a: 'Os serviços de saúde prestados por profissionais habilitados estão isentos de IVA nos termos do Código do IVA português.' },
      { q: 'Emitem recibos para o IRS?', a: 'Sim, emitimos sempre recibo que pode ser utilizado para dedução em sede de IRS como despesa de saúde.' },
    ]
  },
  {
    category: 'Sobre a Clínica',
    items: [
      { q: 'Onde estão localizadas as clínicas?', a: 'Temos duas unidades: Leça da Palmeira (Rua Francisco Sá Carneiro, 307) e São Mamede de Infesta (Avenida Conde, 5981). Ambas com estacionamento nas proximidades.' },
      { q: 'Qual o horário de funcionamento?', a: 'Segunda a Sexta: 09h00 às 20h00. Sábado: 09h00 às 14h00. Domingo e feriados: encerrado.' },
      { q: 'Os pais podem estar presentes nas sessões?', a: 'Depende da situação e da idade da criança. Em muitos casos, a presença dos pais é fundamental, especialmente nas primeiras sessões e nas orientações parentais. O terapeuta irá indicar o que é mais adequado em cada situação.' },
      { q: 'Fazem relatórios para a escola?', a: 'Sim, a nossa equipa elabora relatórios técnicos para escolas, jardins de infância e outras entidades sempre que necessário, mediante pedido e com o consentimento dos pais.' },
    ]
  }
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left hover:text-teal-700 transition-colors">
        <span className="font-semibold text-gray-800 text-sm leading-snug">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
          <ChevronDown size={18} className={open ? 'text-teal-600' : 'text-gray-400'} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="text-gray-500 text-sm leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const categories = ['Todos', ...FAQS.map(f => f.category)]
  const filtered = activeCategory === 'Todos' ? FAQS : FAQS.filter(f => f.category === activeCategory)

  return (
    <div className="bg-[#fdf9f3] min-h-screen">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal-700 to-teal-900 py-24 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="relative max-w-4xl mx-auto px-6 text-center space-y-5">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest">✦ Respostas rápidas</p>
          <h1 className="font-display text-5xl md:text-6xl text-white font-bold">
            Perguntas<br /><span className="text-teal-300 italic">frequentes</span>
          </h1>
          <p className="text-teal-200 max-w-lg mx-auto">Encontre respostas às questões mais comuns sobre os nossos serviços, marcações e funcionamento da clínica.</p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 30C360 60 720 0 1080 30C1260 45 1380 20 1440 30V60H0V30Z" fill="#fdf9f3"/></svg>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 space-y-8">

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-teal-300 hover:text-teal-700'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs */}
        {filtered.map((section, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="px-8 py-5 border-b border-gray-50 bg-teal-50/50">
              <h2 className="font-display text-lg text-teal-800">{section.category}</h2>
            </div>
            <div className="px-8">
              {section.items.map((item, j) => <FAQItem key={j} q={item.q} a={item.a} />)}
            </div>
          </motion.div>
        ))}

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-teal-800 rounded-3xl p-8 text-center space-y-5">
          <h3 className="font-display text-2xl text-white">Não encontrou a resposta?</h3>
          <p className="text-teal-200 text-sm">Fale diretamente connosco — respondemos em menos de 24 horas.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contacto"
              className="flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-full hover:bg-teal-50 transition-colors">
              <MessageCircle size={16} /> Contactar
            </Link>
            <a href="tel:934779548"
              className="flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
              <Phone size={16} /> 934 779 548
            </a>
          </div>
        </motion.div>

      </section>
    </div>
  )
}
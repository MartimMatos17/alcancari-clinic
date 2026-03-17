import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const FAQS_PT = [
  {
    category: 'Consultas e Marcações',
    items: [
      { q: 'Como posso marcar uma consulta?', a: 'Pode marcar consulta através do nosso formulário online, por telefone (934 779 548), por email (alcancari.terapias@gmail.com) ou via WhatsApp. Respondemos em menos de 24 horas.' },
      { q: 'Qual é a duração de uma consulta?', a: 'As sessões têm geralmente 45 a 50 minutos. A primeira consulta (avaliação inicial) pode ter uma duração ligeiramente superior, entre 60 a 90 minutos.' },
      { q: 'Com que frequência devem ser as sessões?', a: 'A frequência ideal é determinada pelo terapeuta após a avaliação inicial. Na maioria dos casos, recomendamos sessões semanais.' },
      { q: 'Posso cancelar ou remarcar uma consulta?', a: 'Sim. Pedimos que qualquer cancelamento ou remarcação seja feito com pelo menos 24 horas de antecedência.' },
    ]
  },
  {
    category: 'Serviços e Terapias',
    items: [
      { q: 'Como sei qual a terapia mais adequada para o meu filho?', a: 'Na primeira consulta, fazemos uma avaliação completa das necessidades da criança e recomendamos os serviços mais adequados.' },
      { q: 'O que é a Integração Sensorial?', a: 'A Integração Sensorial trabalha a forma como o sistema nervoso recebe e processa informação sensorial. É especialmente útil em crianças com hipersensibilidade ou dificuldades de regulação emocional.' },
      { q: 'O que é o Floortime?', a: 'O Floortime baseia-se em seguir a liderança da criança, descendo ao seu nível para criar momentos de interação e comunicação genuínos.' },
      { q: 'Trabalham com adultos?', a: 'A Alcançari é especializada em pediatria. O nosso foco são crianças e adolescentes.' },
    ]
  },
  {
    category: 'Seguros e Pagamentos',
    items: [
      { q: 'Aceitam seguros de saúde?', a: 'Sim, trabalhamos com os principais seguros de saúde e subsistemas. Emitimos sempre recibo para efeitos de reembolso.' },
      { q: 'Quais os métodos de pagamento aceites?', a: 'Aceitamos numerário, transferência bancária e multibanco.' },
      { q: 'As consultas têm IVA?', a: 'Os serviços de saúde prestados por profissionais habilitados estão isentos de IVA.' },
      { q: 'Emitem recibos para o IRS?', a: 'Sim, emitimos sempre recibo que pode ser utilizado para dedução em sede de IRS como despesa de saúde.' },
    ]
  },
  {
    category: 'Sobre a Clínica',
    items: [
      { q: 'Onde estão localizadas as clínicas?', a: 'Temos duas unidades: Leça da Palmeira (Rua Francisco Sá Carneiro, 307) e São Mamede de Infesta (Avenida Conde, 5981).' },
      { q: 'Qual o horário de funcionamento?', a: 'Segunda a Sexta: 09h00 às 20h00. Sábado: 09h00 às 14h00. Domingo e feriados: encerrado.' },
      { q: 'Os pais podem estar presentes nas sessões?', a: 'Depende da situação. Em muitos casos, a presença dos pais é fundamental, especialmente nas primeiras sessões.' },
      { q: 'Fazem relatórios para a escola?', a: 'Sim, elaboramos relatórios técnicos para escolas e outras entidades mediante pedido e consentimento dos pais.' },
    ]
  }
]

const FAQS_EN = [
  {
    category: 'Appointments & Bookings',
    items: [
      { q: 'How can I book an appointment?', a: 'You can book through our online form, by phone (934 779 548), email (alcancari.terapias@gmail.com) or WhatsApp. We reply within 24 hours.' },
      { q: 'How long is an appointment?', a: 'Sessions are usually 45 to 50 minutes. The initial assessment may last 60 to 90 minutes.' },
      { q: 'How often should sessions be?', a: 'The ideal frequency is determined by the therapist after the initial assessment. Weekly sessions are usually recommended.' },
      { q: 'Can I cancel or reschedule?', a: 'Yes. We ask that any cancellation or rescheduling be done at least 24 hours in advance.' },
    ]
  },
  {
    category: 'Services & Therapies',
    items: [
      { q: 'How do I know which therapy is right for my child?', a: 'At the first appointment, we carry out a full assessment and recommend the most suitable services.' },
      { q: 'What is Sensory Integration?', a: 'Sensory Integration works on how the nervous system receives and processes sensory information. It is especially helpful for children with hypersensitivity or emotional regulation difficulties.' },
      { q: 'What is Floortime?', a: 'Floortime is based on following the child\'s lead, going down to their level to create genuine moments of interaction and communication.' },
      { q: 'Do you work with adults?', a: 'Alcançari specialises in paediatrics. Our focus is children and adolescents.' },
    ]
  },
  {
    category: 'Insurance & Payments',
    items: [
      { q: 'Do you accept health insurance?', a: 'Yes, we work with the main health insurers. We always issue receipts for reimbursement purposes.' },
      { q: 'What payment methods do you accept?', a: 'We accept cash, bank transfer and card payment.' },
      { q: 'Is VAT charged on appointments?', a: 'Health services provided by qualified professionals are VAT exempt.' },
      { q: 'Do you issue receipts for tax purposes?', a: 'Yes, we always issue receipts that can be used as health expenses for tax deduction.' },
    ]
  },
  {
    category: 'About the Clinic',
    items: [
      { q: 'Where are the clinics located?', a: 'We have two locations: Leça da Palmeira (Rua Francisco Sá Carneiro, 307) and São Mamede de Infesta (Avenida Conde, 5981).' },
      { q: 'What are the opening hours?', a: 'Monday to Friday: 9am–8pm. Saturday: 9am–2pm. Closed on Sundays and public holidays.' },
      { q: 'Can parents attend sessions?', a: 'It depends on the situation. In many cases, the presence of parents is essential, especially in the first sessions.' },
      { q: 'Do you write school reports?', a: 'Yes, we produce technical reports for schools and other entities upon request and with parental consent.' },
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
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.substring(0,2) || 'pt'
  const FAQS = lang === 'en' ? FAQS_EN : FAQS_PT
  const [activeCategory, setActiveCategory] = useState('Todos')
  const categories = [lang === 'en' ? 'All' : 'Todos', ...FAQS.map(f => f.category)]
  const allLabel = lang === 'en' ? 'All' : 'Todos'
  const filtered = activeCategory === allLabel ? FAQS : FAQS.filter(f => f.category === activeCategory)

  return (
    <div className="bg-[#fdf9f3] min-h-screen">
      <section className="relative bg-gradient-to-br from-teal-700 to-teal-900 py-24 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="relative max-w-4xl mx-auto px-6 text-center space-y-5">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest">✦ {t('faq.badge')}</p>
          <h1 className="font-display text-5xl md:text-6xl text-white font-bold">
            {t('faq.title').split(' ')[0]}<br />
            <span className="text-teal-300 italic">{t('faq.title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-teal-200 max-w-lg mx-auto">{t('faq.sub')}</p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 30C360 60 720 0 1080 30C1260 45 1380 20 1440 30V60H0V30Z" fill="#fdf9f3"/></svg>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat ? 'bg-teal-700 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:border-teal-300 hover:text-teal-700'
              }`}>
              {cat}
            </button>
          ))}
        </div>

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

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-teal-800 rounded-3xl p-8 text-center space-y-5">
          <h3 className="font-display text-2xl text-white">{t('faq.not_found')}</h3>
          <p className="text-teal-200 text-sm">{t('faq.not_found_sub')}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contacto" className="flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-full hover:bg-teal-50 transition-colors">
              <MessageCircle size={16} /> {t('nav.contact')}
            </Link>
            <a href="tel:934779548" className="flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
              <Phone size={16} /> 934 779 548
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Phone, Mail, MapPin, Clock } from 'lucide-react'

const SERVICES = [
  { slug: 'fisioterapia',         name: 'Fisioterapia',         emoji: '🏃', color: '#e0f2fe', accent: '#0369a1' },
  { slug: 'psicologia',           name: 'Psicologia',           emoji: '🧠', color: '#f3e8ff', accent: '#7c3aed' },
  { slug: 'terapia-fala',         name: 'Terapia da Fala',      emoji: '🗣️', color: '#dcfce7', accent: '#16a34a' },
  { slug: 'terapia-ocupacional',  name: 'Terapia Ocupacional',  emoji: '🤲', color: '#ffedd5', accent: '#ea580c' },
  { slug: 'floortime',            name: 'Floortime',            emoji: '🎮', color: '#fce7f3', accent: '#db2777' },
  { slug: 'integracao-sensorial', name: 'Integração Sensorial', emoji: '🌀', color: '#e0e7ff', accent: '#4f46e5' },
  { slug: 'acupuntura',           name: 'Acupuntura',           emoji: '🌿', color: '#ccfbf1', accent: '#0d9488' },
  { slug: 'intervencao-grupo',    name: 'Intervenção em Grupo', emoji: '👥', color: '#fef9c3', accent: '#ca8a04' },
  { slug: 'formacao',             name: 'Formação',             emoji: '📚', color: '#f1f5f9', accent: '#475569' },
]

const UNITS = [
  { id: 'leca', name: 'Leça da Palmeira', address: 'Rua Francisco Sá Carneiro, 307', emoji: '🏖️' },
  { id: 'smi',  name: 'São Mamede de Infesta', address: 'Avenida Conde, 5981', emoji: '🌿' },
]

const TIMES = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30']

const STEPS = ['Serviço', 'Unidade', 'Data & Hora', 'Dados', 'Confirmação']

function getNextDays(n) {
  const days = []
  const today = new Date()
  for (let i = 1; i <= n; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    if (d.getDay() !== 0) days.push(d)
  }
  return days.slice(0, n)
}

const DAYS = getNextDays(14)
const DAY_NAMES = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const MONTH_NAMES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export default function AppointmentPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    service: null, unit: null, date: null, time: null,
    name: '', email: '', phone: '', age: '', notes: ''
  })
  const [done, setDone] = useState(false)

  const canNext = () => {
    if (step === 1) return !!form.service
    if (step === 2) return !!form.unit
    if (step === 3) return !!form.date && !!form.time
    if (step === 4) return form.name && form.email && form.phone
    return true
  }

  const next = () => { if (canNext()) setStep(s => Math.min(s + 1, 5)) }
  const back = () => setStep(s => Math.max(s - 1, 1))
  const submit = () => setDone(true)

  const selectedService = SERVICES.find(s => s.slug === form.service)
  const selectedUnit = UNITS.find(u => u.id === form.unit)

  if (done) return (
    <div className="min-h-screen bg-[#fdf9f3] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-xl border border-gray-100">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={36} className="text-teal-600" />
        </motion.div>
        <h2 className="font-display text-3xl text-teal-800 font-bold mb-3">Pedido enviado!</h2>
        <p className="text-gray-500 mb-2">Entraremos em contacto em breve para confirmar a sua consulta.</p>
        <div className="bg-teal-50 rounded-2xl p-4 my-6 text-left space-y-2">
          <p className="text-sm text-teal-700"><strong>Serviço:</strong> {selectedService?.name}</p>
          <p className="text-sm text-teal-700"><strong>Unidade:</strong> {selectedUnit?.name}</p>
          <p className="text-sm text-teal-700"><strong>Data:</strong> {form.date && new Date(form.date).toLocaleDateString('pt-PT')} às {form.time}</p>
          <p className="text-sm text-teal-700"><strong>Nome:</strong> {form.name}</p>
        </div>
        <div className="space-y-3">
          <a href="tel:934779548" className="flex items-center justify-center gap-2 bg-teal-700 text-white font-semibold py-3 px-6 rounded-full w-full hover:bg-teal-800 transition-colors">
            <Phone size={16} /> Ligar para confirmar
          </a>
          <button onClick={() => { setDone(false); setStep(1); setForm({ service: null, unit: null, date: null, time: null, name: '', email: '', phone: '', age: '', notes: '' }) }}
            className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
            Fazer nova marcação
          </button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fdf9f3]">

      {/* Header */}
      <div className="bg-teal-800 py-12 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <p className="text-teal-300 text-xs font-semibold uppercase tracking-widest mb-2">Agende já</p>
          <h1 className="font-display text-4xl md:text-5xl text-white font-bold">Marcar Consulta</h1>
          <p className="text-teal-200 mt-2 text-sm">Rápido, simples e sem esperas</p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 30" fill="none"><path d="M0 15C360 30 720 0 1080 15C1260 22 1380 8 1440 15V30H0V15Z" fill="#fdf9f3"/></svg>
        </div>
      </div>

      {/* Progress bar */}
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((label, i) => {
            const n = i + 1
            const active = n === step
            const done = n < step
            return (
              <div key={n} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    done ? 'bg-teal-600 text-white' : active ? 'bg-teal-700 text-white ring-4 ring-teal-200' : 'bg-white text-gray-300 border-2 border-gray-200'
                  }`}>
                    {done ? <Check size={16} /> : n}
                  </div>
                  <p className={`text-xs mt-1.5 font-medium hidden sm:block transition-colors ${active ? 'text-teal-700' : done ? 'text-teal-500' : 'text-gray-300'}`}>{label}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-colors duration-500 ${n < step ? 'bg-teal-500' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          >

            {/* STEP 1 — Serviço */}
            {step === 1 && (
              <div className="p-8">
                <h2 className="font-display text-2xl text-teal-800 font-bold mb-2">Qual o serviço?</h2>
                <p className="text-gray-400 text-sm mb-7">Selecione a especialidade que pretende</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SERVICES.map(s => (
                    <button key={s.slug} onClick={() => setForm(f => ({ ...f, service: s.slug }))}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:-translate-y-0.5 ${
                        form.service === s.slug ? 'border-teal-500 shadow-md' : 'border-transparent hover:border-gray-200'
                      }`}
                      style={{ backgroundColor: form.service === s.slug ? s.color : '#f9fafb' }}>
                      <span className="text-2xl">{s.emoji}</span>
                      <span className="text-xs font-semibold text-center leading-snug" style={{ color: form.service === s.slug ? s.accent : '#6b7280' }}>{s.name}</span>
                      {form.service === s.slug && <Check size={14} style={{ color: s.accent }} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 — Unidade */}
            {step === 2 && (
              <div className="p-8">
                <h2 className="font-display text-2xl text-teal-800 font-bold mb-2">Qual a unidade?</h2>
                <p className="text-gray-400 text-sm mb-7">Escolha a clínica mais próxima de si</p>
                <div className="space-y-4">
                  {UNITS.map(u => (
                    <button key={u.id} onClick={() => setForm(f => ({ ...f, unit: u.id }))}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                        form.unit === u.id ? 'border-teal-500 bg-teal-50' : 'border-gray-100 hover:border-teal-200 bg-gray-50'
                      }`}>
                      <span className="text-3xl">{u.emoji}</span>
                      <div className="flex-1">
                        <p className={`font-semibold ${form.unit === u.id ? 'text-teal-700' : 'text-gray-700'}`}>{u.name}</p>
                        <p className="text-gray-400 text-sm flex items-center gap-1 mt-0.5">
                          <MapPin size={12} /> {u.address}
                        </p>
                        <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                          <Clock size={12} /> Seg–Sex: 09h–20h · Sáb: 09h–14h
                        </p>
                      </div>
                      {form.unit === u.id && <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0"><Check size={12} className="text-white" /></div>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 — Data & Hora */}
            {step === 3 && (
              <div className="p-8">
                <h2 className="font-display text-2xl text-teal-800 font-bold mb-2">Quando prefere?</h2>
                <p className="text-gray-400 text-sm mb-6">Escolha a data e horário disponível</p>

                {/* Dias */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Data</p>
                <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
                  {DAYS.map(d => {
                    const iso = d.toISOString().split('T')[0]
                    const sel = form.date === iso
                    return (
                      <button key={iso} onClick={() => setForm(f => ({ ...f, date: iso }))}
                        className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl border-2 transition-all min-w-[64px] ${
                          sel ? 'border-teal-500 bg-teal-50' : 'border-gray-100 hover:border-teal-200'
                        }`}>
                        <span className={`text-xs font-semibold ${sel ? 'text-teal-500' : 'text-gray-400'}`}>{DAY_NAMES[d.getDay()]}</span>
                        <span className={`font-display text-xl font-bold ${sel ? 'text-teal-700' : 'text-gray-700'}`}>{d.getDate()}</span>
                        <span className={`text-xs ${sel ? 'text-teal-400' : 'text-gray-300'}`}>{MONTH_NAMES[d.getMonth()]}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Horas */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Horário</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {TIMES.map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, time: t }))}
                      className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        form.time === t ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-100 text-gray-500 hover:border-teal-200'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4 — Dados */}
            {step === 4 && (
              <div className="p-8">
                <h2 className="font-display text-2xl text-teal-800 font-bold mb-2">Os seus dados</h2>
                <p className="text-gray-400 text-sm mb-7">Precisamos de alguns dados para confirmar</p>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Nome completo *</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="O seu nome"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Telefone *</label>
                      <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="9XX XXX XXX"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="o.seu@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Idade da criança</label>
                    <input value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="Ex: 5 anos"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Observações</label>
                    <textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Descreva brevemente a situação ou o motivo da consulta..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all resize-none" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5 — Confirmação */}
            {step === 5 && (
              <div className="p-8">
                <h2 className="font-display text-2xl text-teal-800 font-bold mb-2">Confirmar marcação</h2>
                <p className="text-gray-400 text-sm mb-7">Verifique os detalhes antes de enviar</p>
                <div className="space-y-3">
                  {[
                    { label: 'Serviço', value: `${selectedService?.emoji} ${selectedService?.name}` },
                    { label: 'Unidade', value: `${selectedUnit?.emoji} ${selectedUnit?.name}` },
                    { label: 'Data', value: form.date ? new Date(form.date + 'T12:00:00').toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' }) : '-' },
                    { label: 'Hora', value: form.time },
                    { label: 'Nome', value: form.name },
                    { label: 'Email', value: form.email },
                    { label: 'Telefone', value: form.phone },
                    form.age && { label: 'Idade', value: form.age },
                    form.notes && { label: 'Notas', value: form.notes },
                  ].filter(Boolean).map((item, i) => (
                    <div key={i} className={`flex justify-between items-start py-3 ${i < 6 ? 'border-b border-gray-100' : ''}`}>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-24 flex-shrink-0">{item.label}</span>
                      <span className="text-sm text-gray-700 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-teal-50 rounded-2xl border border-teal-100">
                  <p className="text-teal-700 text-xs leading-relaxed">
                    📞 Após o envio, a nossa equipa entrará em contacto para confirmar a disponibilidade do horário pretendido.
                  </p>
                </div>
              </div>
            )}

            {/* Navegação */}
            <div className="px-8 pb-8 flex items-center justify-between gap-4">
              {step > 1 ? (
                <button onClick={back} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors">
                  <ArrowLeft size={16} /> Anterior
                </button>
              ) : <div />}

              {step < 5 ? (
                <button onClick={next} disabled={!canNext()}
                  className={`flex items-center gap-2 font-semibold px-8 py-3 rounded-full text-sm transition-all ${
                    canNext() ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-lg hover:-translate-y-0.5' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}>
                  Continuar <ArrowRight size={16} />
                </button>
              ) : (
                <button onClick={submit}
                  className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold px-8 py-3 rounded-full text-sm transition-all shadow-lg hover:-translate-y-0.5">
                  <Check size={16} /> Enviar pedido
                </button>
              )}
            </div>

          </motion.div>
        </AnimatePresence>

        {/* Contacto alternativo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-6 text-center">
          <p className="text-gray-400 text-sm">Prefere ligar diretamente?</p>
          <a href="tel:934779548" className="inline-flex items-center gap-2 text-teal-700 font-semibold text-sm mt-1 hover:text-teal-800">
            <Phone size={14} /> 934 779 548
          </a>
        </motion.div>
      </div>
    </div>
  )
}

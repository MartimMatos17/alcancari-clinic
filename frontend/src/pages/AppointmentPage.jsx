import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Phone, MapPin, Calendar, Clock, User } from 'lucide-react'
import { publicApi } from '../lib/api'

const SERVICES = [
  { slug: 'Fisioterapia',         name: 'Fisioterapia',         emoji: '🏃', color: '#e0f2fe', accent: '#0369a1', specialty: 'Fisioterapia' },
  { slug: 'Psicologia',           name: 'Psicologia',           emoji: '🧠', color: '#f3e8ff', accent: '#7c3aed', specialty: 'Psicologia' },
  { slug: 'Terapia da Fala',      name: 'Terapia da Fala',      emoji: '🗣️', color: '#dcfce7', accent: '#16a34a', specialty: 'Terapia da Fala' },
  { slug: 'Terapia Ocupacional',  name: 'Terapia Ocupacional',  emoji: '🤲', color: '#ffedd5', accent: '#ea580c', specialty: 'Terapia Ocupacional' },
  { slug: 'Floortime',            name: 'Floortime',            emoji: '🎮', color: '#fce7f3', accent: '#db2777', specialty: 'Terapia Ocupacional' },
  { slug: 'Integração Sensorial', name: 'Integração Sensorial', emoji: '🌀', color: '#e0e7ff', accent: '#4f46e5', specialty: 'Terapia Ocupacional' },
  { slug: 'Acupuntura',           name: 'Acupuntura',           emoji: '🌿', color: '#ccfbf1', accent: '#0d9488', specialty: null },
  { slug: 'Intervenção em Grupo', name: 'Intervenção em Grupo', emoji: '👥', color: '#fef9c3', accent: '#ca8a04', specialty: null },
  { slug: 'Formação',             name: 'Formação',             emoji: '📚', color: '#f1f5f9', accent: '#475569', specialty: null },
]

const UNITS = [
  { id: 'leça_palmeira', name: 'Leça da Palmeira',     address: 'Rua Francisco Sá Carneiro, 307', emoji: '🏖️' },
  { id: 'são_mamede',    name: 'São Mamede de Infesta', address: 'Avenida Conde, 5981',            emoji: '🌿' },
]

const ALL_TIMES = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30']
const STEPS = ['Serviço', 'Unidade', 'Terapeuta', 'Data & Hora', 'Dados', 'Confirmação']
const DAY_NAMES = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const MONTH_NAMES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

function getNextDays(n) {
  const days = []
  const today = new Date()
  for (let i = 1; i <= n + 10; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    if (d.getDay() !== 0) days.push(d)
    if (days.length === n) break
  }
  return days
}

const DAYS = getNextDays(16)

export default function AppointmentPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    service: null, unit: null, therapist: null,
    date: null, time: null,
    name: '', email: '', phone: '', age: '', notes: ''
  })
  const [therapists, setTherapists] = useState([])
  const [occupied, setOccupied] = useState([])
  const [loadingTherapists, setLoadingTherapists] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const selectedService = SERVICES.find(s => s.slug === form.service)
  const selectedUnit = UNITS.find(u => u.id === form.unit)
  const selectedTherapist = therapists.find(t => t.id === form.therapist)

  // Carregar terapeutas no step 3
  useEffect(() => {
    if (step !== 3) return
    setLoadingTherapists(true)
    publicApi.get('/therapists').then(res => {
      const specialty = selectedService?.specialty
      const filtered = specialty ? res.data.filter(t => t.specialty === specialty) : res.data
      setTherapists(filtered)
    }).catch(console.error).finally(() => setLoadingTherapists(false))
  }, [step])

  // Carregar disponibilidade quando data ou terapeuta mudam
  useEffect(() => {
    if (!form.date || !form.therapist || form.therapist === 'any') {
      setOccupied([])
      return
    }
    setLoadingSlots(true)
    setForm(f => ({ ...f, time: null }))
    publicApi.get('/appointments/availability', {
      params: { date: form.date, therapist_id: form.therapist }
    }).then(res => setOccupied(res.data.occupied || []))
    .catch(console.error)
    .finally(() => setLoadingSlots(false))
  }, [form.date, form.therapist])

  const canNext = () => {
    if (step === 1) return !!form.service
    if (step === 2) return !!form.unit
    if (step === 3) return !!form.therapist
    if (step === 4) return !!form.date && !!form.time
    if (step === 5) return !!(form.name && form.email && form.phone)
    return true
  }

  const next = () => { if (canNext()) setStep(s => s + 1) }
  const back = () => setStep(s => s - 1)

  const submit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const notesText = [
        form.notes,
        form.therapist !== 'any' && selectedTherapist ? `Terapeuta pretendida: ${selectedTherapist.full_name}` : 'Sem preferência de terapeuta'
      ].filter(Boolean).join('\n')

      await publicApi.post('/appointment-requests', {
        name: form.name, email: form.email, phone: form.phone,
        service: form.service, unit: form.unit,
        preferred_date: form.date, preferred_time: form.time,
        age: form.age, notes: notesText,
      })
      setDone(true)
    } catch {
      setError('Erro ao enviar. Por favor tente novamente ou contacte-nos por telefone.')
    }
    setSubmitting(false)
  }

  const reset = () => {
    setDone(false); setStep(1)
    setForm({ service: null, unit: null, therapist: null, date: null, time: null, name: '', email: '', phone: '', age: '', notes: '' })
  }

  if (done) return (
    <div className="min-h-screen bg-[#fdf9f3] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-xl border border-gray-100">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={36} className="text-teal-600" />
        </motion.div>
        <h2 className="font-display text-3xl text-teal-800 font-bold mb-3">Pedido enviado!</h2>
        <p className="text-gray-500 mb-2">Entraremos em contacto em breve para confirmar a sua consulta.</p>
        <div className="bg-teal-50 rounded-2xl p-5 my-6 text-left space-y-2">
          <p className="text-sm text-teal-700"><strong>Serviço:</strong> {selectedService?.name}</p>
          <p className="text-sm text-teal-700"><strong>Unidade:</strong> {selectedUnit?.name}</p>
          <p className="text-sm text-teal-700"><strong>Terapeuta:</strong> {form.therapist === 'any' ? 'Sem preferência' : selectedTherapist?.full_name}</p>
          <p className="text-sm text-teal-700"><strong>Data:</strong> {form.date && new Date(form.date + 'T12:00:00').toLocaleDateString('pt-PT')} às {form.time}</p>
          <p className="text-sm text-teal-700"><strong>Nome:</strong> {form.name}</p>
        </div>
        <div className="space-y-3">
          <a href="tel:934779548" className="flex items-center justify-center gap-2 bg-teal-700 text-white font-semibold py-3 px-6 rounded-full w-full hover:bg-teal-800 transition-colors">
            <Phone size={16} /> 934 779 548
          </a>
          <button onClick={reset} className="text-teal-600 text-sm font-medium hover:underline">Fazer novo pedido</button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fdf9f3]">
      <section className="relative bg-gradient-to-br from-teal-700 to-teal-900 py-20 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative max-w-3xl mx-auto px-6 text-center space-y-4">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest">✦ Primeiro passo</p>
          <h1 className="font-display text-5xl md:text-6xl text-white font-bold">Marcar<br /><span className="text-teal-300 italic">consulta</span></h1>
          <p className="text-teal-200 max-w-md mx-auto">Preencha o formulário e entraremos em contacto para confirmar a sua marcação.</p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 30C360 60 720 0 1080 30C1260 45 1380 20 1440 30V60H0V30Z" fill="#fdf9f3"/></svg>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > i + 1 ? 'bg-teal-600 text-white' :
                  step === i + 1 ? 'bg-teal-700 text-white shadow-lg shadow-teal-200' :
                  'bg-white text-gray-300 border-2 border-gray-200'
                }`}>
                  {step > i + 1 ? <Check size={16} /> : i + 1}
                </div>
                <p className={`text-xs mt-1.5 font-medium hidden sm:block ${step === i + 1 ? 'text-teal-700' : 'text-gray-400'}`}>{s}</p>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 transition-all ${step > i + 1 ? 'bg-teal-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[420px] flex flex-col">

            {/* STEP 1 — Serviço */}
            {step === 1 && (
              <div className="flex-1">
                <h2 className="font-display text-2xl text-teal-800 mb-2">Qual o serviço?</h2>
                <p className="text-gray-400 text-sm mb-6">Selecione o tipo de terapia pretendida</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {SERVICES.map(s => (
                    <button key={s.slug} onClick={() => setForm(f => ({ ...f, service: s.slug, therapist: null }))}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md ${form.service === s.slug ? 'border-teal-500 shadow-md' : 'border-gray-100'}`}
                      style={{ background: form.service === s.slug ? s.color : 'white' }}>
                      <span className="text-2xl">{s.emoji}</span>
                      <span className="font-medium text-sm text-gray-700 flex-1">{s.name}</span>
                      {form.service === s.slug && <Check size={14} style={{ color: s.accent }} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 — Unidade */}
            {step === 2 && (
              <div className="flex-1">
                <h2 className="font-display text-2xl text-teal-800 mb-2">Qual a unidade?</h2>
                <p className="text-gray-400 text-sm mb-6">Escolha a clínica mais próxima</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {UNITS.map(u => (
                    <button key={u.id} onClick={() => setForm(f => ({ ...f, unit: u.id, therapist: null }))}
                      className={`p-6 rounded-2xl border-2 text-left transition-all hover:shadow-md ${form.unit === u.id ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-gray-100'}`}>
                      <span className="text-4xl block mb-3">{u.emoji}</span>
                      <p className="font-semibold text-teal-800">{u.name}</p>
                      <p className="text-gray-400 text-sm mt-1 flex items-center gap-1"><MapPin size={12} />{u.address}</p>
                      {form.unit === u.id && <p className="mt-3 text-teal-600 text-xs font-semibold flex items-center gap-1"><Check size={12} />Selecionada</p>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 — Terapeuta */}
            {step === 3 && (
              <div className="flex-1">
                <h2 className="font-display text-2xl text-teal-800 mb-2">Escolher terapeuta</h2>
                <p className="text-gray-400 text-sm mb-6">Terapeutas disponíveis para <strong>{selectedService?.name}</strong></p>
                {loadingTherapists ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button onClick={() => setForm(f => ({ ...f, therapist: 'any' }))}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${form.therapist === 'any' ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}>
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700 text-sm">Sem preferência</p>
                        <p className="text-gray-400 text-xs mt-0.5">A clínica escolhe</p>
                      </div>
                      {form.therapist === 'any' && <Check size={14} className="ml-auto text-teal-600" />}
                    </button>
                    {therapists.map(t => {
                      const initials = t.full_name.split(' ').slice(0,2).map(n => n[0]).join('')
                      return (
                        <button key={t.id} onClick={() => setForm(f => ({ ...f, therapist: t.id }))}
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${form.therapist === t.id ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}>
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">{initials}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-700 text-sm truncate">{t.full_name}</p>
                            <p className="text-gray-400 text-xs mt-0.5">{t.specialty}</p>
                          </div>
                          {form.therapist === t.id && <Check size={14} className="ml-auto text-teal-600 flex-shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP 4 — Data & Hora */}
            {step === 4 && (
              <div className="flex-1">
                <h2 className="font-display text-2xl text-teal-800 mb-2">Data e hora</h2>
                <p className="text-gray-400 text-sm mb-6">Escolha a data e horário preferencial</p>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 flex items-center gap-2"><Calendar size={13} />Data</p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {DAYS.map((d, i) => {
                        const dateStr = d.toISOString().split('T')[0]
                        return (
                          <button key={i} onClick={() => setForm(f => ({ ...f, date: dateStr }))}
                            className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl border-2 w-16 transition-all ${form.date === dateStr ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-gray-100 hover:border-teal-200'}`}>
                            <span className="text-xs text-gray-400">{DAY_NAMES[d.getDay()]}</span>
                            <span className="font-bold text-teal-800 text-lg leading-tight">{d.getDate()}</span>
                            <span className="text-xs text-gray-400">{MONTH_NAMES[d.getMonth()]}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 flex items-center gap-2">
                      <Clock size={13} />Hora
                      {loadingSlots && <span className="text-teal-400 font-normal normal-case">A verificar disponibilidade...</span>}
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {ALL_TIMES.map(t => {
                        const isOccupied = occupied.includes(t)
                        return (
                          <button key={t} onClick={() => !isOccupied && setForm(f => ({ ...f, time: t }))}
                            disabled={isOccupied || loadingSlots}
                            className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                              isOccupied ? 'border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed line-through' :
                              form.time === t ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-md' :
                              'border-gray-100 text-gray-600 hover:border-teal-200'
                            }`}>{t}
                          </button>
                        )
                      })}
                    </div>
                    {form.therapist !== 'any' && occupied.length > 0 && (
                      <p className="text-xs text-gray-400 mt-2">🔒 Horas riscadas já estão ocupadas para esta terapeuta</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5 — Dados */}
            {step === 5 && (
              <div className="flex-1">
                <h2 className="font-display text-2xl text-teal-800 mb-2">Os seus dados</h2>
                <p className="text-gray-400 text-sm mb-6">Informações para confirmarmos a marcação</p>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Nome completo *</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome do responsável"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Idade da criança</label>
                      <input value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="Ex: 5 anos"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="o.seu@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Telefone *</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="9XX XXX XXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Observações</label>
                    <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
                      placeholder="Descreva brevemente o motivo da consulta..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6 — Confirmação */}
            {step === 6 && (
              <div className="flex-1">
                <h2 className="font-display text-2xl text-teal-800 mb-2">Confirmar pedido</h2>
                <p className="text-gray-400 text-sm mb-6">Verifique os dados antes de enviar</p>
                <div className="bg-teal-50 rounded-2xl p-6 space-y-3 mb-6">
                  {[
                    { label: 'Serviço',    value: selectedService?.name },
                    { label: 'Unidade',    value: selectedUnit?.name },
                    { label: 'Terapeuta',  value: form.therapist === 'any' ? 'Sem preferência' : selectedTherapist?.full_name },
                    { label: 'Data',       value: form.date ? new Date(form.date + 'T12:00:00').toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' }) : '' },
                    { label: 'Hora',       value: form.time },
                    { label: 'Nome',       value: form.name },
                    { label: 'Telefone',   value: form.phone },
                    { label: 'Email',      value: form.email },
                    form.age   && { label: 'Idade',        value: form.age },
                    form.notes && { label: 'Observações',  value: form.notes },
                  ].filter(Boolean).map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-teal-500 text-sm font-semibold w-28 flex-shrink-0">{item.label}</span>
                      <span className="text-teal-800 text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
                {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
                <p className="text-gray-400 text-xs">
                  Ao submeter, concorda com a nossa <a href="/privacidade" className="text-teal-600 underline">Política de Privacidade</a>.
                </p>
              </div>
            )}

            {/* Navegação */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-50">
              <button onClick={back} disabled={step === 1}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 font-medium text-sm">
                <ArrowLeft size={16} />Anterior
              </button>
              {step < 6 ? (
                <button onClick={next} disabled={!canNext()}
                  className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white font-semibold px-8 py-3 rounded-full text-sm">
                  Seguinte <ArrowRight size={16} />
                </button>
              ) : (
                <button onClick={submit} disabled={submitting}
                  className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-70 text-white font-semibold px-8 py-3 rounded-full text-sm">
                  {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />A enviar...</> : <><Check size={16} />Enviar pedido</>}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CheckCircle, Calendar, User, Stethoscope } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'

const STEPS = ['Serviço', 'Terapeuta', 'Data & Hora', 'Dados', 'Confirmação']

export default function AppointmentPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    service_id: '', therapist_id: '', date: '', time: '',
    name: '', email: '', phone: '', notes: '', unit: 'leça_palmeira'
  })
  const [done, setDone] = useState(false)

  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: () => api.get('/services').then(r => r.data) })
  const { data: therapists = [] } = useQuery({ queryKey: ['therapists'], queryFn: () => api.get('/therapists').then(r => r.data) })

  const bookMutation = useMutation({
    mutationFn: data => api.post('/appointments', data),
    onSuccess: () => { setDone(true) },
    onError: () => toast.error('Erro ao criar marcação. Tente novamente.')
  })

  const selectedService = services.find(s => s.id === form.service_id)
  const selectedTherapist = therapists.find(t => t.id === form.therapist_id)

  const handleBook = () => {
    const start = new Date(`${form.date}T${form.time}`)
    const end = new Date(start.getTime() + (selectedService?.duration_minutes || 50) * 60000)
    bookMutation.mutate({
      patient_id: null, // will be created on backend or linked
      therapist_id: form.therapist_id,
      service_id: form.service_id,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      notes: `${form.name} | ${form.email} | ${form.phone}\n${form.notes}`,
      unit: form.unit,
      status: 'pending'
    })
  }

  if (done) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="font-display text-3xl text-teal-800 mb-4">Marcação Recebida!</h2>
          <p className="text-gray-600 mb-8">
            Entraremos em contacto brevemente para confirmar a sua marcação. Obrigado pela confiança na Alcançari!
          </p>
          <a href="/" className="btn-primary">Voltar ao Início</a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="py-16 px-4 min-h-screen bg-sand-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl text-teal-800 mb-3">Marcar Consulta</h1>
          <p className="text-gray-500">Escolha o serviço, terapeuta e horário que preferir</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                ${i < step ? 'bg-teal-600 text-white' : i === step ? 'bg-teal-600 text-white ring-4 ring-teal-100' : 'bg-sand-200 text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-teal-600' : 'bg-sand-200'}`} />}
            </div>
          ))}
        </div>

        <div className="card p-8">
          {/* Step 0 - Service */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl text-teal-800 mb-6">Escolha o serviço</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {services.map(s => (
                  <button key={s.id} onClick={() => { setForm(f => ({ ...f, service_id: s.id })) }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${form.service_id === s.id ? 'border-teal-500 bg-teal-50' : 'border-sand-200 hover:border-teal-300'}`}>
                    <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.duration_minutes} min</p>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={() => setStep(1)} disabled={!form.service_id} className="btn-primary disabled:opacity-40">Continuar →</button>
              </div>
            </div>
          )}

          {/* Step 1 - Therapist */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl text-teal-800 mb-6">Escolha o terapeuta</h2>
              <div className="space-y-3">
                {therapists.map(t => (
                  <button key={t.id} onClick={() => setForm(f => ({ ...f, therapist_id: t.id }))}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${form.therapist_id === t.id ? 'border-teal-500 bg-teal-50' : 'border-sand-200 hover:border-teal-300'}`}>
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700 font-bold">
                      {t.full_name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{t.full_name}</p>
                      <p className="text-sm text-gray-500">{t.specialty}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <button onClick={() => setStep(0)} className="btn-outline">← Voltar</button>
                <button onClick={() => setStep(2)} disabled={!form.therapist_id} className="btn-primary disabled:opacity-40">Continuar →</button>
              </div>
            </div>
          )}

          {/* Step 2 - Date & Unit */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl text-teal-800 mb-6">Data, hora e unidade</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Data</label>
                  <input type="date" value={form.date} min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Hora</label>
                  <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Unidade</label>
                <div className="grid grid-cols-2 gap-3">
                  {[['leça_palmeira', '📍 Leça da Palmeira'], ['são_mamede', '📍 São Mamede de Infesta']].map(([val, label]) => (
                    <button key={val} onClick={() => setForm(f => ({ ...f, unit: val }))}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${form.unit === val ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-sand-200 text-gray-600 hover:border-teal-300'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button onClick={() => setStep(1)} className="btn-outline">← Voltar</button>
                <button onClick={() => setStep(3)} disabled={!form.date || !form.time} className="btn-primary disabled:opacity-40">Continuar →</button>
              </div>
            </div>
          )}

          {/* Step 3 - Personal data */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl text-teal-800 mb-6">Os seus dados</h2>
              {[
                { key: 'name', label: 'Nome completo *', type: 'text', placeholder: 'Nome e apelido' },
                { key: 'email', label: 'Email *', type: 'email', placeholder: 'email@exemplo.com' },
                { key: 'phone', label: 'Telefone *', type: 'tel', placeholder: '9XX XXX XXX' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Observações</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={3} placeholder="Informação adicional relevante..."
                  className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
              </div>
              <div className="flex justify-between mt-4">
                <button onClick={() => setStep(2)} className="btn-outline">← Voltar</button>
                <button onClick={() => setStep(4)} disabled={!form.name || !form.email || !form.phone} className="btn-primary disabled:opacity-40">Continuar →</button>
              </div>
            </div>
          )}

          {/* Step 4 - Confirm */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl text-teal-800 mb-6">Confirmar Marcação</h2>
              <div className="bg-teal-50 rounded-2xl p-5 space-y-3 text-sm">
                {[
                  [Stethoscope, 'Serviço', selectedService?.name],
                  [User, 'Terapeuta', selectedTherapist?.full_name],
                  [Calendar, 'Data & Hora', form.date && form.time ? `${form.date} às ${form.time}` : '—'],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Icon size={14} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="font-medium text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center">
                A sua marcação ficará pendente até confirmação pela nossa equipa.
              </p>
              <div className="flex justify-between">
                <button onClick={() => setStep(3)} className="btn-outline">← Voltar</button>
                <button onClick={handleBook} disabled={bookMutation.isPending} className="btn-primary">
                  {bookMutation.isPending ? 'A enviar...' : '✓ Confirmar Marcação'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

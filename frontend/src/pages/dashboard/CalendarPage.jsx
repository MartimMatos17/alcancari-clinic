import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, X, Clock, User, MapPin, CheckCircle, Save } from 'lucide-react'
import api from '../../lib/api'

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DAY_NAMES = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

const SERVICE_COLORS = {
  'Terapia Ocupacional':  'bg-orange-100 text-orange-700 border-orange-200',
  'Terapia da Fala':      'bg-green-100 text-green-700 border-green-200',
  'Psicologia':           'bg-purple-100 text-purple-700 border-purple-200',
  'Fisioterapia':         'bg-blue-100 text-blue-700 border-blue-200',
  'Floortime':            'bg-pink-100 text-pink-700 border-pink-200',
  'Integração Sensorial': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Acupuntura':           'bg-rose-100 text-rose-700 border-rose-200',
}
const DEFAULT_COLOR = 'bg-teal-100 text-teal-700 border-teal-200'

const TIME_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00']
const DURATIONS = [{ label: '30 min', value: 30 }, { label: '45 min', value: 45 }, { label: '60 min', value: 60 }, { label: '90 min', value: 90 }]

export default function CalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0])
  const [monthAppts, setMonthAppts] = useState([])
  const [dayAppts, setDayAppts] = useState([])
  const [selectedAppt, setSelectedAppt] = useState(null)
  const [loadingMonth, setLoadingMonth] = useState(true)
  const [loadingDay, setLoadingDay] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [patients, setPatients] = useState([])
  const [therapists, setTherapists] = useState([])
  const [services, setServices] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    patient_id: '', therapist_id: '', service_id: '',
    date: '', time: '', duration: 45, unit: 'leça_palmeira', notes: ''
  })

  useEffect(() => { loadMonth() }, [year, month])
  useEffect(() => { loadDay() }, [selectedDate])

  const loadMonth = async () => {
    setLoadingMonth(true)
    try {
      const res = await api.get('/calendar', { params: { year, month } })
      setMonthAppts(res.data.appointments || [])
    } catch (err) { console.error(err) }
    setLoadingMonth(false)
  }

  const loadDay = async () => {
    setLoadingDay(true)
    try {
      const res = await api.get('/calendar/day', { params: { date: selectedDate } })
      setDayAppts(res.data)
    } catch (err) { console.error(err) }
    setLoadingDay(false)
  }

  const openModal = async () => {
    setForm({ patient_id: '', therapist_id: '', service_id: '', date: selectedDate, time: '09:00', duration: 45, unit: 'leça_palmeira', notes: '' })
    setSaved(false)
    setShowModal(true)
    try {
      const [pRes, uRes, sRes] = await Promise.all([
        api.get('/patients'),
        api.get('/users'),
        api.get('/services'),
      ])
      setPatients(pRes.data)
      setTherapists(uRes.data?.filter(u => u.role === 'therapist' || u.role === 'admin') || uRes.data || [])
      setServices(sRes.data)
    } catch (err) { console.error(err) }
  }

  const saveAppointment = async () => {
    if (!form.patient_id || !form.date || !form.time) return
    setSaving(true)
    try {
      const start = new Date(`${form.date}T${form.time}:00`)
      const end = new Date(start.getTime() + form.duration * 60000)
      await api.post('/appointments', {
        patient_id: form.patient_id,
        therapist_id: form.therapist_id || null,
        service_id: form.service_id || null,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        unit: form.unit,
        notes: form.notes,
      })
      setSaved(true)
      loadMonth()
      loadDay()
      setTimeout(() => { setShowModal(false); setSaved(false) }, 1200)
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(y => y-1) } else setMonth(m => m-1) }
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(y => y+1) } else setMonth(m => m+1) }

  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDay = new Date(year, month-1, 1).getDay()
  const days = Array.from({ length: firstDay }, () => null).concat(Array.from({ length: daysInMonth }, (_, i) => i+1))
  const todayStr = today.toISOString().split('T')[0]

  const getApptsByDay = (day) => {
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return monthAppts.filter(a => a.start_time?.startsWith(dateStr))
  }

  const formatTime = (ts) => new Date(ts).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
  const formatDateStr = (day) => `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  const selectedDateFormatted = new Date(selectedDate + 'T12:00').toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-teal-900 font-bold">Calendário</h1>
          <p className="text-gray-400 text-sm mt-0.5">{dayAppts.length} consultas em {selectedDateFormatted}</p>
        </div>
        <button onClick={openModal}
          className="flex items-center gap-2 bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-teal-800 transition-colors shadow-md">
          <Plus size={15} /> Nova Consulta
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ChevronLeft size={18} /></button>
            <h2 className="font-display font-bold text-teal-900 text-lg">{MONTH_NAMES[month-1]} {year}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ChevronRight size={18} /></button>
          </div>
          <div className="grid grid-cols-7 border-b border-gray-50">
            {DAY_NAMES.map(d => (
              <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              if (!day) return <div key={i} className="h-24 border-b border-r border-gray-50" />
              const dateStr = formatDateStr(day)
              const appts = getApptsByDay(day)
              const isToday = dateStr === todayStr
              const isSelected = dateStr === selectedDate
              return (
                <div key={i} onClick={() => setSelectedDate(dateStr)}
                  className={`h-24 border-b border-r border-gray-50 p-1.5 cursor-pointer hover:bg-teal-50/50 transition-colors ${isSelected ? 'bg-teal-50' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold mb-1 ${isToday ? 'bg-teal-700 text-white' : isSelected ? 'bg-teal-100 text-teal-700' : 'text-gray-600'}`}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {appts.slice(0,2).map((a, j) => {
                      const color = SERVICE_COLORS[a.service_name] || DEFAULT_COLOR
                      return (
                        <div key={j} className={`text-[10px] px-1.5 py-0.5 rounded-md truncate border ${color}`}>
                          {formatTime(a.start_time)} {a.patient_name?.split(' ')[0]}
                        </div>
                      )
                    })}
                    {appts.length > 2 && <div className="text-xs text-gray-400 pl-1">+{appts.length-2}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Painel do dia */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800 text-sm capitalize">{selectedDateFormatted}</h3>
            <p className="text-gray-400 text-xs mt-0.5">{dayAppts.length} consultas</p>
          </div>
          <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
            {loadingDay ? (
              [1,2].map(i => <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />)
            ) : dayAppts.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p className="text-3xl mb-2">📅</p>
                <p className="text-sm">Sem consultas neste dia</p>
                <button onClick={openModal} className="mt-3 text-xs text-teal-600 hover:text-teal-700 font-semibold">
                  + Marcar consulta
                </button>
              </div>
            ) : dayAppts.map((a) => {
              const color = SERVICE_COLORS[a.service_name] || DEFAULT_COLOR
              const isSelected = selectedAppt?.id === a.id
              return (
                <motion.div key={a.id} layout
                  onClick={() => setSelectedAppt(isSelected ? null : a)}
                  className={`rounded-xl border-2 p-3 cursor-pointer transition-all hover:shadow-sm ${color} ${isSelected ? 'shadow-md' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={12} />
                      <span className="font-bold text-sm">{formatTime(a.start_time)}</span>
                    </div>
                    <span className="text-xs opacity-60 bg-white/40 px-2 py-0.5 rounded-full">{a.unit?.replace('_', ' ')}</span>
                  </div>
                  <p className="font-semibold text-sm mt-1">
                    {a.patient_name}
                    {a.date_of_birth && <span className="font-normal opacity-70"> ({new Date().getFullYear() - new Date(a.date_of_birth).getFullYear()}a)</span>}
                  </p>
                  <p className="text-xs opacity-70 mt-0.5">{a.service_name || 'Serviço não definido'}</p>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                        className="mt-3 pt-3 border-t border-current border-opacity-20 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs opacity-80"><User size={11} /> {a.therapist_name || 'Não atribuído'}</div>
                        <div className="flex items-center gap-1.5 text-xs opacity-80"><MapPin size={11} /> {a.unit?.replace('_', ' ')}</div>
                        <div className="flex items-center gap-1.5 text-xs opacity-80"><Clock size={11} /> {formatTime(a.start_time)} — {formatTime(a.end_time)}</div>
                        <button className="w-full mt-1 py-1.5 bg-white/60 hover:bg-white/80 rounded-lg text-xs font-semibold transition-colors">
                          {a.note_id ? '📄 Ver sumário' : '✏️ Escrever sumário'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modal Nova Consulta */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 sticky top-0 bg-white rounded-t-3xl z-10">
                <div>
                  <h2 className="font-display text-xl text-teal-900 font-bold">Nova Consulta</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Agendar nova consulta</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Paciente *</label>
                  <select value={form.patient_id} onChange={e => setForm(f => ({ ...f, patient_id: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                    <option value="">Selecionar paciente</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.full_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Terapeuta</label>
                  <select value={form.therapist_id} onChange={e => setForm(f => ({ ...f, therapist_id: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                    <option value="">Selecionar terapeuta</option>
                    {therapists.map(t => (
                      <option key={t.id} value={t.id}>{t.full_name || t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Serviço</label>
                  <select value={form.service_id} onChange={e => setForm(f => ({ ...f, service_id: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                    <option value="">Selecionar serviço</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Data *</label>
                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Hora *</label>
                    <select value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Duração</label>
                  <div className="grid grid-cols-4 gap-2">
                    {DURATIONS.map(d => (
                      <button key={d.value} type="button" onClick={() => setForm(f => ({ ...f, duration: d.value }))}
                        className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${form.duration === d.value ? 'bg-teal-600 text-white border-teal-600' : 'border-gray-200 text-gray-500 hover:border-teal-300'}`}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Unidade</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[['leça_palmeira', 'Leça da Palmeira'], ['são_mamede', 'S. Mamede de Infesta']].map(([val, label]) => (
                      <button key={val} type="button" onClick={() => setForm(f => ({ ...f, unit: val }))}
                        className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all border ${form.unit === val ? 'bg-teal-600 text-white border-teal-600' : 'border-gray-200 text-gray-500 hover:border-teal-300'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Notas</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    rows={2} placeholder="Observações adicionais..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
                </div>

                <button onClick={saveAppointment} disabled={!form.patient_id || !form.date || saving}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all ${
                    saved ? 'bg-green-500 text-white' :
                    (form.patient_id && form.date) ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-lg' :
                    'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}>
                  {saved ? <><CheckCircle size={16} /> Consulta marcada!</> :
                   saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> A guardar...</> :
                   <><Save size={16} /> Marcar Consulta</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

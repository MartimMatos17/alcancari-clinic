import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, X, Clock, User, MapPin } from 'lucide-react'
import api from '../../lib/api'

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DAY_NAMES = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

const SERVICE_COLORS = {
  'Terapia Ocupacional': 'bg-orange-100 text-orange-700 border-orange-200',
  'Terapia da Fala':     'bg-green-100 text-green-700 border-green-200',
  'Psicologia':          'bg-purple-100 text-purple-700 border-purple-200',
  'Fisioterapia':        'bg-blue-100 text-blue-700 border-blue-200',
  'Floortime':           'bg-pink-100 text-pink-700 border-pink-200',
  'Integração Sensorial':'bg-indigo-100 text-indigo-700 border-indigo-200',
}
const DEFAULT_COLOR = 'bg-teal-100 text-teal-700 border-teal-200'

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

  useEffect(() => {
    loadMonth()
  }, [year, month])

  useEffect(() => {
    loadDay()
  }, [selectedDate])

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
        <button className="flex items-center gap-2 bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-teal-800 transition-colors">
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

        {/* Consultas do dia */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800 text-sm capitalize">{selectedDateFormatted}</h3>
            <p className="text-gray-400 text-xs mt-0.5">{dayAppts.length} consultas</p>
          </div>
          <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
            {loadingDay ? (
              <div className="text-center py-8 text-gray-400 text-sm">A carregar...</div>
            ) : dayAppts.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p className="text-3xl mb-2">📅</p>
                <p className="text-sm">Sem consultas neste dia</p>
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
                    <span className="text-xs opacity-70">{a.unit}</span>
                  </div>
                  <p className="font-semibold text-sm mt-1">
                    {a.patient_name}
                    {a.date_of_birth && <span className="font-normal opacity-70"> ({new Date().getFullYear() - new Date(a.date_of_birth).getFullYear()}a)</span>}
                  </p>
                  <p className="text-xs opacity-70 mt-0.5">{a.service_name}</p>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                        className="mt-3 pt-3 border-t border-current border-opacity-20 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs opacity-80"><User size={11} /> {a.therapist_name}</div>
                        <div className="flex items-center gap-1.5 text-xs opacity-80"><MapPin size={11} /> {a.unit}</div>
                        <div className="flex gap-2 mt-2">
                          <button className="flex-1 py-1.5 bg-white/50 hover:bg-white/70 rounded-lg text-xs font-semibold">
                            {a.note_id ? 'Ver sumário' : 'Escrever sumário'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

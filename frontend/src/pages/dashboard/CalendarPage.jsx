import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, X, Clock, User, MapPin } from 'lucide-react'

const APPOINTMENTS = {
  '2026-03-12': [
    { id:1, time:'09:00', patient:'Maria Silva', age:6, service:'Terapia Ocupacional', therapist:'Alexandra F.', unit:'Leça', color:'bg-orange-100 text-orange-700 border-orange-200' },
    { id:2, time:'10:00', patient:'João Santos', age:4, service:'Terapia da Fala', therapist:'Luísa P.', unit:'Leça', color:'bg-green-100 text-green-700 border-green-200' },
    { id:3, time:'11:00', patient:'Ana Costa', age:8, service:'Psicologia', therapist:'Joana B.', unit:'SMI', color:'bg-purple-100 text-purple-700 border-purple-200' },
    { id:4, time:'14:00', patient:'Pedro Rocha', age:5, service:'Fisioterapia', therapist:'Alexandra F.', unit:'SMI', color:'bg-blue-100 text-blue-700 border-blue-200' },
    { id:5, time:'15:00', patient:'Sofia Lima', age:7, service:'Floortime', therapist:'Joana M.', unit:'Leça', color:'bg-pink-100 text-pink-700 border-pink-200' },
    { id:6, time:'16:00', patient:'Miguel Ferreira', age:3, service:'Int. Sensorial', therapist:'Inês M.', unit:'SMI', color:'bg-indigo-100 text-indigo-700 border-indigo-200' },
  ],
  '2026-03-13': [
    { id:7, time:'09:30', patient:'Beatriz Nunes', age:9, service:'Psicologia', therapist:'Filipa L.', unit:'Leça', color:'bg-purple-100 text-purple-700 border-purple-200' },
    { id:8, time:'11:00', patient:'Rodrigo Pinto', age:5, service:'Terapia da Fala', therapist:'Sónia T.', unit:'SMI', color:'bg-green-100 text-green-700 border-green-200' },
    { id:9, time:'14:30', patient:'Carolina Matos', age:7, service:'Terapia Ocupacional', therapist:'Inês H.', unit:'Leça', color:'bg-orange-100 text-orange-700 border-orange-200' },
  ],
  '2026-03-14': [
    { id:10, time:'10:00', patient:'Tomás Carvalho', age:6, service:'Floortime', therapist:'Joana M.', unit:'Leça', color:'bg-pink-100 text-pink-700 border-pink-200' },
    { id:11, time:'14:00', patient:'Maria Silva', age:6, service:'Terapia Ocupacional', therapist:'Alexandra F.', unit:'Leça', color:'bg-orange-100 text-orange-700 border-orange-200' },
    { id:12, time:'16:30', patient:'Ana Costa', age:8, service:'Psicologia', therapist:'Joana B.', unit:'SMI', color:'bg-purple-100 text-purple-700 border-purple-200' },
  ],
  '2026-03-17': [
    { id:13, time:'09:00', patient:'Pedro Rocha', age:5, service:'Fisioterapia', therapist:'Alexandra F.', unit:'SMI', color:'bg-blue-100 text-blue-700 border-blue-200' },
    { id:14, time:'10:30', patient:'Sofia Lima', age:7, service:'Floortime', therapist:'Joana M.', unit:'Leça', color:'bg-pink-100 text-pink-700 border-pink-200' },
  ],
  '2026-03-18': [
    { id:15, time:'11:00', patient:'João Santos', age:4, service:'Terapia da Fala', therapist:'Luísa P.', unit:'Leça', color:'bg-green-100 text-green-700 border-green-200' },
    { id:16, time:'15:00', patient:'Beatriz Nunes', age:9, service:'Psicologia', therapist:'Filipa L.', unit:'SMI', color:'bg-purple-100 text-purple-700 border-purple-200' },
    { id:17, time:'17:00', patient:'Miguel Ferreira', age:3, service:'Int. Sensorial', therapist:'Inês M.', unit:'Leça', color:'bg-indigo-100 text-indigo-700 border-indigo-200' },
  ],
}

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DAY_NAMES = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const HOURS = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export default function CalendarPage() {
  const today = new Date()
  const [view, setView] = useState('month')
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0])
  const [selectedAppt, setSelectedAppt] = useState(null)

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1) } else setMonth(m => m-1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1) } else setMonth(m => m+1) }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const days = Array.from({ length: firstDay }, () => null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))

  const formatDate = (d) => `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
  const selectedAppts = APPOINTMENTS[selectedDate] || []
  const todayStr = today.toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-teal-900 font-bold">Calendário</h1>
          <p className="text-gray-400 text-sm mt-0.5">{selectedAppts.length} consultas em {new Date(selectedDate + 'T12:00').toLocaleDateString('pt-PT', { day:'numeric', month:'long' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1">
            {[['month','Mês'],['week','Semana']].map(([v,l]) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === v ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                {l}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-teal-800 transition-colors">
            <Plus size={15} /> Nova Consulta
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Calendário */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Nav mês */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ChevronLeft size={18} className="text-gray-500" /></button>
            <h2 className="font-display font-bold text-teal-900 text-lg">{MONTH_NAMES[month]} {year}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ChevronRight size={18} className="text-gray-500" /></button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 border-b border-gray-50">
            {DAY_NAMES.map(d => (
              <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">{d}</div>
            ))}
          </div>

          {/* Células */}
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              if (!day) return <div key={i} className="h-20 border-b border-r border-gray-50" />
              const dateStr = formatDate(day)
              const appts = APPOINTMENTS[dateStr] || []
              const isToday = dateStr === todayStr
              const isSelected = dateStr === selectedDate
              return (
                <div key={i} onClick={() => setSelectedDate(dateStr)}
                  className={`h-20 border-b border-r border-gray-50 p-2 cursor-pointer transition-colors hover:bg-teal-50/50 ${isSelected ? 'bg-teal-50' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold mb-1 ${
                    isToday ? 'bg-teal-700 text-white' : isSelected ? 'bg-teal-100 text-teal-700' : 'text-gray-600'
                  }`}>{day}</div>
                  <div className="space-y-0.5">
                    {appts.slice(0,2).map((a,j) => (
                      <div key={j} className={`text-xs px-1.5 py-0.5 rounded-md truncate border ${a.color} text-[10px]`}>{a.time} {a.patient.split(' ')[0]}</div>
                    ))}
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
            <h3 className="font-semibold text-gray-800 text-sm">
              {new Date(selectedDate + 'T12:00').toLocaleDateString('pt-PT', { weekday:'long', day:'numeric', month:'long' })}
            </h3>
            <p className="text-gray-400 text-xs mt-0.5">{selectedAppts.length} consultas</p>
          </div>

          <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
            {selectedAppts.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p className="text-3xl mb-2">📅</p>
                <p className="text-sm">Sem consultas neste dia</p>
                <button className="mt-3 text-teal-600 text-xs font-semibold hover:text-teal-700">+ Adicionar consulta</button>
              </div>
            ) : (
              selectedAppts.map((a) => (
                <motion.div key={a.id} layout
                  onClick={() => setSelectedAppt(selectedAppt?.id === a.id ? null : a)}
                  className={`rounded-xl border-2 p-3 cursor-pointer transition-all hover:shadow-sm ${a.color} ${selectedAppt?.id === a.id ? 'shadow-md' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={12} />
                      <span className="font-bold text-sm">{a.time}</span>
                    </div>
                    <span className="text-xs opacity-70">{a.unit}</span>
                  </div>
                  <p className="font-semibold text-sm mt-1">{a.patient} <span className="font-normal opacity-70">({a.age}a)</span></p>
                  <p className="text-xs opacity-70 mt-0.5">{a.service}</p>

                  <AnimatePresence>
                    {selectedAppt?.id === a.id && (
                      <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                        className="mt-3 pt-3 border-t border-current border-opacity-20 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs opacity-80"><User size={11} /> {a.therapist}</div>
                        <div className="flex items-center gap-1.5 text-xs opacity-80"><MapPin size={11} /> {a.unit === 'Leça' ? 'Leça da Palmeira' : 'São Mamede de Infesta'}</div>
                        <div className="flex gap-2 mt-2">
                          <button className="flex-1 py-1.5 bg-white/50 hover:bg-white/70 rounded-lg text-xs font-semibold transition-colors">Sumário</button>
                          <button className="flex-1 py-1.5 bg-white/50 hover:bg-white/70 rounded-lg text-xs font-semibold transition-colors">Editar</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

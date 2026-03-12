import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Users, FileText, Clock, ArrowRight, TrendingUp, Bell, CheckCircle } from 'lucide-react'

const STATS = [
  { label: 'Consultas hoje', value: '8', icon: <Calendar size={20} />, color: 'bg-teal-50 text-teal-600', trend: '+2 vs ontem' },
  { label: 'Pacientes ativos', value: '47', icon: <Users size={20} />, color: 'bg-blue-50 text-blue-600', trend: '+3 este mês' },
  { label: 'Sumários pendentes', value: '3', icon: <FileText size={20} />, color: 'bg-amber-50 text-amber-600', trend: 'por preencher' },
  { label: 'Horas esta semana', value: '32h', icon: <Clock size={20} />, color: 'bg-purple-50 text-purple-600', trend: '4 dias restantes' },
]

const TODAY_APPOINTMENTS = [
  { time: '09:00', patient: 'Maria Silva', age: 6, service: 'Terapia Ocupacional', therapist: 'Alexandra F.', status: 'done', color: 'bg-orange-100 text-orange-700' },
  { time: '10:00', patient: 'João Santos', age: 4, service: 'Terapia da Fala', therapist: 'Luísa P.', status: 'done', color: 'bg-green-100 text-green-700' },
  { time: '11:00', patient: 'Ana Costa', age: 8, service: 'Psicologia', therapist: 'Joana B.', status: 'current', color: 'bg-purple-100 text-purple-700' },
  { time: '14:00', patient: 'Pedro Rocha', age: 5, service: 'Fisioterapia', therapist: 'Alexandra F.', status: 'upcoming', color: 'bg-blue-100 text-blue-700' },
  { time: '15:00', patient: 'Sofia Lima', age: 7, service: 'Floortime', therapist: 'Fabiana R.', status: 'upcoming', color: 'bg-pink-100 text-pink-700' },
  { time: '16:00', patient: 'Miguel Ferreira', age: 3, service: 'Integração Sensorial', therapist: 'Inês M.', status: 'upcoming', color: 'bg-indigo-100 text-indigo-700' },
]

const PENDING_NOTES = [
  { patient: 'Maria Silva', service: 'Terapia Ocupacional', date: 'Hoje 09:00', urgent: true },
  { patient: 'João Santos', service: 'Terapia da Fala', date: 'Hoje 10:00', urgent: true },
  { patient: 'Beatriz Nunes', service: 'Psicologia', date: 'Ontem 15:00', urgent: false },
]

export default function DashboardHome() {
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Bom dia' : now.getHours() < 19 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-gray-400 text-sm">{now.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1 className="font-display text-3xl text-teal-900 font-bold mt-1">{greeting} 👋</h1>
        </motion.div>
        <Link to="/dashboard/calendario"
          className="flex items-center gap-2 bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-teal-800 transition-colors">
          <Calendar size={15} /> Ver calendário
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <p className="font-display text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-gray-500 text-sm mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-300 mt-1 flex items-center gap-1"><TrendingUp size={10} />{s.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Consultas de hoje */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">Consultas de hoje</h2>
            <Link to="/dashboard/calendario" className="text-teal-600 text-xs font-semibold hover:text-teal-700 flex items-center gap-1">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {TODAY_APPOINTMENTS.map((a, i) => (
              <div key={i} className={`flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors ${a.status === 'current' ? 'bg-teal-50/50' : ''}`}>
                <div className="w-14 flex-shrink-0">
                  <p className={`text-sm font-bold ${a.status === 'current' ? 'text-teal-600' : 'text-gray-500'}`}>{a.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{a.patient} <span className="text-gray-400 font-normal">({a.age} anos)</span></p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.color}`}>{a.service}</span>
                    <span className="text-gray-300 text-xs">{a.therapist}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {a.status === 'done' && <span className="flex items-center gap-1 text-xs text-green-500"><CheckCircle size={14} /> Concluída</span>}
                  {a.status === 'current' && <span className="flex items-center gap-1 text-xs text-teal-600 font-semibold animate-pulse">● A decorrer</span>}
                  {a.status === 'upcoming' && <span className="text-xs text-gray-300">Próxima</span>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sumários pendentes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              Sumários pendentes
              {PENDING_NOTES.length > 0 && <span className="w-5 h-5 bg-amber-400 text-white text-xs rounded-full flex items-center justify-center font-bold">{PENDING_NOTES.length}</span>}
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {PENDING_NOTES.map((n, i) => (
              <Link key={i} to="/dashboard/notas"
                className={`flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors border ${n.urgent ? 'border-amber-100 bg-amber-50/50' : 'border-gray-50'}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.urgent ? 'bg-amber-400' : 'bg-gray-300'}`} />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-700 text-sm truncate">{n.patient}</p>
                  <p className="text-gray-400 text-xs">{n.service}</p>
                  <p className="text-gray-300 text-xs mt-0.5">{n.date}</p>
                </div>
                <ArrowRight size={14} className="text-gray-300 flex-shrink-0 mt-1" />
              </Link>
            ))}
            <Link to="/dashboard/notas"
              className="flex items-center justify-center gap-2 w-full py-3 text-teal-600 text-sm font-semibold hover:bg-teal-50 rounded-xl transition-colors">
              <FileText size={14} /> Ver todos os sumários
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

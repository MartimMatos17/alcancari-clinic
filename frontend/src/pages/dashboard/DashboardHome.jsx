import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Users, FileText, Clock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../../lib/api'
import { useAuthStore } from '../../store/authStore'

export default function DashboardHome() {
  const { user } = useAuthStore()
  const [todayAppts, setTodayAppts] = useState([])
  const [pendingNotes, setPendingNotes] = useState([])
  const [patientCount, setPatientCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.role === 'admin'
  const today = new Date().toISOString().split('T')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 19 ? 'Boa tarde' : 'Boa noite'
  const firstName = user?.full_name?.split(' ')[0] || ''

  useEffect(() => {
    const load = async () => {
      try {
        const params = isAdmin ? {} : { therapist_id: user?.id }

        const [appts, notes, patients] = await Promise.all([
          api.get('/calendar/day', { params: { date: today, ...params } }),
          api.get('/session-notes', { params: { pending: true, ...params } }),
          api.get('/patients', { params }),
        ])
        setTodayAppts(Array.isArray(appts.data) ? appts.data : [])
        setPendingNotes(Array.isArray(notes.data) ? notes.data : [])
        setPatientCount(Array.isArray(patients.data) ? patients.data.length : 0)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    load()
  }, [])

  const SERVICE_COLORS = {
    'Terapia Ocupacional': 'bg-orange-100 text-orange-700',
    'Terapia da Fala': 'bg-green-100 text-green-700',
    'Psicologia': 'bg-purple-100 text-purple-700',
    'Fisioterapia': 'bg-blue-100 text-blue-700',
    'Floortime': 'bg-pink-100 text-pink-700',
    'Integração Sensorial': 'bg-indigo-100 text-indigo-700',
  }

  const getStatus = (appt) => {
    const now = new Date()
    const start = new Date(appt.start_time)
    const end = new Date(appt.end_time)
    if (now > end) return 'done'
    if (now >= start) return 'current'
    return 'upcoming'
  }

  const stats = [
    { label: isAdmin ? 'Consultas hoje' : 'As minhas consultas hoje', value: loading ? '...' : todayAppts.length, icon: <Calendar size={20} />, color: 'bg-teal-50 text-teal-600', to: '/dashboard/calendario' },
    { label: isAdmin ? 'Total pacientes' : 'Os meus pacientes', value: loading ? '...' : patientCount, icon: <Users size={20} />, color: 'bg-blue-50 text-blue-600', to: '/dashboard/pacientes' },
    { label: 'Sumários pendentes', value: loading ? '...' : pendingNotes.length, icon: <FileText size={20} />, color: 'bg-amber-50 text-amber-600', to: '/dashboard/notas' },
    { label: 'Duração média', value: '50 min', icon: <Clock size={20} />, color: 'bg-purple-50 text-purple-600', to: null },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-gray-400 text-sm capitalize">
            {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="font-display text-3xl text-teal-900 font-bold mt-1">
            {greeting}, {firstName} 👋
          </h1>
          {isAdmin && (
            <p className="text-xs text-teal-600 font-semibold mt-1 bg-teal-50 px-3 py-1 rounded-full inline-block">
              👑 Visão geral da clínica
            </p>
          )}
        </motion.div>
        <Link to="/dashboard/calendario"
          className="flex items-center gap-2 bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-teal-800 transition-colors">
          <Calendar size={15} /> Ver calendário
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            {s.to ? (
              <Link to={s.to} className="block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
                <p className="font-display text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-gray-500 text-sm mt-0.5">{s.label}</p>
              </Link>
            ) : (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
                <p className="font-display text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-gray-500 text-sm mt-0.5">{s.label}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Consultas + Pendentes */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Consultas de hoje */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">
              {isAdmin ? 'Consultas de hoje — toda a clínica' : 'As minhas consultas de hoje'}
            </h2>
            <Link to="/dashboard/calendario" className="text-teal-600 text-xs font-semibold hover:text-teal-700 flex items-center gap-1">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="w-6 h-6 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
            </div>
          ) : todayAppts.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-3xl mb-2">📅</p>
              <p className="text-sm">Sem consultas hoje</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {todayAppts.map((a) => {
                const status = getStatus(a)
                return (
                  <div key={a.id} className={`flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors ${status === 'current' ? 'bg-teal-50/50' : ''}`}>
                    <div className="w-14 flex-shrink-0">
                      <p className={`text-sm font-bold ${status === 'current' ? 'text-teal-600' : 'text-gray-500'}`}>
                        {new Date(a.start_time).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{a.patient_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SERVICE_COLORS[a.service_name] || 'bg-gray-100 text-gray-600'}`}>
                          {a.service_name || 'Sem serviço'}
                        </span>
                        {isAdmin && <span className="text-gray-300 text-xs">{a.therapist_name}</span>}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {status === 'done' && <span className="flex items-center gap-1 text-xs text-green-500"><CheckCircle size={14} /> Concluída</span>}
                      {status === 'current' && <span className="text-xs text-teal-600 font-semibold animate-pulse">● A decorrer</span>}
                      {status === 'upcoming' && <span className="text-xs text-gray-300">Próxima</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Sumários pendentes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              Sumários pendentes
              {!loading && pendingNotes.length > 0 && (
                <span className="w-5 h-5 bg-amber-400 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {pendingNotes.length}
                </span>
              )}
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {loading ? (
              <div className="text-center py-6">
                <div className="w-5 h-5 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
              </div>
            ) : pendingNotes.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                <CheckCircle size={24} className="mx-auto mb-2 text-green-400" />
                <p className="text-sm">Tudo em dia!</p>
              </div>
            ) : pendingNotes.slice(0, 4).map((n, i) => (
              <Link key={i} to="/dashboard/notas"
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-amber-100 bg-amber-50/50">
                <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-700 text-sm truncate">{n.patient_name}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(n.start_time).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}
                  </p>
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

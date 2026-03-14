import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Users, FileText, Clock, ArrowRight, TrendingUp, MapPin, Inbox } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import api from '../../lib/api'
import { useAuthStore } from '../../store/authStore'

const COLORS = ['#0d9488', '#7c3aed', '#16a34a', '#0369a1', '#db2777', '#ca8a04', '#ea580c']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-lg">
        <p className="text-teal-700 font-semibold text-sm">{label}</p>
        <p className="text-gray-600 text-sm">{payload[0].value} consultas</p>
      </div>
    )
  }
  return null
}

export default function DashboardHome() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [todayAppts, setTodayAppts] = useState([])
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.role === 'admin'
  const today = new Date().toISOString().split('T')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 19 ? 'Boa tarde' : 'Boa noite'
  const firstName = user?.full_name?.split(' ')[0] || ''

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, dayRes] = await Promise.all([
          api.get('/stats'),
          api.get('/calendar/day', { params: { date: today } }),
        ])
        setStats(statsRes.data)
        setTodayAppts(Array.isArray(dayRes.data) ? dayRes.data : [])
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    load()
  }, [])

  const unitData = stats?.byUnit?.map(u => ({
    name: u.unit === 'leça_palmeira' ? 'Leça' : 'São Mamede',
    value: parseInt(u.total)
  })) || []

  const getStatus = (appt) => {
    const now = new Date()
    const start = new Date(appt.start_time)
    const end = new Date(appt.end_time)
    if (now > end) return 'done'
    if (now >= start) return 'current'
    return 'upcoming'
  }

  const SERVICE_COLORS = {
    'Terapia Ocupacional': 'bg-orange-100 text-orange-700',
    'Terapia da Fala':     'bg-green-100 text-green-700',
    'Psicologia':          'bg-purple-100 text-purple-700',
    'Fisioterapia':        'bg-blue-100 text-blue-700',
    'Floortime':           'bg-pink-100 text-pink-700',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-gray-400 text-sm capitalize">
            {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="font-display text-3xl text-teal-900 font-bold mt-1">{greeting}, {firstName} 👋</h1>
          {isAdmin && (
            <span className="text-xs text-teal-600 font-semibold mt-1 bg-teal-50 px-3 py-1 rounded-full inline-block">
              👑 Visão geral da clínica
            </span>
          )}
        </motion.div>
        <Link to="/dashboard/calendario"
          className="flex items-center gap-2 bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-teal-800 transition-colors">
          <Calendar size={15} /> Ver calendário
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: isAdmin ? 'Consultas hoje' : 'As minhas hoje', value: loading ? '...' : stats?.totals?.today || 0, icon: <Calendar size={20} />, color: 'bg-teal-50 text-teal-600', to: '/dashboard/calendario' },
          { label: isAdmin ? 'Esta semana' : 'Esta semana', value: loading ? '...' : stats?.totals?.this_week || 0, icon: <TrendingUp size={20} />, color: 'bg-blue-50 text-blue-600', to: '/dashboard/calendario' },
          { label: isAdmin ? 'Total pacientes' : 'Os meus pacientes', value: loading ? '...' : stats?.totalPatients || 0, icon: <Users size={20} />, color: 'bg-purple-50 text-purple-600', to: '/dashboard/pacientes' },
          { label: 'Sumários pendentes', value: loading ? '...' : stats?.pendingNotes || 0, icon: <FileText size={20} />, color: 'bg-amber-50 text-amber-600', to: '/dashboard/notas' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link to={s.to} className="block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
              <p className="font-display text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-gray-500 text-sm mt-0.5">{s.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Gráfico de barras — consultas por mês */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-800">Consultas por mês</h2>
              <p className="text-gray-400 text-xs mt-0.5">Últimos 6 meses</p>
            </div>
            <TrendingUp size={18} className="text-teal-400" />
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.monthly?.map(m => ({ mes: m.mes, total: parseInt(m.total) })) || []}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" fill="#0d9488" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Gráfico de pizza — por unidade */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-800">Por unidade</h2>
              <p className="text-gray-400 text-xs mt-0.5">Distribuição</p>
            </div>
            <MapPin size={18} className="text-teal-400" />
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={unitData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                  paddingAngle={4} dataKey="value">
                  {unitData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(val) => [val + ' consultas']} />
                <Legend formatter={(val) => <span className="text-xs text-gray-600">{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Serviços + Consultas hoje */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Top serviços */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Serviços mais pedidos</h2>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-8 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.byService?.map((s, i) => {
                const max = stats.byService[0]?.total || 1
                const pct = Math.round((s.total / max) * 100)
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600 truncate">{s.service}</span>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{s.total}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: pct + '%' }} transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Consultas de hoje */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">
              {isAdmin ? 'Consultas de hoje' : 'As minhas consultas de hoje'}
            </h2>
            <Link to="/dashboard/calendario" className="text-teal-600 text-xs font-semibold flex items-center gap-1">
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
              {todayAppts.map(a => {
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
                          {a.service_name || 'Consulta'}
                        </span>
                        {isAdmin && <span className="text-gray-300 text-xs">{a.therapist_name}</span>}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-xs">
                      {status === 'done' && <span className="text-green-500">✓ Concluída</span>}
                      {status === 'current' && <span className="text-teal-600 font-semibold animate-pulse">● A decorrer</span>}
                      {status === 'upcoming' && <span className="text-gray-300">Próxima</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Admin: pedidos pendentes */}
      {isAdmin && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-teal-700 to-teal-800 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Inbox size={22} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">Pedidos de marcação online</p>
              <p className="text-teal-200 text-sm">Verifique os novos pedidos recebidos</p>
            </div>
          </div>
          <Link to="/dashboard/pedidos"
            className="flex items-center gap-2 bg-white text-teal-700 font-semibold px-5 py-2.5 rounded-full hover:bg-teal-50 transition-colors text-sm flex-shrink-0">
            Ver pedidos <ArrowRight size={14} />
          </Link>
        </motion.div>
      )}
    </div>
  )
}

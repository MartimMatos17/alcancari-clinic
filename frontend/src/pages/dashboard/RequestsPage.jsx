import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Phone, Mail, Calendar, User } from 'lucide-react'
import api from '../../lib/api'

const STATUS_COLORS = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}
const STATUS_LABELS = { pending: 'Pendente', confirmed: 'Confirmado', cancelled: 'Cancelado' }

export default function RequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  const load = async () => {
    try {
      const res = await api.get('/appointment-requests')
      setRequests(res.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointment-requests/${id}`, { status })
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    } catch (err) { console.error(err) }
  }

  const filtered = requests.filter(r => filter === 'all' || r.status === filter)
  const counts = {
    pending:   requests.filter(r => r.status === 'pending').length,
    confirmed: requests.filter(r => r.status === 'confirmed').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-teal-900 font-bold">Pedidos de Marcação</h1>
          <p className="text-gray-400 text-sm mt-1">Pedidos recebidos através do site</p>
        </div>
        {counts.pending > 0 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-2 rounded-full">
            {counts.pending} pendente{counts.pending > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'pending',   label: `Pendentes (${counts.pending})` },
          { key: 'confirmed', label: `Confirmados (${counts.confirmed})` },
          { key: 'cancelled', label: `Cancelados (${counts.cancelled})` },
          { key: 'all',       label: 'Todos' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f.key ? 'bg-teal-700 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:border-teal-300'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-400">Sem pedidos {filter !== 'all' ? STATUS_LABELS[filter]?.toLowerCase() + 's' : ''}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-gray-800">{r.name}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${STATUS_COLORS[r.status]}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                    <span className="text-xs bg-teal-50 text-teal-600 border border-teal-100 px-2.5 py-1 rounded-full font-medium">
                      {r.service}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><Phone size={13} className="text-teal-400" />{r.phone}</span>
                    <span className="flex items-center gap-1.5"><Mail size={13} className="text-teal-400" />{r.email}</span>
                    {r.preferred_date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-teal-400" />
                        {r.preferred_date ? new Date(r.preferred_date + 'T12:00:00').toLocaleDateString('pt-PT') : ''} às {r.preferred_time}
                      </span>
                    )}
                    {r.age && <span className="flex items-center gap-1.5"><User size={13} className="text-teal-400" />{r.age}</span>}
                  </div>
                  {r.notes && <p className="text-gray-400 text-sm bg-gray-50 rounded-xl px-4 py-2 italic">"{r.notes}"</p>}
                  <p className="text-gray-300 text-xs">
                    Recebido: {new Date(r.created_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {r.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => updateStatus(r.id, 'confirmed')}
                      className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-xl transition-colors border border-green-200">
                      <CheckCircle size={14} /> Confirmar
                    </button>
                    <button onClick={() => updateStatus(r.id, 'cancelled')}
                      className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold px-4 py-2 rounded-xl transition-colors border border-red-200">
                      <XCircle size={14} /> Cancelar
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

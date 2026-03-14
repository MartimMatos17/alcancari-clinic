import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Mail, MapPin } from 'lucide-react'
import api from '../../lib/api'

const SPECIALTY_COLORS = {
  'Terapia Ocupacional': 'bg-orange-50 text-orange-600 border-orange-200',
  'Psicologia':          'bg-purple-50 text-purple-600 border-purple-200',
  'Terapia da Fala':     'bg-green-50 text-green-600 border-green-200',
  'Fisioterapia':        'bg-blue-50 text-blue-600 border-blue-200',
}

export default function TeamPage() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Todos')

  useEffect(() => {
    api.get('/therapists').then(res => {
      setTeam(res.data)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const specialties = ['Todos', ...new Set(team.map(t => t.specialty).filter(Boolean))]
  const filtered = filter === 'Todos' ? team : team.filter(t => t.specialty === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-teal-900 font-bold">Equipa</h1>
          <p className="text-gray-400 text-sm mt-1">{team.length} profissionais ativos</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {specialties.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === s ? 'bg-teal-700 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:border-teal-300'
            }`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((t, i) => {
            const initials = t.full_name?.split(' ').slice(0,2).map(n => n[0]).join('') || '?'
            const colorClass = SPECIALTY_COLORS[t.specialty] || 'bg-teal-50 text-teal-600 border-teal-200'
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{t.full_name}</p>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium mt-1 inline-block ${colorClass}`}>
                      {t.specialty}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-gray-400">
                  {t.email && (
                    <a href={`mailto:${t.email}`} className="flex items-center gap-2 hover:text-teal-600 transition-colors truncate">
                      <Mail size={12} className="flex-shrink-0" /> {t.email}
                    </a>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin size={12} className="flex-shrink-0" />
                    {t.unit === 'both' ? 'Ambas as unidades' : t.unit === 'leça_palmeira' ? 'Leça da Palmeira' : 'São Mamede'}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

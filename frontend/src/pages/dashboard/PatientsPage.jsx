import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Phone, Mail, FileText, ChevronRight, X } from 'lucide-react'
import api from '../../lib/api'

const SERVICE_COLORS = {
  'Psicologia':           'bg-purple-100 text-purple-700',
  'Terapia da Fala':      'bg-green-100 text-green-700',
  'Terapia Ocupacional':  'bg-orange-100 text-orange-700',
  'Fisioterapia':         'bg-blue-100 text-blue-700',
  'Floortime':            'bg-pink-100 text-pink-700',
  'Integração Sensorial': 'bg-indigo-100 text-indigo-700',
}

export default function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    loadPatients()
  }, [search])

  const loadPatients = async () => {
    setLoading(true)
    try {
      const res = await api.get('/patients', { params: search ? { search } : {} })
      setPatients(res.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const loadDetail = async (p) => {
    setSelected(p)
    setLoadingDetail(true)
    try {
      const res = await api.get('/patients/' + p.id)
      setDetail(res.data)
    } catch (err) { console.error(err) }
    setLoadingDetail(false)
  }

  const getAge = (dob) => {
    if (!dob) return null
    return new Date().getFullYear() - new Date(dob).getFullYear()
  }

  const getInitials = (name) => name?.split(' ').map(n => n[0]).slice(0,2).join('') || '?'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-teal-900 font-bold">Pacientes</h1>
          <p className="text-gray-400 text-sm mt-0.5">{patients.length} pacientes</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-teal-800 transition-colors">
          <Plus size={15} /> Novo Paciente
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar por nome ou encarregado..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lista */}
        <div className={`${selected ? 'lg:col-span-1' : 'lg:col-span-3'} space-y-2`}>
          {loading ? (
            <div className="text-center py-12 text-gray-400">A carregar...</div>
          ) : patients.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p>Nenhum paciente encontrado</p>
            </div>
          ) : patients.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              onClick={() => loadDetail(p)}
              className={`bg-white rounded-2xl p-4 border cursor-pointer hover:shadow-md transition-all ${selected?.id === p.id ? 'border-teal-400 shadow-md' : 'border-gray-100 hover:border-teal-200'}`}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{getInitials(p.full_name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {p.full_name}
                    {getAge(p.date_of_birth) && <span className="text-gray-400 font-normal"> ({getAge(p.date_of_birth)} anos)</span>}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">{p.parent_name || 'Sem encarregado'}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 text-gray-300 text-xs">
                    <FileText size={12} /> {p.note_count || 0}
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detalhe */}
        {selected && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-800">Ficha do Paciente</h2>
              <button onClick={() => { setSelected(null); setDetail(null) }} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            {loadingDetail ? (
              <div className="p-8 text-center text-gray-400">A carregar...</div>
            ) : detail && (
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{getInitials(detail.full_name)}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-teal-900 font-bold">{detail.full_name}</h3>
                    <p className="text-gray-400 text-sm">
                      {getAge(detail.date_of_birth) && `${getAge(detail.date_of_birth)} anos`}
                      {detail.gender && ` · ${detail.gender}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Encarregado', value: detail.parent_name || '—' },
                    { label: 'Data Nasc.', value: detail.date_of_birth ? new Date(detail.date_of_birth).toLocaleDateString('pt-PT') : '—' },
                    { label: 'Consultas', value: detail.appointments?.length || 0 },
                    { label: 'Sumários', value: detail.session_notes?.length || 0 },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm text-gray-700 font-medium mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>

                {detail.parent_email && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Contactos</p>
                    {detail.parent_phone && (
                      <a href={'tel:' + detail.parent_phone} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50">
                        <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center"><Phone size={14} className="text-teal-600" /></div>
                        <span className="text-sm text-gray-600">{detail.parent_phone}</span>
                      </a>
                    )}
                    <a href={'mailto:' + detail.parent_email} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><Mail size={14} className="text-blue-600" /></div>
                      <span className="text-sm text-gray-600">{detail.parent_email}</span>
                    </a>
                  </div>
                )}

                {detail.notes && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-2">Notas clínicas</p>
                    <p className="text-sm text-gray-600">{detail.notes}</p>
                  </div>
                )}

                {detail.session_notes?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Últimos sumários</p>
                    <div className="space-y-2">
                      {detail.session_notes.slice(0,3).map((n, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100">
                          <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-400">{new Date(n.created_at).toLocaleDateString('pt-PT')}</p>
                            <p className="text-sm text-gray-600 truncate">{n.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

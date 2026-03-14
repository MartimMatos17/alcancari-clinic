import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, MapPin, Plus, Edit3, Trash2, X, Save, CheckCircle } from 'lucide-react'
import api from '../../lib/api'
import { useAuthStore } from '../../store/authStore'

const SPECIALTY_COLORS = {
  'Terapia Ocupacional': 'bg-orange-50 text-orange-600 border-orange-200',
  'Psicologia':          'bg-purple-50 text-purple-600 border-purple-200',
  'Terapia da Fala':     'bg-green-50 text-green-600 border-green-200',
  'Fisioterapia':        'bg-blue-50 text-blue-600 border-blue-200',
  'Acupuntura':          'bg-teal-50 text-teal-600 border-teal-200',
  'Floortime':           'bg-pink-50 text-pink-600 border-pink-200',
  'Integração Sensorial':'bg-indigo-50 text-indigo-600 border-indigo-200',
}

const ALL_SPECIALTIES = [
  'Terapia Ocupacional', 'Psicologia', 'Terapia da Fala',
  'Fisioterapia', 'Acupuntura', 'Floortime', 'Integração Sensorial', 'Outra'
]

const UNITS = [
  { value: 'both',           label: 'Ambas as unidades' },
  { value: 'leça_palmeira',  label: 'Leça da Palmeira' },
  { value: 'são_mamede',     label: 'São Mamede de Infesta' },
]

export default function TeamPage() {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Todos')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ full_name: '', email: '', specialty: [], unit: 'both', bio: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = () => {
    api.get('/therapists').then(res => setTeam(res.data))
      .catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // Todas as especialidades únicas no sistema
  const allSpecs = ['Todos', ...new Set(team.flatMap(t => Array.isArray(t.specialty) ? t.specialty : [t.specialty]).filter(Boolean))]

  const filtered = filter === 'Todos'
    ? team
    : team.filter(t => (Array.isArray(t.specialty) ? t.specialty : [t.specialty]).includes(filter))

  const openEdit = (t) => {
    setSelected(t)
    setForm({
      full_name: t.full_name || '',
      email: t.email || '',
      specialty: Array.isArray(t.specialty) ? t.specialty : [t.specialty].filter(Boolean),
      unit: t.unit || 'both',
      bio: t.bio || ''
    })
    setSaved(false)
    setModal('edit')
  }

  const openAdd = () => {
    setSelected(null)
    setForm({ full_name: '', email: '', specialty: [], unit: 'both', bio: '' })
    setSaved(false)
    setModal('add')
  }

  const toggleSpecialty = (spec) => {
    setForm(f => ({
      ...f,
      specialty: f.specialty.includes(spec)
        ? f.specialty.filter(s => s !== spec)
        : [...f.specialty, spec]
    }))
  }

  const save = async () => {
    if (!form.full_name || form.specialty.length === 0) return
    setSaving(true)
    try {
      if (modal === 'edit' && selected) {
        await api.put(`/therapists/${selected.id}`, form)
      } else {
        await api.post('/therapists', form)
      }
      setSaved(true)
      load()
      setTimeout(() => { setModal(null); setSaved(false) }, 1200)
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  const deleteTherapist = async (id) => {
    try {
      await api.delete(`/therapists/${id}`)
      setTeam(prev => prev.filter(t => t.id !== id))
      setDeleteConfirm(null)
    } catch (err) { console.error(err) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-teal-900 font-bold">Equipa</h1>
          <p className="text-gray-400 text-sm mt-1">{team.length} profissionais ativos</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full">
            <Plus size={15} /> Adicionar terapeuta
          </button>
        )}
      </div>

      {/* Filtros por especialidade */}
      <div className="flex gap-2 flex-wrap">
        {allSpecs.map(s => (
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
            const specs = Array.isArray(t.specialty) ? t.specialty : [t.specialty].filter(Boolean)
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{initials}</span>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">{t.full_name}</p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(t)} className="p-1.5 hover:bg-teal-50 text-teal-600 rounded-lg">
                        <Edit3 size={13} />
                      </button>
                      <button onClick={() => setDeleteConfirm(t.id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Múltiplas especialidades */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {specs.map(spec => (
                    <span key={spec} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${SPECIALTY_COLORS[spec] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="space-y-1.5 text-xs text-gray-400">
                  {t.email && (
                    <a href={`mailto:${t.email}`} className="flex items-center gap-2 hover:text-teal-600 truncate">
                      <Mail size={11} className="flex-shrink-0" /> {t.email}
                    </a>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin size={11} className="flex-shrink-0" />
                    {t.unit === 'both' ? 'Ambas as unidades' : t.unit === 'leça_palmeira' ? 'Leça da Palmeira' : 'São Mamede'}
                  </div>
                  {t.bio && <p className="text-gray-300 text-xs line-clamp-2 mt-1">{t.bio}</p>}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Modal editar/adicionar */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-5 my-8">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-teal-800">
                  {modal === 'edit' ? 'Editar terapeuta' : 'Adicionar terapeuta'}
                </h3>
                <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Nome completo *</label>
                  <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>

                {/* Especialidades — múltipla seleção */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Especialidades * <span className="text-gray-400 font-normal normal-case">(pode selecionar várias)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SPECIALTIES.map(spec => (
                      <button key={spec} type="button" onClick={() => toggleSpecialty(spec)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                          form.specialty.includes(spec)
                            ? (SPECIALTY_COLORS[spec] || 'bg-teal-50 text-teal-600 border-teal-300') + ' shadow-sm'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}>
                        {form.specialty.includes(spec) ? '✓ ' : ''}{spec}
                      </button>
                    ))}
                  </div>
                  {form.specialty.length === 0 && (
                    <p className="text-red-400 text-xs mt-1">Selecione pelo menos uma especialidade</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Unidade</label>
                  <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                    {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Bio</label>
                  <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    rows={3} placeholder="Breve descrição profissional..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)}
                  className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 text-sm">
                  Cancelar
                </button>
                <button onClick={save} disabled={saving || !form.full_name || form.specialty.length === 0}
                  className="flex-1 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                  {saved ? <><CheckCircle size={16} />Guardado!</> :
                   saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />A guardar...</> :
                   <><Save size={16} />Guardar</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal confirmar apagar */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="font-display text-xl text-gray-800">Remover terapeuta?</h3>
              <p className="text-gray-400 text-sm">O terapeuta ficará inativo no sistema.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 text-sm">
                  Cancelar
                </button>
                <button onClick={() => deleteTherapist(deleteConfirm)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl text-sm">
                  Remover
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

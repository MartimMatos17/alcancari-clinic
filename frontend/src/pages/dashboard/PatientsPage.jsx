import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, X, Save, Phone, Mail, FileText, ChevronRight, User, CheckCircle } from 'lucide-react'
import api from '../../lib/api'

export default function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    full_name: '', date_of_birth: '', gender: '', notes: '',
    parent_name: '', parent_phone: '', parent_email: ''
  })

  useEffect(() => { loadPatients() }, [search])

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

  const openModal = () => {
    setForm({ full_name: '', date_of_birth: '', gender: '', notes: '', parent_name: '', parent_phone: '', parent_email: '' })
    setSaved(false)
    setShowModal(true)
  }

  const savePatient = async () => {
    if (!form.full_name) return
    setSaving(true)
    try {
      await api.post('/patients', form)
      setSaved(true)
      loadPatients()
      setTimeout(() => { setShowModal(false); setSaved(false) }, 1200)
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  const getAge = (dob) => dob ? new Date().getFullYear() - new Date(dob).getFullYear() : null
  const getInitials = (name) => name?.split(' ').map(n => n[0]).slice(0,2).join('') || '?'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-teal-900 font-bold">Pacientes</h1>
          <p className="text-gray-400 text-sm mt-0.5">{patients.length} pacientes</p>
        </div>
        <button onClick={openModal}
          className="flex items-center gap-2 bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-teal-800 transition-colors shadow-md">
          <Plus size={15} /> Novo Paciente
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar por nome..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className={`${selected ? 'lg:col-span-1' : 'lg:col-span-3'} space-y-2`}>
          {loading ? (
            [1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse h-20" />
            ))
          ) : patients.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <User size={36} className="mx-auto mb-3 opacity-20" />
              <p className="font-medium">Nenhum paciente encontrado</p>
              <p className="text-sm mt-1">Clique em "Novo Paciente" para adicionar</p>
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
                  <p className="text-gray-400 text-xs mt-0.5">{p.parent_name || 'Sem encarregado associado'}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 text-gray-300 text-xs"><FileText size={12} />{p.note_count || 0}</div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selected && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50/50">
              <h2 className="font-semibold text-gray-800 text-sm">Ficha do Paciente</h2>
              <button onClick={() => { setSelected(null); setDetail(null) }} className="text-gray-400 hover:text-gray-600 p-1"><X size={18} /></button>
            </div>
            {loadingDetail ? (
              <div className="p-8 text-center text-gray-400">A carregar...</div>
            ) : detail && (
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">{getInitials(detail.full_name)}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-teal-900 font-bold">{detail.full_name}</h3>
                    <p className="text-gray-400 text-sm">
                      {getAge(detail.date_of_birth) ? `${getAge(detail.date_of_birth)} anos` : ''}
                      {detail.gender ? ` · ${detail.gender}` : ''}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Data Nasc.', value: detail.date_of_birth ? new Date(detail.date_of_birth).toLocaleDateString('pt-PT') : '—' },
                    { label: 'Género', value: detail.gender || '—' },
                    { label: 'Consultas', value: detail.appointments?.length || 0 },
                    { label: 'Sumários', value: detail.session_notes?.length || 0 },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm text-gray-700 font-semibold mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>

                {(detail.parent_name || detail.parent_email || detail.parent_phone) && (
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Encarregado</p>
                    <div className="space-y-2">
                      {detail.parent_name && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                          <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0"><User size={14} className="text-teal-600" /></div>
                          <span className="text-sm text-gray-600 font-medium">{detail.parent_name}</span>
                        </div>
                      )}
                      {detail.parent_phone && (
                        <a href={'tel:' + detail.parent_phone} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0"><Phone size={14} className="text-green-600" /></div>
                          <span className="text-sm text-gray-600">{detail.parent_phone}</span>
                        </a>
                      )}
                      {detail.parent_email && (
                        <a href={'mailto:' + detail.parent_email} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0"><Mail size={14} className="text-blue-600" /></div>
                          <span className="text-sm text-gray-600">{detail.parent_email}</span>
                        </a>
                      )}
                    </div>
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
                        <div key={i} className="p-3 rounded-xl border border-gray-100 hover:border-teal-200 transition-colors">
                          <p className="text-xs text-gray-400 mb-1">{new Date(n.created_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{n.content}</p>
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

      {/* Modal Novo Paciente */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 sticky top-0 bg-white rounded-t-3xl z-10">
                <div>
                  <h2 className="font-display text-xl text-teal-900 font-bold">Novo Paciente</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Preencha os dados do paciente</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-3">Dados do Paciente</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Nome completo *</label>
                      <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                        placeholder="Nome do paciente"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Data de Nascimento</label>
                        <input type="date" value={form.date_of_birth} onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Género</label>
                        <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                          <option value="">Selecionar</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Feminino">Feminino</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Notas clínicas</label>
                      <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        rows={3} placeholder="Diagnóstico, observações relevantes..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-3">Encarregado de Educação</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Nome</label>
                      <input value={form.parent_name} onChange={e => setForm(f => ({ ...f, parent_name: e.target.value }))}
                        placeholder="Nome do encarregado"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Telefone</label>
                        <input value={form.parent_phone} onChange={e => setForm(f => ({ ...f, parent_phone: e.target.value }))}
                          placeholder="9XX XXX XXX"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email</label>
                        <input type="email" value={form.parent_email} onChange={e => setForm(f => ({ ...f, parent_email: e.target.value }))}
                          placeholder="email@exemplo.pt"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <button onClick={savePatient} disabled={!form.full_name || saving}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all ${
                    saved ? 'bg-green-500 text-white' :
                    form.full_name ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-lg' :
                    'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}>
                  {saved ? <><CheckCircle size={16} /> Paciente adicionado!</> :
                   saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> A guardar...</> :
                   <><Save size={16} /> Adicionar Paciente</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

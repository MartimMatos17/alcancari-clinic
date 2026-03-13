import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Save, CheckCircle, AlertCircle, FileText, Clock, ChevronRight, Plus } from 'lucide-react'
import api from '../../lib/api'

const EVOLUTION_OPTIONS = ['Muito Positiva', 'Positiva', 'Estável', 'Negativa', 'Muito Negativa']
const EVOLUTION_COLORS = {
  'Muito Positiva': 'bg-green-100 text-green-700 border-green-200',
  'Positiva':       'bg-teal-100 text-teal-700 border-teal-200',
  'Estável':        'bg-blue-100 text-blue-700 border-blue-200',
  'Negativa':       'bg-orange-100 text-orange-700 border-orange-200',
  'Muito Negativa': 'bg-red-100 text-red-700 border-red-200',
}

export default function SessionNotesPage() {
  const [patients, setPatients] = useState([])
  const [allNotes, setAllNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientNotes, setPatientNotes] = useState([])
  const [loadingNotes, setLoadingNotes] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ content: '', objectives: '', evolution: '', next_steps: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [pRes, nRes] = await Promise.all([
        api.get('/patients'),
        api.get('/session-notes'),
      ])
      setPatients(pRes.data)
      setAllNotes(nRes.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const loadPatientNotes = async (patient) => {
    setSelectedPatient(patient)
    setEditing(null)
    setLoadingNotes(true)
    try {
      const res = await api.get('/session-notes', { params: { patient_id: patient.id } })
      setPatientNotes(res.data)
    } catch (err) { console.error(err) }
    setLoadingNotes(false)
  }

  const openEdit = (note) => {
    setEditing(note)
    setForm({ content: note.content || '', objectives: note.objectives || '', evolution: note.evolution || '', next_steps: note.next_steps || '' })
    setSaved(false)
  }

  const openNew = () => {
    const latest = patientNotes[0]
    setEditing({ appointment_id: latest?.appointment_id || null, patient_id: selectedPatient.id, patient_name: selectedPatient.full_name, start_time: new Date().toISOString(), isNew: true })
    setForm({ content: '', objectives: '', evolution: '', next_steps: '' })
    setSaved(false)
  }

  const saveNote = async () => {
    if (!form.content) return
    setSaving(true)
    try {
      if (editing.id) {
        await api.put('/session-notes/' + editing.id, form)
      } else {
        await api.post('/session-notes', { ...form, appointment_id: editing.appointment_id, patient_id: editing.patient_id })
      }
      setSaved(true)
      const res = await api.get('/session-notes', { params: { patient_id: selectedPatient.id } })
      setPatientNotes(res.data)
      await loadAll()
      setTimeout(() => { setEditing(null); setSaved(false) }, 1200)
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  const getAge = (dob) => dob ? new Date().getFullYear() - new Date(dob).getFullYear() : null
  const getInitials = (name) => name?.split(' ').map(n => n[0]).slice(0, 2).join('') || '?'
  const formatDate = (ts) => new Date(ts).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })
  const formatTime = (ts) => new Date(ts).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
  const getPending = (pid) => allNotes.filter(n => n.patient_id === pid && !n.content).length
  const getDone = (pid) => allNotes.filter(n => n.patient_id === pid && n.content).length
  const totalPending = allNotes.filter(n => !n.content).length
  const filteredPatients = patients.filter(p => !search || p.full_name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-teal-900 font-bold">Sumários de Sessão</h1>
        <p className="text-sm mt-0.5">
          {totalPending > 0
            ? <span className="text-amber-500 font-semibold">{totalPending} sumários por preencher</span>
            : <span className="text-green-500 font-semibold">Todos preenchidos ✓</span>}
          <span className="text-gray-300 mx-2">·</span>
          <span className="text-gray-400">{patients.length} pacientes</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Lista pacientes */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar paciente..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}</div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">Nenhum paciente encontrado</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredPatients.map((p, i) => {
                  const pending = getPending(p.id)
                  const done = getDone(p.id)
                  const isSelected = selectedPatient?.id === p.id
                  return (
                    <motion.button key={p.id} onClick={() => loadPatientNotes(p)}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-teal-50/50 transition-colors text-left ${isSelected ? 'bg-teal-50' : ''}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm text-white ${isSelected ? 'bg-teal-600' : 'bg-gradient-to-br from-teal-400 to-teal-600'}`}>
                        {getInitials(p.full_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm truncate ${isSelected ? 'text-teal-700' : 'text-gray-800'}`}>
                          {p.full_name}
                          {getAge(p.date_of_birth) && <span className="font-normal text-gray-400"> ({getAge(p.date_of_birth)}a)</span>}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {done > 0 && <span className="text-xs text-teal-600 font-medium">{done} sumário{done > 1 ? 's' : ''}</span>}
                          {pending > 0 && <span className="text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-semibold">{pending} pendente{pending > 1 ? 's' : ''}</span>}
                          {done === 0 && pending === 0 && <span className="text-xs text-gray-300">Sem sessões</span>}
                        </div>
                      </div>
                      <ChevronRight size={15} className={`flex-shrink-0 ${isSelected ? 'text-teal-500' : 'text-gray-300'}`} />
                    </motion.button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Painel direito */}
        <div className="lg:col-span-3 space-y-4">
          {!selectedPatient ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 text-gray-400">
              <FileText size={48} className="opacity-10 mb-4" />
              <p className="font-medium">Selecione um paciente</p>
              <p className="text-sm mt-1">para ver e gerir os sumários de sessão</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                      {getInitials(selectedPatient.full_name)}
                    </div>
                    <div>
                      <h2 className="font-display text-lg text-teal-900 font-bold">{selectedPatient.full_name}</h2>
                      <p className="text-gray-400 text-sm">
                        {getAge(selectedPatient.date_of_birth) ? `${getAge(selectedPatient.date_of_birth)} anos` : ''}
                        {selectedPatient.gender ? ` · ${selectedPatient.gender}` : ''}
                      </p>
                    </div>
                  </div>
                  <button onClick={openNew}
                    className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors shadow-md">
                    <Plus size={14} /> Novo Sumário
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {editing && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-2xl border-2 border-teal-200 shadow-lg overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 bg-teal-50 border-b border-teal-100">
                      <div>
                        <h3 className="font-semibold text-teal-900 text-sm">{editing.id ? 'Editar sumário' : 'Novo sumário'}</h3>
                        {!editing.isNew && <p className="text-teal-600 text-xs mt-0.5">{formatDate(editing.start_time)} · {formatTime(editing.start_time)}</p>}
                      </div>
                      <button onClick={() => setEditing(null)} className="w-7 h-7 rounded-full bg-teal-100 hover:bg-teal-200 flex items-center justify-center text-teal-600"><X size={14} /></button>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Objetivos</label>
                        <input value={form.objectives} onChange={e => setForm(f => ({ ...f, objectives: e.target.value }))}
                          placeholder="Objetivos terapêuticos trabalhados..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Sumário <span className="text-red-400">*</span></label>
                        <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                          rows={5} placeholder="Descreva a sessão, atividades, comportamentos, progressos observados..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Evolução</label>
                        <div className="flex flex-wrap gap-2">
                          {EVOLUTION_OPTIONS.map(opt => (
                            <button key={opt} type="button" onClick={() => setForm(f => ({ ...f, evolution: opt }))}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${form.evolution === opt ? EVOLUTION_COLORS[opt] : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Próxima sessão</label>
                        <textarea value={form.next_steps} onChange={e => setForm(f => ({ ...f, next_steps: e.target.value }))}
                          rows={2} placeholder="Plano para a próxima sessão..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
                      </div>
                      <button onClick={saveNote} disabled={!form.content || saving}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${saved ? 'bg-green-500 text-white' : form.content ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-lg' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
                        {saved ? <><CheckCircle size={15} /> Guardado!</> : saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> A guardar...</> : <><Save size={15} /> {editing.id ? 'Atualizar' : 'Guardar Sumário'}</>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Histórico de sessões</h3>
                {loadingNotes ? (
                  [1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />)
                ) : patientNotes.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 text-center py-10 text-gray-400">
                    <p className="text-sm">Sem sessões registadas para este paciente</p>
                  </div>
                ) : patientNotes.map((note, i) => {
                  const isPending = !note.content
                  const isEditing = editing?.appointment_id === note.appointment_id
                  return (
                    <motion.div key={note.appointment_id}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      onClick={() => openEdit(note)}
                      className={`bg-white rounded-2xl border cursor-pointer transition-all hover:shadow-md ${isEditing ? 'border-teal-400 shadow-md' : isPending ? 'border-amber-200 hover:border-amber-300' : 'border-gray-100 hover:border-teal-200'}`}>
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isPending ? 'bg-amber-50' : 'bg-teal-50'}`}>
                            {isPending ? <AlertCircle size={16} className="text-amber-500" /> : <CheckCircle size={16} className="text-teal-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs text-gray-500 font-medium">{note.therapist_name}</p>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs font-semibold text-gray-600">{formatDate(note.start_time)}</p>
                                <p className="text-xs text-gray-400 flex items-center gap-1 justify-end mt-0.5"><Clock size={9} />{formatTime(note.start_time)}</p>
                              </div>
                            </div>
                            {isPending ? (
                              <span className="inline-block mt-1.5 text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">⚠️ Por preencher — clique para escrever</span>
                            ) : (
                              <div className="mt-1.5 space-y-1">
                                {note.evolution && <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium border ${EVOLUTION_COLORS[note.evolution] || ''}`}>{note.evolution}</span>}
                                <p className="text-xs text-gray-500 line-clamp-2">{note.content}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

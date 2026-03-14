import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Save, CheckCircle, AlertCircle, FileText, ChevronRight, Plus, Trash2, Edit3, ArrowLeft } from 'lucide-react'
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
  const [deleteConfirm, setDeleteConfirm] = useState(null)

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
    const latest = patientNotes.find(n => !n.content)
    setEditing({
      appointment_id: latest?.appointment_id || null,
      patient_id: selectedPatient.id,
      patient_name: selectedPatient.full_name,
      start_time: new Date().toISOString(),
      isNew: true
    })
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
        await api.post('/session-notes', {
          ...form,
          appointment_id: editing.appointment_id,
          patient_id: editing.patient_id
        })
      }
      setSaved(true)
      const res = await api.get('/session-notes', { params: { patient_id: selectedPatient.id } })
      setPatientNotes(res.data)
      await loadAll()
      setTimeout(() => { setEditing(null); setSaved(false) }, 1200)
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  const deleteNote = async (id) => {
    try {
      await api.delete('/session-notes/' + id)
      setPatientNotes(prev => prev.filter(n => n.id !== id))
      setDeleteConfirm(null)
      await loadAll()
    } catch (err) { console.error(err) }
  }

  const filtered = patients.filter(p =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  )

  const pendingCount = (pid) => allNotes.filter(n => n.patient_id === pid && !n.content).length
  const noteCount = (pid) => allNotes.filter(n => n.patient_id === pid && n.content).length

  // Vista de edição
  if (editing) return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setEditing(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Voltar
        </button>
        <div>
          <h1 className="font-display text-2xl text-teal-900 font-bold">
            {editing.id ? 'Editar sumário' : 'Novo sumário'}
          </h1>
          <p className="text-gray-400 text-sm">
            {editing.patient_name} · {new Date(editing.start_time).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Evolução da sessão</label>
          <div className="flex flex-wrap gap-2">
            {EVOLUTION_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setForm(f => ({ ...f, evolution: opt }))}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                  form.evolution === opt
                    ? EVOLUTION_COLORS[opt] + ' border-current shadow-sm'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Conteúdo da sessão *</label>
          <textarea
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            placeholder="Descreva o que foi trabalhado na sessão..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Objetivos</label>
            <textarea
              value={form.objectives}
              onChange={e => setForm(f => ({ ...f, objectives: e.target.value }))}
              placeholder="Objetivos terapêuticos..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Próximos passos</label>
            <textarea
              value={form.next_steps}
              onChange={e => setForm(f => ({ ...f, next_steps: e.target.value }))}
              placeholder="O que trabalhar na próxima sessão..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <button onClick={() => setEditing(null)}
            className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">
            Cancelar
          </button>
          <button onClick={saveNote} disabled={saving || !form.content}
            className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-full transition-all text-sm">
            {saved ? (
              <><CheckCircle size={16} /> Guardado!</>
            ) : saving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> A guardar...</>
            ) : (
              <><Save size={16} /> Guardar sumário</>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  // Vista de paciente selecionado
  if (selectedPatient) return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedPatient(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Voltar
          </button>
          <div>
            <h1 className="font-display text-2xl text-teal-900 font-bold">{selectedPatient.full_name}</h1>
            <p className="text-gray-400 text-sm">{patientNotes.filter(n => n.content).length} sumários registados</p>
          </div>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
          <Plus size={15} /> Novo sumário
        </button>
      </div>

      {loadingNotes ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
        </div>
      ) : patientNotes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <FileText size={32} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-400">Sem sumários para este paciente</p>
          <button onClick={openNew} className="mt-4 text-teal-600 text-sm font-semibold hover:underline">
            Criar primeiro sumário
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {patientNotes.map((note, i) => (
            <motion.div key={note.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold text-gray-700 text-sm">
                      {new Date(note.start_time).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {note.evolution && (
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${EVOLUTION_COLORS[note.evolution] || 'bg-gray-100 text-gray-600'}`}>
                        {note.evolution}
                      </span>
                    )}
                    {!note.content && (
                      <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                        <AlertCircle size={11} /> Pendente
                      </span>
                    )}
                  </div>

                  {note.content ? (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{note.content}</p>
                  ) : (
                    <p className="text-gray-300 text-sm italic">Sumário por preencher</p>
                  )}

                  {note.therapist_name && (
                    <p className="text-gray-400 text-xs">Terapeuta: {note.therapist_name}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(note)}
                    className="flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                    <Edit3 size={13} /> Editar
                  </button>
                  {note.id && (
                    <button onClick={() => setDeleteConfirm(note.id)}
                      className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                      <Trash2 size={13} /> Apagar
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de confirmação de apagar */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="font-display text-xl text-gray-800">Apagar sumário?</h3>
              <p className="text-gray-400 text-sm">Esta ação não pode ser revertida.</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  Cancelar
                </button>
                <button onClick={() => deleteNote(deleteConfirm)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                  Apagar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  // Vista principal — lista de pacientes
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-teal-900 font-bold">Sumários</h1>
          <p className="text-gray-400 text-sm mt-1">{patients.length} pacientes · {allNotes.filter(n => n.content).length} sumários</p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Pesquisar paciente..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p, i) => {
            const pending = pendingCount(p.id)
            const notes = noteCount(p.id)
            const initials = p.full_name.split(' ').slice(0,2).map(n => n[0]).join('')
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <button onClick={() => loadPatientNotes(p)}
                  className="w-full flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-teal-100 transition-all text-left">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{p.full_name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <FileText size={11} /> {notes} sumário{notes !== 1 ? 's' : ''}
                      </span>
                      {pending > 0 && (
                        <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <AlertCircle size={10} /> {pending} pendente{pending > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                </button>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

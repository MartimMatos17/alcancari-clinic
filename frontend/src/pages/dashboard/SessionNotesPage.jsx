import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, X, Save, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import api from '../../lib/api'

const EVOLUTION_OPTIONS = ['Muito Positiva', 'Positiva', 'Estável', 'Negativa', 'Muito Negativa']
const EVOLUTION_COLORS = {
  'Muito Positiva': 'bg-green-100 text-green-700 border-green-300',
  'Positiva':       'bg-teal-100 text-teal-700 border-teal-300',
  'Estável':        'bg-blue-100 text-blue-700 border-blue-300',
  'Negativa':       'bg-orange-100 text-orange-700 border-orange-300',
  'Muito Negativa': 'bg-red-100 text-red-700 border-red-300',
}

export default function SessionNotesPage() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ content: '', objectives: '', evolution: '', next_steps: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { loadNotes() }, [filter])

  const loadNotes = async () => {
    setLoading(true)
    try {
      const params = {}
      const res = await api.get('/session-notes', { params })
      setNotes(res.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const filtered = notes.filter(n => {
    const matchSearch = !search || n.patient_name?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' ||
      (filter === 'done' && n.content) ||
      (filter === 'pending' && !n.content)
    return matchSearch && matchFilter
  })

  const openEdit = (note) => {
    setEditing(note)
    setForm({ content: note.content || '', objectives: note.objectives || '', evolution: note.evolution || '', next_steps: note.next_steps || '' })
    setSaved(false)
  }

  const saveNote = async () => {
    setSaving(true)
    try {
      if (editing.id) {
        await api.put('/session-notes/' + editing.id, form)
      } else {
        await api.post('/session-notes', { ...form, appointment_id: editing.appointment_id, patient_id: editing.patient_id })
      }
      setSaved(true)
      loadNotes()
      setTimeout(() => { setEditing(null); setSaved(false) }, 1200)
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  const getAge = (dob) => dob ? new Date().getFullYear() - new Date(dob).getFullYear() : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-teal-900 font-bold">Sumários de Sessão</h1>
          <p className="text-gray-400 text-sm mt-0.5">{notes.filter(n => !n.content).length} por preencher</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar por paciente..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white" />
        </div>
        <div className="flex gap-2">
          {[['all','Todos'],['pending','Pendentes'],['done','Completos']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${filter === val ? 'bg-teal-700 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-teal-300'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className={`${editing ? 'lg:col-span-2' : 'lg:col-span-5'} space-y-3`}>
          {loading ? (
            <div className="text-center py-12 text-gray-400">A carregar...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <FileText size={32} className="mx-auto mb-3 opacity-30" />
              <p>Nenhum sumário encontrado</p>
            </div>
          ) : filtered.map((note, i) => {
            const isPending = !note.content
            return (
              <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => openEdit(note)}
                className={`bg-white rounded-2xl border cursor-pointer hover:shadow-md transition-all ${
                  editing?.id === note.id ? 'border-teal-400 shadow-md' : isPending ? 'border-amber-200' : 'border-gray-100 hover:border-teal-200'
                }`}>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isPending ? 'bg-amber-50' : 'bg-teal-50'}`}>
                        {isPending ? <AlertCircle size={18} className="text-amber-500" /> : <CheckCircle size={18} className="text-teal-500" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm">
                          {note.patient_name}
                          {getAge(note.date_of_birth) && <span className="text-gray-400 font-normal"> ({getAge(note.date_of_birth)} anos)</span>}
                        </p>
                        <p className="text-gray-400 text-xs truncate">{note.therapist_name}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-gray-400 text-xs">{new Date(note.created_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>

                  {!isPending && note.evolution && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${EVOLUTION_COLORS[note.evolution] || 'bg-gray-100 text-gray-600'}`}>
                        {note.evolution}
                      </span>
                      <p className="text-gray-400 text-xs truncate flex-1">{note.content?.substring(0, 60)}...</p>
                    </div>
                  )}
                  {isPending && (
                    <div className="mt-3">
                      <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1 rounded-full font-semibold">
                        Sumário por preencher — clique para escrever
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        <AnimatePresence>
          {editing && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit sticky top-6">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                <div>
                  <h2 className="font-semibold text-gray-800 text-sm">{editing.patient_name}</h2>
                  <p className="text-gray-400 text-xs">{new Date(editing.created_at).toLocaleDateString('pt-PT')}</p>
                </div>
                <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600 p-1"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Objetivos da sessão</label>
                  <input value={form.objectives} onChange={e => setForm(f => ({ ...f, objectives: e.target.value }))}
                    placeholder="Objetivos terapêuticos..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Sumário da sessão *</label>
                  <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    rows={6} placeholder="Descreva o decorrer da sessão, atividades realizadas, progressos..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
                  <p className="text-xs text-gray-300 mt-1 text-right">{form.content?.length || 0} caracteres</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Evolução</label>
                  <div className="flex flex-wrap gap-2">
                    {EVOLUTION_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => setForm(f => ({ ...f, evolution: opt }))}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${form.evolution === opt ? (EVOLUTION_COLORS[opt] || '') : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Próxima sessão</label>
                  <textarea value={form.next_steps} onChange={e => setForm(f => ({ ...f, next_steps: e.target.value }))}
                    rows={3} placeholder="Plano para a próxima sessão..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
                </div>
                <button onClick={saveNote} disabled={!form.content || saving}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                    saved ? 'bg-green-500 text-white' :
                    form.content ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-lg' :
                    'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}>
                  {saved ? <><CheckCircle size={16} /> Guardado!</> :
                   saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> A guardar...</> :
                   <><Save size={16} /> Guardar Sumário</>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

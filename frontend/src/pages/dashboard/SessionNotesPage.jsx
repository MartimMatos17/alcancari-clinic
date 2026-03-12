import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Plus, X, ChevronDown, FileText } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

export default function SessionNotesPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editNote, setEditNote] = useState(null)
  const [form, setForm] = useState({ patient_id: '', content: '', objectives: '', evolution: '', next_steps: '' })

  const { data: patients = [] } = useQuery({ queryKey: ['patients'], queryFn: () => api.get('/patients').then(r => r.data) })
  const { data: notes = [] } = useQuery({
    queryKey: ['session-notes', selectedPatient],
    queryFn: () => api.get('/session-notes', { params: { patient_id: selectedPatient } }).then(r => r.data)
  })

  const saveNote = useMutation({
    mutationFn: data => editNote ? api.put(`/session-notes/${editNote.id}`, data) : api.post('/session-notes', data),
    onSuccess: () => {
      qc.invalidateQueries(['session-notes'])
      setShowModal(false)
      setEditNote(null)
      setForm({ patient_id: '', content: '', objectives: '', evolution: '', next_steps: '' })
      toast.success(editNote ? 'Sumário atualizado!' : 'Sumário criado!')
    }
  })

  const openEdit = (note) => {
    setEditNote(note)
    setForm({ content: note.content, objectives: note.objectives || '', evolution: note.evolution || '', next_steps: note.next_steps || '' })
    setShowModal(true)
  }

  const filteredPatients = patients.filter(p => p.full_name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-teal-800">Sumários</h1>
          <p className="text-gray-500 text-sm">Registos de sessões terapêuticas</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Novo Sumário
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient list */}
        <div className="card p-4 space-y-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar paciente..."
              className="w-full pl-9 pr-4 py-2.5 border border-sand-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            <button onClick={() => setSelectedPatient(null)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${!selectedPatient ? 'bg-teal-50 text-teal-700 font-medium' : 'hover:bg-sand-50 text-gray-700'}`}>
              Todos os pacientes
            </button>
            {filteredPatients.map(p => (
              <button key={p.id} onClick={() => setSelectedPatient(p.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${selectedPatient === p.id ? 'bg-teal-50 text-teal-700 font-medium' : 'hover:bg-sand-50 text-gray-700'}`}>
                {p.full_name}
                <span className="block text-xs text-gray-400">
                  {p.date_of_birth ? `${format(new Date(p.date_of_birth), 'd MMM yyyy', { locale: pt })}` : 'Sem data'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes list */}
        <div className="lg:col-span-2 space-y-4">
          {notes.length === 0 ? (
            <div className="card p-12 text-center text-gray-400">
              <FileText size={40} className="mx-auto mb-3 opacity-30" />
              <p>Nenhum sumário encontrado</p>
            </div>
          ) : notes.map(note => (
            <div key={note.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{note.patient_name}</p>
                  <p className="text-xs text-gray-400">{note.therapist_name} • {format(new Date(note.created_at), 'd MMMM yyyy, HH:mm', { locale: pt })}</p>
                </div>
                <button onClick={() => openEdit(note)} className="text-xs text-teal-600 hover:underline">Editar</button>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <span className="text-xs font-semibold uppercase text-gray-400 block mb-0.5">Sessão</span>
                  <p className="line-clamp-2">{note.content}</p>
                </div>
                {note.evolution && (
                  <div>
                    <span className="text-xs font-semibold uppercase text-gray-400 block mb-0.5">Evolução</span>
                    <p className="line-clamp-1 text-green-700">{note.evolution}</p>
                  </div>
                )}
                {note.next_steps && (
                  <div>
                    <span className="text-xs font-semibold uppercase text-gray-400 block mb-0.5">Próximos Passos</span>
                    <p className="line-clamp-1 text-blue-700">{note.next_steps}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-teal-800">{editNote ? 'Editar Sumário' : 'Novo Sumário'}</h2>
              <button onClick={() => { setShowModal(false); setEditNote(null) }} className="p-2 rounded-xl hover:bg-sand-100"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              {!editNote && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Paciente *</label>
                  <select value={form.patient_id} onChange={e => setForm(f => ({ ...f, patient_id: e.target.value }))}
                    className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="">Selecionar paciente...</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                  </select>
                </div>
              )}

              {[
                { key: 'content', label: 'Descrição da Sessão *', rows: 4 },
                { key: 'objectives', label: 'Objetivos Trabalhados', rows: 3 },
                { key: 'evolution', label: 'Evolução Observada', rows: 3 },
                { key: 'next_steps', label: 'Próximos Passos', rows: 3 },
              ].map(({ key, label, rows }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <textarea value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    rows={rows} className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setEditNote(null) }} className="flex-1 btn-outline text-sm">Cancelar</button>
              <button onClick={() => saveNote.mutate(form)} disabled={saveNote.isPending} className="flex-1 btn-primary text-sm">
                {saveNote.isPending ? 'A guardar...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

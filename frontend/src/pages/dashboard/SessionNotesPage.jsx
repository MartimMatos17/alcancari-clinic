import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, X, Save, ChevronDown, Clock, User, FileText, CheckCircle, AlertCircle } from 'lucide-react'

const INITIAL_NOTES = [
  { id: 1, patient: 'Maria Silva', age: 6, service: 'Terapia Ocupacional', therapist: 'Alexandra Fernandes', date: '2026-03-12', time: '09:00', status: 'done', content: 'A criança demonstrou boa tolerância à estimulação tátil. Trabalhámos atividades de motricidade fina com plasticina. Evolução positiva na coordenação bimanual. Próxima sessão: continuar trabalho de integração sensorial com foco no sistema propriocetivo.', objectives: 'Melhorar integração sensorial tátil e propriocetiva.', evolution: 'Positiva', nextSession: 'Continuar atividades de integração sensorial.' },
  { id: 2, patient: 'João Santos', age: 4, service: 'Terapia da Fala', therapist: 'Luísa Perdiz', date: '2026-03-12', time: '10:00', status: 'done', content: 'Sessão focada na articulação do fonema /r/. A criança mostrou progresso significativo. Jogos com imagens e repetição de sílabas. Boa adesão às atividades propostas.', objectives: 'Trabalhar articulação de fonemas em falta.', evolution: 'Muito Positiva', nextSession: 'Avançar para palavras com /r/ inicial.' },
  { id: 3, patient: 'Beatriz Nunes', age: 9, service: 'Psicologia', therapist: 'Filipa Lima', date: '2026-03-11', time: '15:00', status: 'pending', content: '', objectives: 'Gestão de ansiedade escolar.', evolution: '', nextSession: '' },
  { id: 4, patient: 'Sofia Lima', age: 7, service: 'Floortime', therapist: 'Joana Martins', date: '2026-03-10', time: '14:00', status: 'done', content: 'Sessão de jogo livre com mediação terapêutica. A criança iniciou brincadeira simbólica com os bonecos. Excelente avanço na comunicação intencional. Muito boa sessão.', objectives: 'Desenvolver jogo simbólico e comunicação intencional.', evolution: 'Muito Positiva', nextSession: 'Expandir temáticas do jogo simbólico.' },
  { id: 5, patient: 'Pedro Rocha', age: 5, service: 'Fisioterapia', therapist: 'Alexandra Fernandes', date: '2026-03-12', time: '14:00', status: 'pending', content: '', objectives: 'Melhorar tónus muscular e coordenação.', evolution: '', nextSession: '' },
]

const EVOLUTION_OPTIONS = ['Muito Positiva', 'Positiva', 'Estável', 'Negativa', 'Muito Negativa']
const EVOLUTION_COLORS = {
  'Muito Positiva': 'bg-green-100 text-green-700',
  'Positiva': 'bg-teal-100 text-teal-700',
  'Estável': 'bg-blue-100 text-blue-700',
  'Negativa': 'bg-orange-100 text-orange-700',
  'Muito Negativa': 'bg-red-100 text-red-700',
}

export default function SessionNotesPage() {
  const [notes, setNotes] = useState(INITIAL_NOTES)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saved, setSaved] = useState(false)

  const filtered = notes.filter(n => {
    const matchSearch = n.patient.toLowerCase().includes(search.toLowerCase()) ||
      n.service.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || n.status === filter
    return matchSearch && matchFilter
  })

  const openEdit = (note) => {
    setEditing(note.id)
    setForm({ content: note.content, objectives: note.objectives, evolution: note.evolution, nextSession: note.nextSession })
    setSaved(false)
  }

  const saveNote = () => {
    setNotes(prev => prev.map(n => n.id === editing ? { ...n, ...form, status: 'done' } : n))
    setSaved(true)
    setTimeout(() => { setEditing(null); setSaved(false) }, 1200)
  }

  const editingNote = notes.find(n => n.id === editing)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-teal-900 font-bold">Sumários de Sessão</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {notes.filter(n => n.status === 'pending').length} sumários por preencher
          </p>
        </div>
        <button className="flex items-center gap-2 bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-teal-800 transition-colors">
          <Plus size={15} /> Novo Sumário
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar por paciente ou serviço..."
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

        {/* Lista */}
        <div className={`${editing ? 'lg:col-span-2' : 'lg:col-span-5'} space-y-3`}>
          {filtered.map((note, i) => (
            <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl border transition-all hover:shadow-md cursor-pointer ${
                editing === note.id ? 'border-teal-400 shadow-md' : note.status === 'pending' ? 'border-amber-200' : 'border-gray-100 hover:border-teal-200'
              }`}
              onClick={() => openEdit(note)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${note.status === 'pending' ? 'bg-amber-50' : 'bg-teal-50'}`}>
                      {note.status === 'pending'
                        ? <AlertCircle size={18} className="text-amber-500" />
                        : <CheckCircle size={18} className="text-teal-500" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">{note.patient} <span className="text-gray-400 font-normal">({note.age} anos)</span></p>
                      <p className="text-gray-400 text-xs truncate">{note.service} · {note.therapist}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-gray-400 text-xs justify-end">
                      <Clock size={11} /> {note.time}
                    </div>
                    <p className="text-gray-300 text-xs mt-0.5">{new Date(note.date + 'T12:00').toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>

                {!editing && note.status === 'done' && note.evolution && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${EVOLUTION_COLORS[note.evolution] || 'bg-gray-100 text-gray-600'}`}>
                      {note.evolution}
                    </span>
                    {note.content && <p className="text-gray-400 text-xs truncate flex-1">{note.content.substring(0, 60)}...</p>}
                  </div>
                )}

                {note.status === 'pending' && (
                  <div className="mt-3">
                    <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1 rounded-full font-semibold">
                      ⚠️ Sumário por preencher — clique para escrever
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <FileText size={32} className="mx-auto mb-3 opacity-30" />
              <p>Nenhum sumário encontrado</p>
            </div>
          )}
        </div>

        {/* Editor */}
        <AnimatePresence>
          {editing && editingNote && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit sticky top-6">

              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                <div>
                  <h2 className="font-semibold text-gray-800 text-sm">{editingNote.patient}</h2>
                  <p className="text-gray-400 text-xs">{editingNote.service} · {editingNote.date} {editingNote.time}</p>
                </div>
                <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5">

                {/* Objetivos */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Objetivos da sessão</label>
                  <input value={form.objectives} onChange={e => setForm(f => ({ ...f, objectives: e.target.value }))}
                    placeholder="Objetivos terapêuticos desta sessão..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all" />
                </div>

                {/* Sumário */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Sumário da sessão *</label>
                  <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    rows={6} placeholder="Descreva o decorrer da sessão, atividades realizadas, comportamento da criança, dificuldades encontradas e progressos observados..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all resize-none" />
                  <p className="text-xs text-gray-300 mt-1 text-right">{form.content?.length || 0} caracteres</p>
                </div>

                {/* Evolução */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Evolução</label>
                  <div className="flex flex-wrap gap-2">
                    {EVOLUTION_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => setForm(f => ({ ...f, evolution: opt }))}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                          form.evolution === opt
                            ? (EVOLUTION_COLORS[opt] || 'bg-teal-100 text-teal-700') + ' border-current'
                            : 'border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Próxima sessão */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Plano para próxima sessão</label>
                  <textarea value={form.nextSession} onChange={e => setForm(f => ({ ...f, nextSession: e.target.value }))}
                    rows={3} placeholder="O que trabalhar na próxima sessão..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all resize-none" />
                </div>

                {/* Guardar */}
                <button onClick={saveNote} disabled={!form.content}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                    saved ? 'bg-green-500 text-white' :
                    form.content ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-lg hover:-translate-y-0.5' :
                    'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}>
                  {saved
                    ? <><CheckCircle size={16} /> Sumário guardado!</>
                    : <><Save size={16} /> Guardar Sumário</>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

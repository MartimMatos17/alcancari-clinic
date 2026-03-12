import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Phone, Mail, FileText, ChevronRight, X } from 'lucide-react'

const PATIENTS = [
  { id: 1, name: 'Ana Costa', age: 8, dob: '2016-03-15', parent: 'Sofia Costa', phone: '912 345 678', email: 'sofia.costa@email.com', services: ['Psicologia'], therapist: 'Joana Bessa', unit: 'Leça da Palmeira', since: 'Jan 2024', notes: 3, status: 'active' },
  { id: 2, name: 'João Santos', age: 4, dob: '2020-07-22', parent: 'Carlos Santos', phone: '934 567 890', email: 'carlos.santos@email.com', services: ['Terapia da Fala'], therapist: 'Luísa Perdiz', unit: 'São Mamede', since: 'Mar 2024', notes: 5, status: 'active' },
  { id: 3, name: 'Maria Silva', age: 6, dob: '2018-11-08', parent: 'Ana Silva', phone: '923 456 789', email: 'ana.silva@email.com', services: ['Terapia Ocupacional', 'Integração Sensorial'], therapist: 'Alexandra Fernandes', unit: 'Leça da Palmeira', since: 'Jun 2023', notes: 12, status: 'active' },
  { id: 4, name: 'Pedro Rocha', age: 5, dob: '2019-04-30', parent: 'Miguel Rocha', phone: '916 789 012', email: 'miguel.rocha@email.com', services: ['Fisioterapia'], therapist: 'Alexandra Fernandes', unit: 'São Mamede', since: 'Set 2024', notes: 2, status: 'active' },
  { id: 5, name: 'Sofia Lima', age: 7, dob: '2017-09-12', parent: 'Patrícia Lima', phone: '961 234 567', email: 'patricia.lima@email.com', services: ['Floortime', 'Psicologia'], therapist: 'Joana Martins', unit: 'Leça da Palmeira', since: 'Fev 2024', notes: 8, status: 'active' },
  { id: 6, name: 'Miguel Ferreira', age: 3, dob: '2021-01-18', parent: 'Rui Ferreira', phone: '935 678 901', email: 'rui.ferreira@email.com', services: ['Integração Sensorial'], therapist: 'Inês Maia', unit: 'São Mamede', since: 'Out 2024', notes: 1, status: 'active' },
  { id: 7, name: 'Beatriz Nunes', age: 9, dob: '2015-06-25', parent: 'Teresa Nunes', phone: '917 890 123', email: 'teresa.nunes@email.com', services: ['Psicologia'], therapist: 'Filipa Lima', unit: 'Leça da Palmeira', since: 'Abr 2023', notes: 15, status: 'inactive' },
]

const SERVICE_COLORS = {
  'Psicologia': 'bg-purple-100 text-purple-700',
  'Terapia da Fala': 'bg-green-100 text-green-700',
  'Terapia Ocupacional': 'bg-orange-100 text-orange-700',
  'Fisioterapia': 'bg-blue-100 text-blue-700',
  'Floortime': 'bg-pink-100 text-pink-700',
  'Integração Sensorial': 'bg-indigo-100 text-indigo-700',
}

export default function PatientsPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  const filtered = PATIENTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.parent.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-teal-900 font-bold">Pacientes</h1>
          <p className="text-gray-400 text-sm mt-0.5">{PATIENTS.filter(p => p.status === 'active').length} pacientes ativos</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-teal-800 transition-colors">
          <Plus size={15} /> Novo Paciente
        </button>
      </div>

      {/* Filtros + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar por nome ou encarregado..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white" />
        </div>
        <div className="flex gap-2">
          {[['all', 'Todos'], ['active', 'Ativos'], ['inactive', 'Inativos']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${filter === val ? 'bg-teal-700 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-teal-300'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lista */}
        <div className={`${selected ? 'lg:col-span-1' : 'lg:col-span-3'} space-y-2`}>
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              onClick={() => setSelected(p)}
              className={`bg-white rounded-2xl p-4 border cursor-pointer hover:shadow-md transition-all ${selected?.id === p.id ? 'border-teal-400 shadow-md' : 'border-gray-100 hover:border-teal-200'}`}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{p.name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800 text-sm truncate">{p.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {p.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">{p.age} anos · {p.parent}</p>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {p.services.map(s => (
                      <span key={s} className={`text-xs px-2 py-0.5 rounded-full ${SERVICE_COLORS[s] || 'bg-gray-100 text-gray-600'}`}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 text-gray-300 text-xs">
                    <FileText size={12} /> {p.notes}
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p>Nenhum paciente encontrado</p>
            </div>
          )}
        </div>

        {/* Detalhe */}
        {selected && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-800">Ficha do Paciente</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-6">
              {/* Header paciente */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{selected.name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
                </div>
                <div>
                  <h3 className="font-display text-xl text-teal-900 font-bold">{selected.name}</h3>
                  <p className="text-gray-400 text-sm">{selected.age} anos · Paciente desde {selected.since}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {selected.services.map(s => (
                      <span key={s} className={`text-xs px-2.5 py-1 rounded-full font-medium ${SERVICE_COLORS[s] || 'bg-gray-100 text-gray-600'}`}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Encarregado', value: selected.parent },
                  { label: 'Terapeuta', value: selected.therapist },
                  { label: 'Unidade', value: selected.unit },
                  { label: 'Data Nasc.', value: new Date(selected.dob).toLocaleDateString('pt-PT') },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{item.label}</p>
                    <p className="text-sm text-gray-700 font-medium mt-1">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Contactos */}
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Contactos</p>
                <a href={"tel:" + selected.phone.replace(/ /g,'')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center"><Phone size={14} className="text-teal-600" /></div>
                  <span className="text-sm text-gray-600">{selected.phone}</span>
                </a>
                <a href={"mailto:" + selected.email} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><Mail size={14} className="text-blue-600" /></div>
                  <span className="text-sm text-gray-600">{selected.email}</span>
                </a>
              </div>

              {/* Ações */}
              <div className="flex gap-3 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-teal-700 text-white text-sm font-semibold py-3 rounded-xl hover:bg-teal-800 transition-colors">
                  <FileText size={15} /> Ver Sumários ({selected.notes})
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 border border-teal-200 text-teal-700 text-sm font-semibold py-3 rounded-xl hover:bg-teal-50 transition-colors">
                  <Plus size={15} /> Novo Sumário
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

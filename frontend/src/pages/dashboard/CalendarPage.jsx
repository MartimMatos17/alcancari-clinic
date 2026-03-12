import { useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { pt } from 'date-fns/locale'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, X, Clock, User } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = dateFnsLocalizer({
  format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay, locales: { 'pt-PT': pt }
})

const messages = {
  today: 'Hoje', previous: '‹', next: '›',
  month: 'Mês', week: 'Semana', day: 'Dia', agenda: 'Agenda',
  date: 'Data', time: 'Hora', event: 'Evento', noEventsInRange: 'Sem eventos neste período'
}

export default function CalendarPage() {
  const qc = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', event_type: 'appointment', color: '#1a8f96' })

  const { data: therapists = [] } = useQuery({ queryKey: ['therapists'], queryFn: () => api.get('/therapists').then(r => r.data) })
  const { data: events = [] } = useQuery({
    queryKey: ['calendar'],
    queryFn: () => api.get('/calendar').then(r => r.data.map(e => ({
      ...e, start: new Date(e.start_time), end: new Date(e.end_time)
    })))
  })

  const createEvent = useMutation({
    mutationFn: data => api.post('/calendar', data),
    onSuccess: () => { qc.invalidateQueries(['calendar']); setShowModal(false); toast.success('Evento criado!') }
  })

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot)
    setForm(f => ({ ...f }))
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!form.title || !form.therapist_id) return toast.error('Preencha os campos obrigatórios')
    createEvent.mutate({
      ...form,
      start_time: selectedSlot.start.toISOString(),
      end_time: selectedSlot.end.toISOString(),
    })
  }

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color || '#1a8f96',
      borderRadius: '8px',
      border: 'none',
      color: 'white',
      padding: '2px 6px',
      fontSize: '12px'
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-teal-800">Calendário</h1>
          <p className="text-gray-500 text-sm">Gerencie as sessões e disponibilidades</p>
        </div>
        <button onClick={() => { setSelectedSlot({ start: new Date(), end: new Date(Date.now() + 3600000) }); setShowModal(true) }}
          className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Novo Evento
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-100" style={{ height: 680 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          messages={messages}
          culture="pt-PT"
          selectable
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="week"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-teal-800">Novo Evento</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-sand-100"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Título *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Terapeuta *</label>
                <select value={form.therapist_id || ''} onChange={e => setForm(f => ({ ...f, therapist_id: e.target.value }))}
                  className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">Selecionar...</option>
                  {therapists.map(t => <option key={t.id} value={t.id}>{t.full_name} — {t.specialty}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo</label>
                <select value={form.event_type} onChange={e => setForm(f => ({ ...f, event_type: e.target.value }))}
                  className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="appointment">Consulta</option>
                  <option value="block">Bloqueado</option>
                  <option value="vacation">Férias</option>
                  <option value="meeting">Reunião</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={14} />
                  {selectedSlot && format(selectedSlot.start, 'dd/MM HH:mm')} – {selectedSlot && format(selectedSlot.end, 'HH:mm')}
                </div>
                <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notas</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2} className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 btn-outline text-sm py-2.5">Cancelar</button>
              <button onClick={handleSubmit} disabled={createEvent.isPending}
                className="flex-1 btn-primary text-sm py-2.5">
                {createEvent.isPending ? 'A criar...' : 'Criar Evento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

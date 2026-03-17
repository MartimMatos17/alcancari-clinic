import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, FileText, ArrowRight, Clock, MapPin } from 'lucide-react'
import api from '../../lib/api'
import { useAuthStore } from '../../store/authStore'
import { useTranslation } from 'react-i18next'

const EVOLUTION_COLORS = {
  'Muito Positiva': 'bg-green-100 text-green-700',
  'Positiva':       'bg-teal-100 text-teal-700',
  'Estável':        'bg-blue-100 text-blue-700',
  'Negativa':       'bg-orange-100 text-orange-700',
  'Muito Negativa': 'bg-red-100 text-red-700',
}

export default function ParentHome() {
  const { user } = useAuthStore()
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.substring(0,2) || 'pt'

  const [children, setChildren] = useState([])
  const [selected, setSelected] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('appointments')

  const firstName = user?.full_name?.split(' ')[0] || ''
  const hour = new Date().getHours()
  const greeting = hour < 12
    ? t('parent.greeting_morning')
    : hour < 19
    ? t('parent.greeting_afternoon')
    : t('parent.greeting_evening')

  useEffect(() => {
    api.get('/parents/me').then(res => {
      setChildren(res.data.children)
      if (res.data.children.length > 0) loadChild(res.data.children[0])
      else setLoading(false)
    }).catch(console.error)
  }, [])

  const loadChild = async (child) => {
    setSelected(child)
    setLoading(true)
    try {
      const [appts, nts] = await Promise.all([
        api.get(`/parents/children/${child.id}/appointments`),
        api.get(`/parents/children/${child.id}/notes`),
      ])
      setAppointments(appts.data)
      setNotes(nts.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const upcoming = appointments.filter(a => new Date(a.start_time) > new Date())
  const past = appointments.filter(a => new Date(a.start_time) <= new Date())

  if (loading && children.length === 0) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8">

      {/* Saudação */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-gray-400 text-sm capitalize">
          {new Date().toLocaleDateString(lang === 'en' ? 'en-GB' : 'pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="font-display text-3xl text-teal-900 font-bold mt-1">{greeting}, {firstName} 👋</h1>
        <p className="text-gray-400 text-sm mt-1">{t('parent.sub')}</p>
      </motion.div>

      {/* Seletor de filho */}
      {children.length > 1 && (
        <div className="flex gap-3 flex-wrap">
          {children.map(c => (
            <button key={c.id} onClick={() => loadChild(c)}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all ${
                selected?.id === c.id ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-gray-100 bg-white hover:border-teal-200'
              }`}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{c.full_name[0]}</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-700 text-sm">{c.full_name}</p>
                <p className="text-gray-400 text-xs">{c.appointment_count} {lang === 'en' ? 'appointments' : 'consultas'}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <>
          {/* Cards resumo */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: t('parent.upcoming'),    value: upcoming.length, icon: <Calendar size={20} />, color: 'bg-teal-50 text-teal-600' },
              { label: t('parent.past'),         value: past.length,     icon: <Clock size={20} />,    color: 'bg-blue-50 text-blue-600' },
              { label: t('parent.notes_count'),  value: notes.length,    icon: <FileText size={20} />, color: 'bg-purple-50 text-purple-600' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
                <p className="font-display text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-gray-500 text-sm mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { key: 'appointments', label: t('parent.tab_appointments') },
              { key: 'notes',        label: t('parent.tab_notes') },
            ].map(tab_item => (
              <button key={tab_item.key} onClick={() => setTab(tab_item.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  tab === tab_item.key ? 'bg-teal-700 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:border-teal-300'
                }`}>
                {tab_item.label}
              </button>
            ))}
          </div>

          {/* Consultas */}
          {tab === 'appointments' && (
            <div className="space-y-4">
              {upcoming.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">{t('parent.next_label')}</p>
                  <div className="space-y-3">
                    {upcoming.map((a, i) => (
                      <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-2xl border-2 border-teal-100 shadow-sm p-5 space-y-2">
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-xs bg-teal-50 text-teal-600 border border-teal-200 px-2.5 py-1 rounded-full font-medium">
                            {a.service_name || (lang === 'en' ? 'Appointment' : 'Consulta')}
                          </span>
                          <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2.5 py-1 rounded-full font-medium">
                            {t('parent.confirmed')}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-800">
                          {new Date(a.start_time).toLocaleDateString(lang === 'en' ? 'en-GB' : 'pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} className="text-teal-400" />
                            {new Date(a.start_time).toLocaleTimeString(lang === 'en' ? 'en-GB' : 'pt-PT', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-teal-400" />
                            {a.unit === 'leça_palmeira' ? 'Leça da Palmeira' : 'São Mamede'}
                          </span>
                        </div>
                        {a.therapist_name && (
                          <p className="text-gray-400 text-xs">{t('parent.therapist')}: {a.therapist_name}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {past.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">{t('parent.history_label')}</p>
                  <div className="space-y-3">
                    {past.slice(0,5).map((a) => (
                      <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700 text-sm">
                            {new Date(a.start_time).toLocaleDateString(lang === 'en' ? 'en-GB' : 'pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {a.service_name || (lang === 'en' ? 'Appointment' : 'Consulta')} · {new Date(a.start_time).toLocaleTimeString(lang === 'en' ? 'en-GB' : 'pt-PT', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {a.note_id
                          ? <button onClick={() => setTab('notes')} className="text-xs text-teal-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                              {t('parent.see_note')} <ArrowRight size={12} />
                            </button>
                          : <span className="text-xs text-gray-300">{t('parent.no_note')}</span>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {appointments.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <p className="text-4xl mb-3">📅</p>
                  <p className="text-gray-400">{t('parent.no_appointments')}</p>
                  <Link to="/marcacao" className="mt-4 inline-flex items-center gap-2 text-teal-600 font-semibold text-sm">
                    {t('nav.book')} <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Sumários */}
          {tab === 'notes' && (
            <div className="space-y-4">
              {notes.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <p className="text-4xl mb-3">📝</p>
                  <p className="text-gray-400">{t('parent.no_notes')}</p>
                </div>
              ) : notes.map((n, i) => (
                <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="font-semibold text-gray-700">
                        {new Date(n.start_time || n.created_at).toLocaleDateString(lang === 'en' ? 'en-GB' : 'pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      {n.therapist_name && <p className="text-gray-400 text-xs mt-0.5">{t('parent.therapist')}: {n.therapist_name}</p>}
                    </div>
                    {n.evolution && (
                      <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${EVOLUTION_COLORS[n.evolution] || 'bg-gray-100 text-gray-600'}`}>
                        {n.evolution}
                      </span>
                    )}
                  </div>
                  {n.content && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{t('parent.session')}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{n.content}</p>
                    </div>
                  )}
                  {n.next_steps && (
                    <div className="bg-teal-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-teal-500 uppercase tracking-wide mb-2">{t('parent.next_steps')}</p>
                      <p className="text-teal-700 text-sm leading-relaxed">{n.next_steps}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* CTA */}
      <div className="bg-teal-800 rounded-3xl p-8 text-center space-y-4">
        <h3 className="font-display text-2xl text-white">{t('parent.book_cta')}</h3>
        <p className="text-teal-200 text-sm">{t('parent.book_sub')}</p>
        <Link to="/marcacao" className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-8 py-3 rounded-full hover:bg-teal-50 transition-colors">
          {t('nav.book')} <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}

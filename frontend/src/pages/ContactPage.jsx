import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, Instagram, Facebook, CheckCircle } from 'lucide-react'
import { publicApi } from '../lib/api'
import { useTranslation } from 'react-i18next'

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } }

export default function ContactPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', unit: 'leca' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await publicApi.post('/contact', form)
      setSent(true)
    } catch {
      setError(t('common.error'))
    }
    setLoading(false)
  }

  return (
    <div className="overflow-hidden bg-[#fdf9f3]">
      <section className="relative bg-gradient-to-br from-teal-700 to-teal-900 py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1400&q=60" alt="" className="w-full h-full object-cover opacity-15" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-4xl mx-auto px-6 text-center space-y-5">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-[0.2em]">✦ {t('contact.badge')}</p>
          <h1 className="font-display text-5xl md:text-6xl text-white font-bold leading-tight">
            {t('contact.title').split(' ')[0]}<br /><span className="text-teal-300 italic">{t('contact.title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-teal-200 text-lg max-w-lg mx-auto">{t('contact.sub')}</p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 30C360 60 720 0 1080 30C1260 45 1380 20 1440 30V60H0V30Z" fill="#fdf9f3"/></svg>
        </div>
      </section>

      <section className="py-16 bg-[#fdf9f3]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Phone size={22} />, label: t('contact.phone') || 'Telefone', value: '934 779 548', href: 'tel:934779548', color: 'bg-teal-50 text-teal-600 border-teal-200' },
              { icon: <Mail size={22} />, label: t('contact.email') || 'Email', value: 'alcancari.terapias@gmail.com', href: 'mailto:alcancari.terapias@gmail.com', color: 'bg-blue-50 text-blue-600 border-blue-200' },
              { icon: <Instagram size={22} />, label: 'Instagram', value: '@alcancari.terapias', href: 'https://instagram.com/alcancari.terapias', color: 'bg-pink-50 text-pink-600 border-pink-200' },
              { icon: <Facebook size={22} />, label: 'Facebook', value: 'Alcançari', href: 'https://facebook.com/alcancari', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
            ].map((c, i) => (
              <motion.a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                {...fadeUp} transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-4 p-5 bg-white rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ${c.color.split(' ')[2]}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${c.color.split(' ').slice(0,2).join(' ')}`}>{c.icon}</div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{c.label}</p>
                  <p className="text-sm font-semibold text-gray-700 truncate">{c.value}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 bg-[#fdf9f3]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-10">
            <motion.div {...fadeUp} className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                {sent ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-4">
                    <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle size={40} className="text-teal-600" />
                    </div>
                    <h3 className="font-display text-2xl text-teal-800">{t('contact.sent_title')}</h3>
                    <p className="text-gray-500">{t('contact.sent_sub')}</p>
                    <button onClick={() => { setSent(false); setForm({ name:'', email:'', phone:'', subject:'', message:'', unit:'leca' }) }}
                      className="border border-teal-300 text-teal-600 text-sm px-6 py-2 rounded-full mt-4 hover:bg-teal-50 transition-colors">
                      {t('contact.send_another')}
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="font-display text-2xl text-teal-800 mb-2">{t('contact.form_title')}</h2>
                      <p className="text-gray-400 text-sm">{t('contact.form_sub')}</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{t('contact.name')} *</label>
                          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t('contact.name')}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{t('contact.phone')}</label>
                          <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="9XX XXX XXX"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{t('contact.email')} *</label>
                        <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="o.seu@email.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{t('contact.unit')}</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[['leca','🏖️ Leça da Palmeira'],['smi','🌿 São Mamede de Infesta']].map(([val, label]) => (
                            <button key={val} type="button" onClick={() => setForm({...form, unit: val})}
                              className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${form.unit === val ? 'bg-teal-600 text-white border-teal-600' : 'border-gray-200 text-gray-500 hover:border-teal-300'}`}>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{t('contact.subject')}</label>
                        <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                          <option value="">—</option>
                          <option>{t('contact.subject_book')}</option>
                          <option>{t('contact.subject_info')}</option>
                          <option>{t('contact.subject_general')}</option>
                          <option>{t('contact.subject_training')}</option>
                          <option>{t('contact.subject_other')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{t('contact.message')} *</label>
                        <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all resize-none" />
                      </div>
                      {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}
                      <button type="submit" disabled={loading}
                        className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">
                        {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('contact.sending')}</> : <><Send size={16} />{t('contact.send')}</>}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="lg:col-span-2 space-y-6">
              {[
                { name: 'Leça da Palmeira', icon: '🏖️', address: 'Rua Francisco Sá Carneiro, 307\n4450-676 Leça da Palmeira', hours: 'Seg–Sex: 09h–20h · Sáb: 09h–14h' },
                { name: 'São Mamede de Infesta', icon: '🌿', address: 'Avenida Conde, 5981\n4465-098 São Mamede de Infesta', hours: 'Seg–Sex: 09h–20h · Sáb: 09h–14h' },
              ].map((unit, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{unit.icon}</span>
                    <h3 className="font-semibold text-teal-800 text-sm">{unit.name}</h3>
                  </div>
                  <div className="flex items-start gap-2 text-gray-500 text-xs">
                    <MapPin size={13} className="text-teal-500 mt-0.5 flex-shrink-0" />
                    <span className="whitespace-pre-line">{unit.address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-500 text-xs">
                    <Clock size={13} className="text-teal-500 mt-0.5 flex-shrink-0" />
                    <span>{unit.hours}</span>
                  </div>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(unit.address.replace('\n',' '))}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold py-2.5 rounded-xl transition-colors">
                    <MapPin size={12} /> Ver no Google Maps
                  </a>
                </div>
              ))}
              <div className="bg-teal-800 rounded-3xl p-6 space-y-4">
                <h3 className="font-display text-white text-lg">{t('contact.follow')}</h3>
                <div className="flex gap-3">
                  <a href="https://instagram.com/alcancari.terapias" target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm py-3 rounded-xl transition-colors">
                    <Instagram size={16} /> Instagram
                  </a>
                  <a href="https://facebook.com/alcancari" target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm py-3 rounded-xl transition-colors">
                    <Facebook size={16} /> Facebook
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

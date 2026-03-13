import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, Instagram, Facebook, CheckCircle } from 'lucide-react'
import api from '../lib/api'

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } }

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', unit: 'leca' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/contact', form)
      setSent(true)
    } catch (err) {
      setError('Erro ao enviar mensagem. Tente novamente.')
    }
    setLoading(false)
  }

  const contacts = [
    { icon: <Phone size={22} />, label: 'Telefone', value: '934 779 548', href: 'tel:934779548', bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
    { icon: <Mail size={22} />, label: 'Email', value: 'alcancari.terapias@gmail.com', href: 'mailto:alcancari.terapias@gmail.com', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    { icon: <Instagram size={22} />, label: 'Instagram', value: '@alcancari.terapias', href: 'https://instagram.com/alcancari.terapias', bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
    { icon: <Facebook size={22} />, label: 'Facebook', value: 'Alcancari', href: 'https://facebook.com/alcancari', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
  ]

  const units = [
    { name: 'Leca da Palmeira', icon: '🏖️', address: 'Rua Francisco Sa Carneiro, 307\n4450-676 Leca da Palmeira', hours: 'Seg-Sex: 09h-20h - Sab: 09h-14h' },
    { name: 'Sao Mamede de Infesta', icon: '🌿', address: 'Avenida Conde, 5981\n4465-098 Sao Mamede de Infesta', hours: 'Seg-Sex: 09h-20h - Sab: 09h-14h' },
  ]

  return (
    <div className="overflow-hidden bg-[#fdf9f3]">
      <section className="relative bg-gradient-to-br from-teal-700 to-teal-900 py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1400&q=60" alt="" className="w-full h-full object-cover opacity-15" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-4xl mx-auto px-6 text-center space-y-5">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-[0.2em]">Estamos aqui para si</p>
          <h1 className="font-display text-6xl md:text-7xl text-white font-bold leading-tight">
            Fale<br /><span className="text-teal-300 italic">connosco</span>
          </h1>
          <p className="text-teal-200 text-lg max-w-lg mx-auto">A nossa equipa esta pronta para responder a todas as suas questoes.</p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 30C360 60 720 0 1080 30C1260 45 1380 20 1440 30V60H0V30Z" fill="#fdf9f3"/></svg>
        </div>
      </section>

      <section className="py-16 bg-[#fdf9f3]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contacts.map((c, i) => (
              <motion.a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                {...fadeUp} transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-4 p-5 bg-white rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ${c.border}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg} ${c.text}`}>{c.icon}</div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{c.label}</p>
                  <p className="text-sm font-semibold text-gray-700">{c.value}</p>
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
                    <h3 className="font-display text-2xl text-teal-800">Mensagem enviada!</h3>
                    <p className="text-gray-500">Entraremos em contacto consigo em breve.</p>
                    <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '', unit: 'leca' }) }}
                      className="border border-teal-300 text-teal-600 text-sm px-6 py-2 rounded-full mt-4 hover:bg-teal-50 transition-colors">
                      Enviar outra mensagem
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="font-display text-2xl text-teal-800 mb-2">Formulario de contacto</h2>
                      <p className="text-gray-400 text-sm">Respondemos em ate 24 horas.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Nome</label>
                          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="O seu nome"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Telefone</label>
                          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="9XX XXX XXX"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email</label>
                        <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="o.seu@email.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Unidade</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[['leca', 'Leca da Palmeira'], ['smi', 'Sao Mamede de Infesta']].map(([val, label]) => (
                            <button key={val} type="button" onClick={() => setForm({ ...form, unit: val })}
                              className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${form.unit === val ? 'bg-teal-600 text-white border-teal-600' : 'border-gray-200 text-gray-500 hover:border-teal-300'}`}>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Assunto</label>
                        <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                          <option value="">Selecione um assunto</option>
                          <option>Marcar consulta</option>
                          <option>Informacoes sobre servicos</option>
                          <option>Duvida geral</option>
                          <option>Formacao</option>
                          <option>Outro</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Mensagem</label>
                        <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Descreva a sua situacao..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all resize-none" />
                      </div>
                      {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}
                      <button type="submit" disabled={loading}
                        className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">
                        {loading
                          ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> A enviar...</>
                          : <><Send size={16} /> Enviar mensagem</>}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="lg:col-span-2 space-y-6">
              {units.map((unit, i) => (
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
                  <a href={'https://maps.google.com/?q=' + encodeURIComponent(unit.address.replace('\n', ' '))}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold py-2.5 rounded-xl transition-colors">
                    <MapPin size={12} /> Ver no Google Maps
                  </a>
                </div>
              ))}
              <div className="bg-teal-800 rounded-3xl p-6 space-y-4">
                <h3 className="font-display text-white text-lg">Siga-nos</h3>
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

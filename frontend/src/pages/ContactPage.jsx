import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, Instagram, Facebook, MessageCircle, CheckCircle } from 'lucide-react'

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } }

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', unit: 'leca' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="overflow-hidden bg-[#fdf9f3]">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-teal-700 to-teal-900 py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1400&q=60" alt="" className="w-full h-full object-cover opacity-15" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-4xl mx-auto px-6 text-center space-y-5">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-[0.2em]">✦ Estamos aqui para si</p>
          <h1 className="font-display text-6xl md:text-7xl text-white font-bold leading-tight">
            Fale<br /><span className="text-teal-300 italic">connosco</span>
          </h1>
          <p className="text-teal-200 text-lg max-w-lg mx-auto">A nossa equipa está pronta para responder a todas as suas questões e ajudá-lo a dar o primeiro passo.</p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 30C360 60 720 0 1080 30C1260 45 1380 20 1440 30V60H0V30Z" fill="#fdf9f3"/></svg>
        </div>
      </section>

      {/* CONTACTOS RÁPIDOS */}
      <section className="py-16 bg-[#fdf9f3]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Phone size={22} />, label: 'Telefone', value: '934 779 548', href: 'tel:934779548', color: 'bg-teal-50 text-teal-600 border-teal-200' },
              { icon: <Mail size={22} />, label: 'Email', value: 'alcancari.terapias@gmail.com', href: 'mailto:alcancari.terapias@gmail.com', color: 'bg-blue-50 text-blue-600 border-blue-200' },
              { icon: <MessageCircle size={22} />, label: 'WhatsApp', value: 'Enviar mensagem', href: 'https://wa.me/351934779548', color: 'bg-green-50 text-green-600 border-green-200' },
              { icon: <Instagram size={22} />, label: 'Instagram', value: '@alcancari.terapias', href: 'https://instagram.com/alcancari.terapias', color: 'bg-pink-50 text-pink-600 border-pink-200' },
            ].map((c, i) => (
              <motion.a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                {...fadeUp} transition={{ delay: i * 0.1 }}
                className={"flex items-center gap-4 p-5 bg-white rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all " + c.color.split(' ')[2]}>
                <div className={"w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 " + c.color.split(' ').slice(0,2).join(' ')}>
                  {c.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{c.label}</p>
                  <p className="text-sm font-semibold text-gray-700">{c.value}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULÁRIO + MAPA */}
      <section className="pb-24 bg-[#fdf9f3]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Formulário — 3 colunas */}
            <motion.div {...fadeUp} className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                {sent ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-4">
                    <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle size={40} className="text-teal-600" />
                    </div>
                    <h3 className="font-display text-2xl text-teal-800">Mensagem enviada!</h3>
                    <p className="text-gray-500">Entraremos em contacto consigo em breve.</p>
                    <button onClick={() => setSent(false)} className="btn-outline text-sm px-6 py-2 mt-4">Enviar outra mensagem</button>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="font-display text-2xl text-teal-800 mb-2">Formulário de contacto</h2>
                      <p className="text-gray-400 text-sm">Preencha o formulário e respondemos em até 24 horas.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Nome *</label>
                          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                            placeholder="O seu nome"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Telefone</label>
                          <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                            placeholder="9XX XXX XXX"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all" />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email *</label>
                        <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                          placeholder="o.seu@email.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all" />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Unidade</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[['leca', '🏖️ Leça da Palmeira'], ['smi', '🌿 São Mamede de Infesta']].map(([val, label]) => (
                            <button key={val} type="button" onClick={() => setForm({...form, unit: val})}
                              className={"py-3 px-4 rounded-xl border text-sm font-medium transition-all " + (form.unit === val ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'border-gray-200 text-gray-500 hover:border-teal-300')}>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Assunto</label>
                        <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-600 bg-white transition-all">
                          <option value="">Selecione um assunto</option>
                          <option>Marcar consulta</option>
                          <option>Informações sobre serviços</option>
                          <option>Dúvida geral</option>
                          <option>Formação</option>
                          <option>Outro</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Mensagem *</label>
                        <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                          placeholder="Descreva a sua situação ou questão..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all resize-none" />
                      </div>

                      <button type="submit" disabled={loading}
                        className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70">
                        {loading ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> A enviar...</>
                        ) : (
                          <><Send size={16} /> Enviar mensagem</>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>

            {/* Info + Mapas — 2 colunas */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="lg:col-span-2 space-y-6">

              {[
                { name: 'Leça da Palmeira', icon: '🏖️', address: 'Rua Francisco Sá Carneiro, 307\n4450-676 Leça da Palmeira', hours: 'Seg–Sex: 09h–20h · Sáb: 09h–14h', map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3003.5!2d-8.6980!3d41.2043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDEyJzE1LjUiTiA4wrA0MSw1Mi44Ilc!5e0!3m2!1spt!2spt!4v1' },
                { name: 'São Mamede de Infesta', icon: '🌿', address: 'Avenida Conde, 5981\n4465-098 São Mamede de Infesta', hours: 'Seg–Sex: 09h–20h · Sáb: 09h–14h', map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3002.1!2d-8.6274!3d41.2205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDEzJzEzLjgiTiA4wrAzNyw0Mi42Ilc!5e0!3m2!1spt!2spt!4v1' },
              ].map((unit, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="rounded-2xl overflow-hidden h-36 m-3">
                    <iframe src={unit.map} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title={unit.name} />
                  </div>
                  <div className="px-5 pb-5 space-y-3">
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
                    <a href={"https://maps.google.com/?q=" + encodeURIComponent(unit.address.replace('\n', ' '))}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold py-2.5 rounded-xl transition-colors">
                      <MapPin size={12} /> Ver no Google Maps
                    </a>
                  </div>
                </div>
              ))}

              {/* Redes sociais */}
              <div className="bg-teal-800 rounded-3xl p-6 space-y-4">
                <h3 className="font-display text-white text-lg">Siga-nos</h3>
                <p className="text-teal-200 text-xs leading-relaxed">Conteúdo diário sobre desenvolvimento infantil, dicas para famílias e novidades da clínica.</p>
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

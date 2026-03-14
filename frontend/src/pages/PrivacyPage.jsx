import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Trash2, Mail } from 'lucide-react'

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } }

const SECTIONS = [
  {
    icon: <Eye size={20} />,
    title: 'Dados que recolhemos',
    content: `Recolhemos apenas os dados estritamente necessários para a prestação dos nossos serviços:
- Nome completo e data de nascimento
- Dados de contacto (email, telefone, morada)
- Informações clínicas relevantes para o acompanhamento terapêutico
- Dados de faturação quando aplicável

Não recolhemos dados de forma automática através de cookies de rastreio ou tecnologias similares sem o seu consentimento.`
  },
  {
    icon: <Shield size={20} />,
    title: 'Como utilizamos os seus dados',
    content: `Os seus dados pessoais são utilizados exclusivamente para:
- Prestação dos serviços terapêuticos contratados
- Comunicação relacionada com consultas e tratamentos
- Elaboração de relatórios clínicos
- Cumprimento de obrigações legais e fiscais
- Melhoria da qualidade dos nossos serviços

Os dados clínicos são tratados com a máxima confidencialidade e apenas acessíveis pelos profissionais de saúde envolvidos no seu acompanhamento.`
  },
  {
    icon: <Lock size={20} />,
    title: 'Como protegemos os seus dados',
    content: `Implementamos medidas técnicas e organizacionais adequadas para proteger os seus dados:
- Armazenamento seguro em servidores com encriptação
- Acesso restrito por autenticação com credenciais individuais
- Formação regular da equipa em proteção de dados
- Contratos de confidencialidade com todos os colaboradores
- Revisão periódica dos procedimentos de segurança

Em caso de violação de dados que coloque em risco os seus direitos, será notificado no prazo legal de 72 horas.`
  },
  {
    icon: <Trash2 size={20} />,
    title: 'Retenção e eliminação',
    content: `Os dados clínicos são conservados pelo período mínimo exigido pela legislação portuguesa aplicável à área da saúde (geralmente 10 anos após o último contacto clínico).

Dados de contacto para fins de comunicação são eliminados mediante pedido do titular.

Dados de faturação são conservados pelo período exigido pela legislação fiscal (10 anos).`
  },
  {
    icon: <Mail size={20} />,
    title: 'Os seus direitos',
    content: `Ao abrigo do Regulamento Geral de Proteção de Dados (RGPD), tem direito a:
- Acesso: saber que dados temos sobre si
- Retificação: corrigir dados incorretos ou incompletos
- Eliminação: solicitar a remoção dos seus dados ("direito ao esquecimento")
- Portabilidade: receber os seus dados num formato estruturado
- Oposição: opor-se ao tratamento para determinadas finalidades
- Limitação: restringir o tratamento em certas circunstâncias

Para exercer qualquer destes direitos, contacte-nos através de alcancari.terapias@gmail.com.`
  }
]

export default function PrivacyPage() {
  return (
    <div className="bg-[#fdf9f3] min-h-screen">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal-700 to-teal-900 py-24 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="relative max-w-4xl mx-auto px-6 text-center space-y-5">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
            <Shield size={32} className="text-teal-300" />
          </div>
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest">RGPD</p>
          <h1 className="font-display text-5xl text-white font-bold">Política de Privacidade</h1>
          <p className="text-teal-200 max-w-lg mx-auto">Última atualização: Janeiro de 2025</p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 30C360 60 720 0 1080 30C1260 45 1380 20 1440 30V60H0V30Z" fill="#fdf9f3"/></svg>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 space-y-6">

        {/* Intro */}
        <motion.div {...fadeUp} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <p className="text-gray-600 leading-relaxed">
            A <strong>Alcançari — Clínica Terapêutica Pediátrica</strong> compromete-se a proteger a privacidade e os dados pessoais de todos os seus utentes, familiares e visitantes do website, em conformidade com o <strong>Regulamento Geral sobre a Proteção de Dados (RGPD — Regulamento UE 2016/679)</strong> e a legislação nacional aplicável.
          </p>
          <p className="text-gray-500 text-sm mt-4 leading-relaxed">
            <strong>Responsável pelo tratamento:</strong> Alcançari, Lda. | alcancari.terapias@gmail.com | 934 779 548
          </p>
        </motion.div>

        {/* Secções */}
        {SECTIONS.map((s, i) => (
          <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                {s.icon}
              </div>
              <h2 className="font-display text-xl text-teal-800">{s.title}</h2>
            </div>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{s.content}</div>
          </motion.div>
        ))}

        {/* Contacto DPO */}
        <motion.div {...fadeUp} className="bg-teal-800 rounded-3xl p-8 text-center space-y-4">
          <Shield size={32} className="text-teal-300 mx-auto" />
          <h3 className="font-display text-2xl text-white">Questões sobre privacidade?</h3>
          <p className="text-teal-200 text-sm max-w-md mx-auto">
            Para qualquer questão relacionada com o tratamento dos seus dados pessoais, contacte-nos diretamente.
          </p>
          <a href="mailto:alcancari.terapias@gmail.com"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-8 py-3 rounded-full hover:bg-teal-50 transition-colors">
            <Mail size={16} /> alcancari.terapias@gmail.com
          </a>
        </motion.div>

      </section>
    </div>
  )
}
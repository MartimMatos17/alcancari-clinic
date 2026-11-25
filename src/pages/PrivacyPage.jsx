import { useState } from 'react'
import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'
import PageIntro from '../components/PageIntro'
import { validContactEndpoint } from '../lib/contactRequest'
import { clearSitePreferences } from '../lib/privacyPreferences'

export default function PrivacyPage() {
  const formAvailable = validContactEndpoint(import.meta.env.VITE_CONTACT_FORM_ENDPOINT)
  const [message, setMessage] = useState('')
  usePageMeta('Privacidade', 'Saiba como funcionam os contactos, as preferências deste navegador e as ligações a serviços externos.')
  const clear = () => {
    if (!window.confirm('Apagar os favoritos, leituras guardadas, checklist, preferências de leitura e páginas recentes deste navegador?')) return
    try {
      const done = clearSitePreferences(window.localStorage, window.sessionStorage)
      if (done) window.location.reload()
      else setMessage('Não foi possível apagar todos os ajustes. Pode remover os dados deste site nas definições do navegador.')
    } catch { setMessage('O navegador bloqueou o acesso ao armazenamento. Consulte as definições de dados de sites do navegador.') }
  }
  return <><PageIntro eyebrow="Privacidade" title="Clareza, também nos seus dados." intro="Saiba que dados ficam no seu navegador e o que acontece quando contacta a clínica." /><article className="container-shell article-content">
    <h2>Informação institucional</h2><p>Este website apresenta a clínica, os serviços, a equipa, as unidades e conteúdos do Blog. Não disponibiliza contas de pacientes, pagamentos ou acesso a processos clínicos.</p>
    <h2>Contactos e formulário</h2><p>{formAvailable ? 'Ao enviar o formulário, os dados que preencher são enviados através do Formspree. Podem incluir nome, email, telefone, mensagem e preferências de contacto ou marcação. A equipa confirma a disponibilidade.' : 'O formulário está desativado. Pode falar com a equipa por telefone, email ou WhatsApp.'}</p><p>Não introduza dados de saúde, documentos clínicos, palavras-passe ou informações sensíveis. As ligações de email, telefone e WhatsApp abrem a aplicação ou serviço escolhido, sujeito às respetivas condições.</p>
    <h2>Preferências guardadas no navegador</h2><p>Favoritos, leituras guardadas, checklist da primeira visita e ajustes de conforto e tamanho do texto podem ficar no armazenamento local deste navegador até serem removidos. A lista de páginas recentes usa o armazenamento de sessão do separador e pode ser limpa ou pausada na própria lista. Estes dados não são enviados pela aplicação para um serviço de análise.</p><div className="privacy-details"><h2>As suas escolhas, sob controlo.</h2><p>Pode apagar os dados locais das funcionalidades abaixo. A página será recarregada para aplicar a alteração. Esta ação não apaga mensagens já enviadas nem dados guardados por serviços externos.</p><ul><li>Favoritos e leituras guardadas</li><li>Checklist de preparação da visita</li><li>Preferências de texto, contraste e movimento</li><li>Páginas recentes deste separador</li></ul><button className="button button-primary" type="button" onClick={clear}>Apagar preferências deste site</button>{message && <p role="status">{message}</p>}</div>
    <h2>Redes sociais e serviços externos</h2><p>O conteúdo incorporado do Facebook só é carregado quando seleciona a opção para o ver. Ao carregá-lo, o navegador comunica com a Meta, que pode usar cookies e tratar dados segundo as suas próprias políticas. Ocultar a cronologia interrompe a apresentação, mas não elimina cookies já definidos pelo fornecedor.</p><p>As imagens das publicações do Instagram são apresentadas pelo próprio site. A ligação à publicação original abre o Instagram. Mapas e restantes ligações externas são abertos por escolha do visitante.</p>
    <h2>Medição de utilização</h2><p>Este site não utiliza ferramentas de análise de visitantes ou publicidade.</p>
    <h2>Questões sobre privacidade</h2><p>Para esclarecer como são tratados os seus dados ou fazer um pedido relativo aos seus dados pessoais, contacte a clínica.</p><Link className="text-link" to="/contactos">Consultar os contactos da clínica ↗</Link>
  </article></>
}

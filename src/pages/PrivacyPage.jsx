import { useState } from 'react'
import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'
import PageIntro from '../components/PageIntro'
import { clearSitePreferences } from '../lib/privacyPreferences'

export default function PrivacyPage() {
  const [message, setMessage] = useState('')
  usePageMeta('Privacidade', 'Informação técnica sobre contactos, preferências locais e serviços externos nesta versão do website Alcançari.')
  const clear = () => {
    if (!window.confirm('Apagar os favoritos, leituras guardadas, checklist, preferências de leitura e páginas recentes deste navegador?')) return
    try {
      const done = clearSitePreferences(window.localStorage, window.sessionStorage)
      if (done) window.location.reload()
      else setMessage('Não foi possível apagar todos os ajustes. Pode remover os dados deste site nas definições do navegador.')
    } catch { setMessage('O navegador bloqueou o acesso ao armazenamento. Consulte as definições de dados de sites do navegador.') }
  }
  return <><PageIntro eyebrow="Privacidade" title="Clareza, também nos seus dados." intro="Informação técnica sobre o funcionamento desta versão de demonstração. A informação final de privacidade será revista com a clínica antes do lançamento." /><article className="container-shell article-content">
    <h2>Informação institucional</h2><p>Este website apresenta a clínica, os serviços, a equipa, as unidades e conteúdos do Blog. Não disponibiliza contas de pacientes, pagamentos ou acesso a processos clínicos.</p>
    <h2>Contactos e formulário</h2><p>Quando o formulário está configurado, o pedido é enviado ao serviço Formspree. Inclui os campos preenchidos, como nome, email, telefone, mensagem e preferências de contacto ou marcação. Sem configuração, o envio fica indisponível e são apresentados os contactos alternativos. O envio não confirma uma consulta.</p><p>Não introduza dados de saúde, documentos clínicos, palavras-passe ou informações sensíveis. As ligações de email, telefone e WhatsApp abrem a aplicação ou serviço escolhido, sujeito às respetivas condições.</p>
    <h2>Preferências guardadas no navegador</h2><p>Favoritos, leituras guardadas, checklist da primeira visita e ajustes de conforto e tamanho do texto podem ficar no armazenamento local deste navegador até serem removidos. A lista de páginas recentes usa o armazenamento de sessão do separador e pode ser limpa ou pausada na própria lista. Estes dados não são enviados pela aplicação para um serviço de análise.</p><div className="privacy-details"><h2>As suas escolhas, sob controlo.</h2><p>Pode apagar os dados locais das funcionalidades abaixo. A página será recarregada para aplicar a alteração. Esta ação não apaga mensagens já enviadas nem dados guardados por serviços externos.</p><ul><li>Favoritos e leituras guardadas</li><li>Checklist de preparação da visita</li><li>Preferências de texto, contraste e movimento</li><li>Páginas recentes deste separador</li></ul><button className="button button-primary" type="button" onClick={clear}>Apagar preferências deste site</button>{message && <p role="status">{message}</p>}</div>
    <h2>Redes sociais e serviços externos</h2><p>O conteúdo incorporado do Facebook só é carregado quando seleciona a opção para o ver. Ao carregá-lo, o navegador comunica com a Meta, que pode usar cookies e tratar dados segundo as suas próprias políticas. Ocultar a cronologia interrompe a apresentação, mas não elimina cookies já definidos pelo fornecedor.</p><p>As publicações do Instagram, quando sincronizadas através da integração oficial, são preparadas no build com imagens locais; as ligações às publicações abrem o Instagram. Mapas e restantes ligações externas são abertos por escolha do visitante.</p>
    <h2>Medição de utilização</h2><p>O código atual do website não inclui ferramentas de análise de visitantes ou publicidade. Registos técnicos e condições do alojamento terão de ser confirmados quando o fornecedor for escolhido.</p>
    <h2>Antes da publicação</h2><p>Falta confirmar com a clínica a identificação do responsável pelo tratamento, finalidades e fundamentos aplicáveis, destinatários, prazos de conservação, contactos de privacidade e informação sobre o exercício de direitos. Esta descrição técnica da demonstração não substitui essa validação.</p><Link className="text-link" to="/contactos">Consultar os contactos da clínica ↗</Link>
  </article></>
}

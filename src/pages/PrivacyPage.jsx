import usePageMeta from '../hooks/usePageMeta'
import PageIntro from '../components/PageIntro'

export default function PrivacyPage() {
  usePageMeta('Privacidade', 'Informação sobre privacidade na versão institucional do website Alcançari.')
  return <><PageIntro eyebrow="Privacidade" title="A sua privacidade." intro="Informação sobre esta versão do website." /><article className="container-shell article-content">
    <h2>Navegação no website</h2><p>Esta versão apresenta informação institucional. Não disponibiliza contas de utilizador, formulários de recolha de dados ou acesso a processos clínicos.</p>
    <h2>Cookies e medição de utilização</h2><p>A aplicação não utiliza cookies, armazenamento local, ferramentas de análise de utilização ou publicidade. As imagens e os tipos de letra apresentados não são obtidos de serviços externos.</p>
    <h2>Ligações para outros serviços</h2><p>Quando disponibilizadas, as ligações de contacto e de mapas abrem serviços externos apenas quando as seleciona. A utilização desses serviços está sujeita às respetivas condições de privacidade.</p>
    <h2>Informação a completar</h2><p>A identificação completa do responsável pelo tratamento, os contactos para questões de privacidade e a informação relativa ao alojamento serão confirmados antes da publicação do website.</p>
  </article></>
}

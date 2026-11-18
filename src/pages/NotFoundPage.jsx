import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'
import Icon from '../components/Icon'

export default function NotFoundPage() {
  usePageMeta('Página não encontrada', 'A página que procura não está disponível.', { notFound: true })
  return <section className="not-found container-shell"><p className="eyebrow">Página não encontrada · 404</p><h1>Vamos encontrar<br />outro caminho.</h1><p>A página que procura não existe ou já não está disponível.</p><div className="page-recovery__actions"><Link className="button button-primary" to="/">Voltar ao início<Icon name="arrow" /></Link><Link className="button" to="/servicos">Explorar os serviços</Link><Link className="text-link" to="/contactos">Pedir ajuda<Icon name="diagonal" /></Link></div></section>
}

import { Component } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import '../styles/page-recovery.css'

export function PageLoading() {
  return <section className="container-shell page-loading" aria-label="A carregar conteúdo"><p role="status">A preparar a próxima página…</p><div className="page-loading__skeleton" aria-hidden="true"><span /><span /><span /><span /></div></section>
}
export default class PageRecovery extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (!this.state.failed) return this.props.children
    return <section className="container-shell page-recovery" role="alert"><p className="eyebrow">Vamos tentar outro caminho</p><h1>Esta página não carregou<br /><em>como esperávamos.</em></h1><p>A navegação continua disponível. Pode tentar novamente ou contactar a clínica pelos canais habituais.</p><div className="page-recovery__actions"><button className="button button-primary" type="button" onClick={() => window.location.reload()}>Tentar novamente<Icon name="arrow" /></button><Link className="button" to="/">Voltar ao início</Link><Link className="text-link" to="/contactos">Ver contactos<Icon name="diagonal" /></Link></div></section>
  }
}

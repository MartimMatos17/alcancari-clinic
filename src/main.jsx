import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <main className="not-found container-shell"><h1>Não foi possível apresentar esta página.</h1><p>Tente carregar novamente o website.</p><a className="button button-primary" href="/">Voltar ao início</a></main>
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(<StrictMode><ErrorBoundary><App /></ErrorBoundary></StrictMode>)

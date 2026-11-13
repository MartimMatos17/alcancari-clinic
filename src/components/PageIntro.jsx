import { Link } from 'react-router-dom'

export default function PageIntro({ eyebrow, title, intro }) {
  return <header className="page-intro container-shell">
    <nav aria-label="Percurso de navegação" className="breadcrumb"><Link to="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">{eyebrow}</span></nav>
    <p className="eyebrow">{eyebrow}</p>
    <h1>{title}</h1>
    {intro && <p className="intro-text">{intro}</p>}
  </header>
}

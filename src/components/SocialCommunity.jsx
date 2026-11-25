import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../content/site'
import '../styles/social-community.css'

const official = (label, fallback) => site.officialLinks.find(item => item.label === label)?.href || fallback
const facebook = official('Facebook', 'https://www.facebook.com/alcancari')
const instagram = official('Instagram', 'https://www.instagram.com/clinica.alcancari/')
const facebookEmbed = `https://www.facebook.com/plugins/page.php?${new URLSearchParams({
  href: facebook,
  tabs: 'timeline',
  width: '500',
  height: '560',
  small_header: 'false',
  adapt_container_width: 'true',
  hide_cover: 'false',
  show_facepile: 'false',
}).toString()}`

function PlatformIcon({ type }) {
  if (type === 'facebook') return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.7 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5H17V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.5v3.2h2.8V21h3.4Z" /></svg>
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>
}

export default function SocialCommunity() {
  const [showFacebook, setShowFacebook] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  return <section className="alc-social" aria-labelledby="alc-social-heading">
    <div className="alc-social__intro">
      <div>
        <p className="alc-social__eyebrow">Comunidade Alcançari</p>
        <h2 id="alc-social-heading">A nossa comunidade, <em>mais perto de si.</em></h2>
      </div>
      <p>Acompanhe os momentos, as novidades e as conversas que partilhamos nas nossas redes. Um espaço de proximidade para famílias e profissionais.</p>
    </div>

    <div className="alc-social__grid">
      <article className="alc-social__card alc-social__card--facebook">
        <div className="alc-social__card-head">
          <span className="alc-social__mark alc-social__mark--facebook"><PlatformIcon type="facebook" /></span>
        </div>
        <div className="alc-social__card-copy">
          <h3>Facebook</h3>
          <p>Publicações, atividades e novidades partilhadas pela Clínica Alcançari.</p>
        </div>
        {!showFacebook ? <div className="alc-social__preview">
          <div className="alc-social__preview-copy"><strong>Veja as publicações recentes</strong><span>O conteúdo do Facebook só será carregado após a sua escolha.</span></div>
          <button className="alc-social__button alc-social__button--facebook" type="button" onClick={() => setShowFacebook(true)}>Ver cronologia do Facebook <span aria-hidden="true">↗</span></button>
        </div> : <div className="alc-social__embed">
          <div className="alc-social__embed-toolbar"><strong>Facebook da Alcançari</strong><button type="button" onClick={() => setShowFacebook(false)}>Ocultar</button></div>
          <iframe title="Publicações da Clínica Alcançari no Facebook" src={facebookEmbed} loading="lazy" width="500" height="560" referrerPolicy="strict-origin-when-cross-origin" allow="encrypted-media" />
          <p>Se o Facebook não apresentar a cronologia, pode <a href={facebook} target="_blank" rel="noopener noreferrer">abrir a página oficial</a>.</p>
        </div>}
        <a className="alc-social__external" href={facebook} target="_blank" rel="noopener noreferrer">Abrir Facebook <span aria-hidden="true">↗</span></a>
      </article>

      <article className="alc-social__card alc-social__card--instagram">
        <div className="alc-social__card-head">
          <span className="alc-social__mark alc-social__mark--instagram"><PlatformIcon type="instagram" /></span>
        </div>
        <div className="alc-social__card-copy">
          <h3>Instagram</h3>
          <p>Acompanhe o nosso lado mais visual e as partilhas feitas no Instagram.</p>
        </div>
        <a className="alc-social__button alc-social__button--instagram" href={instagram} target="_blank" rel="noopener noreferrer">Explorar o Instagram <span aria-hidden="true">↗</span></a>

      </article>
    </div>

    <div className="alc-social__bottom">
      <div><span className="alc-social__bottom-symbol" aria-hidden="true">✳</span><p><strong>Quer saber mais sobre a Alcançari?</strong><span>Conheça os nossos serviços, a equipa e os espaços.</span></p></div>
      <Link to="/servicos">Descobrir a clínica <span aria-hidden="true">↗</span></Link>
    </div>
    <div className="alc-social__privacy"><button type="button" aria-expanded={showInfo} onClick={() => setShowInfo(value => !value)}>Como funcionam as redes nesta página? <span aria-hidden="true">{showInfo ? '−' : '+'}</span></button>{showInfo && <p>O conteúdo do Facebook é apresentado por um serviço externo e só carrega depois de selecionar «Ver cronologia». O Facebook poderá utilizar cookies e recolher dados de navegação de acordo com as suas políticas. As ligações às redes abrem os respetivos websites. Não guardamos dados pessoais nesta secção.</p>}</div>
  </section>
}

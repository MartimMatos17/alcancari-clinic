import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { serviceImageCaption } from '../content/servicePresentation'

export default function ServiceGallery({ images, title, id = 'service-gallery' }) {
  const [expanded, setExpanded] = useState(false)
  const [active, setActive] = useState(null)
  const dialog = useRef(null)
  const opener = useRef(null)
  const isOpen = active !== null

  useEffect(() => {
    if (!isOpen) return
    const modal = dialog.current
    const previousOverflow = document.body.style.overflow
    modal.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      modal.close()
      document.body.style.overflow = previousOverflow
      opener.current?.focus({ preventScroll: true })
    }
  }, [isOpen])

  if (!images.length) return null
  const move = direction => setActive(index => (index + direction + images.length) % images.length)
  const image = images[active ?? 0]

  return <section className="sv-gallery sv-shell" id={id} aria-labelledby="service-gallery-title">
    <div className="sv-section-heading">
      <div><p className="sv-eyebrow">Imagens deste serviço</p><h2 id="service-gallery-title">Galeria<span className="sv-count">{String(images.length).padStart(2, '0')}</span></h2></div>
      <p>Selecione uma imagem para ampliar.</p>
    </div>
    <div className="sv-gallery__grid" id="service-gallery-images">
      {images.slice(0, expanded ? images.length : 3).map((item, index) => <figure key={item.src}>
        <button className="sv-gallery__image" type="button" aria-label={`Ampliar imagem ${index + 1} de ${images.length}: ${item.alt}`} aria-haspopup="dialog" onClick={event => { opener.current = event.currentTarget; setActive(index) }}>
          <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" />
          <span className="sv-gallery__zoom" aria-hidden="true"><Icon name="plus" /></span>
        </button>
        <figcaption><span>{String(index + 1).padStart(2, '0')}</span>{serviceImageCaption(item)}</figcaption>
      </figure>)}
    </div>
    {images.length > 3 && <button type="button" className="sv-button sv-button--outline sv-gallery__more" aria-expanded={expanded} aria-controls="service-gallery-images" onClick={() => setExpanded(value => !value)}>
      {expanded ? 'Mostrar menos imagens' : `Ver todas as ${images.length} imagens`}<span aria-hidden="true">{expanded ? '−' : '+'}</span>
    </button>}
    <dialog className="sv-lightbox" ref={dialog} aria-label={`Galeria de ${title}`} onCancel={() => setActive(null)} onClick={event => { if (event.target === event.currentTarget) setActive(null) }} onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1) }
    }}>
      <div className="sv-lightbox__inner">
        <div className="sv-lightbox__top"><span>{title}</span><button type="button" autoFocus onClick={() => setActive(null)} aria-label="Fechar galeria"><Icon name="close" /></button></div>
        {isOpen && <img className="sv-lightbox__image" src={image.src} alt={image.alt} width={image.width} height={image.height} />}
        <div className="sv-lightbox__bottom">
          <button type="button" onClick={() => move(-1)} aria-label="Imagem anterior" disabled={images.length < 2}><Icon className="sv-arrow-back" /></button>
          <div aria-live="polite" aria-atomic="true"><p>{(active ?? 0) + 1} / {images.length}</p><p>{serviceImageCaption(image)}</p></div>
          <button type="button" onClick={() => move(1)} aria-label="Imagem seguinte" disabled={images.length < 2}><Icon /></button>
        </div>
      </div>
    </dialog>
  </section>
}

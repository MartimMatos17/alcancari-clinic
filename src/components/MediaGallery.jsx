import { useState } from 'react'
import { Modal } from './UtilityActions'
export default function MediaGallery({ images = [], label = 'Ver fotografias' }) {
  const [index, setIndex] = useState(null)
  if (!images.length) return null
  const move = direction => setIndex(current => (current + direction + images.length) % images.length)
  const image = images[index]
  return <><details className="media-gallery"><summary>{label} <span>({images.length})</span></summary><div className="gallery-grid">{images.map((item, i) => <button type="button" key={item.src} onClick={() => setIndex(i)} aria-label={`Abrir fotografia ${i + 1}: ${item.alt}`}><img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" /></button>)}</div></details>{image && <Modal label={label} className="gallery-lightbox" onClose={() => setIndex(null)} onKeyDown={event => { if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) } if (event.key === 'ArrowRight') { event.preventDefault(); move(1) } }}><figure><img className="gallery-lightbox__photo" src={image.src} alt={image.alt} /><figcaption aria-live="polite">{index + 1} / {images.length} — {image.alt}</figcaption></figure><div className="gallery-lightbox__controls"><button className="utility-button" type="button" onClick={() => move(-1)} aria-label="Fotografia anterior">←</button><button className="utility-button" type="button" onClick={() => move(1)} aria-label="Fotografia seguinte">→</button></div><div className="gallery-thumbnails">{images.map((item, i) => <button key={item.src} type="button" aria-label={`Ver fotografia ${i + 1}`} aria-pressed={index === i} onClick={() => setIndex(i)}><img src={item.src} alt="" loading="lazy" /></button>)}</div></Modal>}</>
}

import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/virtual-tour.css'

function TourPhoto({ photo, label, immediate = false }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <span className="alc-tour__unavailable" role="status">Esta fotografia está temporariamente indisponível.</span>
  }

  return (
    <img
      src={photo.src}
      alt={photo.caption || label}
      width={photo.width}
      height={photo.height}
      loading={immediate ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

function TourLightbox({ photos, unit, initialIndex, onClose, returnFocus }) {
  const [index, setIndex] = useState(initialIndex)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const titleId = useId()
  const helpId = useId()
  const photo = photos[index]
  const move = (offset) => setIndex(current => (current + offset + photos.length) % photos.length)

  useEffect(() => {
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    closeRef.current.focus({ preventScroll: true })

    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true })
    }
  }, [returnFocus])

  function handleKeys(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      move(event.key === 'ArrowRight' ? 1 : -1)
    }
    if (event.key === 'Tab') {
      const buttons = [...dialogRef.current.querySelectorAll('button:not(:disabled)')]
      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="alc-tour-lightbox"
      aria-labelledby={titleId}
      aria-describedby={helpId}
      onCancel={event => { event.preventDefault(); onClose() }}
      onKeyDown={handleKeys}
    >
      <header className="alc-tour-lightbox__header">
        <h2 id={titleId}>{unit.name}</h2>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Fechar fotografia">Fechar <span aria-hidden="true">×</span></button>
      </header>
      <figure>
        <div className="alc-tour-lightbox__image">
          <TourPhoto key={photo.src} photo={photo} label={`${unit.name} — fotografia ${index + 1}`} immediate />
        </div>
        <figcaption aria-live="polite" aria-atomic="true">
          {photo.caption || `${unit.name} — fotografia ${index + 1}`} · {index + 1} / {photos.length}
        </figcaption>
      </figure>
      <div className="alc-tour-lightbox__navigation">
        <button type="button" onClick={() => move(-1)} disabled={photos.length < 2} aria-label="Fotografia anterior">← <span>Anterior</span></button>
        <p id={helpId}>Use as setas para explorar e Escape para fechar.</p>
        <button type="button" onClick={() => move(1)} disabled={photos.length < 2} aria-label="Fotografia seguinte"><span>Seguinte</span> →</button>
      </div>
    </dialog>
  )
}

export default function VirtualTour({ units, galleries = {}, initialUnitId, preview = false }) {
  const [unitId, setUnitId] = useState(initialUnitId || units[0]?.id)
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const thumbnailRefs = useRef([])
  const titleId = useId()
  const unit = units.find(item => item.id === unitId) || units[0]
  // Only use images explicitly assigned to this unit; never borrow another gallery.
  const photos = (galleries[unit?.id] || []).filter((photo, position, all) =>
    photo?.src && all.findIndex(item => item?.src === photo.src) === position
  )
  const activeIndex = Math.min(index, Math.max(photos.length - 1, 0))
  const photo = photos[activeIndex]
  const label = unit ? `${unit.name} — fotografia ${activeIndex + 1}` : ''

  function selectPhoto(next, focus = false) {
    setIndex(next)
    if (focus) {
      thumbnailRefs.current[next]?.focus({ preventScroll: true })
      thumbnailRefs.current[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }
  }

  function handleThumbnailKeys(event, current) {
    const targets = {
      ArrowRight: (current + 1) % photos.length,
      ArrowLeft: (current - 1 + photos.length) % photos.length,
      Home: 0,
      End: photos.length - 1,
    }
    if (event.key in targets) {
      event.preventDefault()
      selectPhoto(targets[event.key], true)
    }
  }

  if (!unit) return null

  return (
    <section id={preview ? undefined : 'visita-virtual'} className={`alc-tour${preview ? ' alc-tour--preview' : ''}`} aria-labelledby={titleId}>
      <div className="alc-tour__intro">
        <p className="alc-tour__eyebrow">VISITA VIRTUAL FOTOGRÁFICA</p>
        <h2 id={titleId}>{preview ? 'A Alcançari, de perto.' : 'Entre. Conheça o nosso espaço.'}</h2>
        {!preview && <p>Escolha uma unidade e descubra as suas fotografias, ao seu ritmo.</p>}
      </div>

      <div className="alc-tour__units" role="group" aria-label="Escolher unidade">
        {units.map(item => (
          <button
            key={item.id}
            type="button"
            aria-pressed={unit.id === item.id}
            onClick={() => { setUnitId(item.id); setIndex(0) }}
          >{item.name}</button>
        ))}
      </div>

      {photo ? (
        <div className="alc-tour__gallery">
          <figure className="alc-tour__figure">
            {preview ? (
              <Link className="alc-tour__stage" to={`/unidades/${unit.id}#visita-virtual`} aria-label={`Explorar fotografias de ${unit.name}`}>
                <TourPhoto key={photo.src} photo={photo} label={label} />
                <span className="alc-tour__image-action">Explorar fotografias <span aria-hidden="true">↗</span></span>
              </Link>
            ) : (
              <button className="alc-tour__stage" type="button" aria-label={`Ampliar fotografia: ${label}`} aria-haspopup="dialog" onClick={event => setLightbox({ index: activeIndex, trigger: event.currentTarget })}>
                <TourPhoto key={photo.src} photo={photo} label={label} />
                <span className="alc-tour__image-action">Ampliar fotografia <span aria-hidden="true">↗</span></span>
              </button>
            )}
            <figcaption className="alc-tour__caption" aria-live="polite" aria-atomic="true">
              <span>{photo.caption || label}</span>
              <span>{activeIndex + 1} / {photos.length}</span>
            </figcaption>
          </figure>

          {!preview && (
            <>
              <div className="alc-tour__controls">
                <button type="button" disabled={photos.length < 2} onClick={() => selectPhoto((activeIndex - 1 + photos.length) % photos.length)} aria-label="Fotografia anterior">← Anterior</button>
                <span>Escolha um olhar.</span>
                <button type="button" disabled={photos.length < 2} onClick={() => selectPhoto((activeIndex + 1) % photos.length)} aria-label="Fotografia seguinte">Seguinte →</button>
              </div>
              <div className="alc-tour__thumbnails" role="group" aria-label={`Miniaturas de ${unit.name}. Use as setas para navegar.`}>
                {photos.map((item, position) => (
                  <button
                    key={`${unit.id}-${item.src}`}
                    ref={element => { thumbnailRefs.current[position] = element }}
                    type="button"
                    aria-label={`${item.caption || `Fotografia ${String(position + 1).padStart(2, '0')}`} — ${unit.name}`}
                    aria-pressed={position === activeIndex}
                    tabIndex={position === activeIndex ? 0 : -1}
                    onClick={() => selectPhoto(position)}
                    onKeyDown={event => handleThumbnailKeys(event, position)}
                  >
                    <TourPhoto photo={item} label={`${unit.name} — fotografia ${position + 1}`} />
                    <span>{item.caption || `Fotografia ${String(position + 1).padStart(2, '0')}`}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="alc-tour__empty" role="status">
          <span className="alc-tour__eyebrow">{unit.name}</span>
          <h3>Um primeiro encontro começa com uma conversa.</h3>
          <p>Ainda não há fotografias disponíveis para esta unidade. A nossa equipa pode ajudar a preparar a sua visita.</p>
        </div>
      )}

      <footer className="alc-tour__footer">
        <p>{preview ? 'Conheça os espaços antes da sua visita.' : 'Quer saber mais sobre esta unidade?'}</p>
        <Link to="/contactos">Falar com a equipa <span aria-hidden="true">↗</span></Link>
      </footer>

      {lightbox && <TourLightbox photos={photos} unit={unit} initialIndex={lightbox.index} returnFocus={lightbox.trigger} onClose={() => setLightbox(null)} />}
    </section>
  )
}

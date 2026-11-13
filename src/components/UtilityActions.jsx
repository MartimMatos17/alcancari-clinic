import { useEffect, useRef, useState } from 'react'
import '../styles/site-utilities.css'

export function CopyButton({ text, label = 'Copiar morada' }) {
  const [status, setStatus] = useState('')
  return <><button className="utility-button" type="button" onClick={async () => { try { await navigator.clipboard.writeText(text); setStatus('Copiado.'); } catch { setStatus('Não foi possível copiar. Selecione e copie o texto apresentado.'); } }}>{label}</button><span className="utility-status" role="status">{status}</span></>
}
export function ShareButton({ title }) {
  const [status, setStatus] = useState('')
  return <><button className="utility-button" type="button" onClick={async () => { try { const url = window.location.origin + window.location.pathname; if (navigator.share) { await navigator.share({ title, url }); } else { await navigator.clipboard.writeText(url); setStatus('Ligação copiada.'); } } catch (error) { if (error.name !== 'AbortError') setStatus('Não foi possível partilhar. Copie a ligação da barra de endereço.'); } }}>Partilhar ↗</button><span className="utility-status" role="status">{status}</span></>
}
export function ReadingProgress({ target }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const update = () => { const rect = target.current?.getBoundingClientRect(); if (rect) setValue(Math.max(0, Math.min(100, -rect.top / Math.max(1, rect.height - window.innerHeight) * 100))); }
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [target])
  return <progress className="reading-progress" max="100" value={value} aria-label="Progresso de leitura" />
}
export function Modal({ children, label, onClose, className = '', onKeyDown }) {
  const ref = useRef(null)
  const close = useRef(onClose); close.current = onClose
  useEffect(() => { const dialog = ref.current; const active = document.activeElement; const overflow = document.body.style.overflow; dialog.showModal(); document.body.style.overflow = 'hidden'; return () => { dialog.close(); document.body.style.overflow = overflow; if (active?.isConnected) active.focus() } }, [])
  return <dialog ref={ref} aria-label={label} className={`utility-modal ${className}`} onCancel={event => { event.preventDefault(); close.current() }} onKeyDown={onKeyDown} onClick={event => { if (event.target === event.currentTarget) close.current() }}><div className="utility-modal__inner"><button type="button" className="utility-modal__close utility-button" onClick={onClose} aria-label="Fechar">✕</button>{children}</div></dialog>
}

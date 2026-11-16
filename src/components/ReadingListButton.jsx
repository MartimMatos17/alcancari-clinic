import { useEffect, useState } from 'react'

const STORAGE_KEY = 'alcancari:leituras-guardadas:v1'
const CHANGE_EVENT = 'alcancari:leituras-atualizadas'

function readSaved() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter(value => typeof value === 'string') : []
  } catch {
    return []
  }
}

export function useReadingList() {
  const [saved, setSaved] = useState(() =>
    typeof window === 'undefined' ? [] : readSaved()
  )

  useEffect(() => {
    const sync = () => setSaved(readSaved())
    window.addEventListener('storage', sync)
    window.addEventListener(CHANGE_EVENT, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(CHANGE_EVENT, sync)
    }
  }, [])

  function toggle(slug) {
    if (!slug || typeof window === 'undefined') return
    const current = readSaved()
    const next = current.includes(slug)
      ? current.filter(item => item !== slug)
      : [...current, slug]
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // O botão continua utilizável mesmo com armazenamento bloqueado.
    }
    setSaved(next)
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }

  return { saved, toggle }
}

export default function ReadingListButton({ slug, className = '' }) {
  const { saved, toggle } = useReadingList()
  const active = saved.includes(slug)
  return (
    <button
      type="button"
      className={`be-save ${active ? 'is-saved' : ''} ${className}`.trim()}
      onClick={() => toggle(slug)}
      aria-pressed={active}
      aria-label={active ? 'Remover artigo das leituras guardadas' : 'Guardar artigo para ler mais tarde'}
      title={active ? 'Remover dos guardados' : 'Guardar para ler mais tarde'}
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4V4.5Z" />
      </svg>
      <span>{active ? 'Guardado' : 'Guardar'}</span>
    </button>
  )
}

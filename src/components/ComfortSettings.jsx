import { useEffect, useState } from 'react'
import { Modal } from './UtilityActions'
import '../styles/comfort-settings.css'
const defaults = { size: 'normal', contrast: false, motion: false }
function read() {
  try {
    const saved = JSON.parse(localStorage.getItem('alcancari-comfort') || 'null')
    return { size: ['normal', 'large', 'larger'].includes(saved?.size) ? saved.size : 'normal', contrast: saved?.contrast === true, motion: saved?.motion === true }
  } catch { return defaults }
}
export default function ComfortSettings() {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState(read)
  const [persistent, setPersistent] = useState(true)
  useEffect(() => {
    document.documentElement.dataset.readingSize = settings.size
    document.documentElement.dataset.contrast = String(settings.contrast)
    document.documentElement.dataset.calm = String(settings.motion)
    try { localStorage.setItem('alcancari-comfort', JSON.stringify(settings)); setPersistent(true) } catch { setPersistent(false) }
  }, [settings])
  return <><button className="comfort-trigger" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}><span aria-hidden="true">Aa</span> Modo conforto</button>{open && <Modal label="Preferências de conforto" onClose={() => setOpen(false)} className="comfort-panel"><p className="comfort-kicker">AO SEU RITMO</p><h2>Um site mais<br /><em>confortável para si.</em></h2><p>Ajuste a apresentação. Pode repor tudo a qualquer momento.</p><fieldset><legend>Tamanho do texto</legend><div className="comfort-options">{[['normal', 'Normal'], ['large', 'Maior'], ['larger', 'Grande']].map(([value, label]) => <button key={value} type="button" aria-pressed={settings.size === value} onClick={() => setSettings(previous => ({ ...previous, size: value }))}>{label}</button>)}</div></fieldset><label className="comfort-choice"><span><strong>Mais contraste</strong><small>Reforça o contraste dos textos principais.</small></span><input type="checkbox" checked={settings.contrast} onChange={event => setSettings(previous => ({ ...previous, contrast: event.target.checked }))} /></label><label className="comfort-choice"><span><strong>Menos movimento</strong><small>Reduz animações e transições. A preferência do sistema continua a ser respeitada.</small></span><input type="checkbox" checked={settings.motion} onChange={event => setSettings(previous => ({ ...previous, motion: event.target.checked }))} /></label><button type="button" className="utility-button" onClick={() => setSettings({ ...defaults })}>Repor preferências</button><p className="comfort-storage" role="status">{persistent ? 'Estas preferências ficam apenas neste navegador.' : 'O armazenamento está indisponível. Os ajustes aplicam-se enquanto mantém esta página aberta.'}</p></Modal>}</>
}

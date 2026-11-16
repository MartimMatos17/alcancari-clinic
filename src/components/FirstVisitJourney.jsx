import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../content/site'
import '../styles/first-visit.css'

const checklist = [
  { id: 'contacto', title: 'Confirmar os detalhes', description: 'Verifique com a clínica a data, o horário, a unidade e quaisquer indicações dadas pela equipa.' },
  { id: 'local', title: 'Planear o percurso', description: 'Consulte a morada e organize o trajeto até à unidade escolhida.' },
  { id: 'perguntas', title: 'Preparar perguntas', description: 'Pense nas dúvidas que gostaria de esclarecer com o profissional.' },
  { id: 'orientacoes', title: 'Rever as orientações recebidas', description: 'Caso a equipa tenha indicado algum documento ou preparação, confirme o que é necessário levar.' },
]

const steps = [
  { number: '01', title: 'Antes da visita', text: 'Prepare o percurso e anote as questões que deseja esclarecer.' },
  { number: '02', title: 'À chegada', text: 'Dirija-se à receção da unidade e siga as indicações da equipa.' },
  { number: '03', title: 'Depois da conversa', text: 'Confirme os próximos passos diretamente com o profissional que o acompanhou.' },
]

const STORE = 'alcancari-first-visit-v1'
function initialChecks() {
  try {
    const value = JSON.parse(localStorage.getItem(STORE) || '[]')
    return Array.isArray(value) ? value.filter(id => checklist.some(item => item.id === id)) : []
  } catch { return [] }
}

export default function FirstVisitJourney() {
  const [unitId, setUnitId] = useState(site.units[0]?.id || '')
  const [checked, setChecked] = useState(initialChecks)
  const [stepIndex, setStepIndex] = useState(0)
  const unit = site.units.find(item => item.id === unitId)
  const completed = checked.length
  const progress = Math.round(completed / checklist.length * 100)

  const toggle = id => {
    const next = checked.includes(id) ? checked.filter(value => value !== id) : [...checked, id]
    setChecked(next)
    try { localStorage.setItem(STORE, JSON.stringify(next)) } catch { /* armazenamento indisponível */ }
  }
  const reset = () => {
    setChecked([])
    try { localStorage.removeItem(STORE) } catch { /* armazenamento indisponível */ }
  }
  const print = () => window.print()

  return (
    <section className="fv" id="primeira-visita" aria-labelledby="fv-title">
      <div className="container-shell fv-shell">
        <header className="fv-head">
          <div>
            <p className="fv-overline">UM PERCURSO MAIS SIMPLES</p>
            <h2 id="fv-title">A primeira visita <em>começa aqui.</em></h2>
          </div>
          <p>Um pequeno guia interativo para preparar a visita à Clínica Alcançari, ao seu ritmo.</p>
        </header>
        <div className="fv-layout">
          <div className="fv-main">
            <div className="fv-eyebrow"><span>01 / ESCOLHER A UNIDADE</span><span className="fv-line" /></div>
            <div className="fv-unit-grid" role="group" aria-label="Escolher unidade">
              {site.units.filter(item => item.confirmed && item.published).map(item => (
                <button className={'fv-unit' + (unitId === item.id ? ' is-active' : '')}
                  type="button" key={item.id} aria-pressed={unitId === item.id}
                  onClick={() => setUnitId(item.id)}>
                  <span className="fv-unit-mark" aria-hidden="true">⌖</span>
                  <strong>{item.name.replace(/^Unidade\s+/i, '')}</strong>
                  <small>{item.address}</small>
                  <span className="fv-unit-check" aria-hidden="true">{unitId === item.id ? '✓' : '↗'}</span>
                </button>
              ))}
            </div>
            {unit && <div className="fv-address" aria-live="polite">
              <div><span>UNIDADE SELECIONADA</span><strong>{unit.address}, {unit.postalCode}</strong></div>
              <Link to="/unidades">Ver informações e localização <span aria-hidden="true">↗</span></Link>
            </div>}
            <div className="fv-eyebrow"><span>02 / CONHECER AS ETAPAS</span><span className="fv-line" /></div>
            <div className="fv-steps" role="group" aria-label="Etapas da primeira visita">
              {steps.map((step, i) => <button type="button" key={step.number}
                className={'fv-step' + (stepIndex === i ? ' is-active' : '')}
                aria-pressed={stepIndex === i} onClick={() => setStepIndex(i)}>
                <span>{step.number}</span>{step.title}
              </button>)}
            </div>
            <div className="fv-step-detail" aria-live="polite">
              <span className="fv-step-watermark" aria-hidden="true">{steps[stepIndex].number}</span>
              <div><p>O SEU PERCURSO</p><h3>{steps[stepIndex].title}</h3><p>{steps[stepIndex].text}</p></div>
              <div className="fv-step-actions"><button type="button" onClick={() => setStepIndex((stepIndex + 2) % 3)}>Anterior</button><button type="button" onClick={() => setStepIndex((stepIndex + 1) % 3)}>Seguinte ↗</button></div>
            </div>
          </div>
          <aside className="fv-checklist" aria-labelledby="fv-checklist-title">
            <div className="fv-check-top"><span>A SUA CHECKLIST</span><span>{completed}/{checklist.length}</span></div>
            <h3 id="fv-checklist-title">Tudo a postos?</h3>
            <p>Marque o que já preparou. O progresso fica guardado apenas neste navegador.</p>
            <div className="fv-progress" role="progressbar" aria-label="Preparação concluída" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${progress}%` }} /></div>
            <span className="fv-progress-label">{progress}% preparado</span>
            <div className="fv-tasks">{checklist.map(item => <label className={'fv-task' + (checked.includes(item.id) ? ' is-checked' : '')} key={item.id}>
              <input type="checkbox" checked={checked.includes(item.id)} onChange={() => toggle(item.id)} />
              <span><strong>{item.title}</strong><small>{item.description}</small></span>
            </label>)}</div>
            <div className="fv-check-actions"><button type="button" className="fv-print" onClick={print}>Imprimir guia ↗</button><button type="button" className="fv-reset" onClick={reset}>Recomeçar</button></div>
            <p className="fv-privacy">Este guia é informativo. Para indicações específicas sobre a visita, confirme diretamente com a clínica. Não introduza dados clínicos.</p>
          </aside>
        </div>
        <div className="fv-bottom"><div><strong>Ficou alguma dúvida?</strong><span>A nossa equipa está disponível para ajudar a preparar a sua visita.</span></div><Link to="/contactos">Falar com a clínica <span aria-hidden="true">↗</span></Link></div>
      </div>
    </section>
  )
}

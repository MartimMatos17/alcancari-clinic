export default function SourceNote({ entry }) {
  return <aside className="source-note">
    {entry.status === 'excerpt-only' && <p>Este é o excerto disponível no blog da clínica. O artigo completo ainda não está disponível nesta página.</p>}
    {entry.status === 'summary-only' && <p>Para saber mais sobre este serviço, contacte a clínica.</p>}
    <a href={entry.source.url} target="_blank" rel="noopener noreferrer">Consultar a fonte original ↗</a>
  </aside>
}

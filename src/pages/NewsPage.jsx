import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InstagramFeed from '../components/InstagramFeed'
import SocialCommunity from '../components/SocialCommunity'
import { content, site } from '../content/site'
import { getPublished } from '../lib/content'
import usePageMeta from '../hooks/usePageMeta'
import EmptyState from '../components/EmptyState'
import { categoriesOf, searchable, PostCard } from '../components/BlogEditorial'
import ReadingListButton, { useReadingList } from '../components/ReadingListButton'
import '../styles/blog-editorial.css'
import '../styles/blog-experience.css'

export default function NewsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [onlySaved, setOnlySaved] = useState(false)
  const { saved } = useReadingList()
  const navigate = useNavigate()

  const posts = getPublished(site.posts)
  const categories = [...new Set(posts.flatMap(categoriesOf))]
    .sort((a, b) => a.localeCompare(b, 'pt-PT'))
  const normalizedQuery = searchable(query.trim())
  const filtering = Boolean(normalizedQuery) || category !== 'Todas' || onlySaved
  const filtered = posts.filter(post => {
    if (onlySaved && !saved.includes(post.slug)) return false
    if (category !== 'Todas' && !categoriesOf(post).includes(category)) return false
    const text = [post.title, post.summary, post.category,
      ...(post.blocks || []).flatMap(block => [block.text, ...(block.items || [])])
    ].filter(Boolean).join(' ')
    return searchable(text).includes(normalizedQuery)
  })

  usePageMeta('Blog e novidades', content.news.intro)

  function surprise() {
    if (!posts.length) return
    const picked = posts[Math.floor(Math.random() * posts.length)]
    navigate(`/novidades/${picked.slug}`)
  }

  function reset() {
    setQuery('')
    setCategory('Todas')
    setOnlySaved(false)
  }

  return (
    <div className="blog-editorial blog-experience">
      <header className="be-hero">
        <div className="container-shell be-hero__inner">
          <div className="be-hero__copy">
            <p className="be-eyebrow"><span aria-hidden="true">✳</span> ALCANÇARI / REVISTA DIGITAL</p>
            <h1>Histórias que <em>aproximam.</em></h1>
            <p className="be-hero__description">Ideias, novidades e pequenas descobertas sobre o desenvolvimento, o brincar e a vida em família. Um espaço para explorar ao seu ritmo.</p>
            <div className="be-hero__actions">
              <a className="be-button be-button--dark" href="#explorar-blog">Explorar artigos <span aria-hidden="true">↘</span></a>
              <button className="be-button be-button--outline" type="button" onClick={surprise} disabled={!posts.length}>Surpreenda-me <span aria-hidden="true">✦</span></button>
            </div>
          </div>
          <div className="be-hero__art" aria-hidden="true">
            <span className="be-orbit be-orbit--one" />
            <span className="be-orbit be-orbit--two" />
            <div className="be-art__center"><span>Aprender.</span><span>Descobrir.</span><strong>Crescer.</strong></div>
            <span className="be-art__stamp">UM ESPAÇO PARA CONVERSAR •</span>
          </div>
        </div>
        <div className="container-shell be-hero__foot"><span>OLHARES SOBRE O CUIDADO</span><span>{posts.length} PUBLICAÇÕES PARA EXPLORAR</span></div>
      </header>

      <div className="container-shell be-main">
        {!filtering && posts[0] && (
          <section className="be-spotlight" aria-labelledby="be-spotlight-title">
            <div className="be-section-heading"><div><p className="be-eyebrow">EM DESTAQUE</p><h2 id="be-spotlight-title">Para começar <em>por aqui.</em></h2></div><span className="be-index">01 / DESTAQUE</span></div>
            <div className="be-featured-wrap"><PostCard post={posts[0]} featured /><ReadingListButton slug={posts[0].slug} className="be-featured-save" /></div>
          </section>
        )}

        <section className="be-discover" aria-labelledby="be-discover-title">
          <div className="be-section-heading"><div><p className="be-eyebrow">NAVEGUE POR INTERESSES</p><h2 id="be-discover-title">O que desperta a sua <em>curiosidade?</em></h2></div></div>
          <div className="be-topic-grid">
            {categories.slice(0, 6).map((topic, index) => (
              <button key={topic} type="button" className={`be-topic ${category === topic && !onlySaved ? 'is-active' : ''}`} onClick={() => { setCategory(topic); setOnlySaved(false); document.getElementById('explorar-blog')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
                <span className="be-topic__number">{String(index + 1).padStart(2, '0')}</span><strong>{topic}</strong><span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </section>

        <section className="blog-library be-library" id="explorar-blog" aria-labelledby="blog-library-title">
          <div className="blog-library__heading be-library__heading"><div><p className="be-eyebrow">BIBLIOTECA ALCANÇARI</p><h2 id="blog-library-title">Explore. Guarde. <em>Volte a ler.</em></h2></div><p>Encontre um tema interessante e guarde as leituras que quiser revisitar, neste dispositivo.</p></div>
          <div className="be-toolbar">
            <label className="blog-search be-search"><span className="blog-sr">Pesquisar publicações</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6" /></svg><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Pesquisar temas, palavras, artigos…" /></label>
            <button type="button" className={`be-shelf-toggle ${onlySaved ? 'is-active' : ''}`} aria-pressed={onlySaved} onClick={() => setOnlySaved(v => !v)}><span aria-hidden="true">▤</span> As minhas leituras <span className="be-shelf-count">{posts.filter(p => saved.includes(p.slug)).length}</span></button>
          </div>
          <div className="blog-filters" role="group" aria-label="Filtrar por categoria">{['Todas', ...categories].map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}</div>
          <div className="be-results-row"><p className="blog-results" role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'publicação encontrada' : 'publicações encontradas'}{onlySaved ? ' nas suas leituras' : ''}</p>{filtering && <button type="button" className="be-reset" onClick={reset}>Limpar filtros ×</button>}</div>
          {filtered.length ? <div className="blog-grid be-grid">{filtered.map(post => <div className="be-card-wrap" key={post.slug}><PostCard post={post} /><ReadingListButton slug={post.slug} /></div>)}</div> : <div className="blog-empty be-empty"><EmptyState title={onlySaved ? 'Ainda não há leituras guardadas.' : posts.length ? 'Não encontrámos artigos para esta pesquisa.' : content.news.emptyTitle} text={onlySaved ? 'Guarde uma publicação através do botão Guardar para a encontrar aqui.' : posts.length ? 'Experimente outra palavra ou selecione uma categoria diferente.' : content.news.emptyText} /><button type="button" className="be-button be-button--dark" onClick={reset}>Ver todas as publicações</button></div>}
        </section>
        <div className="be-closing"><span aria-hidden="true">✳</span><p>Conhecer mais é uma forma de cuidar melhor.</p><span>ALCANÇARI / BLOG</span></div>
        <SocialCommunity /><InstagramFeed />
      </div>
    </div>
  )
}

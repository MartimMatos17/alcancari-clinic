import InstagramFeed from '../components/InstagramFeed'
import { useState } from 'react'
import { content, site } from '../content/site'
import { getPublished } from '../lib/content'
import usePageMeta from '../hooks/usePageMeta'
import EmptyState from '../components/EmptyState'
import { categoriesOf, searchable, PostCard } from '../components/BlogEditorial'
import '../styles/blog-editorial.css'

export default function NewsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const posts = getPublished(site.posts)
  const categories = [...new Set(posts.flatMap(categoriesOf))]
  const searching = Boolean(query.trim()) || category !== 'Todas'
  const filtered = posts.filter(post => (category === 'Todas' || categoriesOf(post).includes(category)) && searchable([post.title, post.summary, post.category, ...(post.blocks || []).flatMap(block => [block.text, ...(block.items || [])])].join(' ')).includes(searchable(query.trim())))
  usePageMeta('Blog e novidades', content.news.intro)
  return <div className="blog-editorial"><header className="container-shell blog-intro"><p className="blog-kicker">{content.news.eyebrow}</p><h1>{content.news.title}</h1><p>{content.news.intro}</p><span className="blog-edition">Alcançari / Blog</span></header>
    <div className="container-shell">{!searching && posts[0] && <PostCard post={posts[0]} featured />}
      <section className="blog-library" aria-labelledby="blog-library-title"><div className="blog-library__heading"><h2 id="blog-library-title">Todas as publicações</h2><label className="blog-search"><span className="blog-sr">Pesquisar publicações</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Pesquisar no blog…" /></label></div>
      <div className="blog-filters" role="group" aria-label="Filtrar por categoria">{['Todas', ...categories].map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}</div>
      <p className="blog-results" role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'publicação' : 'publicações'}{category !== 'Todas' ? ` em ${category}` : ''}</p>
      {filtered.length ? <div className="blog-grid">{filtered.map(post => <PostCard key={post.slug} post={post} />)}</div> : <div className="blog-empty"><EmptyState title={posts.length ? 'Nenhuma publicação encontrada.' : content.news.emptyTitle} text={posts.length ? 'Experimente outra pesquisa ou categoria.' : content.news.emptyText} />{posts.length > 0 && <button type="button" className="button button-primary" onClick={() => { setQuery(''); setCategory('Todas') }}>Limpar filtros</button>}</div>}</section><InstagramFeed />
    </div></div>
}

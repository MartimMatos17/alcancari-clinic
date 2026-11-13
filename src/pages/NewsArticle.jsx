import { useRef } from 'react'
import { ShareButton, ReadingProgress } from '../components/UtilityActions'
import { Link } from 'react-router-dom'
import MediaPlaceholder from '../components/MediaPlaceholder'
import RichContent from '../components/RichContent'
import SourceNote from '../components/SourceNote'
import { categoriesOf, PostCard, PostMeta } from '../components/BlogEditorial'
import Icon from '../components/Icon'
import '../styles/blog-editorial.css'

export default function NewsArticle({ entry, posts }) {
  const reading = useRef(null)
  const words = (entry.blocks || []).map(block => [block.text, ...(block.items || [])].filter(Boolean).join(' ')).join(' ').split(/\s+/).length
  const categories = categoriesOf(entry)
  const related = posts.filter(post => post.slug !== entry.slug).map((post, index) => ({ post, index, score: categoriesOf(post).filter(category => categories.includes(category)).length })).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 3)
  const sections = (entry.blocks || []).map((block, index) => ({ ...block, index })).filter(block => block.type === 'heading')
  return <div className="blog-editorial blog-article"><article><header className="container-shell blog-article__header"><Link className="blog-back" to="/novidades"><Icon name="arrow" />Todas as publicações</Link><p className="blog-kicker">{categories.join(' / ')}</p><h1>{entry.title}</h1><PostMeta post={entry} /><ShareButton title={entry.title} />{entry.author && <p className="blog-author">Por {entry.author}</p>}</header>
    <div className="container-shell blog-article__cover"><MediaPlaceholder image={entry.image} label={entry.title} eager /></div>
    <div className="container-shell blog-reading-layout"><aside className="blog-reading-aside"><p className="blog-kicker">Nesta leitura</p><p>{categories.join(' / ')}</p>{sections.length > 0 && <nav aria-label="Índice do artigo">{sections.map(section => <a key={section.index} href={`#section-${section.index}`}>{section.text}</a>)}</nav>}<Link to="/novidades">Explorar o blog <span aria-hidden="true">↗</span></Link></aside><div className="blog-prose" ref={reading}>{words >= 400 && <ReadingProgress target={reading} />}<RichContent blocks={entry.blocks} /><SourceNote entry={entry} /><div className="blog-article__end"><span className="blog-kicker">Alcançari / Blog</span><Link to="/novidades">Voltar às publicações <Icon name="arrow" /></Link></div></div></div></article>
    {related.length > 0 && <section className="blog-related"><div className="container-shell"><div className="blog-library__heading"><div><p className="blog-kicker">Continue a leitura</p><h2>Artigos relacionados</h2></div><Link className="blog-read" to="/novidades">Ver todos <Icon name="arrow" /></Link></div><div className="blog-grid">{related.map(({ post }) => <PostCard post={post} key={post.slug} />)}</div></div></section>}
  </div>
}

import { Link } from 'react-router-dom'
import { formatDate } from '../lib/content'
import MediaPlaceholder from './MediaPlaceholder'
import Icon from './Icon'

export const categoriesOf = post => (post.category || '').split('|').map(value => value.trim()).filter(Boolean)
export const searchable = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-PT')
export const readingTime = post => {
  const words = (post.blocks || []).map(block => [block.text, ...(block.items || [])].filter(Boolean).join(' ')).join(' ').trim().split(/\s+/).filter(Boolean).length
  return words < 200 ? 'Menos de 1 min de leitura' : `${Math.ceil(words / 200)} min de leitura`
}
export function PostMeta({ post }) {
  return <div className="blog-meta">{formatDate(post.date) && <time dateTime={post.date}>{formatDate(post.date)}</time>}<span>{readingTime(post)}</span>{post.status === 'excerpt-only' && <span>Excerto</span>}</div>
}
export function PostCard({ post, featured = false }) {
  return <article className={`blog-card${featured ? ' blog-card--featured' : ''}`}>
    <Link className="blog-card__image" to={`/novidades/${post.slug}`} tabIndex={-1} aria-hidden="true"><MediaPlaceholder image={post.image} label={post.title} eager={featured} /></Link>
    <div className="blog-card__body"><p className="blog-kicker">{featured ? 'Em destaque · ' : ''}{categoriesOf(post).join(' / ')}</p><h2><Link to={`/novidades/${post.slug}`}>{post.title}</Link></h2><p className="blog-card__summary">{post.summary}</p><PostMeta post={post} /><Link className="blog-read" to={`/novidades/${post.slug}`}>Ler {post.status === 'excerpt-only' ? 'excerto' : 'artigo'}<Icon name="diagonal" /><span className="blog-sr">: {post.title}</span></Link></div>
  </article>
}

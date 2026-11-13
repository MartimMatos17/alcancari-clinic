import NewsArticle from './NewsArticle'

import ServiceDetailPage from './ServiceDetailPage'
import { useParams } from 'react-router-dom'
import { site } from '../content/site'
import { getPublished } from '../lib/content'
import usePageMeta from '../hooks/usePageMeta'
import NotFoundPage from './NotFoundPage'
import '../styles/services-redesign.css'

export default function DetailPage({ kind }) {
  const { slug } = useParams()
  const article = kind === 'news'

  const entries = getPublished(
    article ? site.posts : site.services
  )

  const entry = entries.find(item => item.slug === slug)

  usePageMeta(
    entry?.title || 'Página não encontrada',
    entry?.summary,
    { notFound: !entry }
  )

  if (!entry) return <NotFoundPage />
  if (!article) return <ServiceDetailPage key={entry.slug} entry={entry} services={entries} />

  return <NewsArticle key={entry.slug} entry={entry} posts={entries} />
}

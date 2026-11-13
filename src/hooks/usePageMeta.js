import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { site } from '../content/site'

export default function usePageMeta(title, description = site.description, { notFound = false } = {}) {
  const { pathname } = useLocation()
  useEffect(() => {
    const pageTitle = title ? `${title} · ${site.name}` : site.name
    document.title = pageTitle
    document.documentElement.lang = 'pt-PT'
    const setMeta = (attribute, key, value) => {
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.appendChild(element)
      }
      element.content = value
    }
    setMeta('name', 'description', description)
    setMeta('name', 'robots', site.indexingEnabled && !notFound ? 'index, follow' : 'noindex, nofollow')
    setMeta('property', 'og:title', pageTitle)
    setMeta('property', 'og:description', description)
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (site.url && /^https:\/\//.test(site.url) && !notFound) {
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
      canonical.href = new URL(pathname, site.url).href
      setMeta('property', 'og:url', canonical.href)
    } else {
      canonical?.remove()
      document.head.querySelector('meta[property="og:url"]')?.remove()
    }
  }, [title, description, pathname, notFound])
}

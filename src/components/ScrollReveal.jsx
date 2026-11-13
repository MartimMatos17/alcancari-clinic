
import { useEffect } from 'react'

export default function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(
      '.alc-home-section, .alc-home-about, .alc-home-units, .alc-home-news, .alc-team__card, .sv-card, .alc-units__item'
    )

    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('alc-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    )

    elements.forEach(element => {
      element.classList.add('alc-reveal')
      observer.observe(element)
    })

    return () => observer.disconnect()
  })

  return null
}

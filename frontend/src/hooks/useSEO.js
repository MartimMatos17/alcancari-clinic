import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SEO_DATA = {
  '/': { title: 'Alcançari — Clínica Terapêutica Pediátrica', description: 'Clínica terapêutica pediátrica multidisciplinar em Leça da Palmeira e São Mamede de Infesta.' },
  '/servicos': { title: 'Serviços — Alcançari', description: 'Terapia Ocupacional, Psicologia, Terapia da Fala, Fisioterapia, Floortime e mais.' },
  '/sobre': { title: 'A Clínica — Alcançari', description: 'Conheça a equipa e as unidades da Alcançari.' },
  '/blog': { title: 'Blog — Alcançari', description: 'Artigos sobre desenvolvimento infantil escritos pela equipa da Alcançari.' },
  '/contacto': { title: 'Contacto — Alcançari', description: 'Entre em contacto com a Alcançari. 934 779 548.' },
  '/marcacao': { title: 'Marcar Consulta — Alcançari', description: 'Marque uma consulta de forma rápida e simples.' },
  '/faq': { title: 'FAQ — Alcançari', description: 'Perguntas frequentes sobre os serviços da Alcançari.' },
  '/privacidade': { title: 'Privacidade — Alcançari', description: 'Política de privacidade e RGPD.' },
}

const SERVICE_SEO = {
  fisioterapia: { title: 'Fisioterapia — Alcançari', description: 'Fisioterapia pediátrica especializada.' },
  psicologia: { title: 'Psicologia — Alcançari', description: 'Acompanhamento psicológico para crianças.' },
  'terapia-fala': { title: 'Terapia da Fala — Alcançari', description: 'Avaliação e intervenção em comunicação e linguagem.' },
  'terapia-ocupacional': { title: 'Terapia Ocupacional — Alcançari', description: 'Terapia Ocupacional pediátrica.' },
  floortime: { title: 'Floortime — Alcançari', description: 'Abordagem Floortime para desenvolvimento relacional.' },
  'integracao-sensorial': { title: 'Integração Sensorial — Alcançari', description: 'Intervenção em processamento sensorial.' },
  acupuntura: { title: 'Acupuntura — Alcançari', description: 'Acupuntura como terapia complementar.' },
  'intervencao-grupo': { title: 'Intervenção em Grupo — Alcançari', description: 'Sessões terapêuticas em grupo.' },
  formacao: { title: 'Formação — Alcançari', description: 'Formações para profissionais e famílias.' },
}

export default function useSEO() {
  const { pathname } = useLocation()

  useEffect(() => {
    let seo = SEO_DATA[pathname]

    if (!seo && pathname.startsWith('/servicos/')) {
      const slug = pathname.replace('/servicos/', '')
      seo = SERVICE_SEO[slug] || { title: 'Serviço — Alcançari', description: 'Serviço terapêutico da Alcançari.' }
    }

    if (!seo) seo = SEO_DATA['/']

    document.title = seo.title

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta) }
    meta.content = seo.description

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.content = seo.title
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.content = seo.description

  }, [pathname])
}

import { site } from './site.js'

export const legacyRoutes = {
  '/sobre': '/clinica',
  '/a-clinica': '/clinica',
  '/corpo-clinico': '/equipa',
  '/contacto': '/contactos',
  '/marcacao': '/contactos',
  '/blog': '/novidades',
  '/faq': '/contactos',
  '/acupunctura': '/servicos/acupuntura',
  '/unidade-leca-da-palmeira': '/unidades/leca-da-palmeira',
  '/unidade-sao-mamede-de-infesta': '/unidades/sao-mamede-de-infesta',
  ...Object.fromEntries(site.services.map(service => [`/${service.slug}`, `/servicos/${service.slug}`])),
}

export const publicPaths = [
  '/', '/clinica', '/servicos', '/equipa', '/unidades', '/novidades', '/contactos', '/privacidade',
  ...site.services.map(item => `/servicos/${item.slug}`),
  ...site.team.map(item => `/equipa/${item.id}`),
  ...site.units.map(item => `/unidades/${item.id}`),
  ...site.posts.map(item => `/novidades/${item.slug}`),
]

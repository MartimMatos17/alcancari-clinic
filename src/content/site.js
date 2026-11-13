import services from './services.json' with { type: 'json' }
import team from './team.json' with { type: 'json' }
import units from './units.json' with { type: 'json' }
import posts from './posts.json' with { type: 'json' }
import clinic from './clinic.json' with { type: 'json' }
import { media } from './media.js'

const withImages = (items, images) => items.map(item => ({ ...item, image: images[item.slug || item.id] || null }))

export const site = {
  name: 'Clínica Alcançari',
  shortName: 'Alcançari',
  url: '',
  indexingEnabled: false,
  description: 'Conheça a Clínica Alcançari: a clínica, os serviços, a equipa, as unidades e as novidades.',
  brand: { logo: media.brand, footerLogo: media.brandFooter, logoAlt: 'Clínica Alcançari' },
  images: { home: media.home, clinic: media.clinic, team: null },
  contacts: {
    phone: { value: '+351934779548', confirmed: true },
    whatsapp: { value: '+351934779548', confirmed: true },
    email: { value: 'alcancari.terapias@gmail.com', confirmed: true },
  },
  // Modelos e regras de publicação em docs/CONTENT.md.
  services: withImages(services, media.services),
  team: withImages(team, media.team),
  units: withImages(units, media.units),
  posts: withImages(posts, media.posts),
  clinic,
  galleries: media.galleries,
  officialLinks: [
    { label: 'Instagram', href: 'https://www.instagram.com/clinica.alcancari/' },
    { label: 'Facebook', href: 'https://www.facebook.com/alcancari' },
    { label: 'Livro de reclamações', href: 'https://www.livroreclamacoes.pt/Inicio/' },
  ],
}

export const navigation = [
  { path: '/', label: 'Início' },
  { path: '/clinica', label: 'Clínica' },
  { path: '/servicos', label: 'Serviços' },
  { path: '/equipa', label: 'Equipa' },
  { path: '/unidades', label: 'Unidades' },
  { path: '/novidades', label: 'Blog' },
  { path: '/contactos', label: 'Contactos' },
]

export const content = {
  home: {
    eyebrow: 'Bem-vindo à Alcançari',
    titleLead: 'A clínica terapêutica', titleBridge: 'do seu', titleEmphasis: 'filho.',
    intro: clinic.intro,
    aboutTitle: 'A Alcançari, de perto.',
    aboutText: clinic.blocks.map(block => block.text).join(' '),
    exploreTitle: 'Encontre o seu ponto de partida.',
    exploreText: 'Escolha o que gostaria de conhecer melhor.',
    newsTitle: 'Há sempre espaço para uma nova conversa.',
    newsText: 'Conheça os conteúdos da clínica sobre desenvolvimento, brincar e família.',
  },
  clinic: {
    eyebrow: 'A clínica', title: 'Prazer, somos a Alcançari.',
    intro: clinic.intro,
    detailTitle: 'Uma equipa que escuta. Um cuidado em conjunto.',
  },
  services: {
    eyebrow: 'Serviços', title: 'Conhecer para escolher.',
    intro: 'Conheça os nove serviços da Clínica Alcançari e as suas áreas de intervenção.',
    emptyTitle: 'Os nossos serviços, em breve.',
    emptyText: 'Estamos a preparar a informação de cada serviço para a apresentar com clareza.',
  },
  team: {
    eyebrow: 'A equipa', title: 'Conheça quem está deste lado.',
    intro: 'Uma equipa de profissionais de diversas áreas disponível para esclarecer e ajudar.',
    emptyTitle: 'Uma equipa para conhecer.',
    emptyText: 'A apresentação dos profissionais e as suas fotografias serão disponibilizadas em breve.',
  },
  units: {
    eyebrow: 'Unidades', title: 'Os espaços da Alcançari.',
    intro: 'Informação prática para preparar a sua visita.',
    emptyTitle: 'Prepare a sua visita.',
    emptyText: 'As moradas, os horários e as indicações de acesso serão disponibilizados após confirmação.',
  },
  news: {
    eyebrow: 'Blog e novidades', title: 'O que há de novo por aqui.',
    intro: 'Um espaço para partilhar notícias e conteúdos da Clínica Alcançari.',
    emptyTitle: 'As primeiras novidades estão a caminho.',
    emptyText: 'Ainda não existem publicações disponíveis. Volte a visitar-nos para acompanhar as novidades.',
  },
  contact: {
    eyebrow: 'Contactos', title: 'Uma conversa começa aqui.',
    intro: 'Para pedir informações ou combinar uma marcação, escolha um dos contactos disponibilizados pela clínica.',
    emptyTitle: 'Contactos a disponibilizar.',
    emptyText: 'Os contactos oficiais da Clínica Alcançari serão apresentados aqui assim que estiverem confirmados.',
    note: 'A disponibilidade e a confirmação de marcações são combinadas diretamente com a clínica.',
  },
}

export const exploreLinks = [
  { to: '/servicos', title: 'Os serviços', text: 'Conheça as áreas de atividade da clínica.' },
  { to: '/equipa', title: 'As pessoas', text: 'Um espaço dedicado à apresentação da equipa.' },
  { to: '/unidades', title: 'Os espaços', text: 'Informação prática para uma próxima visita.' },
]

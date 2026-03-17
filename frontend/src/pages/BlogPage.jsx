import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Search, Clock, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const POSTS = [
  { id: 1, title: 'Seletividade Alimentar', title_en: 'Food Selectivity', excerpt: 'A seletividade alimentar pode manifestar-se de diferentes formas e em várias idades.', excerpt_en: 'Food selectivity can manifest in different ways and at various ages.', category: 'Autismo | Dúvidas', date: '12 Jan 2025', readTime: '4', image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&q=80', featured: true },
  { id: 2, title: 'Como brincar com uma criança com autismo?', title_en: 'How to play with a child with autism?', excerpt: 'Brincar ajuda as crianças a desenvolverem competências sociais e comunicativas.', excerpt_en: 'Play helps children develop social and communication skills.', category: 'Autismo | PEA', date: '5 Jan 2025', readTime: '5', image: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=600&q=80', featured: true },
  { id: 3, title: 'O que é a hiperlexia?', title_en: 'What is hyperlexia?', excerpt: 'Hiperlexia é um síndrome que se identifica pela capacidade de leitura precoce.', excerpt_en: 'Hyperlexia is a syndrome identified by early reading ability.', category: 'Autismo | Dúvidas', date: '28 Dez 2024', readTime: '3', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80', featured: false },
  { id: 4, title: 'Motricidade Fina: o que é e como se desenvolve?', title_en: 'Fine Motor Skills: what is it and how does it develop?', excerpt: 'O desenvolvimento motor fino durante a primeira infância é crucial.', excerpt_en: 'Fine motor development during early childhood is crucial.', category: 'Blog', date: '20 Dez 2024', readTime: '6', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80', featured: false },
  { id: 5, title: 'O meu filho anda em bicos dos pés. Porquê?', title_en: 'My child walks on tiptoes. Why?', excerpt: 'Andar em bicos de pés é comum quando as crianças começam a andar.', excerpt_en: 'Walking on tiptoes is common when children start to walk.', category: 'Blog', date: '15 Dez 2024', readTime: '4', image: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&q=80', featured: false },
  { id: 6, title: 'Como identificar os principais sinais de Autismo', title_en: 'How to identify the main signs of Autism', excerpt: 'Os primeiros traços da Perturbação do Espectro do Autismo podem ser detetados muito cedo.', excerpt_en: 'The first signs of Autism Spectrum Disorder can be detected very early.', category: 'Autismo | PEA', date: '8 Dez 2024', readTime: '7', image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80', featured: false },
  { id: 7, title: 'Birra ou crise de desregulação: Qual a diferença?', title_en: 'Tantrum or dysregulation crisis: What is the difference?', excerpt: 'Como distinguir uma crise de desregulação autista de uma birra?', excerpt_en: 'How to distinguish an autistic dysregulation crisis from a tantrum?', category: 'Autismo | PEA', date: '1 Dez 2024', readTime: '5', image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&q=80', featured: false },
  { id: 8, title: 'Atividades da rotina diária para estimular o desenvolvimento', title_en: 'Daily routine activities to stimulate development', excerpt: 'A implementação de rotinas diárias é extremamente importante para a autonomia.', excerpt_en: 'Implementing daily routines is extremely important for autonomy.', category: 'Blog', date: '22 Nov 2024', readTime: '5', image: 'https://images.unsplash.com/photo-1484820540004-14229fe36ca4?w=600&q=80', featured: false },
  { id: 9, title: 'Intervenção da TO na Perturbação de Hiperatividade', title_en: 'OT Intervention in Hyperactivity Disorder', excerpt: 'É uma das perturbações do neurodesenvolvimento que surge antes dos 12 anos.', excerpt_en: 'It is one of the neurodevelopmental disorders that appears before age 12.', category: 'Terapia Ocupacional', date: '14 Nov 2024', readTime: '8', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80', featured: false },
  { id: 10, title: 'Os adultos precisam de reaprender a brincar', title_en: 'Adults need to relearn how to play', excerpt: 'Como é que, enquanto adultos, nos podemos incentivar a brincar com os nossos filhos?', excerpt_en: 'How can we, as adults, encourage ourselves to play with our children?', category: 'Blog', date: '5 Nov 2024', readTime: '4', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80', featured: false },
]

const CATEGORIES_PT = ['Todos', 'Autismo | PEA', 'Blog', 'Terapia Ocupacional', 'Autismo | Dúvidas']
const CATEGORIES_EN = ['All', 'Autism | ASD', 'Blog', 'Occupational Therapy', 'Autism | FAQ']

const CATEGORY_COLORS = {
  'Autismo | PEA': 'bg-purple-50 text-purple-600 border-purple-200',
  'Autism | ASD':  'bg-purple-50 text-purple-600 border-purple-200',
  'Autismo | Dúvidas': 'bg-purple-50 text-purple-600 border-purple-200',
  'Autism | FAQ':  'bg-purple-50 text-purple-600 border-purple-200',
  'Blog':          'bg-teal-50 text-teal-600 border-teal-200',
  'Terapia Ocupacional': 'bg-orange-50 text-orange-600 border-orange-200',
  'Occupational Therapy': 'bg-orange-50 text-orange-600 border-orange-200',
}

export default function BlogPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.substring(0,2) || 'pt'
  const isEN = lang === 'en'

  const CATEGORIES = isEN ? CATEGORIES_EN : CATEGORIES_PT
  const allLabel = isEN ? 'All' : 'Todos'

  const [activeCategory, setActiveCategory] = useState(allLabel)
  const [search, setSearch] = useState('')

  const filtered = POSTS.filter(p => {
    const title = isEN ? p.title_en : p.title
    const excerpt = isEN ? p.excerpt_en : p.excerpt
    const matchSearch = title.toLowerCase().includes(search.toLowerCase()) || excerpt.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === allLabel || p.category.includes(activeCategory.replace('All','').replace('Todos',''))
    return matchSearch && matchCat
  })

  const featured = filtered.filter(p => p.featured).slice(0,2)
  const rest = filtered.filter(p => !p.featured)

  return (
    <div className="overflow-hidden bg-[#fdf9f3]">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-teal-700 to-teal-900 py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1400&q=70" alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <p className="text-teal-300 text-sm font-semibold uppercase tracking-[0.2em]">✦ {t('blog.badge')}</p>
            <h1 className="font-display text-6xl md:text-7xl text-white font-bold leading-tight">
              {t('blog.title').split(' ').slice(0,-1).join(' ')}<br />
              <span className="text-teal-300 italic">{t('blog.title').split(' ').slice(-1)}</span>
            </h1>
            <p className="text-teal-200 text-lg max-w-lg mx-auto">{t('blog.sub')}</p>
            <div className="max-w-md mx-auto mt-8">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder={t('blog.search_placeholder')}
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-700 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm" />
              </div>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 30C360 60 720 0 1080 30C1260 45 1380 20 1440 30V60H0V30Z" fill="#fdf9f3"/></svg>
        </div>
      </section>

      {/* FILTROS */}
      <section className="py-8 bg-[#fdf9f3] sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-teal-700 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:border-teal-300 hover:text-teal-700'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6 space-y-16">

        {/* FEATURED */}
        {featured.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {isEN ? 'Featured' : 'Em Destaque'}
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map((post, i) => {
                const title = isEN ? post.title_en : post.title
                const excerpt = isEN ? post.excerpt_en : post.excerpt
                return (
                  <motion.article key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative overflow-hidden h-56">
                      <img src={post.image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className={`absolute top-4 left-4 text-xs px-3 py-1.5 rounded-full border font-semibold ${CATEGORY_COLORS[post.category] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {post.category}
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <Clock size={12} /> {post.readTime} {t('blog.reading_time')}
                        <span>·</span><span>{post.date}</span>
                      </div>
                      <h2 className="font-display text-xl text-teal-900 leading-snug group-hover:text-teal-600 transition-colors">{title}</h2>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{excerpt}</p>
                      <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-1.5 text-teal-600 text-sm font-semibold hover:gap-3 transition-all">
                        {t('blog.read')} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        )}

        {/* TODOS OS POSTS */}
        {rest.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {isEN ? 'All Articles' : 'Todos os Artigos'}
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post, i) => {
                const title = isEN ? post.title_en : post.title
                const excerpt = isEN ? post.excerpt_en : post.excerpt
                return (
                  <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                    <div className="relative overflow-hidden h-44">
                      <img src={post.image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full border font-semibold ${CATEGORY_COLORS[post.category] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {post.category}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock size={11} /> {post.readTime} {t('blog.reading_time')}
                        <span>·</span>{post.date}
                      </div>
                      <h3 className="font-display text-lg text-teal-900 leading-snug group-hover:text-teal-600 transition-colors flex-1">{title}</h3>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{excerpt}</p>
                      <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-1.5 text-teal-600 text-xs font-semibold hover:gap-3 transition-all mt-auto pt-2">
                        {t('blog.read')} <ArrowRight size={12} />
                      </Link>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500">{t('common.no_results')}</p>
          </div>
        )}
      </section>

      {/* SOCIAL CTA */}
      <section className="py-20 bg-teal-800 mx-6 rounded-3xl mb-16 max-w-6xl lg:mx-auto">
        <div className="text-center px-6 max-w-2xl mx-auto space-y-6">
          <h2 className="font-display text-3xl md:text-4xl text-white">{t('blog.follow_title')}</h2>
          <p className="text-teal-200">{t('blog.follow_sub')}</p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <a href="https://www.instagram.com/alcancari.terapias" target="_blank" rel="noopener noreferrer"
              className="bg-white text-teal-700 font-semibold px-8 py-3 rounded-full hover:bg-teal-50 transition-colors flex items-center gap-2">
              📷 Instagram
            </a>
            <a href="https://www.facebook.com/alcancari" target="_blank" rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
              👍 Facebook
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

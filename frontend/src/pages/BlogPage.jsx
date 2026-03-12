import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Search, Clock, Tag } from 'lucide-react'

const CATEGORIES = ['Todos', 'Autismo | PEA', 'Blog', 'Terapia Ocupacional', 'Notícias', 'Dúvidas', 'PHDA']

const POSTS = [
  { id: 1, title: 'Seletividade Alimentar', excerpt: 'A seletividade alimentar pode manifestar-se de diferentes formas e em várias idades. Todas as crianças passam por algum tipo de seletividade alimentar entre os 2 anos.', category: 'Autismo | Dúvidas', date: '12 Jan 2025', readTime: '4 min', image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&q=80', featured: true },
  { id: 2, title: 'Como brincar com uma criança com autismo?', excerpt: 'Como envolver uma criança com autismo em brincadeiras divertidas e estimulantes? Brincar ajuda as crianças a desenvolverem competências sociais.', category: 'Autismo | PEA', date: '5 Jan 2025', readTime: '5 min', image: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=600&q=80', featured: true },
  { id: 3, title: 'O que é a hiperlexia?', excerpt: 'Hiperlexia é um síndrome que se identifica pela capacidade de leitura precoce — quando uma criança começa a ler surpreendentemente cedo.', category: 'Autismo | Dúvidas', date: '28 Dez 2024', readTime: '3 min', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80', featured: false },
  { id: 4, title: 'Motricidade Fina: o que é e como se desenvolve?', excerpt: 'O desenvolvimento motor fino durante a primeira infância é crucial para o desenvolvimento global da criança. A coordenação óculo-manual é imprescindível.', category: 'Blog', date: '20 Dez 2024', readTime: '6 min', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80', featured: false },
  { id: 5, title: 'O meu filho anda em bicos dos pés. Porquê?', excerpt: 'Andar em bicos de pés é comum quando as crianças começam a andar. Mas quando deve ser motivo de preocupação?', category: 'Blog', date: '15 Dez 2024', readTime: '4 min', image: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&q=80', featured: false },
  { id: 6, title: 'Como identificar os principais sinais de Autismo', excerpt: 'Os primeiros traços e sinais característicos da Perturbação do Espectro do Autismo (PEA) podem ser detetados muito cedo.', category: 'Autismo | PEA', date: '8 Dez 2024', readTime: '7 min', image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80', featured: false },
  { id: 7, title: 'Birra ou crise de desregulação: Qual a diferença?', excerpt: 'Como distinguir uma crise de desregulação autista de uma birra? Perceber esta diferença é fundamental para apoiar a criança.', category: 'Autismo | PEA', date: '1 Dez 2024', readTime: '5 min', image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&q=80', featured: false },
  { id: 8, title: 'Atividades da rotina diária para estimular o desenvolvimento', excerpt: 'A implementação das rotinas diárias no apoio à aprendizagem ativa das crianças é extremamente importante para o desenvolvimento da sua autonomia.', category: 'Blog', date: '22 Nov 2024', readTime: '5 min', image: 'https://images.unsplash.com/photo-1484820540004-14229fe36ca4?w=600&q=80', featured: false },
  { id: 9, title: 'Intervenção da TO na Perturbação de Hiperatividade', excerpt: 'É uma das perturbações do neurodesenvolvimento que surge antes dos 12 anos. Caracterizada por um padrão persistente de desatenção e/ou hiperatividade.', category: 'Terapia Ocupacional', date: '14 Nov 2024', readTime: '8 min', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80', featured: false },
  { id: 10, title: 'Os adultos precisam de reaprender a brincar', excerpt: 'Como é que, enquanto adultos, nos podemos incentivar a brincar e a brincar com os nossos filhos? Frequentemente os adultos sentem-se cansados.', category: 'Blog', date: '5 Nov 2024', readTime: '4 min', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80', featured: false },
]

const CATEGORY_COLORS = {
  'Autismo | PEA':        'bg-purple-50 text-purple-600 border-purple-200',
  'Autismo | Dúvidas':    'bg-purple-50 text-purple-600 border-purple-200',
  'Blog':                 'bg-teal-50   text-teal-600   border-teal-200',
  'Terapia Ocupacional':  'bg-orange-50 text-orange-600 border-orange-200',
  'Notícias':             'bg-blue-50   text-blue-600   border-blue-200',
  'PHDA':                 'bg-pink-50   text-pink-600   border-pink-200',
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [search, setSearch] = useState('')

  const filtered = POSTS.filter(p => {
    const matchCat = activeCategory === 'Todos' || p.category.includes(activeCategory.replace('Todos',''))
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const featured = filtered.filter(p => p.featured).slice(0, 2)
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
            <p className="text-teal-300 text-sm font-semibold uppercase tracking-[0.2em]">✦ Conhecimento para as famílias</p>
            <h1 className="font-display text-6xl md:text-7xl text-white font-bold leading-tight">
              O nosso<br /><span className="text-teal-300 italic">Blog</span>
            </h1>
            <p className="text-teal-200 text-lg max-w-lg mx-auto">Artigos, dicas e recursos escritos pela nossa equipa de especialistas para apoiar o desenvolvimento do seu filho.</p>

            {/* Search */}
            <div className="max-w-md mx-auto mt-8">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" placeholder="Pesquisar artigos..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-700 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                />
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
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={"whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all " + (activeCategory === cat ? 'bg-teal-700 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:border-teal-300 hover:text-teal-700')}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6 space-y-16">

        {/* FEATURED — 2 grandes */}
        {featured.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Em Destaque</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map((post, i) => (
                <motion.article key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative overflow-hidden h-56">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className={"absolute top-4 left-4 text-xs px-3 py-1.5 rounded-full border font-semibold " + (CATEGORY_COLORS[post.category] || 'bg-gray-50 text-gray-600 border-gray-200')}>
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <Clock size={12} /> {post.readTime} de leitura
                      <span>·</span>
                      <span>{post.date}</span>
                    </div>
                    <h2 className="font-display text-xl text-teal-900 leading-snug group-hover:text-teal-600 transition-colors">{post.title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                    <Link to={"/blog/" + post.id} className="inline-flex items-center gap-1.5 text-teal-600 text-sm font-semibold hover:gap-3 transition-all">
                      Ler artigo <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}

        {/* TODOS OS POSTS — grelha 3 colunas */}
        {rest.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Todos os Artigos</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post, i) => (
                <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <div className="relative overflow-hidden h-44">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className={"absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full border font-semibold " + (CATEGORY_COLORS[post.category] || 'bg-gray-50 text-gray-600 border-gray-200')}>
                      {post.category}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock size={11} /> {post.readTime}
                      <span>·</span> {post.date}
                    </div>
                    <h3 className="font-display text-lg text-teal-900 leading-snug group-hover:text-teal-600 transition-colors flex-1">{post.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{post.excerpt}</p>
                    <Link to={"/blog/" + post.id} className="inline-flex items-center gap-1.5 text-teal-600 text-xs font-semibold hover:gap-3 transition-all mt-auto pt-2">
                      Ler artigo <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500">Nenhum artigo encontrado para "<strong>{search}</strong>"</p>
          </div>
        )}

      </section>

      {/* NEWSLETTER CTA */}
      <section className="py-20 bg-teal-800 mx-6 rounded-3xl mb-16 max-w-6xl lg:mx-auto">
        <div className="text-center px-6 max-w-2xl mx-auto space-y-6">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest">Fique a par</p>
          <h2 className="font-display text-3xl md:text-4xl text-white">Acompanhe-nos nas redes sociais</h2>
          <p className="text-teal-200">Siga-nos no Instagram e Facebook para receber os nossos artigos e dicas diretamente no seu feed.</p>
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

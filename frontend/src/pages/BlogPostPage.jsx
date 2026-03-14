import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, Tag, Share2, Facebook, Instagram } from 'lucide-react'

const POSTS = [
  {
    id: 1,
    title: 'Seletividade Alimentar',
    category: 'Autismo | Dúvidas',
    date: '12 Jan 2025',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1200&q=80',
    author: 'Equipa Alcançari',
    excerpt: 'A seletividade alimentar pode manifestar-se de diferentes formas e em várias idades.',
    content: `
A seletividade alimentar é uma das preocupações mais frequentes que os pais trazem às consultas. Mas o que é exatamente, e quando deve ser motivo de preocupação?

## O que é a seletividade alimentar?

A seletividade alimentar ocorre quando uma criança recusa consistentemente certos alimentos, texturas, cores ou cheiros. É um comportamento comum no desenvolvimento infantil, especialmente entre os 2 e os 6 anos, mas pode persistir e tornar-se problemático.

## Sinais de alerta

É importante distinguir entre uma preferência alimentar normal e uma seletividade que requer intervenção:

- Recusa de grupos inteiros de alimentos (ex: todos os vegetais, todas as proteínas)
- Reações de pânico ou vómito ao ver ou cheirar certos alimentos
- Restrição progressiva da variedade alimentar
- Impacto significativo na vida familiar (refeições separadas, conflitos constantes)
- Perda de peso ou crescimento inadequado

## Causas mais comuns

A seletividade alimentar pode ter várias origens. Em muitos casos está relacionada com hipersensibilidade sensorial — a criança tem uma resposta exagerada a texturas, sabores ou cheiros. Noutros casos pode estar associada a ansiedade, experiências negativas anteriores (como engasgamento), ou fazer parte do perfil de uma perturbação do neurodesenvolvimento como o autismo.

## Como pode a Terapia Ocupacional ajudar?

A Terapia Ocupacional aborda a seletividade alimentar de forma gradual e respeitosa. O terapeuta trabalha com a criança para:

- Dessensibilizar progressivamente o sistema sensorial
- Introduzir novos alimentos de forma lúdica e sem pressão
- Criar rotinas alimentares positivas
- Orientar os pais nas estratégias a usar em casa

## O que podem os pais fazer?

- Evitar forçar ou pressionar — cria associações negativas com a comida
- Expor a criança aos alimentos sem obrigação de os comer (ver, tocar, cheirar)
- Comer em família e modelar comportamentos positivos
- Celebrar pequenas vitórias

Se tem dúvidas sobre a alimentação do seu filho, não hesite em contactar-nos. A intervenção precoce faz toda a diferença.
    `
  },
  {
    id: 2,
    title: 'Como brincar com uma criança com autismo?',
    category: 'Autismo | PEA',
    date: '5 Jan 2025',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=1200&q=80',
    author: 'Equipa Alcançari',
    excerpt: 'Brincar ajuda as crianças a desenvolverem competências sociais, comunicativas e emocionais.',
    content: `
Brincar é a linguagem natural da criança. Para crianças com autismo, o brincar pode ter características próprias — e percebê-las é o primeiro passo para criar momentos de conexão genuína.

## Respeitar os interesses da criança

O ponto de partida é sempre o interesse da criança. Se ela adora carros, brinque com carros. Se prefere ordenar objetos por cor, sente-se ao lado dela e faça o mesmo. Entrar no mundo dela cria confiança e abre portas para a comunicação.

## Seguir o ritmo dela

Crianças com PEA podem precisar de mais tempo para processar e responder. Evite apressar, faça pausas e aguarde a resposta. O silêncio nem sempre é ausência — pode ser processamento.

## Brincadeiras estruturadas vs livres

Algumas crianças preferem brincadeiras com regras claras e previsíveis. Outras beneficiam de brincadeiras livres com menos estrutura. Observe o que traz mais conforto e prazer ao seu filho.

## O papel do Floortime

A abordagem Floortime, praticada na Alcançari, parte exatamente deste princípio: descer ao nível da criança, literalmente, e seguir a sua liderança. O objetivo não é ensinar comportamentos, mas criar círculos de comunicação genuínos.

## Dicas práticas

- Use brinquedos com causa-efeito claro (ex: carros que fazem sons)
- Reduza o ruído e as distrações do ambiente
- Não force o contacto visual — ele virá naturalmente
- Comemore cada momento de partilha, por pequeno que seja
    `
  },
  {
    id: 3,
    title: 'O que é a hiperlexia?',
    category: 'Autismo | Dúvidas',
    date: '28 Dez 2024',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=80',
    author: 'Equipa Alcançari',
    excerpt: 'Hiperlexia é um síndrome que se identifica pela capacidade de leitura precoce.',
    content: `
Hiperlexia é a capacidade de ler palavras muito acima do esperado para a idade, muitas vezes antes dos 5 anos, sem que a criança tenha sido ensinada formalmente. É frequentemente acompanhada de dificuldades na compreensão do que é lido e na comunicação verbal.

## Os três tipos de hiperlexia

Existem três tipos principais. O tipo 1 ocorre em crianças com desenvolvimento típico que aprendem a ler muito cedo — geralmente sem impacto significativo. O tipo 2 está associado ao autismo e é o mais comum. O tipo 3 aparece em crianças que não têm autismo mas apresentam comportamentos semelhantes, que tendem a desaparecer com o tempo.

## Sinais comuns

- Leitura fluente muito precoce (2-4 anos)
- Fascínio por letras, números e padrões
- Dificuldade em compreender o que lê
- Linguagem ecolálica (repetição de frases)
- Dificuldades nas interações sociais

## Como intervir?

A intervenção deve focar-se na compreensão — transformar a capacidade de descodificar palavras numa ferramenta real de comunicação e aprendizagem. A Terapia da Fala e a Terapia Ocupacional trabalham em conjunto para desenvolver estas competências.
    `
  },
  {
    id: 4, title: 'Motricidade Fina: o que é e como se desenvolve?', category: 'Blog', date: '20 Dez 2024', readTime: '6 min', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&q=80', author: 'Equipa Alcançari', excerpt: 'O desenvolvimento motor fino durante a primeira infância é crucial.', content: 'A motricidade fina refere-se ao uso coordenado dos músculos pequenos das mãos e dedos. É essencial para tarefas do dia-a-dia como escrever, abotoar roupa, usar talheres e manusear objetos pequenos.\n\n## Como se desenvolve?\n\nO desenvolvimento da motricidade fina segue uma sequência previsível. Aos 12 meses, a criança já consegue fazer a pinça com polegar e indicador. Aos 2 anos, rabisca e vira páginas. Aos 3-4 anos, começa a recortar e desenhar formas simples. Aos 5-6 anos, escreve letras e usa tesoura com precisão.\n\n## Quando preocupar?\n\nSe o seu filho tem dificuldade persistente em tarefas como abotoar, usar talheres ou segurar num lápis adequadamente para a sua idade, uma avaliação de Terapia Ocupacional pode ser útil.' },
  {
    id: 5, title: 'O meu filho anda em bicos dos pés. Porquê?', category: 'Blog', date: '15 Dez 2024', readTime: '4 min', image: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1200&q=80', author: 'Equipa Alcançari', excerpt: 'Andar em bicos de pés é comum quando as crianças começam a andar.', content: 'Andar em bicos de pés é muito comum nas crianças que estão a aprender a caminhar. A maioria abandona este padrão espontaneamente antes dos 2 anos. Quando persiste após esta idade, pode ser necessário investigar.\n\n## Causas possíveis\n\nAs causas podem ser de origem sensorial (a criança evita o contacto do calcanhar com o chão), neurológica, ortopédica, ou simplesmente um hábito. Em muitos casos está associado a hipersensibilidade tátil plantar.\n\n## Quando consultar?\n\nSe o seu filho tem mais de 2 anos e continua a andar em bicos dos pés consistentemente, especialmente se associado a outras dificuldades de desenvolvimento, consulte um profissional. A Fisioterapia e a Terapia Ocupacional têm excelentes resultados nestes casos.' }
]

const CATEGORY_COLORS = {
  'Autismo | PEA': 'bg-purple-50 text-purple-600 border-purple-200',
  'Autismo | Dúvidas': 'bg-purple-50 text-purple-600 border-purple-200',
  'Blog': 'bg-teal-50 text-teal-600 border-teal-200',
  'Terapia Ocupacional': 'bg-orange-50 text-orange-600 border-orange-200',
}

function renderContent(content) {
  return content.trim().split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return <h2 key={i} className="font-display text-2xl text-teal-800 mt-10 mb-4">{line.replace('## ', '')}</h2>
    }
    if (line.startsWith('- ')) {
      return <li key={i} className="text-gray-600 leading-relaxed ml-4">{line.replace('- ', '')}</li>
    }
    if (line.trim() === '') return <br key={i} />
    return <p key={i} className="text-gray-600 leading-relaxed">{line}</p>
  })
}

export default function BlogPostPage() {
  const { id } = useParams()
  const post = POSTS.find(p => p.id === parseInt(id))

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf9f3]">
      <div className="text-center space-y-4">
        <p className="text-6xl">📄</p>
        <h1 className="font-display text-2xl text-teal-800">Artigo não encontrado</h1>
        <Link to="/blog" className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:gap-3 transition-all">
          <ArrowLeft size={16} /> Voltar ao blog
        </Link>
      </div>
    </div>
  )

  const related = POSTS.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2)

  return (
    <div className="bg-[#fdf9f3] min-h-screen">

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[380px] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 max-w-4xl mx-auto w-full left-0 right-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <span className={`inline-block text-xs px-3 py-1.5 rounded-full border font-semibold ${CATEGORY_COLORS[post.category] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
              {post.category}
            </span>
            <h1 className="font-display text-3xl md:text-5xl text-white font-bold leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 text-white/70 text-sm">
              <span className="flex items-center gap-1.5"><Calendar size={13} /> {post.date}</span>
              <span className="flex items-center gap-1.5"><Clock size={13} /> {post.readTime} de leitura</span>
              <span className="flex items-center gap-1.5"><Tag size={13} /> {post.author}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-10">

          {/* Artigo */}
          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-3">
            <Link to="/blog" className="inline-flex items-center gap-2 text-teal-600 text-sm font-semibold hover:gap-3 transition-all mb-8">
              <ArrowLeft size={15} /> Voltar ao blog
            </Link>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-2">
              {renderContent(post.content)}
            </div>

            {/* Partilhar */}
            <div className="mt-8 flex items-center gap-4">
              <p className="text-gray-400 text-sm font-medium">Partilhar:</p>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                <Facebook size={15} /> Facebook
              </a>
              <a href="https://www.instagram.com/alcancari.terapias" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-600 text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                <Instagram size={15} /> Instagram
              </a>
            </div>
          </motion.article>

          {/* Sidebar */}
          <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6">

            {/* CTA consulta */}
            <div className="bg-teal-700 rounded-3xl p-6 text-center space-y-4">
              <p className="text-3xl">👋</p>
              <h3 className="font-display text-white text-lg">Tem dúvidas?</h3>
              <p className="text-teal-200 text-xs leading-relaxed">Fale connosco. A nossa equipa está disponível para ajudar.</p>
              <Link to="/contacto"
                className="block bg-white text-teal-700 font-semibold text-sm py-3 rounded-xl hover:bg-teal-50 transition-colors">
                Falar connosco
              </Link>
              <Link to="/marcacao"
                className="block border border-white/30 text-white text-sm py-3 rounded-xl hover:bg-white/10 transition-colors">
                Marcar consulta
              </Link>
            </div>

            {/* Artigos relacionados */}
            {related.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Artigos relacionados</p>
                {related.map(r => (
                  <Link key={r.id} to={`/blog/${r.id}`}
                    className="block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all group">
                    <img src={r.image} alt={r.title} className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-3">
                      <p className="font-semibold text-gray-700 text-sm leading-snug group-hover:text-teal-600 transition-colors">{r.title}</p>
                      <p className="text-gray-400 text-xs mt-1">{r.readTime} de leitura</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.aside>
        </div>
      </div>

    </div>
  )
}
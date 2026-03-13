const express = require('express')
const router = express.Router()

const SERVICES = [
  { slug: 'fisioterapia', name: 'Fisioterapia', emoji: '🏃', description: 'Avaliação e intervenção nas alterações do movimento e função motora.', age_range: '0-18 anos', duration: '45-50 min' },
  { slug: 'psicologia', name: 'Psicologia', emoji: '🧠', description: 'Avaliação e acompanhamento psicológico para crianças e adolescentes.', age_range: '3-18 anos', duration: '50 min' },
  { slug: 'terapia-fala', name: 'Terapia da Fala', emoji: '🗣️', description: 'Intervenção nas perturbações da comunicação, linguagem e fala.', age_range: '0-18 anos', duration: '45 min' },
  { slug: 'terapia-ocupacional', name: 'Terapia Ocupacional', emoji: '🤲', description: 'Promoção da independência nas atividades do dia a dia.', age_range: '0-18 anos', duration: '50 min' },
  { slug: 'floortime', name: 'Floortime', emoji: '🎮', description: 'Abordagem de desenvolvimento relacional baseada no jogo.', age_range: '1-12 anos', duration: '50 min' },
  { slug: 'integracao-sensorial', name: 'Integração Sensorial', emoji: '🌀', description: 'Intervenção nas dificuldades de processamento sensorial.', age_range: '2-12 anos', duration: '50 min' },
  { slug: 'acupuntura', name: 'Acupuntura', emoji: '🌿', description: 'Técnica terapêutica complementar para diversas condições.', age_range: '6-18 anos', duration: '45 min' },
  { slug: 'intervencao-grupo', name: 'Intervenção em Grupo', emoji: '👥', description: 'Sessões terapêuticas em pequenos grupos para desenvolvimento de competências sociais.', age_range: '4-12 anos', duration: '60 min' },
  { slug: 'formacao', name: 'Formação', emoji: '📚', description: 'Formações para pais, educadores e profissionais de saúde.', age_range: 'Adultos', duration: 'Variável' },
]

router.get('/', (req, res) => res.json(SERVICES))
router.get('/:slug', (req, res) => {
  const s = SERVICES.find(s => s.slug === req.params.slug)
  if (!s) return res.status(404).json({ error: 'Serviço não encontrado' })
  res.json(s)
})

module.exports = router

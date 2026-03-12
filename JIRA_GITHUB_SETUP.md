# 📋 Alcançari – Estrutura Jira + GitHub

---

## 🗂️ JIRA — Board de Projeto

**Nome do Projeto:** ALCANCARI  
**Tipo:** Scrum  
**Sprints:** 2 semanas  
**Membros:** MM (mais tarefas) | BF

---

## 👥 Divisão de Trabalho

### MM — Backend, Database & Dashboard
> Responsável pela maior parte do trabalho técnico

| Epic | Tarefas MM |
|------|-----------|
| 🔧 Backend & API | ALCA-1 a ALCA-15 |
| 🗃️ Base de Dados | ALCA-16 a ALCA-20 |
| 📊 Dashboard Clínico | ALCA-30 a ALCA-45 |
| 🔐 Auth & Segurança | ALCA-21 a ALCA-25 |
| 🚀 Deploy & DevOps | ALCA-80 a ALCA-90 |

### BF — Frontend Público & Blog
> Responsável pelo site público e gestão de conteúdo

| Epic | Tarefas BF |
|------|-----------|
| 🎨 Frontend Público | ALCA-46 a ALCA-60 |
| ✍️ Blog & Conteúdos | ALCA-61 a ALCA-70 |
| 📱 Responsivo & UX | ALCA-71 a ALCA-79 |

---

## 📌 EPICS

### Epic 1 – Autenticação & Utilizadores
- ALCA-1 `[MM]` Setup projeto Node.js + Express
- ALCA-2 `[MM]` Criar schema PostgreSQL completo
- ALCA-3 `[MM]` Endpoint POST /auth/login com JWT
- ALCA-4 `[MM]` Endpoint POST /auth/register
- ALCA-5 `[MM]` Middleware de autenticação e roles
- ALCA-6 `[BF]` Página de Login (UI)
- ALCA-7 `[BF]` Zustand auth store no frontend

### Epic 2 – Backend API
- ALCA-8  `[MM]` CRUD Pacientes (/api/patients)
- ALCA-9  `[MM]` CRUD Terapeutas (/api/therapists)
- ALCA-10 `[MM]` CRUD Serviços (/api/services)
- ALCA-11 `[MM]` CRUD Marcações (/api/appointments)
- ALCA-12 `[MM]` API Calendário (/api/calendar)
- ALCA-13 `[MM]` API Sumários (/api/session-notes)
- ALCA-14 `[MM]` Upload de ficheiros (/api/media)
- ALCA-15 `[MM]` API Blog (/api/blog)
- ALCA-16 `[MM]` API Contacto (/api/contact)

### Epic 3 – Base de Dados
- ALCA-17 `[MM]` Configurar PostgreSQL local + produção
- ALCA-18 `[MM]` Migrations e schema.sql
- ALCA-19 `[MM]` Seeds de dados de teste
- ALCA-20 `[MM]` Backups automáticos (cron)

### Epic 4 – Dashboard Clínico (Area Privada)
- ALCA-30 `[MM]` Layout Dashboard com sidebar
- ALCA-31 `[MM]` Calendário interativo (react-big-calendar)
- ALCA-32 `[MM]` CRUD de Marcações no dashboard
- ALCA-33 `[MM]` Lista e detalhe de Pacientes
- ALCA-34 `[MM]` Formulário de Sumários de Sessão
- ALCA-35 `[MM]` Visualização de sumários por paciente
- ALCA-36 `[MM]` Dashboard home com estatísticas
- ALCA-37 `[BF]` Gestão de Media (upload de imagens)
- ALCA-38 `[MM]` Sistema de notificações

### Epic 5 – Site Público (Frontend)
- ALCA-46 `[BF]` Setup Vite + React + Tailwind
- ALCA-47 `[BF]` Navbar responsiva com dropdowns
- ALCA-48 `[BF]` Página Home — Hero, Serviços, Stats
- ALCA-49 `[BF]` Página Sobre / Corpo Clínico
- ALCA-50 `[BF]` Página Serviços (listagem)
- ALCA-51 `[BF]` Página Serviço Individual
- ALCA-52 `[BF]` Formulário de Marcação (multi-step)
- ALCA-53 `[BF]` Página Contacto com mapa
- ALCA-54 `[BF]` Footer completo
- ALCA-55 `[BF]` Animações com Framer Motion
- ALCA-56 `[BF]` SEO e meta tags

### Epic 6 – Blog
- ALCA-61 `[BF]` Página Blog (listagem de posts)
- ALCA-62 `[BF]` Página de Post Individual
- ALCA-63 `[BF]` Editor de Post no dashboard (admin)
- ALCA-64 `[BF]` Upload de imagem de capa
- ALCA-65 `[BF]` Tags e categorias
- ALCA-66 `[BF]` SEO por post

### Epic 7 – Responsivo & Qualidade
- ALCA-71 `[BF]` Testes responsivos mobile
- ALCA-72 `[BF]` Acessibilidade (ARIA, contraste)
- ALCA-73 `[MM]` Testes de API (Jest/Supertest)
- ALCA-74 `[MM]` Validação de inputs (express-validator)
- ALCA-75 `[BF]` Loading states e error handling

### Epic 8 – Deploy & DevOps
- ALCA-80 `[MM]` Configurar GitHub repo + branch protection
- ALCA-81 `[MM]` Docker Compose (backend + db)
- ALCA-82 `[MM]` CI/CD com GitHub Actions
- ALCA-83 `[MM]` Deploy backend (Railway/Render)
- ALCA-84 `[BF]` Deploy frontend (Vercel/Netlify)
- ALCA-85 `[MM]` Variáveis de ambiente em produção

---

## 🚀 SPRINTS SUGERIDAS

### Sprint 1 (Semanas 1-2) — Fundações
**MM:** ALCA-1, 2, 3, 4, 5, 8, 9, 10, 17, 18  
**BF:** ALCA-46, 47, 6, 7, 48

### Sprint 2 (Semanas 3-4) — Core Features
**MM:** ALCA-11, 12, 13, 14, 30, 31, 32  
**BF:** ALCA-49, 50, 51, 52, 53, 54

### Sprint 3 (Semanas 5-6) — Dashboard & Blog  
**MM:** ALCA-33, 34, 35, 36, 15, 16  
**BF:** ALCA-61, 62, 63, 64, 37

### Sprint 4 (Semanas 7-8) — Polish & Deploy
**MM:** ALCA-19, 73, 74, 80, 81, 82, 83, 85  
**BF:** ALCA-55, 56, 71, 72, 75, 84

---

## 🐙 GITHUB — Estrutura

### Repositório
```
Nome: alcancari-clinic
Visibilidade: Private
Owner: organização ou utilizador pessoal
```

### Branch Strategy
```
main          ← produção (protegida, só via PR)
develop       ← integração
feature/MM-*  ← features do MM
feature/BF-*  ← features do BF
hotfix/*      ← correções urgentes
```

### Regras de Branch Protection (main)
- ✅ Require pull request reviews (1 reviewer)
- ✅ Require status checks to pass
- ✅ Restrict pushes (apenas via PR)

### Estrutura do Repositório
```
alcancari-clinic/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml        (lint + test em PRs)
│   │   └── deploy.yml    (deploy automático em main)
│   └── PULL_REQUEST_TEMPLATE.md
├── backend/              ← Node.js API
├── frontend/             ← React app
├── database/             ← Schemas e migrations
├── docker-compose.yml
├── .gitignore
└── README.md
```

### Comandos Git para começar
```bash
# Clonar após criar no GitHub
git clone git@github.com:SEU_USER/alcancari-clinic.git
cd alcancari-clinic

# Configurar branches
git checkout -b develop
git push -u origin develop

# MM começa uma feature
git checkout develop
git pull origin develop
git checkout -b feature/MM-backend-auth
# ... trabalha ...
git add .
git commit -m "feat(auth): add JWT login endpoint"
git push -u origin feature/MM-backend-auth
# Abre Pull Request para develop

# BF começa uma feature
git checkout develop
git checkout -b feature/BF-homepage-redesign
```

### Commit Convention
```
feat(scope): descrição curta
fix(scope): descrição
docs: atualização de documentação
style: formatação sem mudança de lógica
refactor: reestruturação de código
test: adicionar/corrigir testes

Exemplos:
feat(auth): add JWT authentication
feat(calendar): add event creation modal
fix(api): handle duplicate email on register
```

### GitHub Actions CI (exemplo)
```yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request]
jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: '20' }
      - run: cd backend && npm ci
      - run: cd backend && npm test
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: '20' }
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build
```

---

## 🔧 SETUP LOCAL (README resumo)

```bash
# 1. Clonar repositório
git clone git@github.com:SEU_USER/alcancari-clinic.git

# 2. Base de dados
psql -U postgres -c "CREATE DATABASE alcancari;"
psql -U postgres -d alcancari -f database/schema.sql

# 3. Backend
cd backend
cp .env.example .env  # editar com as suas credenciais
npm install
npm run dev           # http://localhost:4000

# 4. Frontend
cd ../frontend
cp .env.example .env
npm install
npm run dev           # http://localhost:5173
```

---

## 📊 Divisão Resumida de Horas Estimadas

| Área | MM | BF |
|------|----|----|
| Backend API | 40h | 0h |
| Base de Dados | 8h | 0h |
| Auth & Segurança | 6h | 2h |
| Dashboard | 20h | 5h |
| Site Público | 4h | 20h |
| Blog | 4h | 12h |
| DevOps & Deploy | 10h | 4h |
| **TOTAL** | **~92h** | **~43h** |

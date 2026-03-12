# 🏥 Alcançari Clinic — Plataforma Web

Plataforma web completa para a clínica terapêutica pediátrica Alcançari, com site público, área clínica privada, calendário e gestão de sumários.

## 📦 Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 18 + Vite + Tailwind CSS + Framer Motion |
| **Backend** | Node.js + Express.js |
| **Base de Dados** | PostgreSQL 16 |
| **Auth** | JWT (JSON Web Tokens) |
| **Calendário** | React Big Calendar + date-fns |
| **State** | Zustand + TanStack Query |
| **Deploy** | Docker Compose / Railway + Vercel |

## 🗂️ Estrutura do Projeto

```
alcancari-clinic/
├── frontend/          # React App (Vite)
├── backend/           # Node.js API
├── database/          # Schema SQL e migrations
├── docker-compose.yml
└── README.md
```

## 🚀 Setup Rápido

### Pré-requisitos
- Node.js 20+
- PostgreSQL 16+ (ou Docker)
- npm ou pnpm

### Com Docker (recomendado)
```bash
git clone git@github.com:SEU_USER/alcancari-clinic.git
cd alcancari-clinic
docker-compose up -d
# Frontend: http://localhost:5173
# Backend:  http://localhost:4000
```

### Manual
```bash
# Base de dados
psql -U postgres -c "CREATE DATABASE alcancari;"
psql -U postgres -d alcancari -f database/schema.sql

# Backend
cd backend && cp .env.example .env
npm install && npm run dev

# Frontend (novo terminal)
cd frontend && cp .env.example .env
npm install && npm run dev
```

## 🔑 Funcionalidades

### Site Público
- ✅ Homepage com hero, serviços e blog
- ✅ Páginas de serviços individuais
- ✅ Formulário de marcação multi-step
- ✅ Blog com posts e imagens
- ✅ Página de contacto
- ✅ Totalmente responsivo

### Área Clínica (Login)
- ✅ Calendário interativo por terapeuta
- ✅ Gestão de marcações
- ✅ Ficha de pacientes
- ✅ Sumários de sessão
- ✅ Upload de media/imagens
- ✅ Gestão do blog (admin)

## 👥 Equipa
- **MM** — Backend, Base de Dados, Dashboard
- **BF** — Frontend Público, Blog, UX

## 📋 Jira
Ver `JIRA_GITHUB_SETUP.md` para estrutura completa de tickets e sprints.

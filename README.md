
<div align="center">

# Clínica Alcançari

### Website Institucional

**Um espaço digital pensado para acolher, informar e aproximar.**

Website desenvolvido com React, Vite e JavaScript, com foco na experiência de utilização, acessibilidade, desempenho e apresentação dos serviços da Clínica Alcançari.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css&logoColor=white)

**Estado:** Em desenvolvimento · Ainda não publicado

</div>

---

## Sobre o projeto

O projeto consiste na modernização do website institucional da Clínica Alcançari, com uma experiência responsiva e uma arquitetura frontend de manutenção simples.

O objetivo é facilitar o acesso à informação sobre os serviços, os profissionais, as unidades e os contactos da clínica.

## Funcionalidades

| Área | Funcionalidades |
|---|---|
| Página inicial | Apresentação da clínica e navegação interativa |
| Serviços | Nove áreas de intervenção, categorias e páginas de detalhe |
| Equipa | Perfis profissionais, pesquisa e filtros |
| Unidades | Fotografias, informações e localização |
| Novidades | Publicações, pesquisa e categorias |
| Contactos | Formulário de contacto e pedido de marcação |
| WhatsApp | Contacto rápido e mensagens personalizadas |
| Pesquisa global | Pesquisa de conteúdos do website |
| Atlas | Exploração visual interativa de serviços, equipa, unidades e artigos |
| Acessibilidade | Modo conforto, tamanho de texto, contraste, teclado e redução de movimento |

As informações apresentadas são institucionais. O formulário não confirma automaticamente marcações nem deve ser utilizado para transmitir dados clínicos sensíveis.

## Tecnologias

- React — interface e componentes reutilizáveis
- Vite — desenvolvimento e compilação
- React Router — navegação e rotas
- JavaScript — funcionalidades interativas
- CSS — design responsivo e animações
- Formspree — receção de pedidos de contacto, quando configurado
- WebP — otimização das fotografias

## Estrutura do projeto

```text
alcancari-clinic/
├── public/
│   └── images/
│       ├── branding/
│       ├── clinica/
│       ├── equipa/
│       ├── servicos/
│       ├── unidades/
│       └── blog/
├── src/
│   ├── components/
│   ├── content/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   └── styles/
├── scripts/
├── tests/
├── index.html
├── package.json
└── vite.config.js
```

## Executar localmente

### Requisitos

- Node.js compatível com a versão indicada no projeto
- npm

### Instalação

```bash
git clone https://github.com/MartimMatos17/alcancari-clinic.git
cd alcancari-clinic
npm ci
npm run dev
```

O Vite apresenta o endereço local da aplicação no terminal.

### Testes e compilação

```bash
npm run check
npm run build
npm run preview
```

O build de produção é gerado na pasta `dist/`.

## Configuração

O website pode ser executado localmente sem credenciais para explorar as páginas institucionais.

O envio de pedidos depende de `PUBLIC_CONTACT_FORM_ENDPOINT=https://formspree.io/f/SEU_ID`, configurado no ambiente do build ou num `.env.local` ignorado pelo Git. É um endereço público, validado pelo Vite; nenhuma outra variável privada é exposta ao cliente. Sem este endereço, o site mantém os contactos alternativos. Configure a proteção contra spam e os destinatários no Formspree, e valide consentimento, privacidade e envio antes de publicar.

As credenciais privadas e os ficheiros `.env` não devem ser adicionados ao repositório. Variáveis incluídas no código cliente não devem conter segredos.

## Desempenho

As imagens públicas foram convertidas e otimizadas para WebP.

| Indicador | Resultado da otimização |
|---|---|
| Imagens convertidas | 88 |
| Build anterior | Aproximadamente 34 MB |
| Build otimizado | Aproximadamente 12 MB |
| Redução | Aproximadamente 65% |

Estes valores representam o tamanho dos ficheiros gerados, não o tráfego descarregado por cada visitante.

## Segurança e privacidade

- Website institucional sem base de dados de pacientes
- Sem autenticação de utilizadores finais
- Ficheiros privados excluídos do build público
- Formulários sujeitos a validação
- Informação de privacidade disponível no website
- Dependências verificadas durante o desenvolvimento

A revisão de segurança e privacidade para produção ainda está em curso. Um build aprovado não equivale a uma auditoria completa.

## Administração local e preparação do lançamento

```bash
node scripts/admin-local.mjs
# Dashboard: http://127.0.0.1:4174/
node scripts/admin-editor.mjs
# Editor: http://127.0.0.1:4175/
```

Execute os painéis em terminais separados. Cada processo apresenta o seu código temporário de acesso; reiniciar invalida sessões e códigos anteriores. Opcionalmente, configure `ALCANCARI_ADMIN_PASSWORD` no ambiente privado com pelo menos 20 caracteres. Nunca a inclua no Git, em URLs ou em variáveis do frontend.

O estúdio guarda apenas rascunhos em `backups/admin-drafts/`, com revisão, histórico e deteção de conflitos. Não publique estes servidores, nem os exponha por túneis ou proxies. Não gerem pacientes nem substituem uma administração online com autenticação multifator.

O CI verifica testes, build, sintaxe administrativa e vulnerabilidades conhecidas. Dependabot propõe atualizações semanais, sem aprovação ou merge automático. As configurações passam a vigorar no GitHub depois de integradas na branch predefinida. Proteção de branches, revisão obrigatória, MFA e alertas de segredos precisam de configuração na conta/repositório.

O build estático é gerado em `dist/` e pode ser alojado em Cloudflare Pages, Netlify ou equivalente. Não existe configuração de deploy, domínio, HSTS ou cabeçalhos de produção ativa neste projeto. Depois de escolhido o alojamento, configure o fallback das rotas React para `index.html` e os cabeçalhos CSP, anti-incorporação e HTTPS no fornecedor. A CSP deverá considerar os recursos locais, o envio Formspree e o iframe oficial do Facebook. Verifique as respostas reais antes do lançamento. Publique exclusivamente `dist/`, nunca o projeto inteiro nem os painéis administrativos.

Antes do lançamento, configure o domínio e HTTPS, reveja a política de privacidade e teste o envio do formulário e as integrações. A indexação continua desativada até aprovação. Auditorias automáticas não garantem ausência de vulnerabilidades.

## Estado do projeto

O website encontra-se em desenvolvimento.

Antes da publicação serão realizadas verificações finais de conteúdos, contactos, privacidade, formulários, acessibilidade, desempenho e configuração do alojamento.

---

<div align="center">

**Desenvolvido para a Clínica Alcançari**

*Tecnologia ao serviço de uma experiência mais simples e próxima.*

</div>

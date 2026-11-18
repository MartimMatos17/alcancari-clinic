# Clínica Alcançari

Website institucional em React/Vite, com administração editorial **exclusivamente local**. Em desenvolvimento: sem domínio associado, sem alojamento escolhido e sem publicação automática.

## Começar

Requisitos: Node.js 24 LTS (ver `.nvmrc`) e npm 10 ou superior.

```bash
npm ci
npm run dev
```

Abra o endereço local indicado pelo Vite. O servidor escuta apenas em `127.0.0.1`.

```bash
npm run check     # testes de conteúdos, segurança e funcionalidades
npm run build     # gera dist/ e verifica o que pode ser público
npm run preview   # demonstração local do build
```

O build é estático e pode ser preparado para Cloudflare Pages, Netlify ou equivalente. Não existe integração de deploy nem configuração ativa de domínio ou cabeçalhos de produção.

## O que existe

| Área | Funcionalidades |
| --- | --- |
| Clínica e serviços | Informação institucional e textos originais das áreas de intervenção |
| Equipa e unidades | Perfis, pesquisa, fotografias, visita virtual e informações práticas |
| Blog | Artigos existentes, filtros, pesquisa, favoritos e ajustes de leitura |
| Atlas | Exploração visual dos conteúdos publicados |
| Connect | Percursos de descoberta e favoritos no navegador |
| Conforto | Texto ajustável, contraste, menos movimento e navegação por teclado |
| Contactos | Telefone, email, WhatsApp e formulário opcional |
| Administração local | Inventário, revisão editorial, rascunhos, histórico e recuperação |

Não são geridos pacientes, pagamentos, consultas ou processos clínicos. O formulário não confirma marcações. Os artigos que têm apenas excertos continuam identificados como tal.

## Administração local

Execute em **terminais separados**:

```bash
node scripts/admin-local.mjs
# http://127.0.0.1:4174/ — dashboard

node scripts/admin-editor.mjs
# http://127.0.0.1:4175/ — estúdio editorial
```

Cada processo apresenta o seu código temporário no terminal. Abra o endereço de raiz no Safari ou Chrome e utilize o código desse painel. Ao reiniciar, atualize a página e use o novo código. `Ctrl+C` encerra o processo e invalida as suas sessões.

Opcionalmente, defina `ALCANCARI_ADMIN_PASSWORD` no ambiente privado com pelo menos 20 caracteres; estes scripts não carregam automaticamente `.env`. Não coloque a palavra-passe em argumentos, URLs, código, capturas de ecrã ou Git.

Proteções implementadas: validação de Host e origem, autenticação no servidor, cookies HttpOnly/SameSite, tokens CSRF, limite de tentativas, CSP com nonce, expiração após 20 minutos de inatividade e limite absoluto de 2 horas. O HTTP sem cookie Secure é uma limitação deliberada deste acesso loopback; não constitui configuração para Internet.

**Nunca exponha estes painéis por túnel, proxy, rede local ou alojamento público.** Uma futura administração online exige arquitetura própria, HTTPS, MFA e revisão de permissões e auditoria.

### Rascunhos e recuperação

- `backups/admin-drafts/posts.json`: rascunhos atuais; nunca altera `src/content/posts.json`.
- Histórico por publicação: até 20 versões anteriores, com recuperação no editor.
- `backups/admin-drafts/copies/`: até 20 cópias independentes do ficheiro anterior, criadas antes da sua substituição.
- Gravação com ficheiro temporário exclusivo, sincronização em disco e substituição atómica; ficheiros privados com modo `0600` e diretórios administrativos com `0700`.
- O editor deteta conflitos entre janelas. Atualize antes de tentar guardar novamente e conserve o seu texto.

No estúdio, abra **Cópias de segurança** (`/copias`). A recuperação funciona mesmo com JSON principal danificado. Exige confirmação, substitui todos os rascunhos e conserva uma cópia do estado substituído. Nunca recupera automaticamente dados danificados.

Cópias no mesmo disco não protegem de perda do computador. Mantenha uma cópia externa cifrada e teste a recuperação. Os arquivos antigos em `backups/` são material de recuperação, não lixo, e não são removidos pela retenção do Admin.

## Configuração opcional

| Variável | Utilização | Local |
| --- | --- | --- |
| `PUBLIC_CONTACT_FORM_ENDPOINT` | URL pública `https://formspree.io/f/SEU_ID`, validada pelo Vite | ambiente de build ou `.env.local` |
| `ALCANCARI_ADMIN_PASSWORD` | Palavra-passe local opcional | ambiente do processo Admin |
| `INSTAGRAM_ACCESS_TOKEN` | Credencial privada Meta | ambiente privado do build |
| `INSTAGRAM_ACCOUNT_ID` | Identificador da conta profissional oficial | ambiente privado do build |
| `META_GRAPH_VERSION` | Versão suportada `vNN.N` | ambiente privado do build |

Sem endpoint, o formulário mantém os contactos alternativos. Configure os destinatários, proteção contra spam e privacidade no fornecedor e teste um envio autorizado antes do lançamento.

A integração Instagram usa a API oficial Meta apenas no build; não faz scraping nem contacta a API durante o desenvolvimento. Sem autorização/configuração válida, mantém os artigos existentes. Sincronização agendada e publicação continuam pendentes de configuração externa.

## Organização e limpeza

```text
src/            interface, estilos e conteúdos públicos
public/         recursos que podem ser publicados
scripts/        build, administração e ferramentas de manutenção
tests/         verificações automáticas
docs/sources/  fontes públicas utilizadas para verificar os textos
backups/        recuperação privada; ignorada pelo Git
dist/          build regenerável; ignorado pelo Git
```

`node_modules/`, `dist/`, caches e relatórios são regeneráveis. `.env*`, credenciais, backups e rascunhos nunca devem ser versionados nem copiados para `public/`. Preserve `docs/sources/`: os testes comparam os conteúdos com essas fontes. As restantes notas históricas locais não fazem parte do website.

Publique, futuramente, **apenas `dist/`**. O verificador do build recusa ficheiros não autorizados, mapas de código e padrões conhecidos de credenciais, e limita o JavaScript total a 500 KiB. Estas verificações são uma camada adicional, não uma garantia de deteção de todos os segredos.

## GitHub e segurança

O CI executa testes, sintaxe administrativa, auditoria npm e build. As ações estão fixadas por hash e usam permissões de leitura. Dependabot propõe atualizações semanais sem merge automático. Configurações novas só ficam plenamente integradas depois de aprovadas na branch predefinida.

Mantenha MFA na conta, proteção da `main`, revisões e verificações obrigatórias, alertas de dependências e deteção de segredos conforme disponibilidade. A política de comunicação de vulnerabilidades está em [.github/SECURITY.md](.github/SECURITY.md). Não inclua dados pessoais ou credenciais em issues.

## Antes da demonstração e lançamento

A demonstração pode continuar inteiramente local, com `npm run build` e `npm run preview`.

Antes de publicar: aprovar conteúdos e privacidade; testar teclado, telemóvel e navegadores; validar formulário; escolher alojamento e configurar HTTPS, cabeçalhos e fallback das rotas para `index.html`; testar as respostas reais; preparar recuperação externa. A indexação permanece desativada até aprovação.

Um build aprovado ou uma auditoria npm sem alertas não garantem segurança absoluta. Os controlos precisam de manutenção e de validação no ambiente final.

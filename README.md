# Clínica Alcançari — website público

Website institucional em React, Vite e Tailwind CSS, com JavaScript. Funciona
sem API, autenticação, Docker, Express ou PostgreSQL. Não foi publicado.

## Executar na raiz

Requisitos: Node.js 22.12 ou superior; recomenda-se Node.js 24 (`.nvmrc`), e npm 10
ou superior. Não é necessário criar `.env` nem configurar credenciais.

```bash
npm ci
npm run dev
```

O Vite apresenta o endereço local no terminal. O servidor fica limitado a
`127.0.0.1`. Para verificar e compilar:

```bash
npm run check
npm run build
npm run preview
```

`npm run check` executa os testes nativos de Node.js. O build gera apenas `dist/`
e verifica os ficheiros públicos, sinais de configuração privada e um orçamento
de 500 KiB para o JavaScript total. `npm run preview` permite testar esse build
localmente; não publica o website.

## Estrutura

```text
src/
  components/        # Navegação, estrutura, contactos e elementos reutilizáveis
  content/           # Configuração, textos importados, proveniência, rotas e imagens
  hooks/             # Metadados por página
  lib/               # Validação de contactos, imagens e publicação
  pages/             # Páginas institucionais
  App.jsx            # Rotas públicas e redirecionamentos de URLs antigas
  main.jsx           # Arranque e tratamento de erros
  styles.css         # Tailwind e apresentação responsiva
public/
  brand/             # Pasta anterior preservada
  images/            # branding/, equipa/, servicos/, unidades/, clinica/, blog/
  favicon.svg        # Monograma anterior preservado; HTML usa o favicon recuperado
  robots.txt         # Indexação bloqueada nesta fase
scripts/             # Verificação do build público
tests/               # Testes de validação e segurança do build
docs/                # Conteúdos, recuperação e segurança
```

## Páginas e conteúdo

Páginas: Início, Clínica, Serviços, Equipa, Unidades, Blog/Novidades, Contactos e
Privacidade. As antigas URLs `/sobre`, `/contacto`, `/marcacao`, `/blog` e `/faq`
continuam a encaminhar para páginas públicas adequadas. Endereços clínicos ou
inexistentes mostram a página 404, sem pedidos à API.

Em 12 de novembro de 2026 foram importados os conteúdos públicos de
[alcancari.com](https://alcancari.com/), a fonte indicada pelo responsável:

- Nove serviços: sete páginas integrais e duas apresentações sem página própria.
- Apresentação da clínica e 16 perfis completos do Corpo Clínico.
- Duas unidades, moradas, horários, mapas e contactos oficiais.
- Doze entradas do blog, com os excertos existentes na origem. Os artigos
  integrais não estavam disponíveis e não foram inventados.

São 47 páginas locais, incluindo detalhes de profissionais, unidades, serviços e
publicações. As URLs anteriores do WordPress têm redirecionamentos locais.
A equipa pode ser filtrada por especialidade; os textos longos usam um componente
de leitura reutilizável e os serviços extensos incluem índice de secções.

`src/content/site.js` reúne os dados; as coleções estão em JSON por domínio.
Os textos de origem, URLs, hashes e lacunas estão documentados em
[CONTENT.md](docs/CONTENT.md). Foram recuperadas 111 imagens distintas do site público, incluindo logótipos,
11 retratos e fotografias das unidades. [MEDIA.md](docs/MEDIA.md) contém o
inventário, resoluções e lacunas. Só os cinco perfis sem fotografia pública
continuam com espaços reservados. Não há imagens remotas em execução.

A aplicação é inteiramente estática. Telefone, WhatsApp, email, mapas e redes
sociais abrem pelos links oficiais; não há formulários de envio ou API.
Os dados do WordPress foram lidos apenas durante a importação e estão guardados
localmente. O frontend funciona sem o WordPress, backend ou base de dados.

## Validação

A reorganização passou 11 testes e o build **antes** da importação. A versão
com conteúdos e imagens passou 22 testes, o build com política de ficheiros públicos e
120 verificações de páginas/redirecionamentos no Chrome, com inspeção a 1440,
390 e 320 px. Os textos integrais foram comparados também com o DOM renderizado.
Sem erros de execução, recursos falhados ou pedidos externos. Ver
[VALIDATION.md](docs/VALIDATION.md) para cobertura e limites.

O teste de navegador é opcional e requer Chrome instalado, perfil temporário
isolado e depuração local na porta 9223, além de `npm run preview -- --port 5173`.
Depois, executar `node scripts/check-browser.mjs`. Não instala dependências.
Capturas e relatório ficam em `test-results/`, ignorado pelo Git.

## Dependências

Produção: React e React DOM para a interface; React Router para navegação entre
páginas, URLs diretas e redirecionamentos públicos. Desenvolvimento: Vite,
plugin React, Tailwind CSS e integração Tailwind/Vite. Não existe gestor de
estado, cliente HTTP, biblioteca de animações, calendário, editor ou gráficos.
As versões estão fixadas e o `package-lock.json` da raiz deve ser versionado.

## Segurança e arquivo

- A configuração Vite não expõe variáveis de ambiente ao cliente (`envPrefix: []`).
- Não existem cookies da aplicação, armazenamento local, analytics ou embeds externos.
- O código legado, ficheiros privados e dependências antigas foram preservados
  localmente em `backups/2026-11-09-public-refactor/local-worktree/`, fora do build
  e ignorados pelo Git. Este diretório local contém o `.env` antigo: não o partilhar.
- Existe uma cópia separada e sanitizada de recuperação com manifesto e hashes,
  sem segredos, dados de execução ou dependências.
- A referência Git local `archive/pre-public-website-2026-11-09` aponta para o
  commit original; as alterações não commitadas da Fase 0 estão na cópia sanitizada.
- O estado anterior a esta importação foi preservado e verificado em
  `backups/2026-11-12-content-import/`, incluindo o estado Git inicial.
- Nenhum commit, push, merge, force push, deploy ou alteração de domínio foi feito.

Detalhes e recuperação em [REFACTOR.md](docs/REFACTOR.md). A referência Git antiga
continua a ter o histórico previamente exposto; não é um arquivo sanitizado.
A rotação de credenciais e a limpeza do histórico da
[Fase 0](docs/SECURITY_PHASE_0.md) continuam pendentes. Essa documentação descreve
a estrutura anterior e foi preservada sem alterações.

## Antes de uma eventual publicação

Confirmar textos, contactos, serviços, equipa e unidades; integrar o logótipo e
as fotografias reais; validar os conteúdos clínicos antes de os disponibilizar.
Confirmar a política de privacidade e os requisitos do alojamento. Só depois de
uma autorização de publicação: configurar `site.url`, rever `indexingEnabled`,
`index.html` e `robots.txt`, gerar sitemap e configurar o fallback das rotas SPA.
Nunca carregar o repositório completo, `backups/` ou `node_modules/`: o único
artefacto público é `dist/`. Não foi configurado qualquer domínio ou alojamento.

Os metadados iniciais estão em `index.html` e os metadados de cada página são
atualizados no navegador. A pré-renderização/SSR, um sitemap com domínio real e
os testes no alojamento final ficam para a preparação da publicação.

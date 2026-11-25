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

### Pré-visualização no contexto do Blog

Execute `npm run build` antes de abrir **Ver artigo com o aspeto do site** no estúdio. A pré-visualização usa a versão guardada, os estilos compilados e o texto original integral disponível. O resumo editorial é apresentado separadamente, como na listagem do Blog. Não apresenta notas internas nem grava ficheiros em `dist/`. A página, os estilos e as fotografias continuam protegidos pela sessão local. Sem build disponível, apresenta instruções e não tenta publicar nada.

### Rascunhos e recuperação

- `backups/admin-drafts/posts.json`: rascunhos atuais; nunca altera `src/content/posts.json`.
- Histórico por publicação: até 20 versões anteriores, com recuperação no editor.
- `backups/admin-drafts/copies/`: até 20 cópias independentes do ficheiro anterior, criadas antes da sua substituição.
- Gravação com ficheiro temporário exclusivo, sincronização em disco e substituição atómica; ficheiros privados com modo `0600` e diretórios administrativos com `0700`.
- O editor deteta conflitos entre janelas. Atualize antes de tentar guardar novamente e conserve o seu texto.

No estúdio, abra **Cópias de segurança** (`/copias`). A recuperação funciona mesmo com JSON principal danificado. Exige confirmação, substitui todos os rascunhos e conserva uma cópia do estado substituído. Nunca recupera automaticamente dados danificados.

Cópias no mesmo disco não protegem de perda do computador. Mantenha uma cópia externa cifrada e teste a recuperação. Os arquivos antigos em `backups/` são material de recuperação, não lixo, e não são removidos pela retenção do Admin.

### Cópia externa cifrada do Admin

A ferramenta local `scripts/admin-backup.mjs` exporta **apenas** `backups/admin-drafts/posts.json` e as cópias editoriais reconhecidas em `backups/admin-drafts/copies/`, incluindo o histórico que esses ficheiros contêm. Não inclui fotografias, conteúdos originais do projeto, arquivos antigos de `backups/`, configurações, credenciais ou sessões. Conserve também uma cópia separada do projeto para recuperar num computador novo.

Usa **AES-256-GCM**, com autenticação integral do cabeçalho e conteúdo, e **scrypt** (`N=131072`, `r=8`, `p=1`, chave de 32 bytes), através de [`node:crypto`](https://nodejs.org/api/crypto.html). Cada exportação gera um novo sal de 16 bytes e nonce de 12 bytes; a tag tem 16 bytes. O formato `.acbk` versão 1 é um contentor específico desta ferramenta, não um formato de arquivo universal: mantenha este script e uma versão compatível do Node.js para a recuperação. Não há dependências adicionais nem envios pela ferramenta.

#### Criar e guardar

1. Guarde as alterações e encerre Dashboard e Editor com `Ctrl+C` para obter uma cópia consistente. Se ainda não existem rascunhos, não há nada para exportar. A ferramenta recusa fontes com permissões inseguras sem as corrigir ou alterar.
2. Ligue um disco externo e escolha uma pasta já existente **fora do projeto**. Substitua os caminhos de exemplo pelos seus; use sempre um nome novo.

```bash
node scripts/admin-backup.mjs exportar "/Volumes/DiscoPrivado/Alcancari/2026-11-25.acbk"
node scripts/admin-backup.mjs verificar "/Volumes/DiscoPrivado/Alcancari/2026-11-25.acbk"
```

3. A palavra-passe é pedida num terminal interativo, sem eco; na exportação é pedida duas vezes. Use uma palavra-passe exclusiva e longa (mínimo 20 caracteres, máximo 1024), idealmente gerada por um gestor de palavras-passe. **Não** a coloque no comando, em variáveis, ficheiros do projeto, capturas ou Git. Não é guardada pela ferramenta. Sem ela não existe recuperação.
4. Guarde a palavra-passe num gestor de palavras-passe ou noutro local seguro separado da cópia. Confirme o sucesso de `verificar` no arquivo efetivamente guardado e faça um ensaio de recuperação. Ejete o disco com segurança e conserve cópias de datas diferentes.

Os ficheiros novos têm modo `0600`. A exportação é publicada apenas depois de gravada e sincronizada, sem substituir destinos existentes. O disco deve suportar permissões POSIX, sincronização e hard links (por exemplo, APFS num Mac). Se não suportar, a operação falha; não há redução silenciosa das proteções. Em FAT/exFAT estas garantias não estão disponíveis. Um resíduo `.alcancari-*.tmp` após interrupção abrupta contém apenas dados cifrados e não deve ser considerado uma cópia concluída.

**A escolha do destino é sua:** a ferramenta não contacta serviços externos. Uma pasta previamente sincronizada pelo sistema ou por outra aplicação poderá enviar ficheiros por ação dessa aplicação; prefira um disco desligado após a cópia. O nome e tamanho do arquivo não são ocultados.

#### Recuperar sem substituir dados existentes

1. Num computador com o projeto e Node.js compatível, escolha uma pasta **nova**, fora do projeto, dentro de uma pasta existente. Não use `public/`, `dist/` nem uma pasta sincronizada.

```bash
node scripts/admin-backup.mjs verificar "/Volumes/DiscoPrivado/Alcancari/2026-11-25.acbk"
node scripts/admin-backup.mjs recuperar "/Volumes/DiscoPrivado/Alcancari/2026-11-25.acbk" "$HOME/Alcancari-recuperacao-2026-11-25"
```

2. Introduza a palavra-passe quando pedida. A ferramenta autentica o arquivo e valida caminhos e JSON **antes de escrever dados decifrados**. Palavra-passe incorreta, corrupção, versão desconhecida e destinos existentes são recusados. A pasta recuperada é privada (`0700`), com ficheiros `0600`; contém `posts.json` e, se disponíveis, `copies/`. Estes ficheiros são agora **dados em claro**: conserve-os apenas num disco privado e proteja a sua sessão do computador. Em caso de falha de disco durante a extração, pode restar uma pasta nova incompleta; preserve-a e repita com outro nome.
3. Reveja a recuperação. Para a disponibilizar ao Editor, encerre os painéis e execute:

```bash
node scripts/admin-backup.mjs preparar "$HOME/Alcancari-recuperacao-2026-11-25"
```

Este passo acrescenta uma **nova** cópia candidata em `copies/`, sem substituir rascunhos nem alterar cópias existentes. Publicações desconhecidas no projeto são recusadas. Aponta apenas para `posts.json` da pasta recuperada; as cópias históricas ficam nessa pasta para revisão. O projeto tem de ter os diretórios administrativos privados já existentes; num computador novo, abra primeiro o Editor e guarde um rascunho temporário para os inicializar.
4. Reinicie `node scripts/admin-editor.mjs`, autentique-se em `http://127.0.0.1:4175/`, abra **Cópias de segurança**, selecione o nome apresentado pelo comando e confirme a reposição. A recuperação do Editor substitui todos os rascunhos, conserva o estado anterior e aplica a retenção habitual de até 20 cópias. Não publica conteúdos. Atualize o Dashboard e confirme os rascunhos e o histórico recuperados.

Para recuperar uma das cópias históricas do arquivo, preserve a extração inicial e reveja a versão pretendida numa segunda pasta privada de trabalho como `posts.json`; só depois use `preparar`. A ferramenta nunca repõe automaticamente dados no Editor. Os ensaios automatizados usam apenas diretórios temporários isolados, sem consultar nem modificar backups reais.

**Ensaio de 25 de novembro de 2026.** A exportação e recuperação foram verificadas em pastas temporárias do mesmo computador. O arquivo autenticado continha apenas os rascunhos fictícios, a cópia editorial esperada e os metadados de formato e data. Foram confirmados os modos `0600` e `0700`, a rejeição de uma palavra-passe incorreta e a deteção de corrupção. Ficou por testar a recuperação a partir de um disco externo físico.

## Configuração opcional

| Variável | Utilização | Local |
| --- | --- | --- |
| `PUBLIC_CONTACT_FORM_ENDPOINT` | URL pública `https://formspree.io/f/SEU_ID`, validada pelo Vite | ambiente de build ou `.env.local` |
| `ALCANCARI_ADMIN_PASSWORD` | Palavra-passe local opcional | ambiente do processo Admin |
| `INSTAGRAM_ACCESS_TOKEN` | Credencial privada Meta | ambiente privado do build |
| `INSTAGRAM_ACCOUNT_ID` | Identificador da conta profissional oficial | ambiente privado do build |
| `META_GRAPH_VERSION` | Versão suportada `vNN.N` | ambiente privado do build |

Sem endpoint autorizado, o formulário de dados fica oculto e são apresentadas alternativas diretas de telefone, email e WhatsApp. Os testes de envio usam respostas simuladas, sem enviar mensagens reais. Configure os destinatários, proteção contra spam e privacidade no fornecedor e teste um envio autorizado antes do lançamento.

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

`node_modules/`, `dist/`, caches e relatórios são regeneráveis. `.env*`, credenciais, backups e rascunhos nunca devem ser versionados nem copiados para `public/`. Preserve `docs/sources/`: os testes comparam os conteúdos com essas fontes. As notas e relatórios históricos locais foram preservados em `backups/project-notes-2026-11-18-*/` e não fazem parte do website. Os manifestos públicos de imagens em `docs/` continuam disponíveis para manutenção.

Publique, futuramente, **apenas `dist/`**. O verificador do build recusa ficheiros não autorizados, mapas de código e padrões conhecidos de credenciais, e limita o JavaScript total a 500 KiB. Estas verificações são uma camada adicional, não uma garantia de deteção de todos os segredos.

## GitHub e segurança

O CI executa testes, sintaxe administrativa, auditoria npm e build. As ações estão fixadas por hash e usam permissões de leitura. Dependabot propõe atualizações semanais sem merge automático. Configurações novas só ficam plenamente integradas depois de aprovadas na branch predefinida.

Mantenha MFA na conta, proteção da `main`, revisões e verificações obrigatórias, alertas de dependências e deteção de segredos conforme disponibilidade. A política de comunicação de vulnerabilidades está em [.github/SECURITY.md](.github/SECURITY.md). Não inclua dados pessoais ou credenciais em issues.

## Antes da demonstração e lançamento

A demonstração pode continuar inteiramente local, com `npm run build` e `npm run preview`.

Antes de publicar: aprovar conteúdos e privacidade; testar teclado, telemóvel e navegadores; validar formulário; escolher alojamento e configurar HTTPS, cabeçalhos e fallback das rotas para `index.html`; testar as respostas reais; preparar recuperação externa. A indexação permanece desativada até aprovação.

Um build aprovado ou uma auditoria npm sem alertas não garantem segurança absoluta. Os controlos precisam de manutenção e de validação no ambiente final.

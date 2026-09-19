# Blog do Portfólio — Spec de Design

Data: 2026-09-19
Branch: `react-redesign`
Fase do roadmap: Fase 7 (última fase do roadmap de melhorias do portfólio,
ver contexto no histórico de brainstorming da mesma conversa que originou
esta spec)

## Contexto

O portfólio React (Vite + Tailwind + Framer Motion) já reconstruído nas
fases anteriores é uma SPA de página única com navegação por âncora
(`#home`, `#sobre-mim`, `#skills`, `#timeline`, `#projetos`, `#contato`).
Não existe roteador (`react-router` ou similar) no projeto hoje — todas as
"seções" são `<AnimatedSection>` dentro de uma única árvore renderizada por
`App.jsx`.

Objetivo desta fase: adicionar uma seção de Blog com posts técnicos,
atualizações de projetos e notas de estudo, cada um com URL própria
(compartilhável e indexável), sem depender de CMS externo.

## Objetivos

- Cada post do blog tem uma URL própria (`/blog/:slug`), permitindo
  compartilhar e (no futuro, após deploy) indexar individualmente no
  Google.
- Autoria de posts via arquivo Markdown no repositório — sem CMS, sem
  conta externa, sem backend. O usuário escreve um `.md`, commita, o post
  aparece no site.
- Lista de posts (`/blog`) no mesmo estilo visual dos cards já existentes
  (Projetos), ordenada do mais recente para o mais antigo.
- Manter a página única atual (`/`) com todo o conteúdo e comportamento
  existentes (âncoras, scroll-spy, animações) sem regressão.
- Lançar com a estrutura pronta e sem posts reais — estado vazio
  ("em breve") até o usuário escrever o primeiro post.

## Não-objetivos (fora de escopo nesta spec)

- CMS headless (Contentful, Sanity, etc.) — descartado em favor de
  Markdown em arquivo, ver decisão abaixo.
- MDX (Markdown com componentes React embutidos) — não há necessidade
  identificada de embutir componentes interativos dentro de posts; caso
  surja no futuro, é uma migração incremental a partir do Markdown puro.
- Configuração de deploy / regra de rewrite client-side no host de
  produção (Netlify _redirects, GitHub Pages 404.html trick, etc.) — só
  é necessária quando o site for de fato publicado; documentada aqui como
  risco conhecido, tratada na fase de deploy.
- Comentários em posts, busca full-text, paginação (lista de posts
  assume volume baixo o suficiente para renderizar tudo de uma vez),
  RSS/sitemap.
- Syntax highlighting de blocos de código dentro dos posts — pode ser
  adicionado depois (ex. `highlight.js`) se os posts tiverem muito código;
  não é bloqueio para o lançamento.
- Filtro de posts por tag na listagem — mencionado como possível "bônus"
  durante o brainstorming, mas não confirmado; não faz parte desta spec.
  Pode virar uma spec bounded separada depois que houver posts reais para
  validar se faz sentido.

## Decisões de arquitetura

### Autoria: Markdown em arquivo, não CMS

Um CMS externo (Contentful, Sanity) exigiria criar conta, configurar
integração e manter mais uma dependência de serviço — o mesmo tipo de
fricção já discutido na Fase 5 (formulário de contato via EmailJS).
Markdown em arquivo é grátis, versionado no git, e o usuário já está
confortável editando código. Cada post é um arquivo em
`src/content/posts/<slug>.md` com frontmatter:

```markdown
---
title: 'Título do post'
date: '2026-09-19'
excerpt: 'Resumo de uma ou duas linhas para o card da listagem.'
tags: ['ia', 'front-end']
---

Corpo do post em Markdown...
```

O `slug` da URL vem do nome do arquivo (sem a extensão `.md`).

### Parsing e renderização

- `gray-matter` para separar frontmatter do corpo.
- `marked` para converter o corpo Markdown em HTML.
- Carregamento em build time via `import.meta.glob('/src/content/posts/*.md', { query: '?raw', import: 'default', eager: true })`
  do Vite — sem fetch em runtime, consistente com o restante do site
  (dados estáticos importados, como `data/projects.js` etc.).
- O HTML renderizado do corpo é inserido via `dangerouslySetInnerHTML`
  (conteúdo vem do próprio repositório do usuário, não de input de
  terceiros — risco de XSS não se aplica aqui do mesmo jeito que
  aplicaria a conteúdo gerado por usuários externos).

### Roteamento: `react-router-dom`

Novo dependency. Estrutura de rotas:

```
/            → página única atual (Hero, Sobre, Skills, Timeline, Projetos, Contato)
/blog        → listagem de posts
/blog/:slug  → post individual
```

`App.jsx` passa a envolver as rotas com `<BrowserRouter>`; o conteúdo
atual de `App.jsx` (Navbar + seções + Footer) vira a rota `/` sem
alterações de conteúdo.

### Navbar: integração com rotas

- Novo link "Blog" na navegação, usando `<Link to="/blog">` do
  react-router, ativo quando `pathname` começa com `/blog`.
- Os links de âncora existentes (Home, Sobre mim, Skills, Timeline,
  Projetos, Contato) continuam sendo `<a href="#id">` quando a rota atual
  é `/`. Quando a rota atual não é `/` (ex. usuário está em `/blog`),
  esses links precisam navegar de volta para `/` e então rolar até a
  âncora — passam a ser `<Link to={`/#${id}`}>` nesse caso, com um efeito
  que rola até o elemento pelo `id` do hash após a navegação completar.
- O scroll-spy (`getActiveSection`, já existente e testado) só faz sentido
  na rota `/`; o listener de scroll que o alimenta é desativado fora dela.

### Layout do Blog

- `/blog`: reaproveita o padrão visual dos cards de projeto (borda sutil,
  hover com elevação/destaque). Cada card mostra título, data formatada,
  resumo (`excerpt`) e tags. Sem posts: estado vazio com mensagem
  ("em breve, novos posts por aqui") em vez de lista em branco.
- `/blog/:slug`: título, data, tags, corpo do post renderizado, link
  "← voltar pro blog". Rota inexistente (slug que não existe) mostra uma
  mensagem simples de "post não encontrado" com o mesmo link de volta.
- Navbar permanece visível em ambas as rotas do blog, para consistência
  de navegação com o resto do site. Sem reaproveitar o `Footer` completo
  (que hoje é conteúdo da seção "Contato" da home) — página de blog não
  duplica o formulário de contato.

## Estrutura de arquivos (novo/alterado)

```
src/
  content/
    posts/                    # arquivos .md dos posts (vazio no lançamento)
  pages/
    Home.jsx                  # conteúdo atual de App.jsx, movido pra cá
    BlogIndex.jsx
    BlogPost.jsx
  utils/
    posts.js                  # carrega/parseia os .md via import.meta.glob,
                               # exporta lista ordenada + getter por slug
  App.jsx                     # agora só monta <BrowserRouter> + rotas
  components/
    Navbar.jsx                # ajustado para links cientes de rota
```

## Testes / verificação

- `utils/posts.js`: testes unitários (ordenação por data, parsing de
  frontmatter, slug a partir do nome do arquivo) usando arquivos `.md` de
  fixture dentro da própria suíte de teste — sem depender dos posts reais
  do usuário.
- `BlogIndex`: renderiza estado vazio quando não há posts (caso do
  lançamento); renderiza cards quando há posts de fixture.
- `BlogPost`: renderiza post existente pelo slug; renderiza mensagem de
  "não encontrado" para slug inexistente.
- `Navbar`: os links de âncora apontam para `/#id` quando fora da rota
  `/`, e para `#id` quando na rota `/`; link "Blog" fica ativo em
  `/blog` e `/blog/:slug`.
- `npm run build` ao final, como nas fases anteriores.

## Riscos / decisões em aberto para a implementação

- Rewrite de rotas client-side no host de produção (ver Não-objetivos) —
  não bloqueia esta fase, mas precisa ser resolvido antes do deploy real,
  senão `/blog/algum-post` retorna 404 direto do servidor de hospedagem
  estática.
- Volume de posts: a listagem em `/blog` não pagina; se o usuário publicar
  dezenas de posts no futuro, paginação vira necessária — não é problema
  hoje (lançamento com zero posts).
- Tags sem filtro funcional nesta fase — aparecem no card e na página do
  post apenas como informação, sem interação.

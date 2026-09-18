# Redesign do Portfólio em React — Spec de Design

Data: 2026-09-18
Branch: `react-redesign`

## Contexto

O portfólio atual (`index.html`, `css/style.css`, `js/script.js` na raiz do
repo) é um site estático HTML/CSS/JS com: navbar, seção Home (efeito de
digitação, bio, download de CV, ícones sociais), e uma seção de Projetos com
6 cards. Visual: gradiente verde/azul animado com glassmorphism.

Objetivo: reconstruir esse portfólio do zero como uma aplicação React,
mantendo o conteúdo real (bio, projetos, CV, links), mas com uma identidade
visual que comunique "engenheiro de software" — estética dark/terminal —
em vez do gradiente genérico atual.

## Objetivos

- Reconstruir o site como SPA em Vite + React + Tailwind CSS.
- Nova identidade visual: dark mode, inspirada em terminal/editor de código.
- Adicionar duas seções novas: Skills/Stack técnica e Timeline de
  formação/experiência (estilo "git log").
- Manter todo o conteúdo real: bio, os 6 projetos existentes, link do CV,
  ícones sociais (LinkedIn, GitHub, Instagram).
- Separar conteúdo (textos/listas) de componentes, para facilitar edições
  futuras de texto sem tocar em código de marcação.

## Não-objetivos (fora de escopo nesta spec)

- Configuração de deploy (GitHub Pages / `gh-pages` / base path do Vite) e
  merge para `main` — será tratado depois que o build estiver revisado e
  aprovado, em uma etapa separada.
- Alterações de conteúdo/textos além de inferências pontuais já combinadas
  (lista de skills, abaixo). O usuário fará ajustes de texto depois.
- Adição de novos projetos além dos 6 já existentes.
- Backend, formulário de contato funcional, CMS, i18n real (o
  toggle PT/EN existente era só cosmético no efeito de digitação e não
  será reimplementado como i18n completo).

## Stack técnica

- **Build tool**: Vite (`react` template).
- **UI**: React 18+ (function components + hooks).
- **Estilo**: Tailwind CSS.
- **Animações**: Framer Motion (scroll-reveal, hover/microinterações).
- **Ícones**: `react-icons` (conjunto Remix Icon `ri`, mesmos ícones já
  usados no site atual via CDN).
- **Fontes**: Inter ou Poppins (corpo do texto) + JetBrains Mono ou Fira
  Code (detalhes de terminal, labels de seção, prompt).

## Estrutura do projeto

```
src/
  components/
    Navbar.jsx
    Hero.jsx
    About.jsx
    Skills.jsx
    Timeline.jsx
    Projects.jsx
    Footer.jsx
  data/
    projects.js
    skills.js
    timeline.js
  hooks/
    useTypingEffect.js
  App.jsx
  main.jsx
  index.css        # Tailwind directives + fontes + variáveis de tema
```

O conteúdo (textos de bio, lista de projetos, lista de skills, itens da
timeline) vive em `src/data/*.js`, não hardcoded dentro dos componentes.

## Seções e conteúdo

1. **Navbar** — logo/nome, links para as âncoras das seções (Home, Sobre,
   Skills, Timeline, Projetos, Contato), estado ativo ao rolar a página.

2. **Hero** — estilizado como uma janela de terminal (barra superior com
   3 bolinhas estilo macOS, título tipo `raphael@portfolio:~$`). Efeito de
   digitação (reimplementado como hook `useTypingEffect`, substituindo o
   `js/script.js` atual) alternando os textos PT/EN já existentes. Mantém:
   bio (dois parágrafos atuais), botão de download do CV
   (`docs/CV.pdf` — arquivo já existente, será copiado para `public/`),
   e os 3 ícones sociais (LinkedIn, GitHub, Instagram) com os mesmos links
   atuais.

3. **Sobre** — versão um pouco mais detalhada da bio atual (mesmo
   conteúdo, mas com espaço próprio em vez de compartilhar a seção Hero),
   foto (`imagem/about.png`, copiada para `public/`).

4. **Skills/Stack** — grid de badges com ícone + nome, agrupados em
   categorias. Lista inferida a partir da bio e dos projetos existentes
   (o usuário revisará/ajustará depois):
   - **Front-end**: HTML5, CSS3, JavaScript, React
   - **Em aprofundamento**: Python, Bancos de Dados (SQL), Inteligência
     Artificial / Machine Learning
   - **Fundamentos & Ferramentas**: Estruturas de Dados, Git & GitHub

5. **Timeline** — estilo "git log" (lista vertical com marcador tipo commit
   hash/branch), cobrindo: graduação em Ciência da Computação na UNIT (em
   andamento) e os projetos/disciplinas relevantes já existentes como
   marcos (ex.: disciplina de IA, Estruturas de Dados Avançadas,
   Laboratório de Engenharia de Software, projeto freelance). Não inventa
   datas específicas que não existem hoje no site — usa labels genéricos
   ("em andamento", nomes de disciplina) onde a data exata não é conhecida.

6. **Projetos** — 6 cards estilo "repositório do GitHub" (ícone, título,
   descrição, link "veja mais" para o repo), com o mesmo conteúdo e links
   atuais:
   - IA-Documentação por áudio
   - IA-Reconhecimento de Emoção
   - Termo (Experiência Extensionista)
   - Landing Page TechFit
   - Árvore Binária
   - Árvore AVL

7. **Footer/Contato** — repete ícones sociais + CV, rodapé simples.

## Sistema visual

- **Cores**: fundo quase preto (~`#0d1117`, inspirado em GitHub dark),
  texto principal em cinza claro, uma cor de destaque only (verde
  `#3fb950` ou ciano `#58a6ff` — decidir durante implementação com base
  em contraste/legibilidade) usada em links, prompt, bordas de hover e
  labels tipo `// 02. projetos`.
- **Tipografia**: fonte sans-serif (Inter/Poppins) para texto corrido;
  fonte monoespaçada (JetBrains Mono/Fira Code) para: prompt do terminal,
  labels de seção, tags de tecnologia nos cards de projeto.
- **Componentes**: cards com cantos arredondados sutis, bordas finas
  (não glassmorphism pesado como o atual), sombra discreta, hover com
  leve elevação/realce de borda na cor de destaque.

## Interações

- Efeito de digitação no Hero (hook customizado).
- Scroll-reveal (fade/slide-in) nas seções via Framer Motion.
- Hover states em cards de projeto, badges de skills e ícones sociais.
- Navbar com indicação de seção ativa ao rolar (scroll-spy simples).
- Responsivo: mobile-first, breakpoints equivalentes aos atuais
  (~576px, ~768px, ~992px) adaptados às classes do Tailwind.

## Testes / verificação

- Sem framework de testes automatizados nesta fase (projeto de portfólio
  estático); verificação será manual: `npm run dev` e revisão visual de
  cada seção em desktop e mobile (viewport reduzido), checagem de todos
  os links (CV, GitHub dos projetos, redes sociais).
- Rodar `npm run build` ao final para garantir que o build de produção
  funciona sem erros.

## Assets existentes a reaproveitar

- `docs/CV.pdf` → `public/CV.pdf`
- `imagem/about.png` → `public/about.png` (ou `src/assets/`)
- `imagem/home.png` → avaliar uso (atualmente não referenciado no
  `index.html` atual; decidir na implementação se será usado em alguma
  seção ou descartado)

## Riscos / decisões em aberto para a implementação

- Cor de destaque final (verde vs. ciano) — decidir visualmente durante a
  implementação, testando ambas.
- Uso ou não de `imagem/home.png` (não usada no site atual).
- Datas exatas da timeline não existem hoje — usar labels genéricos até o
  usuário fornecer datas específicas.

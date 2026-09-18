# Redesign do Portfólio em React — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir o portfólio estático atual como uma SPA em React (Vite + Tailwind), com identidade visual dark/terminal, mantendo todo o conteúdo real (bio, 6 projetos, CV, redes sociais) e adicionando seções de Skills e Timeline.

**Architecture:** App React de página única, composta por componentes de seção independentes (`Hero`, `About`, `Skills`, `Timeline`, `Projects`, `Footer`) montados em `App.jsx` dentro de wrappers `AnimatedSection` (scroll-reveal via Framer Motion). Conteúdo (textos/listas) vive em módulos `src/data/*.js`, separados da marcação. Um hook (`useTypingEffect`) e uma função utilitária pura (`getActiveSection`) concentram a única lógica não-trivial do app.

**Tech Stack:** Vite, React 18, Tailwind CSS, Framer Motion, react-icons (`ri` + `si`), Vitest + React Testing Library + jsdom.

**Spec:** `docs/superpowers/specs/2026-09-18-react-redesign-design.md`

## Global Constraints

- Novo app vive em `app/` (subpasta do repo). Os arquivos estáticos atuais na raiz (`index.html`, `css/`, `js/`, `imagem/`, `docs/CV.pdf`) permanecem intocados nesta branch — decisão de merge/deploy fica para depois (fora de escopo, ver spec).
- Cor de destaque (accent): `#3fb950` (verde terminal). Fundo: `#0d1117`. Texto principal: `#c9d1d9`. Texto secundário: `#8b949e`. (Decisão travada nesta implementação — resolve o item em aberto da spec.)
- Fonte de corpo: `Inter`. Fonte monoespaçada: `JetBrains Mono`. Carregadas via Google Fonts no `index.css`.
- Ícones: `react-icons/ri` (Remix Icon) para ícones sociais e o ícone genérico de "código"; `react-icons/si` (Simple Icons) para logos de tecnologia na seção Skills.
- Todo conteúdo textual (bio, projetos, links) é cópia exata do site atual — sem inventar texto novo, exceto onde a spec explicitamente pediu inferência (lista de skills) ou rótulos genéricos (timeline, na ausência de datas exatas).
- Testes: Vitest + `@testing-library/react` + `jsdom`, rodados com `npm test` dentro de `app/`.
- Cada task termina com `npm test` verde antes do commit.

---

## Estrutura de arquivos (visão geral)

```
app/
  index.html
  vite.config.js
  tailwind.config.js
  postcss.config.js
  public/
    CV.pdf
    about.png
  src/
    main.jsx
    App.jsx
    App.test.jsx
    index.css
    setupTests.js
    data/
      projects.js
      projects.test.js
      skills.js
      skills.test.js
      timeline.js
      timeline.test.js
      socialLinks.js
      socialLinks.test.js
      navSections.js
      navSections.test.js
    utils/
      getActiveSection.js
      getActiveSection.test.js
    hooks/
      useTypingEffect.js
      useTypingEffect.test.js
    components/
      SocialLinks.jsx
      SocialLinks.test.jsx
      Navbar.jsx
      Navbar.test.jsx
      AnimatedSection.jsx
      AnimatedSection.test.jsx
      Hero.jsx
      Hero.test.jsx
      About.jsx
      About.test.jsx
      Skills.jsx
      Skills.test.jsx
      Timeline.jsx
      Timeline.test.jsx
      Projects.jsx
      Projects.test.jsx
      Footer.jsx
      Footer.test.jsx
```

---

### Task 1: Scaffold do projeto Vite + React + ferramentas de teste

**Files:**
- Create: `app/` (via scaffold do Vite)
- Modify: `app/vite.config.js`
- Create: `app/src/setupTests.js`
- Modify: `app/package.json`

**Interfaces:**
- Consumes: nada (primeira task).
- Produces: comando `npm test` funcional dentro de `app/`, executando Vitest com ambiente `jsdom` e matchers do `@testing-library/jest-dom` disponíveis globalmente (`globals: true`).

- [ ] **Step 1: Criar o projeto Vite**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
npm create vite@latest app -- --template react
cd app
npm install
```

- [ ] **Step 2: Instalar ferramentas de teste**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configurar Vitest no `vite.config.js`**

Substituir o conteúdo de `app/vite.config.js` por:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true,
  },
})
```

- [ ] **Step 4: Criar `src/setupTests.js`**

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Adicionar script de teste no `package.json`**

Em `app/package.json`, dentro de `"scripts"`, adicionar:

```json
"test": "vitest run"
```

- [ ] **Step 6: Escrever teste de verificação do scaffold**

Criar `app/src/App.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App scaffold', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 7: Rodar os testes e confirmar que passam**

Run: `npm test` (dentro de `app/`)
Expected: PASS — 1 teste passando (o `App.jsx` padrão do template Vite ainda contém o texto "Vite + React").

- [ ] **Step 8: Commit**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "chore: scaffold Vite + React app with Vitest/RTL tooling"
```

---

### Task 2: Tailwind, tema visual, fontes e assets

**Files:**
- Create: `app/tailwind.config.js`, `app/postcss.config.js`
- Modify: `app/src/index.css`
- Create: `app/public/CV.pdf`, `app/public/about.png`

**Interfaces:**
- Consumes: projeto scaffolded da Task 1.
- Produces: classes utilitárias Tailwind com tema customizado disponíveis em todo o app: cores `bg-bg`, `text-text`, `text-text-muted`, `text-accent`, `border-accent`, `bg-accent`; fontes `font-sans` (Inter) e `font-mono` (JetBrains Mono). Assets acessíveis publicamente em `/CV.pdf` e `/about.png`.

- [ ] **Step 1: Instalar Tailwind**

```bash
cd app
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 2: Configurar `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d1117',
        accent: '#3fb950',
        text: {
          DEFAULT: '#c9d1d9',
          muted: '#8b949e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Substituir `app/src/index.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-bg text-text font-sans;
}
```

- [ ] **Step 4: Copiar os assets existentes para `public/`**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
cp docs/CV.pdf app/public/CV.pdf
cp imagem/about.png app/public/about.png
```

- [ ] **Step 5: Verificação manual**

Run: `npm run dev` (dentro de `app/`)
Expected: página padrão do Vite abre com fundo escuro (`#0d1117`) e texto claro — confirma que o Tailwind e as fontes foram aplicados. Acessar `http://localhost:5173/CV.pdf` e `http://localhost:5173/about.png` no navegador e confirmar que ambos carregam.

- [ ] **Step 6: Commit**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "feat: add Tailwind theme, fonts and static assets"
```

---

### Task 3: Módulos de conteúdo (dados)

**Files:**
- Create: `app/src/data/projects.js`, `app/src/data/projects.test.js`
- Create: `app/src/data/skills.js`, `app/src/data/skills.test.js`
- Create: `app/src/data/timeline.js`, `app/src/data/timeline.test.js`
- Create: `app/src/data/socialLinks.js`, `app/src/data/socialLinks.test.js`
- Create: `app/src/data/navSections.js`, `app/src/data/navSections.test.js`

**Interfaces:**
- Consumes: nada além do scaffold.
- Produces (usados pelas próximas tasks):
  - `projects`: `{ id: string, title: string, description: string, url: string }[]` (6 itens)
  - `skillCategories`: `{ category: string, items: { name: string, Icon: React.ComponentType | null }[] }[]`
  - `timelineEntries`: `{ id: string, hash: string, label: string, detail: string }[]`
  - `socialLinks`: `{ id: string, label: string, href: string, Icon: React.ComponentType }[]`
  - `navSections`: `{ id: string, label: string }[]`

- [ ] **Step 1: Teste de `projects`**

Criar `app/src/data/projects.test.js`:

```js
import { projects } from './projects'

describe('projects data', () => {
  it('has exactly 6 projects with required fields', () => {
    expect(projects).toHaveLength(6)
    projects.forEach((project) => {
      expect(project.id).toEqual(expect.any(String))
      expect(project.title).toEqual(expect.any(String))
      expect(project.description).toEqual(expect.any(String))
      expect(project.url).toMatch(/^https:\/\/github\.com\//)
    })
  })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npm test -- projects` (dentro de `app/`)
Expected: FAIL — `Cannot find module './projects'`

- [ ] **Step 3: Criar `app/src/data/projects.js`**

```js
export const projects = [
  {
    id: 'ia-documentacao-audio',
    title: 'IA-Documentação por audio',
    description:
      'Projeto freelance, no qual o sistema tem a função de transcrever todo o conteúdo do áudio enviado para a IA.',
    url: 'https://github.com/RaphaVini6/Freelance-IA-Gladston.git',
  },
  {
    id: 'ia-reconhecimento-emocao',
    title: 'IA-Reconhecimento de Emoção',
    description:
      'Projeto acadêmico da disciplina de Inteligência Artificial, no qual a IA, desenvolvida por mim e meu grupo, recebe um áudio e identifica a emoção presente nele.',
    url: 'https://github.com/RaphaVini6/Ia-Emocao.git',
  },
  {
    id: 'termo-extensionista',
    title: 'Termo para Experiencia Extensionista',
    description:
      "Um jogo no estilo 'Termo' desenvolvido como intervenção no contexto da disciplina de Experiência Extensionista.",
    url: 'https://github.com/RaphaVini6/Extensionista_termo.git',
  },
  {
    id: 'landing-techfit',
    title: 'Landing Page TechFit',
    description:
      'Projeto acadêmico para a disciplina de Laboratório de Engenharia de Software, com o objetivo de criar um site funcional para divulgar uma academia de musculação.',
    url: 'https://github.com/RaphaVini6/TechFit.git',
  },
  {
    id: 'arvore-binaria',
    title: 'Árvore Binária',
    description:
      'Projeto acadêmico para a disciplina de Estruturas de Dados Avançadas, com o objetivo de desenvolver uma implementação de Árvore Binária.',
    url: 'https://github.com/RaphaVini6/ME-Estrutura-De-Dados-Avan-ada-Arvore.git',
  },
  {
    id: 'arvore-avl',
    title: 'Arvore AVL',
    description:
      'Projeto acadêmico para a disciplina de Estruturas de Dados Avançadas, com o objetivo de desenvolver uma implementação de Árvore AVL.',
    url: 'https://github.com/RaphaVini6/Web-AVL.git',
  },
]
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npm test -- projects`
Expected: PASS

- [ ] **Step 5: Teste de `socialLinks`**

Criar `app/src/data/socialLinks.test.js`:

```js
import { socialLinks } from './socialLinks'

describe('socialLinks data', () => {
  it('has linkedin, github and instagram with valid hrefs', () => {
    const ids = socialLinks.map((link) => link.id)
    expect(ids).toEqual(['linkedin', 'github', 'instagram'])
    socialLinks.forEach((link) => {
      expect(link.href).toMatch(/^https:\/\//)
      expect(link.Icon).toBeDefined()
    })
  })
})
```

- [ ] **Step 6: Rodar e confirmar falha, depois criar `app/src/data/socialLinks.js`**

```js
import { RiLinkedinFill, RiGithubLine, RiInstagramLine } from 'react-icons/ri'

export const socialLinks = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/raphael-vinicius-a1006b26b/',
    Icon: RiLinkedinFill,
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/RaphaVini6',
    Icon: RiGithubLine,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/rapha.vini6/',
    Icon: RiInstagramLine,
  },
]
```

Instalar a dependência antes de rodar o teste:

```bash
cd app
npm install react-icons
```

Run: `npm test -- socialLinks`
Expected: PASS

- [ ] **Step 7: Teste de `skills`**

Criar `app/src/data/skills.test.js`:

```js
import { skillCategories } from './skills'

describe('skills data', () => {
  it('groups skills into 3 categories with at least one item each', () => {
    expect(skillCategories).toHaveLength(3)
    skillCategories.forEach((group) => {
      expect(group.category).toEqual(expect.any(String))
      expect(group.items.length).toBeGreaterThan(0)
      group.items.forEach((item) => {
        expect(item.name).toEqual(expect.any(String))
      })
    })
  })
})
```

- [ ] **Step 8: Rodar e confirmar falha, depois criar `app/src/data/skills.js`**

```js
import { SiHtml5, SiCss3, SiJavascript, SiReact, SiPython, SiMysql, SiGit, SiGithub } from 'react-icons/si'

export const skillCategories = [
  {
    category: 'Front-end',
    items: [
      { name: 'HTML5', Icon: SiHtml5 },
      { name: 'CSS3', Icon: SiCss3 },
      { name: 'JavaScript', Icon: SiJavascript },
      { name: 'React', Icon: SiReact },
    ],
  },
  {
    category: 'Em aprofundamento',
    items: [
      { name: 'Python', Icon: SiPython },
      { name: 'Bancos de Dados (SQL)', Icon: SiMysql },
      { name: 'Inteligência Artificial / Machine Learning', Icon: null },
    ],
  },
  {
    category: 'Fundamentos & Ferramentas',
    items: [
      { name: 'Estruturas de Dados', Icon: null },
      { name: 'Git', Icon: SiGit },
      { name: 'GitHub', Icon: SiGithub },
    ],
  },
]
```

Run: `npm test -- skills`
Expected: PASS

- [ ] **Step 9: Teste de `timeline`**

Criar `app/src/data/timeline.test.js`:

```js
import { timelineEntries } from './timeline'

describe('timeline data', () => {
  it('has at least 4 entries with hash, label and detail', () => {
    expect(timelineEntries.length).toBeGreaterThanOrEqual(4)
    timelineEntries.forEach((entry) => {
      expect(entry.hash).toMatch(/^[a-f0-9]{7}$/)
      expect(entry.label).toEqual(expect.any(String))
      expect(entry.detail).toEqual(expect.any(String))
    })
  })
})
```

- [ ] **Step 10: Rodar e confirmar falha, depois criar `app/src/data/timeline.js`**

```js
export const timelineEntries = [
  {
    id: 'graduacao-unit',
    hash: 'a1b2c3d',
    label: 'Graduação em Ciência da Computação — UNIT',
    detail: 'Em andamento',
  },
  {
    id: 'lab-engenharia-software',
    hash: 'e4f5a6b',
    label: 'Laboratório de Engenharia de Software — Landing Page TechFit',
    detail: 'Disciplina de graduação',
  },
  {
    id: 'estruturas-dados-avancadas',
    hash: 'c7d8e9f',
    label: 'Estruturas de Dados Avançadas — Árvore Binária e Árvore AVL',
    detail: 'Disciplina de graduação',
  },
  {
    id: 'inteligencia-artificial',
    hash: 'b0c1d2e',
    label: 'Inteligência Artificial — Reconhecimento de Emoção por Áudio',
    detail: 'Disciplina de graduação, projeto em grupo',
  },
  {
    id: 'freelance-ia-audio',
    hash: 'f3a4b5c',
    label: 'Projeto freelance — IA de documentação por áudio',
    detail: 'Cliente externo',
  },
]
```

Run: `npm test -- timeline`
Expected: PASS

- [ ] **Step 11: Teste de `navSections`**

Criar `app/src/data/navSections.test.js`:

```js
import { navSections } from './navSections'

describe('navSections data', () => {
  it('has 6 sections matching the anchors used across the app', () => {
    expect(navSections.map((s) => s.id)).toEqual([
      'home',
      'sobre-mim',
      'skills',
      'timeline',
      'projetos',
      'contato',
    ])
  })
})
```

- [ ] **Step 12: Rodar e confirmar falha, depois criar `app/src/data/navSections.js`**

```js
export const navSections = [
  { id: 'home', label: 'Home' },
  { id: 'sobre-mim', label: 'Sobre mim' },
  { id: 'skills', label: 'Skills' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'contato', label: 'Contato' },
]
```

Run: `npm test`
Expected: PASS (todos os testes de `data/`)

- [ ] **Step 13: Commit**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "feat: add content data modules (projects, skills, timeline, social links, nav sections)"
```

---

### Task 4: Utilitário puro `getActiveSection`

**Files:**
- Create: `app/src/utils/getActiveSection.js`, `app/src/utils/getActiveSection.test.js`

**Interfaces:**
- Consumes: nada.
- Produces: `getActiveSection(sections, scrollY, offset = 0)` → `string | null`, onde `sections: { id: string, offsetTop: number }[]` (usado pela Task 7, `Navbar`).

- [ ] **Step 1: Escrever os testes**

```js
import { getActiveSection } from './getActiveSection'

const sections = [
  { id: 'home', offsetTop: 0 },
  { id: 'sobre-mim', offsetTop: 500 },
  { id: 'projetos', offsetTop: 1000 },
]

describe('getActiveSection', () => {
  it('returns the first section id when scrollY is 0', () => {
    expect(getActiveSection(sections, 0)).toBe('home')
  })

  it('returns the section whose offsetTop has been passed', () => {
    expect(getActiveSection(sections, 600)).toBe('sobre-mim')
  })

  it('returns the last matching section when scrollY passes all offsets', () => {
    expect(getActiveSection(sections, 1200)).toBe('projetos')
  })

  it('applies the offset before comparing', () => {
    expect(getActiveSection(sections, 920, 100)).toBe('projetos')
  })

  it('returns null for an empty sections list', () => {
    expect(getActiveSection([], 100)).toBeNull()
  })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npm test -- getActiveSection`
Expected: FAIL — `Cannot find module './getActiveSection'`

- [ ] **Step 3: Implementar**

```js
export function getActiveSection(sections, scrollY, offset = 0) {
  if (sections.length === 0) return null

  let activeId = sections[0].id
  for (const section of sections) {
    if (scrollY + offset >= section.offsetTop) {
      activeId = section.id
    }
  }
  return activeId
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npm test -- getActiveSection`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "feat: add getActiveSection pure utility for scroll-spy"
```

---

### Task 5: Hook `useTypingEffect`

**Files:**
- Create: `app/src/hooks/useTypingEffect.js`, `app/src/hooks/useTypingEffect.test.js`

**Interfaces:**
- Consumes: nada.
- Produces: `useTypingEffect(entries, options)` → `{ title: string, subtitle: string }`, onde `entries: { title: string, subtitle: string }[]`, `options?: { typingSpeed?: number, deletingSpeed?: number, pauseTime?: number }` (usado pela Task 9, `Hero`).

- [ ] **Step 1: Escrever os testes (com fake timers)**

```js
import { renderHook, act } from '@testing-library/react'
import { useTypingEffect } from './useTypingEffect'

const entries = [
  { title: 'Oi', subtitle: 'Dev' },
  { title: 'Hi', subtitle: 'Eng' },
]

describe('useTypingEffect', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts empty and types characters over time', () => {
    const { result } = renderHook(() =>
      useTypingEffect(entries, { typingSpeed: 100, deletingSpeed: 50, pauseTime: 2000 })
    )

    expect(result.current).toEqual({ title: '', subtitle: '' })

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toEqual({ title: 'O', subtitle: 'D' })

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toEqual({ title: 'Oi', subtitle: 'De' })
  })

  it('pauses on the full text, then deletes it', () => {
    const { result } = renderHook(() =>
      useTypingEffect(entries, { typingSpeed: 100, deletingSpeed: 50, pauseTime: 2000 })
    )

    act(() => {
      vi.advanceTimersByTime(200) // types "Oi"
    })
    expect(result.current.title).toBe('Oi')

    act(() => {
      vi.advanceTimersByTime(2000) // pause, then first delete tick fires
    })
    expect(result.current.title).toBe('O')
  })

  it('cycles to the next entry after fully deleting', () => {
    const { result } = renderHook(() =>
      useTypingEffect(entries, { typingSpeed: 100, deletingSpeed: 50, pauseTime: 2000 })
    )

    act(() => {
      vi.advanceTimersByTime(200) // types "Oi"
      vi.advanceTimersByTime(2000) // pause
      vi.advanceTimersByTime(50) // delete 'i'
      vi.advanceTimersByTime(50) // delete 'O', charIndex reaches 0
      vi.advanceTimersByTime(100) // starts typing next entry: 'H'
    })

    expect(result.current.title).toBe('H')
  })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npm test -- useTypingEffect`
Expected: FAIL — `Cannot find module './useTypingEffect'`

- [ ] **Step 3: Implementar o hook**

```js
import { useEffect, useRef, useState } from 'react'

export function useTypingEffect(
  entries,
  { typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000 } = {}
) {
  const [display, setDisplay] = useState({ title: '', subtitle: '' })
  const entryIndex = useRef(0)
  const charIndex = useRef(0)
  const isDeleting = useRef(false)

  useEffect(() => {
    let timeoutId

    function tick() {
      const current = entries[entryIndex.current]

      setDisplay({
        title: current.title.substring(0, charIndex.current),
        subtitle: current.subtitle.substring(0, charIndex.current),
      })

      if (!isDeleting.current) {
        if (charIndex.current < current.title.length) {
          charIndex.current += 1
          timeoutId = setTimeout(tick, typingSpeed)
        } else {
          timeoutId = setTimeout(() => {
            isDeleting.current = true
            tick()
          }, pauseTime)
        }
      } else {
        if (charIndex.current > 0) {
          charIndex.current -= 1
          timeoutId = setTimeout(tick, deletingSpeed)
        } else {
          isDeleting.current = false
          entryIndex.current = (entryIndex.current + 1) % entries.length
          timeoutId = setTimeout(tick, typingSpeed)
        }
      }
    }

    timeoutId = setTimeout(tick, typingSpeed)

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return display
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npm test -- useTypingEffect`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "feat: add useTypingEffect hook for the hero heading"
```

---

### Task 6: Componente `SocialLinks`

**Files:**
- Create: `app/src/components/SocialLinks.jsx`, `app/src/components/SocialLinks.test.jsx`

**Interfaces:**
- Consumes: `socialLinks` de `../data/socialLinks`.
- Produces: `export default function SocialLinks({ className = '' })` (usado pelas Tasks 9 e 14, `Hero` e `Footer`).

- [ ] **Step 1: Escrever o teste**

```jsx
import { render, screen } from '@testing-library/react'
import SocialLinks from './SocialLinks'

describe('SocialLinks', () => {
  it('renders a link for each social entry with correct hrefs', () => {
    render(<SocialLinks />)

    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/raphael-vinicius-a1006b26b/'
    )
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/RaphaVini6'
    )
    expect(screen.getByRole('link', { name: /instagram/i })).toHaveAttribute(
      'href',
      'https://www.instagram.com/rapha.vini6/'
    )
  })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npm test -- SocialLinks`
Expected: FAIL — `Cannot find module './SocialLinks'`

- [ ] **Step 3: Implementar o componente**

```jsx
import { socialLinks } from '../data/socialLinks'

export default function SocialLinks({ className = '' }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socialLinks.map(({ id, label, href, Icon }) => (
        <a
          key={id}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-text transition hover:border-accent hover:text-accent"
        >
          <Icon />
        </a>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npm test -- SocialLinks`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "feat: add SocialLinks component"
```

---

### Task 7: Componente `Navbar`

**Files:**
- Create: `app/src/components/Navbar.jsx`, `app/src/components/Navbar.test.jsx`

**Interfaces:**
- Consumes: `navSections` de `../data/navSections`; `getActiveSection` de `../utils/getActiveSection`.
- Produces: `export default function Navbar()` (usado pela Task 15, `App`).

- [ ] **Step 1: Escrever o teste**

```jsx
import { render, screen } from '@testing-library/react'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('renders a link for every nav section', () => {
    render(<Navbar />)

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#home')
    expect(screen.getByRole('link', { name: 'Sobre mim' })).toHaveAttribute('href', '#sobre-mim')
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills')
    expect(screen.getByRole('link', { name: 'Timeline' })).toHaveAttribute('href', '#timeline')
    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute('href', '#projetos')
    expect(screen.getByRole('link', { name: 'Contato' })).toHaveAttribute('href', '#contato')
  })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npm test -- Navbar`
Expected: FAIL — `Cannot find module './Navbar'`

- [ ] **Step 3: Implementar o componente**

```jsx
import { useEffect, useState } from 'react'
import { navSections } from '../data/navSections'
import { getActiveSection } from '../utils/getActiveSection'

export default function Navbar() {
  const [active, setActive] = useState(navSections[0].id)

  useEffect(() => {
    function handleScroll() {
      const sections = navSections
        .map(({ id }) => {
          const el = document.getElementById(id)
          return el ? { id, offsetTop: el.offsetTop } : null
        })
        .filter(Boolean)

      const current = getActiveSection(sections, window.scrollY, 96)
      if (current) setActive(current)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between bg-bg/90 px-6 py-4 backdrop-blur">
      <span className="font-mono text-lg text-accent">raphael@portfolio:~$</span>
      <nav className="flex gap-6">
        {navSections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`font-mono text-sm transition ${
              active === id ? 'text-accent' : 'text-text-muted hover:text-text'
            }`}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  )
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npm test -- Navbar`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "feat: add Navbar with scroll-spy"
```

---

### Task 8: Componente `AnimatedSection`

**Files:**
- Create: `app/src/components/AnimatedSection.jsx`, `app/src/components/AnimatedSection.test.jsx`

**Interfaces:**
- Consumes: `framer-motion`.
- Produces: `export default function AnimatedSection({ id, className = '', children })` (usado pela Task 15, `App`).

- [ ] **Step 1: Instalar `framer-motion`**

```bash
cd app
npm install framer-motion
```

- [ ] **Step 2: Escrever o teste**

```jsx
import { render, screen } from '@testing-library/react'
import AnimatedSection from './AnimatedSection'

describe('AnimatedSection', () => {
  it('renders children inside a section with the given id', () => {
    render(
      <AnimatedSection id="home">
        <p>Conteúdo</p>
      </AnimatedSection>
    )

    const section = screen.getByText('Conteúdo').closest('section')
    expect(section).toHaveAttribute('id', 'home')
  })
})
```

- [ ] **Step 3: Rodar e confirmar falha**

Run: `npm test -- AnimatedSection`
Expected: FAIL — `Cannot find module './AnimatedSection'`

- [ ] **Step 4: Implementar o componente**

```jsx
import { motion } from 'framer-motion'

export default function AnimatedSection({ id, className = '', children }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.section>
  )
}
```

- [ ] **Step 5: Rodar e confirmar sucesso**

Run: `npm test -- AnimatedSection`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "feat: add AnimatedSection scroll-reveal wrapper"
```

---

### Task 9: Componente `Hero`

**Files:**
- Create: `app/src/components/Hero.jsx`, `app/src/components/Hero.test.jsx`

**Interfaces:**
- Consumes: `useTypingEffect` de `../hooks/useTypingEffect`; `SocialLinks` de `./SocialLinks`.
- Produces: `export default function Hero()` (usado pela Task 15, `App`).

- [ ] **Step 1: Escrever o teste**

```jsx
import { render, screen } from '@testing-library/react'
import Hero from './Hero'

describe('Hero', () => {
  it('renders the CV download link and social icons', () => {
    render(<Hero />)

    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute('href', '/CV.pdf')
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npm test -- Hero`
Expected: FAIL — `Cannot find module './Hero'`

- [ ] **Step 3: Implementar o componente**

```jsx
import { useTypingEffect } from '../hooks/useTypingEffect'
import SocialLinks from './SocialLinks'

const HERO_TEXTS = [
  { title: 'Olá, eu sou o Raphael Vinicius', subtitle: 'Desenvolvedor' },
  { title: 'Hello, I am Raphael Vinicius', subtitle: 'Developer' },
]

export default function Hero() {
  const { title, subtitle } = useTypingEffect(HERO_TEXTS)

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <div className="px-6 py-10 font-mono">
          <p className="text-sm text-text-muted">raphael@portfolio:~$</p>
          <h1 className="mt-2 text-2xl font-bold text-text sm:text-3xl">
            {title}
            <span className="animate-pulse text-accent">_</span>
          </h1>
          <h2 className="mt-2 text-lg text-accent">{subtitle}</h2>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-6">
        <a
          href="/CV.pdf"
          className="rounded-full bg-accent px-6 py-3 font-mono text-sm font-semibold text-bg transition hover:brightness-110"
        >
          Download CV
        </a>
        <SocialLinks />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npm test -- Hero`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "feat: add Hero terminal-window section"
```

---

### Task 10: Componente `About`

**Files:**
- Create: `app/src/components/About.jsx`, `app/src/components/About.test.jsx`

**Interfaces:**
- Consumes: asset `/about.png`.
- Produces: `export default function About()` (usado pela Task 15, `App`).

- [ ] **Step 1: Escrever o teste**

```jsx
import { render, screen } from '@testing-library/react'
import About from './About'

describe('About', () => {
  it('renders the bio text and photo', () => {
    render(<About />)

    expect(screen.getByText(/Raphael Vinicius, mas pode me chamar de Rafah/i)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /raphael vinicius/i })).toHaveAttribute(
      'src',
      '/about.png'
    )
  })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npm test -- About`
Expected: FAIL — `Cannot find module './About'`

- [ ] **Step 3: Implementar o componente**

```jsx
export default function About() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col-reverse items-center gap-10 px-6 py-24 md:flex-row">
      <div className="flex-1">
        <p className="font-mono text-sm text-accent">// 01. sobre-mim</p>
        <h2 className="mt-2 text-2xl font-bold text-text">Sobre mim</h2>
        <p className="mt-6 leading-relaxed text-text-muted">
          Olá! Meu nome é Raphael Vinicius, mas pode me chamar de Rafah. Atualmente estou cursando
          Ciência da Computação na Universidade Tiradentes (UNIT). Sou especialista em
          Desenvolvimento Front-end, mas estou no caminho para me tornar um Desenvolvedor
          Full-Stack.
        </p>
        <p className="mt-4 leading-relaxed text-text-muted">
          No momento, estou aprimorando minhas habilidades em Front-end enquanto aprofundo meus
          conhecimentos em bancos de dados e inteligencia artificial(IA).
        </p>
      </div>
      <img
        src="/about.png"
        alt="Raphael Vinicius"
        className="h-56 w-56 rounded-full border-4 border-white/10 object-cover shadow-lg"
      />
    </div>
  )
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npm test -- About`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "feat: add About section"
```

---

### Task 11: Componente `Skills`

**Files:**
- Create: `app/src/components/Skills.jsx`, `app/src/components/Skills.test.jsx`

**Interfaces:**
- Consumes: `skillCategories` de `../data/skills`.
- Produces: `export default function Skills()` (usado pela Task 15, `App`).

- [ ] **Step 1: Escrever o teste**

```jsx
import { render, screen } from '@testing-library/react'
import Skills from './Skills'
import { skillCategories } from '../data/skills'

describe('Skills', () => {
  it('renders every category heading and every skill name', () => {
    render(<Skills />)

    skillCategories.forEach((group) => {
      expect(screen.getByText(group.category)).toBeInTheDocument()
      group.items.forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument()
      })
    })
  })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npm test -- Skills`
Expected: FAIL — `Cannot find module './Skills'`

- [ ] **Step 3: Implementar o componente**

```jsx
import { RiCodeSSlashLine } from 'react-icons/ri'
import { skillCategories } from '../data/skills'

export default function Skills() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <p className="font-mono text-sm text-accent">// 02. skills</p>
      <h2 className="mt-2 text-2xl font-bold text-text">Stack técnica</h2>

      <div className="mt-10 grid gap-10 sm:grid-cols-3">
        {skillCategories.map((group) => (
          <div key={group.category}>
            <h3 className="font-mono text-sm text-text-muted">{group.category}</h3>
            <ul className="mt-4 space-y-3">
              {group.items.map((item) => {
                const Icon = item.Icon ?? RiCodeSSlashLine
                return (
                  <li key={item.name} className="flex items-center gap-3 text-text">
                    <Icon className="text-lg text-accent" />
                    <span>{item.name}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npm test -- Skills`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "feat: add Skills section"
```

---

### Task 12: Componente `Timeline`

**Files:**
- Create: `app/src/components/Timeline.jsx`, `app/src/components/Timeline.test.jsx`

**Interfaces:**
- Consumes: `timelineEntries` de `../data/timeline`.
- Produces: `export default function Timeline()` (usado pela Task 15, `App`).

- [ ] **Step 1: Escrever o teste**

```jsx
import { render, screen } from '@testing-library/react'
import Timeline from './Timeline'
import { timelineEntries } from '../data/timeline'

describe('Timeline', () => {
  it('renders every entry label, hash and detail', () => {
    render(<Timeline />)

    timelineEntries.forEach((entry) => {
      expect(screen.getByText(entry.label)).toBeInTheDocument()
      expect(screen.getByText(entry.hash)).toBeInTheDocument()
      expect(screen.getByText(entry.detail)).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npm test -- Timeline`
Expected: FAIL — `Cannot find module './Timeline'`

- [ ] **Step 3: Implementar o componente**

```jsx
import { timelineEntries } from '../data/timeline'

export default function Timeline() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-mono text-sm text-accent">// 03. timeline</p>
      <h2 className="mt-2 text-2xl font-bold text-text">git log --formacao</h2>

      <ul className="mt-10 space-y-6 border-l border-white/10 pl-6">
        {timelineEntries.map((entry) => (
          <li key={entry.id} className="relative">
            <span className="absolute -left-[1.95rem] top-1 h-3 w-3 rounded-full bg-accent" />
            <p className="font-mono text-sm text-accent">{entry.hash}</p>
            <p className="mt-1 font-medium text-text">{entry.label}</p>
            <p className="text-sm text-text-muted">{entry.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npm test -- Timeline`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "feat: add Timeline section"
```

---

### Task 13: Componente `Projects`

**Files:**
- Create: `app/src/components/Projects.jsx`, `app/src/components/Projects.test.jsx`

**Interfaces:**
- Consumes: `projects` de `../data/projects`.
- Produces: `export default function Projects()` (usado pela Task 15, `App`).

- [ ] **Step 1: Escrever o teste**

```jsx
import { render, screen } from '@testing-library/react'
import Projects from './Projects'
import { projects } from '../data/projects'

describe('Projects', () => {
  it('renders a card with title, description and link for every project', () => {
    render(<Projects />)

    projects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument()
      expect(screen.getByText(project.description)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: new RegExp(project.title, 'i') })).toHaveAttribute(
        'href',
        project.url
      )
    })
  })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npm test -- Projects`
Expected: FAIL — `Cannot find module './Projects'`

- [ ] **Step 3: Implementar o componente**

```jsx
import { RiCodeSSlashLine } from 'react-icons/ri'
import { projects } from '../data/projects'

export default function Projects() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <p className="font-mono text-sm text-accent">// 04. projetos</p>
      <h2 className="mt-2 text-2xl font-bold text-text">Projetos</h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.id}
            className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-accent"
          >
            <RiCodeSSlashLine className="text-2xl text-accent" />
            <h3 className="mt-4 font-semibold text-text">{project.title}</h3>
            <p className="mt-2 flex-1 text-sm text-text-muted">{project.description}</p>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} - veja mais`}
              className="mt-6 font-mono text-sm text-accent hover:underline"
            >
              {project.title} - Veja mais →
            </a>
          </article>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npm test -- Projects`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "feat: add Projects section"
```

---

### Task 14: Componente `Footer`

**Files:**
- Create: `app/src/components/Footer.jsx`, `app/src/components/Footer.test.jsx`

**Interfaces:**
- Consumes: `SocialLinks` de `./SocialLinks`.
- Produces: `export default function Footer()` (usado pela Task 15, `App`).

- [ ] **Step 1: Escrever o teste**

```jsx
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the CV link and social icons', () => {
    render(<Footer />)

    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute('href', '/CV.pdf')
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npm test -- Footer`
Expected: FAIL — `Cannot find module './Footer'`

- [ ] **Step 3: Implementar o componente**

```jsx
import SocialLinks from './SocialLinks'

export default function Footer() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-16 text-center">
      <p className="font-mono text-sm text-accent">// 05. contato</p>
      <h2 className="text-2xl font-bold text-text">Vamos conversar?</h2>
      <a
        href="/CV.pdf"
        className="rounded-full bg-accent px-6 py-3 font-mono text-sm font-semibold text-bg transition hover:brightness-110"
      >
        Download CV
      </a>
      <SocialLinks />
      <p className="mt-6 text-xs text-text-muted">© {new Date().getFullYear()} Raphael Vinicius</p>
    </div>
  )
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npm test -- Footer`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "feat: add Footer section"
```

---

### Task 15: Montar `App.jsx`

**Files:**
- Modify: `app/src/App.jsx`
- Modify: `app/src/App.test.jsx` (substituir completamente o teste de scaffold)

**Interfaces:**
- Consumes: `Navbar`, `AnimatedSection`, `Hero`, `About`, `Skills`, `Timeline`, `Projects`, `Footer`.
- Produces: `export default function App()` — árvore final da aplicação.

- [ ] **Step 1: Substituir `app/src/App.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders navbar and all sections with their anchors', () => {
    render(<App />)

    expect(screen.getByText('raphael@portfolio:~$')).toBeInTheDocument()
    expect(document.getElementById('home')).not.toBeNull()
    expect(document.getElementById('sobre-mim')).not.toBeNull()
    expect(document.getElementById('skills')).not.toBeNull()
    expect(document.getElementById('timeline')).not.toBeNull()
    expect(document.getElementById('projetos')).not.toBeNull()
    expect(document.getElementById('contato')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npm test -- App`
Expected: FAIL — o `App.jsx` atual (do scaffold) ainda renderiza o conteúdo padrão do Vite, sem os ids esperados.

- [ ] **Step 3: Substituir `app/src/App.jsx`**

```jsx
import Navbar from './components/Navbar'
import AnimatedSection from './components/AnimatedSection'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Timeline from './components/Timeline'
import Projects from './components/Projects'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <AnimatedSection id="home">
          <Hero />
        </AnimatedSection>
        <AnimatedSection id="sobre-mim">
          <About />
        </AnimatedSection>
        <AnimatedSection id="skills">
          <Skills />
        </AnimatedSection>
        <AnimatedSection id="timeline">
          <Timeline />
        </AnimatedSection>
        <AnimatedSection id="projetos">
          <Projects />
        </AnimatedSection>
        <AnimatedSection id="contato">
          <Footer />
        </AnimatedSection>
      </main>
    </>
  )
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npm test`
Expected: PASS — todos os testes do app (dados, utilitário, hook, componentes e `App`) passam.

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "feat: assemble App with all sections"
```

---

### Task 16: Build de produção e QA manual final

**Files:**
- Nenhum arquivo novo — apenas verificação.

**Interfaces:**
- Consumes: app completo das Tasks 1-15.
- Produces: build de produção validado, pronto para revisão humana (deploy fica para uma etapa separada, fora de escopo desta spec).

- [ ] **Step 1: Rodar toda a suíte de testes**

Run: `npm test` (dentro de `app/`)
Expected: PASS — todos os testes.

- [ ] **Step 2: Rodar o build de produção**

Run: `npm run build` (dentro de `app/`)
Expected: build conclui sem erros, gera pasta `app/dist/`.

- [ ] **Step 3: QA manual no ambiente de desenvolvimento**

Run: `npm run dev` e abrir no navegador. Checklist manual:
- [ ] Efeito de digitação no Hero alterna entre PT e EN.
- [ ] Botão "Download CV" baixa/abre o PDF corretamente.
- [ ] Os 3 ícones sociais abrem os links corretos em nova aba.
- [ ] Navbar destaca a seção ativa ao rolar a página.
- [ ] Seção Skills mostra os ícones e nomes corretos, agrupados por categoria.
- [ ] Timeline exibe as 5 entradas na ordem esperada.
- [ ] Os 6 cards de projeto têm o link "Veja mais" apontando para o repositório correto.
- [ ] Layout responsivo: testar em largura de tela reduzida (~375px) e confirmar que nada quebra (sem overflow horizontal).

- [ ] **Step 4: Commit final (se houver ajustes do QA manual)**

```bash
cd "C:/Users/RaphaelDias/WebstormProjects/Raphael_Vinicius"
git add app
git commit -m "chore: final QA pass on React redesign"
```

Caso nenhum ajuste seja necessário, este passo pode ser pulado — a Task 15 já é o último commit funcional.

---

## Self-Review

- **Cobertura da spec:** Stack (Vite/React/Tailwind/Framer Motion/react-icons) ✅ Task 1-2, 8; estrutura de pastas com `data/` separado ✅ Task 3; Navbar/Hero/About/Skills/Timeline/Projects/Footer ✅ Tasks 7, 9-14; sistema visual (cores/fontes) ✅ Task 2; interações (typing, scroll-reveal, scroll-spy) ✅ Tasks 4, 5, 7, 8; assets reaproveitados ✅ Task 2; build de produção ✅ Task 16. Decisões em aberto da spec (cor de destaque, uso de `home.png`) foram resolvidas nas Global Constraints (verde `#3fb950`; `home.png` não utilizado, pois não fazia parte do site atual e não há seção que o requeira).
- **Placeholders:** nenhum "TBD"/"TODO" — todas as decisões em aberto da spec foram fechadas nas Global Constraints.
- **Consistência de tipos:** `getActiveSection(sections, scrollY, offset)` usado identicamente nas Tasks 4 e 7. `useTypingEffect(entries, options)` retorno `{ title, subtitle }` usado identicamente nas Tasks 5 e 9. Todos os `data/*.js` exportam exatamente os nomes usados pelos componentes que os consomem (`projects`, `skillCategories`, `timelineEntries`, `socialLinks`, `navSections`).

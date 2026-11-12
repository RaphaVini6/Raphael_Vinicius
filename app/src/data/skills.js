import {
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSharp,
  SiVuedotjs,
} from 'react-icons/si'

export const skillCategories = [
  {
    category: 'Linguagens e frameworks',
    items: [
      { name: 'PHP (Laravel, CakePHP)', Icon: SiPhp, certUrl: null },
      { name: 'JavaScript', Icon: SiJavascript, certUrl: null },
      { name: 'React', Icon: SiReact, certUrl: null },
      { name: 'Vue.js', Icon: SiVuedotjs, certUrl: null },
      { name: 'Next.js', Icon: SiNextdotjs, certUrl: null },
      { name: 'Node.js', Icon: SiNodedotjs, certUrl: null },
      { name: 'C#', Icon: SiSharp, certUrl: null },
      { name: 'Python (Flask, Django)', Icon: SiPython, certUrl: null },
      { name: 'Java', Icon: SiOpenjdk, certUrl: null },
    ],
  },
  {
    category: 'Arquitetura e padrões',
    items: [
      { name: 'MVC', Icon: null, certUrl: null },
      { name: 'Arquitetura Hexagonal', Icon: null, certUrl: null },
      { name: 'Clean Architecture', Icon: null, certUrl: null },
      { name: 'Domain-Driven Design (DDD)', Icon: null, certUrl: null },
    ],
  },
  {
    category: 'Bancos de dados',
    items: [
      { name: 'Oracle', Icon: null, certUrl: null },
      { name: 'PostgreSQL', Icon: SiPostgresql, certUrl: null },
      { name: 'Modelagem de dados', Icon: null, certUrl: null },
    ],
  },
  {
    category: 'IA e outros',
    items: [
      { name: 'Inteligência Artificial (RAG e agentes)', Icon: null, certUrl: null },
      { name: 'Automações', Icon: null, certUrl: null },
      { name: 'Operações CRUD', Icon: null, certUrl: null },
      { name: 'Aplicativos institucionais', Icon: null, certUrl: null },
    ],
  },
]

import { SiHtml5, SiCss, SiJavascript, SiReact, SiPython, SiMysql, SiGit, SiGithub } from 'react-icons/si'

export const skillCategories = [
  {
    category: 'Front-end',
    items: [
      { name: 'HTML5', Icon: SiHtml5, certUrl: null },
      { name: 'CSS3', Icon: SiCss, certUrl: null },
      { name: 'JavaScript', Icon: SiJavascript, certUrl: null },
      { name: 'React', Icon: SiReact, certUrl: null },
    ],
  },
  {
    category: 'Em aprofundamento',
    items: [
      { name: 'Python', Icon: SiPython, certUrl: null },
      { name: 'Bancos de Dados (SQL)', Icon: SiMysql, certUrl: null },
      { name: 'Inteligência Artificial / Machine Learning', Icon: null, certUrl: null },
    ],
  },
  {
    category: 'Fundamentos & Ferramentas',
    items: [
      { name: 'Estruturas de Dados', Icon: null, certUrl: null },
      { name: 'Git', Icon: SiGit, certUrl: null },
      { name: 'GitHub', Icon: SiGithub, certUrl: null },
    ],
  },
]

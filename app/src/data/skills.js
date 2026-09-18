import { SiHtml5, SiCss, SiJavascript, SiReact, SiPython, SiMysql, SiGit, SiGithub } from 'react-icons/si'

export const skillCategories = [
  {
    category: 'Front-end',
    items: [
      { name: 'HTML5', Icon: SiHtml5 },
      { name: 'CSS3', Icon: SiCss },
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

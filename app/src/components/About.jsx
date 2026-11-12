import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function About() {
  const [expanded, setExpanded] = useState(false)

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

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.p
              id="sobre-mim-detalhes"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden leading-relaxed text-text-muted"
            >
              Já coloquei a mão na massa em projetos como o reconhecimento de emoção por áudio
              usando Inteligência Artificial, implementações de Árvore Binária e Árvore AVL na
              disciplina de Estruturas de Dados Avançadas, e o desenvolvimento de uma landing page
              na disciplina de Laboratório de Engenharia de Software. Também já atuei em um
              projeto freelance de documentação por áudio com IA.
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          aria-controls="sobre-mim-detalhes"
          className="mt-4 font-mono text-sm text-accent transition hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {expanded ? '</> recolher' : '</> saiba mais'}
        </button>
      </div>
      <img
        src="/about.png"
        alt="Raphael Vinicius"
        width="224"
        height="224"
        loading="lazy"
        decoding="async"
        className="h-56 w-56 rounded-full border-4 border-border object-cover shadow-lg"
      />
    </div>
  )
}

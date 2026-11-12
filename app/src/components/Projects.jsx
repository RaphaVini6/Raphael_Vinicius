import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RiCloseLine, RiCodeSSlashLine } from 'react-icons/ri'
import { projects } from '../data/projects'

export default function Projects() {
  const [selectedId, setSelectedId] = useState(null)
  const triggerRef = useRef(null)
  const selectedProject = projects.find((project) => project.id === selectedId) ?? null

  const openProject = (project, event) => {
    triggerRef.current = event.currentTarget
    setSelectedId(project.id)
  }

  const closeProject = () => {
    setSelectedId(null)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!selectedProject) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeProject()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedProject])

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <p className="font-mono text-sm text-accent">// 04. projetos</p>
      <h2 className="mt-2 text-2xl font-bold text-text">Projetos</h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={(event) => openProject(project, event)}
            aria-label={`${project.title} - abrir detalhes`}
            className="flex flex-col items-start rounded-xl border border-border bg-surface p-6 text-left transition hover:-translate-y-1 hover:border-accent focus-visible:-translate-y-1 focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <RiCodeSSlashLine className="text-2xl text-accent" />
            <h3 className="mt-4 font-semibold text-text">{project.title}</h3>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeProject}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg rounded-xl border border-border bg-bg p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeProject}
                aria-label="Fechar"
                className="absolute right-4 top-4 text-text-muted transition hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <RiCloseLine className="text-2xl" />
              </button>

              <RiCodeSSlashLine className="text-2xl text-accent" />
              <h3 id="project-modal-title" className="mt-4 font-semibold text-text">
                {selectedProject.title}
              </h3>
              <p className="mt-2 text-sm text-text-muted">{selectedProject.description}</p>
              <a
                href={selectedProject.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${selectedProject.title} - veja mais`}
                className="mt-6 inline-block font-mono text-sm text-accent transition hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {selectedProject.title} - Veja mais →
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

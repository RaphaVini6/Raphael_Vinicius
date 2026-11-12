import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RiCloseLine, RiCodeSSlashLine } from 'react-icons/ri'
import { projects } from '../data/projects'

const MAX_TAGS = 3

function StatusBadge({ status }) {
  return (
    <span className="rounded-full border border-accent/50 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
      {status}
    </span>
  )
}

function Tags({ tags }) {
  const visible = tags.slice(0, MAX_TAGS)
  const extra = tags.length - visible.length

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tecnologias">
      {visible.map((tag) => (
        <li key={tag} className="rounded-md bg-surface px-2 py-1 font-mono text-xs text-text-muted">
          {tag}
        </li>
      ))}
      {extra > 0 && (
        <li className="rounded-md bg-surface px-2 py-1 font-mono text-xs text-text-muted">
          +{extra}
        </li>
      )}
    </ul>
  )
}

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default function Projects() {
  const [selectedId, setSelectedId] = useState(null)
  const triggerRef = useRef(null)
  const featuredProjects = projects.filter((project) => project.featured)
  const otherProjects = projects.filter((project) => !project.featured)
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
        {featuredProjects.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={(event) => openProject(project, event)}
            aria-label={`${project.title} - abrir detalhes`}
            className={`flex flex-col items-start gap-4 rounded-xl border border-border bg-surface p-6 text-left transition hover:-translate-y-1 hover:border-accent focus-visible:-translate-y-1 focus-visible:border-accent ${focusRing}`}
          >
            <div className="flex w-full items-center justify-between">
              <RiCodeSSlashLine className="text-2xl text-accent" />
              <StatusBadge status={project.status} />
            </div>
            <h3 className="font-semibold text-text">{project.title}</h3>
            <Tags tags={project.tags} />
          </button>
        ))}
      </div>

      <h3 className="mt-14 font-mono text-sm text-text-muted">// outros projetos</h3>
      <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
        {otherProjects.map((project) => (
          <li key={project.id}>
            <button
              type="button"
              onClick={(event) => openProject(project, event)}
              aria-label={`${project.title} - abrir detalhes`}
              className={`flex w-full flex-col items-start gap-3 px-5 py-4 text-left transition hover:bg-surface sm:flex-row sm:items-center sm:justify-between ${focusRing}`}
            >
              <span className="font-semibold text-text">{project.title}</span>
              <span className="flex flex-wrap items-center gap-3">
                <StatusBadge status={project.status} />
                <Tags tags={project.tags} />
              </span>
            </button>
          </li>
        ))}
      </ul>

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
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <StatusBadge status={selectedProject.status} />
              </div>
              <p className="mt-4 text-sm text-text-muted">{selectedProject.description}</p>
              <div className="mt-4">
                <Tags tags={selectedProject.tags} />
              </div>
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

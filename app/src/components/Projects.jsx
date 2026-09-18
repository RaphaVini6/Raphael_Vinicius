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

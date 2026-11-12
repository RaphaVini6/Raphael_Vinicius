import { educationEntries, experienceEntries } from '../data/experience'

export default function Experience() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-mono text-sm text-accent">// 03. experiência</p>
      <h2 className="mt-2 text-2xl font-bold text-text">git log --experiencia</h2>

      <ul className="mt-10 space-y-10 border-l border-border pl-6">
        {experienceEntries.map((entry) => (
          <li key={entry.id} className="relative">
            <span className="absolute -left-[1.95rem] top-1.5 h-3 w-3 rounded-full bg-accent" />
            <p className="font-mono text-xs text-accent">{entry.period}</p>
            <h3 className="mt-1 font-semibold text-text">{entry.role}</h3>
            <p className="text-sm text-text-muted">{entry.company}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-text-muted">
              {entry.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tecnologias">
              {entry.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md bg-surface px-2 py-1 font-mono text-xs text-text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <h3 className="mt-16 font-mono text-sm text-text-muted">// formação</h3>
      <ul className="mt-4 space-y-4">
        {educationEntries.map((entry) => (
          <li key={entry.id} className="rounded-xl border border-border bg-surface p-6">
            <p className="font-semibold text-text">{entry.title}</p>
            <p className="text-sm text-text-muted">{entry.institution}</p>
            <p className="mt-1 font-mono text-xs text-accent">{entry.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

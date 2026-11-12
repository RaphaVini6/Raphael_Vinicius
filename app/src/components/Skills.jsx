import { RiCodeSSlashLine, RiExternalLinkLine } from 'react-icons/ri'
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

                if (item.certUrl) {
                  return (
                    <li key={item.name}>
                      <a
                        href={item.certUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${item.name} - ver certificado`}
                        className="group flex items-center gap-3 rounded text-text transition hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        <Icon className="text-lg text-accent" />
                        <span>{item.name}</span>
                        <RiExternalLinkLine
                          className="text-sm text-text-muted transition group-hover:text-accent group-focus-visible:text-accent"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  )
                }

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

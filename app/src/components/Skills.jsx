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

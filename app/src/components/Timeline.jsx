import { timelineEntries } from '../data/timeline'

export default function Timeline() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-mono text-sm text-accent">// 03. timeline</p>
      <h2 className="mt-2 text-2xl font-bold text-text">git log --formacao</h2>

      <ul className="mt-10 space-y-6 border-l border-border pl-6">
        {timelineEntries.map((entry) => (
          <li key={entry.id} className="relative">
            <span className="absolute -left-[1.95rem] top-1 h-3 w-3 rounded-full bg-accent" />
            <p className="font-mono text-sm text-accent">{entry.hash}</p>
            <p className="mt-1 font-medium text-text">{entry.label}</p>
            <p className="text-sm text-text-muted">{entry.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

import { useTypingEffect } from '../hooks/useTypingEffect'
import SocialLinks from './SocialLinks'

const HERO_TEXTS = [
  { title: 'Olá, eu sou o Raphael Vinicius', subtitle: 'Desenvolvedor' },
  { title: 'Hello, I am Raphael Vinicius', subtitle: 'Developer' },
]

export default function Hero() {
  const { title, subtitle } = useTypingEffect(HERO_TEXTS)

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <div className="px-6 py-10 font-mono">
          <p className="text-sm text-text-muted">raphael@portfolio:~$</p>
          <h1 className="mt-2 text-2xl font-bold text-text sm:text-3xl">
            {title}
            <span className="animate-pulse text-accent">_</span>
          </h1>
          <h2 className="mt-2 text-lg text-accent">{subtitle}</h2>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-6">
        <a
          href="/CV.pdf"
          className="rounded-full bg-accent px-6 py-3 font-mono text-sm font-semibold text-bg transition hover:brightness-110"
        >
          Download CV
        </a>
        <SocialLinks />
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { navSections } from '../data/navSections'
import { getActiveSection } from '../utils/getActiveSection'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [active, setActive] = useState(navSections[0].id)

  useEffect(() => {
    function handleScroll() {
      const sections = navSections
        .map(({ id }) => {
          const el = document.getElementById(id)
          return el ? { id, offsetTop: el.offsetTop } : null
        })
        .filter(Boolean)

      const current = getActiveSection(sections, window.scrollY, 96)
      if (current) setActive(current)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between bg-bg/90 px-6 py-4 backdrop-blur">
      <span className="font-mono text-lg text-accent">raphael@portfolio:~$</span>
      <div className="flex items-center gap-6">
        <nav className="flex gap-6">
          {navSections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`font-mono text-sm transition ${
                active === id ? 'text-accent' : 'text-text-muted hover:text-text'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}

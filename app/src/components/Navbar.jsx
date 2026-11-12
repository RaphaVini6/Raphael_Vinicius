import { useEffect, useState } from 'react'
import { RiCloseLine, RiMenuLine } from 'react-icons/ri'
import { navSections } from '../data/navSections'
import { getActiveSection } from '../utils/getActiveSection'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [active, setActive] = useState(navSections[0].id)
  const [menuOpen, setMenuOpen] = useState(false)

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

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 w-full bg-bg/90 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="font-mono text-lg text-accent">raphael@portfolio:~$</span>
        <div className="flex items-center gap-4 lg:gap-6">
          <nav aria-label="Principal" className="hidden gap-6 lg:flex">
            {navSections.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`font-mono text-xs uppercase tracking-widest transition ${
                  active === id ? 'text-accent' : 'text-text-muted hover:text-text'
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
          <a
            href="#contato"
            className="hidden rounded-full border border-accent px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-accent transition hover:bg-accent hover:text-bg lg:inline-block"
          >
            Vamos conversar
          </a>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
          >
            {menuOpen ? <RiCloseLine /> : <RiMenuLine />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="menu-mobile"
          aria-label="Menu mobile"
          className="flex flex-col gap-4 border-t border-border px-6 py-4 lg:hidden"
        >
          {navSections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className={`font-mono text-xs uppercase tracking-widest transition ${
                active === id ? 'text-accent' : 'text-text-muted hover:text-text'
              }`}
            >
              {label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setMenuOpen(false)}
            className="w-fit rounded-full border border-accent px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-accent"
          >
            Vamos conversar
          </a>
        </nav>
      )}
    </header>
  )
}

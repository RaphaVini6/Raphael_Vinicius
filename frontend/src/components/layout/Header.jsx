import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AccessibilityMenu from '../AccessibilityMenu'
import LanguageSwitcher from '../LanguageSwitcher'
import BrandMark from '../BrandMark'

const LINKS = [
  { to: '/', key: 'home', end: true },
  { to: '/exhibits', key: 'exhibits' },
  { to: '/missions', key: 'missions' },
  { to: '/simulator', key: 'simulator' },
  { to: '/learn', key: 'learn' },
]

export default function Header() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label={t('brand.name')}>
          <BrandMark className="brand-mark" />
          <span>
            {t('brand.name')}
            <small>{t('brand.tagline')}</small>
          </span>
        </Link>

        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Main">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }} />}
                  {t(`nav.${l.key}`)}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="header-tools">
          <LanguageSwitcher />
          <AccessibilityMenu />
          <button type="button" className="icon-btn menu-toggle" aria-expanded={open} aria-label={t('nav.menu')} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}

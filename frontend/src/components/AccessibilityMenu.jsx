import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Accessibility } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePreferences } from '../context/Preferences'

function Switch({ checked, onChange, label }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className="switch" onClick={() => onChange(!checked)} />
}

export default function AccessibilityMenu() {
  const { t } = useTranslation()
  const { prefs, set } = usePreferences()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" className="icon-btn" aria-expanded={open} aria-label={t('a11y.open')} title={t('a11y.open')} onClick={() => setOpen((o) => !o)}>
        <Accessibility size={20} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="popover"
            role="dialog"
            aria-label={t('a11y.title')}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <h3>{t('a11y.title')}</h3>
            <div className="toggle-row">
              <span>{t('a11y.fontSize')}</span>
              <div className="font-steps">
                {['md', 'lg', 'xl'].map((size, i) => (
                  <button key={size} type="button" aria-pressed={prefs.fontSize === size} onClick={() => set('fontSize', size)} style={{ fontSize: 12 + i * 3 }}>
                    A
                  </button>
                ))}
              </div>
            </div>
            <div className="toggle-row">
              <span>
                {t('a11y.contrast')}
                <small>{t('a11y.contrastHint')}</small>
              </span>
              <Switch checked={prefs.contrast} onChange={(v) => set('contrast', v)} label={t('a11y.contrast')} />
            </div>
            <div className="toggle-row">
              <span>
                {t('a11y.motion')}
                <small>{t('a11y.motionHint')}</small>
              </span>
              <Switch checked={prefs.reduceMotion} onChange={(v) => set('reduceMotion', v)} label={t('a11y.motion')} />
            </div>
            <div className="toggle-row">
              <span>
                {t('a11y.libras')}
                <small>{t('a11y.librasHint')}</small>
              </span>
              <Switch checked={prefs.libras} onChange={(v) => set('libras', v)} label={t('a11y.libras')} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

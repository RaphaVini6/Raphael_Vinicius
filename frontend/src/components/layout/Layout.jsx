import { useEffect } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import Header from './Header'
import Footer from './Footer'
import Starfield from '../Starfield'
import VLibrasWidget from '../VLibrasWidget'

export default function Layout() {
  const { t } = useTranslation()
  const location = useLocation()
  const outlet = useOutlet()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <>
      <Starfield />
      <div className="app">
        <a href="#main" className="skip-link">
          {t('a11y.skip')}
        </a>
        <Header />
        <AnimatePresence mode="wait">
          <motion.main
            id="main"
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {outlet}
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
      <VLibrasWidget />
    </>
  )
}

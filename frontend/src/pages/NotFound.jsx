import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="container section" style={{ textAlign: 'center' }}>
      <motion.img
        src="/images/probes/pioneer-10.webp"
        alt=""
        style={{ width: 280, margin: '0 auto 30px' }}
        animate={{ rotate: [0, 8, -4, 0], y: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <h1 className="section-title">{t('notFound.title')}</h1>
      <p className="section-lead" style={{ margin: '14px auto 28px' }}>{t('notFound.lead')}</p>
      <Link to="/" className="btn btn-primary">{t('notFound.home')}</Link>
    </div>
  )
}

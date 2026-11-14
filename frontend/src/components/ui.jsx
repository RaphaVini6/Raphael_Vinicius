import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

// small shared pieces

export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}>
      {children}
    </Tag>
  )
}

export function StatusBadge({ status }) {
  const { t } = useTranslation()
  return (
    <span className={`badge badge-${status}`}>
      <span className="dot" />
      {t(`status.${status}`)}
    </span>
  )
}

export function DestinationBadge({ destination }) {
  const { t } = useTranslation()
  return <span className={`badge badge-${destination}`}>{t(`destination.${destination}`)}</span>
}

export function Loader() {
  const { t } = useTranslation()
  return (
    <div className="loader" role="status">
      <div className="loader-orbit" />
      <span className="sr-only">{t('common.loading')}</span>
    </div>
  )
}

export function ErrorBox({ onRetry }) {
  const { t } = useTranslation()
  return (
    <div className="error-box" role="alert">
      <p>{t('common.error')}</p>
      {onRetry && (
        <button type="button" className="btn btn-sm" style={{ marginTop: 12 }} onClick={onRetry}>
          {t('common.retry')}
        </button>
      )}
    </div>
  )
}

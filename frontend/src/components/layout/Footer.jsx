import { useTranslation } from 'react-i18next'
import BrandMark from '../BrandMark'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <BrandMark className="brand-mark" />
          <div>
            <strong style={{ color: 'var(--text)' }}>{t('brand.name')}</strong>
            <div>{t('footer.about')}</div>
          </div>
        </div>
        <div style={{ maxWidth: 460 }}>
          <div>{t('footer.data')}</div>
          <div>{t('footer.a11y')}</div>
        </div>
      </div>
    </footer>
  )
}

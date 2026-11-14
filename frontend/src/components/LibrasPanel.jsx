import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Hand, LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { translateProbeToLibras } from '../services/api'

// shows the Libras gloss of a probe (api-1-vlibras)
export function LibrasButton({ probeId, onResult }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  async function run() {
    setLoading(true)
    try {
      onResult(await translateProbeToLibras(probeId))
    } catch {
      onResult({ error: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button type="button" className="btn btn-sm" onClick={run} disabled={loading}>
      {loading ? <LoaderCircle size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Hand size={16} />}
      {t('common.libras')}
    </button>
  )
}

export function LibrasGloss({ result }) {
  const { t } = useTranslation()
  return (
    <AnimatePresence>
      {result && (
        <motion.div className="gloss" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} aria-live="polite">
          <small>{result.error ? t('common.error') : `${t('common.librasTitle')} · ${t('common.librasNote')}`}</small>
          {result.gloss}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

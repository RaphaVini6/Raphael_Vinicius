import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// runs an api call and re-runs it when the language (or deps) change
export function useApi(fn, deps = []) {
  const { i18n } = useTranslation()
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true, error: null }))
    fn()
      .then((data) => alive && setState({ data, error: null, loading: false }))
      .catch((error) => alive && setState({ data: null, error, loading: false }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.resolvedLanguage, attempt, ...deps])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])
  return { ...state, retry }
}

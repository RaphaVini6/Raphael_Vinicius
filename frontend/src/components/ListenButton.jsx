import { useEffect, useRef, useState } from 'react'
import { LoaderCircle, Square, Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { speakInBrowser } from '../services/api'

// plays narration from the backend (api-2-speech); falls back to the browser voice
// load(): Promise<blobUrl>   loadText(): Promise<string>
export default function ListenButton({ load, loadText, label }) {
  const { t } = useTranslation()
  const [state, setState] = useState('idle')
  const audio = useRef(null)

  useEffect(
    () => () => {
      audio.current?.pause()
      window.speechSynthesis?.cancel()
    },
    [],
  )

  function stop() {
    audio.current?.pause()
    audio.current = null
    window.speechSynthesis?.cancel()
    setState('idle')
  }

  async function play() {
    if (state !== 'idle') return stop()
    setState('loading')
    try {
      const url = await load()
      const a = new Audio(url)
      audio.current = a
      a.onended = () => setState('idle')
      await a.play()
      setState('playing')
    } catch {
      try {
        const text = await loadText()
        if (speakInBrowser(text)) {
          setState('playing')
          const timer = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
              clearInterval(timer)
              setState('idle')
            }
          }, 500)
          return
        }
      } catch {
        // nothing else to try
      }
      setState('idle')
    }
  }

  const Icon = state === 'loading' ? LoaderCircle : state === 'playing' ? Square : Volume2
  return (
    <button type="button" className="btn btn-sm" onClick={play} aria-pressed={state === 'playing'}>
      <Icon size={16} className={state === 'loading' ? 'spin' : ''} style={state === 'loading' ? { animation: 'spin 1s linear infinite' } : undefined} />
      {state === 'playing' ? t('common.stop') : label ?? t('common.listen')}
    </button>
  )
}

import { useEffect, useRef, useState } from 'react'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function useTypingEffect(
  entries,
  { typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000 } = {}
) {
  const reduceMotion = prefersReducedMotion()
  const [display, setDisplay] = useState(
    reduceMotion ? { title: entries[0].title, subtitle: entries[0].subtitle } : { title: '', subtitle: '' }
  )
  const entryIndex = useRef(0)
  const charIndex = useRef(0)
  const isDeleting = useRef(false)

  useEffect(() => {
    if (reduceMotion) return undefined

    let timeoutId

    function tick() {
      const current = entries[entryIndex.current]

      if (!isDeleting.current) {
        charIndex.current += 1
        setDisplay({
          title: current.title.substring(0, charIndex.current),
          subtitle: current.subtitle.substring(0, charIndex.current),
        })

        if (charIndex.current >= current.title.length) {
          timeoutId = setTimeout(() => {
            isDeleting.current = true
            tick()
          }, pauseTime)
        } else {
          timeoutId = setTimeout(tick, typingSpeed)
        }
      } else {
        charIndex.current -= 1
        setDisplay({
          title: current.title.substring(0, charIndex.current),
          subtitle: current.subtitle.substring(0, charIndex.current),
        })

        if (charIndex.current <= 0) {
          isDeleting.current = false
          entryIndex.current = (entryIndex.current + 1) % entries.length
          timeoutId = setTimeout(tick, typingSpeed)
        } else {
          timeoutId = setTimeout(tick, deletingSpeed)
        }
      }
    }

    timeoutId = setTimeout(tick, typingSpeed)

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return display
}

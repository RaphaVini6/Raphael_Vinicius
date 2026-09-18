import { useEffect, useRef, useState } from 'react'

export function useTypingEffect(
  entries,
  { typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000 } = {}
) {
  const [display, setDisplay] = useState({ title: '', subtitle: '' })
  const entryIndex = useRef(0)
  const charIndex = useRef(0)
  const isDeleting = useRef(false)

  useEffect(() => {
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

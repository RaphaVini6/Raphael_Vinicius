import { useEffect, useRef } from 'react'
import { usePreferences } from '../context/preferencesContext'

// canvas background: three layers of twinkling stars with scroll parallax and the odd shooting star
export default function Starfield() {
  const canvasRef = useRef(null)
  const { prefs } = usePreferences()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0
    let stars = []
    let shooting = null
    let frame = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round((width * height) / 5000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.2,
        depth: Math.random() * 0.6 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
        warm: Math.random() < 0.12,
      }))
    }

    const draw = (animate) => {
      ctx.clearRect(0, 0, width, height)
      const scroll = window.scrollY
      for (const s of stars) {
        if (animate) s.phase += s.speed
        const alpha = 0.35 + Math.sin(s.phase) * 0.3 + s.depth * 0.4
        const y = (((s.y - scroll * s.depth * 0.25) % height) + height) % height
        ctx.beginPath()
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = s.warm ? `rgba(255, 216, 150, ${alpha})` : `rgba(220, 230, 255, ${alpha})`
        ctx.fill()
      }
      if (!animate) return
      if (!shooting && Math.random() < 0.004) {
        shooting = { x: Math.random() * width * 0.7, y: Math.random() * height * 0.4, life: 0 }
      }
      if (shooting) {
        shooting.life += 1
        const len = 120
        const x = shooting.x + shooting.life * 9
        const y = shooting.y + shooting.life * 4
        const grad = ctx.createLinearGradient(x, y, x - len, y - len * 0.45)
        grad.addColorStop(0, `rgba(255, 230, 180, ${1 - shooting.life / 45})`)
        grad.addColorStop(1, 'rgba(255, 230, 180, 0)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - len, y - len * 0.45)
        ctx.stroke()
        if (shooting.life > 45) shooting = null
      }
    }

    const loop = () => {
      draw(true)
      frame = requestAnimationFrame(loop)
    }

    resize()
    if (prefs.reduceMotion) draw(false)
    else loop()

    const onResize = () => {
      resize()
      if (prefs.reduceMotion) draw(false)
    }
    const onScroll = () => prefs.reduceMotion && draw(false)
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [prefs.reduceMotion])

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />
}

import { renderHook, act } from '@testing-library/react'
import { useTypingEffect } from './useTypingEffect'

const entries = [
  { title: 'Oi', subtitle: 'Dev' },
  { title: 'Hi', subtitle: 'Eng' },
]

describe('useTypingEffect', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts empty and types characters over time', () => {
    const { result } = renderHook(() =>
      useTypingEffect(entries, { typingSpeed: 100, deletingSpeed: 50, pauseTime: 2000 })
    )

    expect(result.current).toEqual({ title: '', subtitle: '' })

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toEqual({ title: 'O', subtitle: 'D' })

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toEqual({ title: 'Oi', subtitle: 'De' })
  })

  it('pauses on the full text, then deletes it', () => {
    const { result } = renderHook(() =>
      useTypingEffect(entries, { typingSpeed: 100, deletingSpeed: 50, pauseTime: 2000 })
    )

    act(() => {
      vi.advanceTimersByTime(200) // types "Oi"
    })
    expect(result.current.title).toBe('Oi')

    act(() => {
      vi.advanceTimersByTime(2000) // pause, then first delete tick fires
    })
    expect(result.current.title).toBe('O')
  })

  it('cycles to the next entry after fully deleting', () => {
    const { result } = renderHook(() =>
      useTypingEffect(entries, { typingSpeed: 100, deletingSpeed: 50, pauseTime: 2000 })
    )

    act(() => {
      vi.advanceTimersByTime(200) // types "Oi"
      vi.advanceTimersByTime(2000) // pause
      vi.advanceTimersByTime(50) // delete 'i'
      vi.advanceTimersByTime(50) // delete 'O', charIndex reaches 0
      vi.advanceTimersByTime(100) // starts typing next entry: 'H'
    })

    expect(result.current.title).toBe('H')
  })
})

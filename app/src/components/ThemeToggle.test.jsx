import { fireEvent, render, screen } from '@testing-library/react'
import ThemeToggle from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    delete document.documentElement.dataset.theme
    window.localStorage.clear()
  })

  it('defaults to dark theme and offers to switch to light', () => {
    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: /ativar tema claro/i })).toBeInTheDocument()
  })

  it('switches to light theme on click, updates the document and persists the choice', () => {
    render(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button', { name: /ativar tema claro/i }))

    expect(screen.getByRole('button', { name: /ativar tema escuro/i })).toBeInTheDocument()
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(window.localStorage.getItem('theme')).toBe('light')
  })

  it('switches back to dark theme on a second click', () => {
    render(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button', { name: /ativar tema claro/i }))
    fireEvent.click(screen.getByRole('button', { name: /ativar tema escuro/i }))

    expect(screen.getByRole('button', { name: /ativar tema claro/i })).toBeInTheDocument()
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem('theme')).toBe('dark')
  })
})

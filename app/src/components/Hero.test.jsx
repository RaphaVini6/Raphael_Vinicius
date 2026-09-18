import { render, screen } from '@testing-library/react'
import Hero from './Hero'

describe('Hero', () => {
  it('renders the CV download link and social icons', () => {
    render(<Hero />)

    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute('href', '/CV.pdf')
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
  })
})

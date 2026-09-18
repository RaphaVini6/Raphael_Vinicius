import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the CV link and social icons', () => {
    render(<Footer />)

    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute('href', '/CV.pdf')
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
  })
})

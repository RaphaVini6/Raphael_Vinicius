import { render, screen } from '@testing-library/react'
import About from './About'

describe('About', () => {
  it('renders the bio text and photo', () => {
    render(<About />)

    expect(screen.getByText(/Raphael Vinicius, mas pode me chamar de Rafah/i)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /raphael vinicius/i })).toHaveAttribute(
      'src',
      '/about.png'
    )
  })
})

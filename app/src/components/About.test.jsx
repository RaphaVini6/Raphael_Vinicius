import { fireEvent, render, screen } from '@testing-library/react'
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

  it('expands to show extra bio detail on click and collapses again', () => {
    render(<About />)

    const toggle = screen.getByRole('button', { name: /saiba mais/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText(/reconhecimento de emoção por áudio/i)).not.toBeInTheDocument()

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/reconhecimento de emoção por áudio/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /recolher/i }))

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})

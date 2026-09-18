import { render, screen } from '@testing-library/react'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('renders a link for every nav section', () => {
    render(<Navbar />)

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#home')
    expect(screen.getByRole('link', { name: 'Sobre mim' })).toHaveAttribute('href', '#sobre-mim')
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills')
    expect(screen.getByRole('link', { name: 'Timeline' })).toHaveAttribute('href', '#timeline')
    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute('href', '#projetos')
    expect(screen.getByRole('link', { name: 'Contato' })).toHaveAttribute('href', '#contato')
  })
})

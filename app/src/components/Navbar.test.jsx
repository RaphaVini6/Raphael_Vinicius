import { fireEvent, render, screen } from '@testing-library/react'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('renders a link for every nav section', () => {
    render(<Navbar />)

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#home')
    expect(screen.getByRole('link', { name: 'Sobre mim' })).toHaveAttribute('href', '#sobre-mim')
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills')
    expect(screen.getByRole('link', { name: 'Experiência' })).toHaveAttribute('href', '#experiencia')
    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute('href', '#projetos')
    expect(screen.getByRole('link', { name: 'Contato' })).toHaveAttribute('href', '#contato')
  })

  it('opens and closes the mobile menu', () => {
    render(<Navbar />)

    const toggle = screen.getByRole('button', { name: 'Abrir menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('navigation', { name: 'Menu mobile' })).not.toBeInTheDocument()

    fireEvent.click(toggle)
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('navigation', { name: 'Menu mobile' })).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('navigation', { name: 'Menu mobile' })).not.toBeInTheDocument()
  })

  it('closes the mobile menu when a link is clicked', () => {
    render(<Navbar />)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    const mobileNav = screen.getByRole('navigation', { name: 'Menu mobile' })
    fireEvent.click(mobileNav.querySelector('a[href="#projetos"]'))

    expect(screen.queryByRole('navigation', { name: 'Menu mobile' })).not.toBeInTheDocument()
  })
})

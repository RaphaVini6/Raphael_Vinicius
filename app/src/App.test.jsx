import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders navbar and all sections with their anchors', () => {
    render(<App />)

    expect(screen.getAllByText('raphael@portfolio:~$').length).toBeGreaterThan(0)
    expect(document.getElementById('home')).not.toBeNull()
    expect(document.getElementById('sobre-mim')).not.toBeNull()
    expect(document.getElementById('skills')).not.toBeNull()
    expect(document.getElementById('timeline')).not.toBeNull()
    expect(document.getElementById('projetos')).not.toBeNull()
    expect(document.getElementById('contato')).not.toBeNull()
  })
})

import { render, screen } from '@testing-library/react'
import AnimatedSection from './AnimatedSection'

describe('AnimatedSection', () => {
  it('renders children inside a section with the given id', () => {
    render(
      <AnimatedSection id="home">
        <p>Conteúdo</p>
      </AnimatedSection>
    )

    const section = screen.getByText('Conteúdo').closest('section')
    expect(section).toHaveAttribute('id', 'home')
  })
})

import { render, screen } from '@testing-library/react'
import Skills from './Skills'
import { skillCategories } from '../data/skills'

describe('Skills', () => {
  it('renders every category heading and every skill name', () => {
    render(<Skills />)

    skillCategories.forEach((group) => {
      expect(screen.getByText(group.category)).toBeInTheDocument()
      group.items.forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument()
      })
    })
  })

  it('renders a skill without certUrl as plain text, not a link', () => {
    render(<Skills />)

    const skillWithoutCert = skillCategories[0].items[0]
    expect(screen.queryByRole('link', { name: new RegExp(skillWithoutCert.name, 'i') })).not.toBeInTheDocument()
  })
})

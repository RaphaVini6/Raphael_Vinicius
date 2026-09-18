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
})

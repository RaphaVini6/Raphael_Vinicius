import { render, screen } from '@testing-library/react'
import Experience from './Experience'
import { educationEntries, experienceEntries } from '../data/experience'

describe('Experience', () => {
  it('renders every role, company and period', () => {
    render(<Experience />)

    experienceEntries.forEach((entry) => {
      expect(screen.getByText(entry.role, { exact: true })).toBeInTheDocument()
      expect(screen.getByText(entry.period)).toBeInTheDocument()
    })
  })

  it('renders the education block', () => {
    render(<Experience />)

    educationEntries.forEach((entry) => {
      expect(screen.getByText(entry.title)).toBeInTheDocument()
      expect(screen.getByText(entry.detail)).toBeInTheDocument()
    })
  })
})

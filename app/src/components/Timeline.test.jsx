import { render, screen, within } from '@testing-library/react'
import Timeline from './Timeline'
import { timelineEntries } from '../data/timeline'

describe('Timeline', () => {
  it('renders every entry label, hash and detail, in order', () => {
    render(<Timeline />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(timelineEntries.length)

    timelineEntries.forEach((entry, index) => {
      const item = within(items[index])
      expect(item.getByText(entry.label)).toBeInTheDocument()
      expect(item.getByText(entry.hash)).toBeInTheDocument()
      expect(item.getByText(entry.detail)).toBeInTheDocument()
    })
  })
})

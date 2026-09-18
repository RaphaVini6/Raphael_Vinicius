import { timelineEntries } from './timeline'

describe('timeline data', () => {
  it('has at least 4 entries with hash, label and detail', () => {
    expect(timelineEntries.length).toBeGreaterThanOrEqual(4)
    timelineEntries.forEach((entry) => {
      expect(entry.hash).toMatch(/^[a-f0-9]{7}$/)
      expect(entry.label).toEqual(expect.any(String))
      expect(entry.detail).toEqual(expect.any(String))
    })
  })
})

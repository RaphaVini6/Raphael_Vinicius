import { educationEntries, experienceEntries } from './experience'

describe('experience data', () => {
  it('has experience entries with role, company, period, bullets and tags', () => {
    expect(experienceEntries.length).toBeGreaterThanOrEqual(1)
    experienceEntries.forEach((entry) => {
      expect(entry.role).toEqual(expect.any(String))
      expect(entry.company).toEqual(expect.any(String))
      expect(entry.period).toEqual(expect.any(String))
      expect(entry.bullets.length).toBeGreaterThan(0)
      expect(entry.tags.length).toBeGreaterThan(0)
    })
  })

  it('has education entries with title, institution and detail', () => {
    expect(educationEntries.length).toBeGreaterThanOrEqual(1)
    educationEntries.forEach((entry) => {
      expect(entry.title).toEqual(expect.any(String))
      expect(entry.institution).toEqual(expect.any(String))
      expect(entry.detail).toEqual(expect.any(String))
    })
  })
})

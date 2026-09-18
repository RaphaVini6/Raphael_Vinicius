import { socialLinks } from './socialLinks'

describe('socialLinks data', () => {
  it('has linkedin, github and instagram with valid hrefs', () => {
    const ids = socialLinks.map((link) => link.id)
    expect(ids).toEqual(['linkedin', 'github', 'instagram'])
    socialLinks.forEach((link) => {
      expect(link.href).toMatch(/^https:\/\//)
      expect(link.Icon).toBeDefined()
    })
  })
})

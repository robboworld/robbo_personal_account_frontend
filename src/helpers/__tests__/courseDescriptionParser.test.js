import { courseDescriptionParser } from '../courseDescriptionParser'

describe('courseDescriptionParser', () => {
  it('returns paragraph text from the .about section', () => {
    const overview = '<section class="about"><p>First <b>bold</b></p><p> Second </p><p></p></section>'
    expect(courseDescriptionParser({ overview })).toBe('First bold\nSecond')
  })

  it('returns empty text when there is no .about section or overview', () => {
    expect(courseDescriptionParser({ overview: '<div>no about</div>' })).toBe('')
    expect(courseDescriptionParser({})).toBe('')
    expect(courseDescriptionParser(null)).toBe('')
  })
})

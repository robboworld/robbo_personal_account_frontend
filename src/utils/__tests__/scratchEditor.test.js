import { getScratchEditorLabel, getScratchEditorUrl } from '../scratchEditor'

jest.mock('@/config', () => ({
  __esModule: true,
  default: { scratchURL: 'https://lk.example.org/scratch/' },
}))

describe('getScratchEditorUrl', () => {
  afterEach(() => window.localStorage.clear())

  it('passes the LK language to the editor', () => {
    window.localStorage.setItem('lk-language', 'en')
    expect(getScratchEditorUrl('p1')).toBe(
      'https://lk.example.org/scratch/?projectPageId=p1&locale=en',
    )
  })

  it('defaults to Russian and works without a project', () => {
    expect(getScratchEditorUrl()).toBe('https://lk.example.org/scratch/?locale=ru')
  })

  it('labels the editor by host and path only', () => {
    expect(getScratchEditorLabel()).toBe('lk.example.org/scratch')
  })
})

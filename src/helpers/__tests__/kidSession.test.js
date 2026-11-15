import { clearKidSession, getKidSession, rememberKidSession } from '@/helpers/kidSession'
import { qrPath } from '@/components/QrCode'

describe('kidSession', () => {
  beforeEach(() => clearKidSession())

  it('belongs to the child who signed in', () => {
    rememberKidSession({ userId: 1001, name: 'Маша К.', avatar: 3, classPage: '/c/abc123' })
    expect(getKidSession('1001')).toMatchObject({ name: 'Маша К.', classPage: '/c/abc123' })
    expect(getKidSession('2002')).toBeNull()
    expect(getKidSession()).toMatchObject({ userId: '1001' })
  })

  it('never sends anywhere but a class page', () => {
    rememberKidSession({ userId: '1', classPage: 'https://evil.example/c/x' })
    expect(getKidSession('1').classPage).toBeNull()
    rememberKidSession({ userId: '1', classPage: '//evil.example' })
    expect(getKidSession('1').classPage).toBeNull()
  })
})

describe('qrPath', () => {
  it('draws a square code with a quiet zone', () => {
    const { d, size } = qrPath('http://localhost:3030/c/card#AAAAAAAAAAAAAAAAAAAAAA')
    // Version 3 (29 modules) or more, plus four modules of margin on each side.
    expect(size).toBeGreaterThanOrEqual(29 + 8)
    expect(d.startsWith('M4,4')).toBe(true) // the top-left finder pattern
  })
})

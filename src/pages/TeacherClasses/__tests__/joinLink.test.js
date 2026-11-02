import { joinLink } from '../InviteDetails'

describe('joinLink', () => {
  it('uses the domain the page is open on, not the backend joinUrl', () => {
    expect(joinLink({ inviteSlug: 'abc', joinUrl: 'http://localhost:3030/join/abc' })).toBe(
      `${window.location.origin}/join/abc`,
    )
  })

  it('falls back to joinUrl without a slug', () => {
    expect(joinLink({ joinUrl: 'https://lk.example.org/join/x' })).toBe('https://lk.example.org/join/x')
    expect(joinLink({})).toBe('')
  })
})

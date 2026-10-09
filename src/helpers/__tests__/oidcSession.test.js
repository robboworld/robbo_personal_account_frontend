import { allowlistedReturnTo, resolveLoginReturnTo } from '../oidcSession'

describe('allowlistedReturnTo', () => {
  it.each([
    ['/projects/1', '/projects/1'],
    ['/projects/1?tab=info', '/projects/1?tab=info'],
    [`${window.location.origin}/home`, `${window.location.origin}/home`],
  ])('keeps safe target %s', (input, expected) => {
    expect(allowlistedReturnTo(input)).toBe(expected)
  })

  it.each([
    '',
    '//evil.example/phish',
    '/\\evil.example',
    '\\\\evil.example',
    '/%5Cevil.example',
    '/%5cevil.example',
    '/\tevil.example',
    '/home\nSet-Cookie: x',
    'javascript:alert(1)',
    'https://evil.example/steal',
    'https://scratch.example.com/',
  ])('rejects %p', input => {
    expect(allowlistedReturnTo(input)).toBe('/home')
  })
})

describe('OIDC_RETURN_TO_ORIGINS', () => {
  const saved = process.env.OIDC_RETURN_TO_ORIGINS
  afterEach(() => {
    process.env.OIDC_RETURN_TO_ORIGINS = saved
  })

  it('allows the listed sites and nothing else', () => {
    process.env.OIDC_RETURN_TO_ORIGINS = 'https://scratch.ru, https://other.example'
    expect(allowlistedReturnTo('https://scratch.ru/projects/5')).toBe('https://scratch.ru/projects/5')
    expect(allowlistedReturnTo('https://other.example/')).toBe('https://other.example/')
    expect(allowlistedReturnTo('http://scratch.ru/')).toBe('/home')
    expect(allowlistedReturnTo('https://evil.example/steal')).toBe('/home')
  })
})

describe('resolveLoginReturnTo', () => {
  it('decodes and validates return_to', () => {
    expect(resolveLoginReturnTo('?return_to=%2Fprojects%2F2')).toBe('/projects/2')
    expect(resolveLoginReturnTo('?return_to=%2F%5Cevil.example')).toBe('/home')
    expect(resolveLoginReturnTo('')).toBe('/home')
  })
})

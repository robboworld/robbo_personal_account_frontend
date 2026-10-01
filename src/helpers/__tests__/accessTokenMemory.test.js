describe('accessTokenMemory', () => {
  beforeEach(() => {
    jest.resetModules()
    localStorage.clear()
  })

  it('migrates a legacy localStorage token once and removes it', () => {
    localStorage.setItem('token', 'legacy-token')
    const { getAccessToken } = require('../accessTokenMemory')
    expect(getAccessToken()).toBe('legacy-token')
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('keeps the token in memory only', () => {
    const { getAccessToken, setAccessToken, clearAccessToken } = require('../accessTokenMemory')
    setAccessToken('abc')
    expect(getAccessToken()).toBe('abc')
    expect(localStorage.getItem('token')).toBeNull()
    clearAccessToken()
    expect(getAccessToken()).toBe('')
  })
})

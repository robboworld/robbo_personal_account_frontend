import { refreshAccessToken, tryRefreshAccessToken } from '@/api/authRefresh'
import { clearAccessToken, getAccessToken } from '@/helpers/accessTokenMemory'

const okResponse = token => ({ ok: true, json: async () => ({ accessToken: token }) })

describe('authRefresh', () => {
  beforeEach(() => {
    clearAccessToken()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    delete global.fetch
  })

  it('shares one request between concurrent callers and stores the token', async () => {
    let release
    global.fetch.mockReturnValue(new Promise(resolve => { release = resolve }))
    const calls = [refreshAccessToken(), refreshAccessToken(), tryRefreshAccessToken()]
    release(okResponse('new-token'))
    await expect(Promise.all(calls)).resolves.toEqual(['new-token', 'new-token', 'new-token'])
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch.mock.calls[0][0]).toMatch(/\/auth\/refresh$/)
    expect(global.fetch.mock.calls[0][1]).toMatchObject({ credentials: 'include' })
    expect(getAccessToken()).toBe('new-token')
  })

  it('rejects every waiter on failure and retries on the next call', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false })
    const first = refreshAccessToken()
    const second = refreshAccessToken()
    await expect(first).rejects.toThrow('Session expired')
    await expect(second).rejects.toThrow('Session expired')

    global.fetch.mockResolvedValueOnce(okResponse('after-retry'))
    await expect(refreshAccessToken()).resolves.toBe('after-retry')
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  it('tryRefreshAccessToken resolves null instead of throwing', async () => {
    global.fetch.mockResolvedValueOnce(okResponse(''))
    await expect(tryRefreshAccessToken()).resolves.toBeNull()
    expect(getAccessToken()).toBe('')
  })
})

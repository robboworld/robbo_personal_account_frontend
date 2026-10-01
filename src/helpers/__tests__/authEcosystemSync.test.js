import { startBffSessionWatch } from '@/helpers/authEcosystemSync'
import { fetchOidcStatus } from '@/helpers/oidcSession'

jest.mock('@/helpers/oidcSession', () => ({ fetchOidcStatus: jest.fn() }))

const setVisibility = state => {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state })
  document.dispatchEvent(new Event('visibilitychange'))
}

describe('startBffSessionWatch', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    fetchOidcStatus.mockReset()
    fetchOidcStatus.mockResolvedValue({ authenticated: true })
    setVisibility('visible')
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('does not poll while the tab is hidden and checks once it is visible again', async () => {
    const stop = startBffSessionWatch({ isAuthenticated: () => true, onSessionLost: jest.fn(), pollIntervalMs: 1000 })
    expect(fetchOidcStatus).toHaveBeenCalledTimes(1)

    setVisibility('hidden')
    await jest.advanceTimersByTimeAsync(5000)
    expect(fetchOidcStatus).toHaveBeenCalledTimes(1)

    setVisibility('visible')
    expect(fetchOidcStatus).toHaveBeenCalledTimes(2)
    stop()
  })

  it('reports a lost session', async () => {
    const onSessionLost = jest.fn()
    const stop = startBffSessionWatch({ isAuthenticated: () => true, onSessionLost, pollIntervalMs: 1000 })
    fetchOidcStatus.mockResolvedValue({ authenticated: false })
    await jest.advanceTimersByTimeAsync(1000)
    expect(onSessionLost).toHaveBeenCalledTimes(1)
    stop()
  })
})

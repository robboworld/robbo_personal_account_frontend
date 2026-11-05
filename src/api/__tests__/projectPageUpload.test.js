import { uploadProjectSb3 } from '@/api/projectPage'

describe('api/projectPage .sb3 uploads', () => {
  const file = new File(['x'], 'game.sb3')
  const { signal } = new AbortController()

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    })
  })

  afterEach(() => {
    delete global.fetch
  })

  it('hands the signal to fetch', async () => {
    await uploadProjectSb3('token', 'p1', file, signal)

    expect(fetch.mock.calls.map(([, init]) => init.signal)).toEqual([signal])
  })
})

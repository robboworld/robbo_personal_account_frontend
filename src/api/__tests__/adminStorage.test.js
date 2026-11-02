import instance from '@/api/instance'
import { getStorageOverview } from '@/api/adminStorage'

jest.mock('@/api/instance', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}))

describe('api/adminStorage', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns the overview and keeps a null volume', async () => {
    const data = {
      volume: null,
      totals: { projectsBytes: 1 },
      databases: { projectsBytes: 2 },
      top: [{ userId: 1 }],
    }
    instance.get.mockResolvedValueOnce({ data })
    await expect(getStorageOverview()).resolves.toEqual(data)
    expect(instance.get).toHaveBeenCalledWith('/api/admin/storage')
  })

  it('fills the gaps of an empty body', async () => {
    instance.get.mockResolvedValueOnce({ data: null })
    await expect(getStorageOverview()).resolves.toEqual({
      volume: null,
      totals: {},
      databases: {},
      top: [],
    })
  })
})

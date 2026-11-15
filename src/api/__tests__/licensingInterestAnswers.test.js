import instance from '@/api/instance'
import { listFeatureInterestAnswers } from '@/api/licensing'

jest.mock('@/api/instance', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}))

describe('api/licensing listFeatureInterestAnswers', () => {
  beforeEach(() => jest.clearAllMocks())

  it('asks the SuperAdmin endpoint with the page and returns answers and total', async () => {
    const answers = [{ role: 'parent', feature: 'club_showcase' }]
    instance.get.mockResolvedValueOnce({ data: { answers, total: 9 } })
    await expect(listFeatureInterestAnswers({ limit: 20, offset: 40 })).resolves.toEqual({
      answers,
      total: 9,
    })
    expect(instance.get).toHaveBeenCalledWith('licensing/interest/answers', {
      params: { limit: 20, offset: 40 },
      withCredentials: true,
    })
  })

  it('uses the first page of 50 by default', async () => {
    instance.get.mockResolvedValueOnce({ data: { answers: [], total: 0 } })
    await listFeatureInterestAnswers()
    expect(instance.get.mock.calls[0][1].params).toEqual({ limit: 50, offset: 0 })
  })

  it('fills the gaps of an empty body', async () => {
    instance.get.mockResolvedValueOnce({ data: null })
    await expect(listFeatureInterestAnswers()).resolves.toEqual({ answers: [], total: 0 })
  })

  it('lets the error through so the panel can show it', async () => {
    const error = new Error('forbidden')
    instance.get.mockRejectedValueOnce(error)
    await expect(listFeatureInterestAnswers()).rejects.toBe(error)
  })
})

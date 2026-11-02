import instance from '@/api/instance'
import { fetchWithAuthRetry, saveResponseBlob } from '@/api/projectPage'
import {
  deleteUserFile,
  deleteUserProject,
  downloadUserFile,
  downloadUserProject,
  getUserAudit,
  getUserContent,
} from '@/api/adminContent'
import { apiErrorMessageId } from '@/helpers/apiErrorMessage'

jest.mock('@/api/instance', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}))

jest.mock('@/api/projectPage', () => ({
  fetchWithAuthRetry: jest.fn(),
  saveResponseBlob: jest.fn(),
}))

const fetchResponse = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: 'x',
  text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
})

describe('api/adminContent', () => {
  beforeEach(() => jest.clearAllMocks())

  it('loads content and fills the gaps of an empty body', async () => {
    const usage = { usedBytes: 10, storageQuotaMb: 100 }
    instance.get.mockResolvedValueOnce({
      data: { usage, filesEnabled: true, projects: [{ id: 'p1' }], files: [{ id: 'f1' }] },
    })
    await expect(getUserContent(42)).resolves.toEqual({
      usage,
      filesEnabled: true,
      projects: [{ id: 'p1' }],
      files: [{ id: 'f1' }],
    })
    expect(instance.get).toHaveBeenCalledWith('/api/admin/users/42/content')

    instance.get.mockResolvedValueOnce({ data: null })
    await expect(getUserContent(42)).resolves.toEqual({
      usage: null,
      filesEnabled: false,
      projects: [],
      files: [],
    })
  })

  it('loads the audit log with a limit', async () => {
    instance.get.mockResolvedValueOnce({ data: { items: [{ id: 1 }] } })
    await expect(getUserAudit('u/1', 20)).resolves.toEqual([{ id: 1 }])
    expect(instance.get).toHaveBeenCalledWith('/api/admin/users/u%2F1/audit', {
      params: { limit: 20 },
    })

    instance.get.mockResolvedValueOnce({ data: {} })
    await expect(getUserAudit(1)).resolves.toEqual([])
  })

  it('downloads a project by POST with the reason and an .sb3 fallback name', async () => {
    const res = fetchResponse(200, '')
    fetchWithAuthRetry.mockResolvedValueOnce(res)
    await downloadUserProject(7, 'p1', 'ticket 12', 'Игра: v2')

    const [[url, init]] = fetchWithAuthRetry.mock.calls
    expect(url).toMatch(/\/api\/admin\/users\/7\/projects\/p1\/download$/)
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(init.body)).toEqual({ reason: 'ticket 12' })
    expect(saveResponseBlob).toHaveBeenCalledWith(res, 'Игра_ v2.sb3')
  })

  it('downloads a file with its own name as fallback', async () => {
    const res = fetchResponse(200, '')
    fetchWithAuthRetry.mockResolvedValueOnce(res)
    await downloadUserFile(7, 'f1', 'check', 'report.pdf')
    expect(fetchWithAuthRetry.mock.calls[0][0]).toMatch(
      /\/api\/admin\/users\/7\/files\/f1\/download$/,
    )
    expect(saveResponseBlob).toHaveBeenCalledWith(res, 'report.pdf')
  })

  it('turns a download error into a mapped backend code', async () => {
    fetchWithAuthRetry.mockResolvedValueOnce(
      fetchResponse(400, { error: 'reason required', code: 'REASON_REQUIRED' }),
    )
    const error = await downloadUserFile(7, 'f1', '', 'a.txt').catch(e => e)
    expect(error.response.status).toBe(400)
    expect(apiErrorMessageId(error)).toBe('errors.reason_required')
    expect(saveResponseBlob).not.toHaveBeenCalled()
  })

  it('deletes projects and files with the reason in the body', async () => {
    instance.delete.mockResolvedValue({ status: 204 })
    await deleteUserProject(7, 'p1', 'spam')
    await deleteUserFile(7, 'f1', 'spam')
    expect(instance.delete.mock.calls).toEqual([
      ['/api/admin/users/7/projects/p1', { data: { reason: 'spam' } }],
      ['/api/admin/users/7/files/f1', { data: { reason: 'spam' } }],
    ])
  })
})

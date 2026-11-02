import instance from '@/api/instance'
import { fetchWithAuthRetry, saveResponseBlob } from '@/api/projectPage'
import {
  ALLOWED_FILE_ACCEPT,
  deleteFile,
  downloadFile,
  isAllowedFileName,
  listFiles,
  uploadFile,
} from '@/api/userFiles'
import { apiErrorMessageId } from '@/helpers/apiErrorMessage'

jest.mock('@/api/instance', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}))

jest.mock('@/api/projectPage', () => ({
  fetchWithAuthRetry: jest.fn(),
  saveResponseBlob: jest.fn(),
}))

const fileRow = { id: 'f1', name: 'a.pdf', kind: 'document', mime: 'application/pdf' }

const fetchResponse = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: 'x',
  text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
})

describe('api/userFiles', () => {
  beforeEach(() => jest.clearAllMocks())

  it('lists files and tolerates an empty body', async () => {
    instance.get.mockResolvedValueOnce({ data: { files: [fileRow] } })
    await expect(listFiles()).resolves.toEqual([fileRow])
    expect(instance.get).toHaveBeenCalledWith('/api/files')

    instance.get.mockResolvedValueOnce({ data: null })
    await expect(listFiles()).resolves.toEqual([])
  })

  it('uploads one multipart field and reports progress', async () => {
    instance.post.mockImplementation(async (url, body, config) => {
      config.onUploadProgress({ loaded: 50, total: 200 })
      config.onUploadProgress({ loaded: 200, total: 200 })
      return { data: { file: fileRow } }
    })
    const file = new File(['x'.repeat(200)], 'a.pdf', { type: 'application/pdf' })
    const progress = jest.fn()

    await expect(uploadFile(file, progress)).resolves.toEqual(fileRow)

    const [[url, body, config]] = instance.post.mock.calls
    expect(url).toBe('/api/files')
    expect(body).toBeInstanceOf(FormData)
    expect(body.get('file')).toBe(file)
    // Without it axios serialises FormData as JSON (the instance default is application/json).
    expect(config.headers['Content-Type']).toBe('multipart/form-data')
    expect(config.timeout).toBeGreaterThan(30000)
    expect(progress.mock.calls).toEqual([[25], [100]])
  })

  it('downloads through fetch and saves with the file name as fallback', async () => {
    const res = fetchResponse(200, '')
    fetchWithAuthRetry.mockResolvedValueOnce(res)
    await downloadFile('id/1', 'report.pdf')
    expect(fetchWithAuthRetry.mock.calls[0][0]).toMatch(/\/api\/files\/id%2F1\/download$/)
    expect(saveResponseBlob).toHaveBeenCalledWith(res, 'report.pdf')
  })

  it('turns a download error body into a mapped backend code', async () => {
    fetchWithAuthRetry.mockResolvedValueOnce(
      fetchResponse(404, { error: 'file not found', code: 'FILE_NOT_FOUND' }),
    )
    const error = await downloadFile('gone', 'x.txt').catch(e => e)
    expect(error.response).toEqual({
      status: 404,
      data: { error: 'file not found', code: 'FILE_NOT_FOUND' },
    })
    expect(apiErrorMessageId(error)).toBe('errors.not_found')
    expect(saveResponseBlob).not.toHaveBeenCalled()
  })

  it('deletes by id', async () => {
    instance.delete.mockResolvedValueOnce({ status: 204 })
    await deleteFile('f1')
    expect(instance.delete).toHaveBeenCalledWith('/api/files/f1')
  })

  it('accepts only the allow-listed extensions', () => {
    expect(isAllowedFileName('Photo.JPG')).toBe(true)
    expect(isAllowedFileName('game.sb3')).toBe(true)
    for (const name of ['old.sb', 'game.sb2', 'blink.ino', 'part.STL', 'robot.FCStd', 'house.skp']) {
      expect(isAllowedFileName(name)).toBe(true)
    }
    expect(isAllowedFileName('page.html')).toBe(false)
    expect(isAllowedFileName('image.svg')).toBe(false)
    expect(isAllowedFileName('noext')).toBe(false)
    expect(ALLOWED_FILE_ACCEPT.split(',')).toHaveLength(22)
  })
})

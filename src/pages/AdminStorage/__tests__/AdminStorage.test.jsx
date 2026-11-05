import React from 'react'
import { fireEvent, screen } from '@testing-library/react'

import AdminStorage, { volumeState } from '@/pages/AdminStorage'
import { getStorageOverview } from '@/api/adminStorage'
import { renderPage } from '@/testUtils'

jest.mock('@/api/adminStorage', () => ({ getStorageOverview: jest.fn() }))
// The drawer's own content has its tests; here only which user it opens for matters.
jest.mock('@/components/AdminUserContent/AdminUserContent', () => ({
  __esModule: true,
  default: ({ userId }) => <div>content of {userId}</div>,
  AUDIT_ACTION_MESSAGE_IDS: {},
}))

const MB = 1024 * 1024
const GB = 1024 * MB

const overview = volume => ({
  volume,
  totals: {
    projectsBytes: 300 * MB,
    projectCount: 21,
    filesBytes: 200 * MB,
    fileCount: 5,
    ownersWithData: 3,
  },
  databases: { projectsBytes: 40 * MB, licensingBytes: 12 * MB },
  top: [
    {
      userId: 42,
      username: 'pupil42',
      fullName: 'Ученик Тестовый',
      projectsBytes: 30 * MB,
      filesBytes: 20 * MB,
      totalBytes: 50 * MB,
      quotaBytes: 100 * MB,
    },
    {
      userId: 7,
      username: 'teacher7',
      projectsBytes: MB,
      filesBytes: 0,
      totalBytes: MB,
      quotaBytes: 0,
    },
  ],
})

describe('AdminStorage', () => {
  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    // Responsive columns render only when every breakpoint matches.
    window.matchMedia = query => ({
      matches: true,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    })
  })

  beforeEach(() => jest.clearAllMocks())

  it('shows the volume, totals, databases and the top', async () => {
    getStorageOverview.mockResolvedValue(
      overview({
        totalBytes: 10 * GB,
        freeBytes: 4 * GB,
        uploadsStopBelowBytes: 500 * MB,
        alertBelowBytes: 5 * GB,
      }),
    )
    renderPage(<AdminStorage />)

    expect(await screen.findByText('pupil42')).toBeTruthy()
    expect(screen.getByText('Ниже порога оповещения')).toBeTruthy()
    expect(screen.getByText('6 ГБ / 10 ГБ')).toBeTruthy()
    expect(screen.getByText('21 проект')).toBeTruthy()
    expect(screen.getByText('5 файлов')).toBeTruthy()
    expect(screen.getByText('40 МБ')).toBeTruthy()
    expect(screen.getByText('без лимита')).toBeTruthy()
  })

  it('opens the user content in a drawer on the same page', async () => {
    getStorageOverview.mockResolvedValue(overview(null))
    renderPage(<AdminStorage />)

    await screen.findByText('pupil42')
    expect(screen.queryAllByRole('link')).toHaveLength(0)
    fireEvent.click(screen.getAllByText('Контент')[0])

    expect(await screen.findByText('content of 42')).toBeTruthy()
    expect(screen.getByText('Контент: pupil42 · Ученик Тестовый')).toBeTruthy()
    expect(getStorageOverview).toHaveBeenCalledTimes(1)
  })

  it('explains a missing volume when "My files" is off', async () => {
    getStorageOverview.mockResolvedValue(overview(null))
    renderPage(<AdminStorage />)
    expect(await screen.findByText('Раздел «Мои файлы» выключен, том не подключён.')).toBeTruthy()
  })

  it('shows an error with a retry', async () => {
    getStorageOverview.mockRejectedValue({
      response: { status: 403, data: { error: 'forbidden' } },
    })
    renderPage(<AdminStorage />)
    expect(await screen.findByText('Нет доступа к этому разделу или объекту.')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Повторить' })).toBeTruthy()
  })

  it('derives the volume state from the thresholds', () => {
    const v = { uploadsStopBelowBytes: 100, alertBelowBytes: 1000 }
    expect(volumeState(null)).toBe('ok')
    expect(volumeState({ ...v, freeBytes: 50 })).toBe('stop')
    expect(volumeState({ ...v, freeBytes: 500 })).toBe('alert')
    expect(volumeState({ ...v, freeBytes: 5000 })).toBe('ok')
  })
})

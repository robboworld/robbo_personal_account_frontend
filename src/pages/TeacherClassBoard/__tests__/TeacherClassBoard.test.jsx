import React from 'react'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'

import TeacherClassBoardPage from '@/pages/TeacherClassBoard'
import * as api from '@/api/teacherClass'
import { renderPage } from '@/testUtils'

jest.mock('@/api/teacherClass', () => ({
  getTeacherClass: jest.fn(),
  listMembers: jest.fn(),
  progressMatrix: jest.fn(),
  listAssignments: jest.fn(),
  listSubmissions: jest.fn(),
  reviewFileSubmission: jest.fn(),
  downloadSubmissionFile: jest.fn(),
  downloadStarterFile: jest.fn(),
}))
jest.mock('@/api/licensing', () => ({
  getEntitlements: jest.fn(() => Promise.resolve({ fileAssignmentsEnabled: true })),
}))
jest.mock('@/api/notifications', () => ({
  fetchTeacherNotificationQuota: jest.fn(),
  teacherSendNotification: jest.fn(),
}))
jest.mock('@apollo/client/react', () => ({ useQuery: () => ({ data: null }) }))
jest.mock('@/components/ScratchPlayerEmbed', () => () => null)

// antd Segmented and Table measure themselves; jsdom has no ResizeObserver.
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

afterAll(() => {
  delete global.ResizeObserver
})

const rowOf = name => screen.getByText(name).closest('tr')

// The board mounts many antd widgets: slow in jsdom, hence the longer timeouts.
describe('TeacherClassBoardPage work tab', () => {
  beforeEach(() => {
    api.getTeacherClass.mockResolvedValue({ data: { id: 'c1', displayName: '5A' } })
    api.listMembers.mockResolvedValue({
      data: {
        items: [
          { userId: '1', name: 'Аня' },
          { userId: '2', name: 'Боря' },
          { userId: '3', name: 'Вика' },
          { userId: '4', name: 'Гоша' },
        ],
      },
    })
    api.progressMatrix.mockResolvedValue({ data: { assignments: [], rows: [] } })
    api.listAssignments.mockResolvedValue({ data: { items: [{ id: 'a1', title: 'Лабиринт' }] } })
    api.listSubmissions.mockResolvedValue({
      data: {
        items: [
          // A teacher gets a draft without its project id.
          { ownerUserId: '1', reviewStatus: 'draft', updatedAt: '2026-11-01T10:00:00Z' },
          { ownerUserId: '2', projectId: 'p2', reviewStatus: 'submitted', late: true },
          { ownerUserId: '3', projectId: 'p3', reviewStatus: 'accepted' },
          // Left the class after handing in: the work stays reviewable.
          { ownerUserId: '9', projectId: 'p9', reviewStatus: 'submitted' },
        ],
      },
    })
  })

  it('opens on the review queue and filters the roster by status', async () => {
    renderPage(<TeacherClassBoardPage />)

    expect(await screen.findByText('Боря', {}, { timeout: 15000 })).toBeTruthy()
    expect(screen.queryByText('Аня')).toBeNull()
    expect(screen.queryByText('Вика')).toBeNull()
    expect(within(rowOf('Боря')).getByText('С опозданием')).toBeTruthy()
    expect(within(rowOf('Боря')).getByRole('button', { name: 'Проверить' })).toBeTruthy()
    expect(screen.getByText('На проверке · 2')).toBeTruthy()

    fireEvent.click(screen.getByText('Не сдали · 2'))
    expect(await screen.findByText('Аня')).toBeTruthy()
    expect(screen.getByText('Гоша')).toBeTruthy()
    // The draft shows its status and last save, but nothing to open.
    expect(within(rowOf('Аня')).getByText('Черновик')).toBeTruthy()
    expect(within(rowOf('Аня')).queryByRole('button')).toBeNull()
    expect(within(rowOf('Гоша')).getByText('Нет работы')).toBeTruthy()

    fireEvent.click(screen.getByText('Проверено · 1'))
    expect(await screen.findByText('Вика')).toBeTruthy()
    expect(screen.queryByText('Аня')).toBeNull()

    fireEvent.click(screen.getByText('Все · 5'))
    expect(await screen.findByText('Аня')).toBeTruthy()
  }, 30000)
})

describe('TeacherClassBoardPage file assignment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    api.getTeacherClass.mockResolvedValue({ data: { id: 'c1', displayName: '5A' } })
    api.listMembers.mockResolvedValue({
      data: {
        items: [
          { userId: '1', name: 'Аня' },
          { userId: '2', name: 'Боря' },
        ],
      },
    })
    api.progressMatrix.mockResolvedValue({ data: { assignments: [], rows: [] } })
    api.listAssignments.mockResolvedValue({
      data: {
        items: [
          {
            id: 'a1',
            title: 'Кронштейн',
            kind: 'file',
            allowedKinds: ['fcstd', 'stl'],
            maxFiles: 10,
            templateFile: { id: 'tpl', name: 'base.FCStd', sizeBytes: 100 },
          },
        ],
      },
    })
    api.listSubmissions.mockResolvedValue({
      data: {
        items: [
          // A draft comes without its files.
          { ownerUserId: '1', submissionId: 's1', reviewStatus: 'draft', title: 'Кронштейн' },
          {
            ownerUserId: '2',
            submissionId: 's2',
            reviewStatus: 'submitted',
            title: 'Кронштейн',
            files: [
              { id: 'f1', name: 'part.FCStd', sizeBytes: 2048 },
              { id: 'f2', name: 'part.stl', sizeBytes: 1024, hasScripts: false },
            ],
          },
        ],
      },
    })
    api.reviewFileSubmission.mockResolvedValue({})
    api.downloadSubmissionFile.mockResolvedValue()
  })

  it('reviews handed-in files and downloads them', async () => {
    renderPage(<TeacherClassBoardPage />)

    expect(await screen.findByText('Боря', {}, { timeout: 15000 })).toBeTruthy()
    expect(screen.getByText('Принимаются: .fcstd, .stl. Не больше 10 файлов.')).toBeTruthy()
    expect(screen.getByText('Стартовый файл')).toBeTruthy()
    expect(within(rowOf('Боря')).getByText('2 файла')).toBeTruthy()

    // Role queries crawl in a DOM this large: buttons are found by their text or label.
    fireEvent.click(within(rowOf('Боря')).getByText('Проверить'))
    expect(await screen.findByText('part.stl')).toBeTruthy()
    fireEvent.click(screen.getAllByLabelText('Скачать')[1])
    expect(api.downloadSubmissionFile).toHaveBeenCalledWith('s2', 'f2', 'part.stl')

    fireEvent.click(screen.getByText('Вернуть на доработку'))
    await waitFor(() =>
      expect(api.reviewFileSubmission).toHaveBeenCalledWith('s2', {
        status: 'returned',
        comment: '',
      }),
    )
  }, 30000)
})

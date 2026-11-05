import React from 'react'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'

import TeacherClassBoardPage from '@/pages/TeacherClassBoard'
import * as api from '@/api/teacherClass'
import { restoreStudentVersion } from '@/api/projectPage'
import { openScratchEditorInNewTab } from '@/utils/scratchEditor'
import { renderPage } from '@/testUtils'

jest.mock('@/api/teacherClass', () => ({
  getTeacherClass: jest.fn(),
  listMembers: jest.fn(),
  progressMatrix: jest.fn(),
  listAssignments: jest.fn(),
  listSubmissions: jest.fn(),
  deleteAssignment: jest.fn(),
  reviewFileSubmission: jest.fn(),
  downloadSubmissionFile: jest.fn(),
  downloadStarterFile: jest.fn(),
}))
jest.mock('@/api/projectPage', () => ({ restoreStudentVersion: jest.fn() }))
jest.mock('@/utils/scratchEditor', () => ({ openScratchEditorInNewTab: jest.fn() }))
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

  it('deletes the open assignment and moves on to the newest one left', async () => {
    api.listAssignments.mockResolvedValueOnce({
      data: {
        items: [
          { id: 'a0', title: 'Кот' },
          { id: 'a1', title: 'Лабиринт' },
        ],
      },
    })
    api.deleteAssignment.mockResolvedValue({})
    renderPage(<TeacherClassBoardPage />)

    expect(await screen.findByText('Боря', {}, { timeout: 15000 })).toBeTruthy()
    fireEvent.click(screen.getByText('Удалить задание'))
    expect(await screen.findByText('Удалить задание «Лабиринт»?')).toBeTruthy()
    api.listAssignments.mockResolvedValue({ data: { items: [{ id: 'a0', title: 'Кот' }] } })
    fireEvent.click(document.querySelector('.ant-popconfirm-buttons .ant-btn-dangerous'))

    await waitFor(() => expect(api.deleteAssignment.mock.calls.at(-1)?.[1]).toBe('a1'))
    await waitFor(() => expect(api.listSubmissions.mock.calls.at(-1)?.[1]).toBe('a0'))
  }, 30000)

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

  it('names who reviewed the work', async () => {
    api.listSubmissions.mockResolvedValue({
      data: {
        items: [
          {
            ownerUserId: '3',
            projectId: 'p3',
            reviewStatus: 'accepted',
            reviewedByName: 'Замена',
            reviewedAt: '2026-11-03T10:00:00Z',
          },
        ],
      },
    })
    renderPage(<TeacherClassBoardPage />)

    fireEvent.click(await screen.findByText('Проверено · 1', {}, { timeout: 15000 }))
    expect(within(rowOf('Вика')).getByText('Проверка: Замена')).toBeTruthy()
  }, 30000)

  it('opens the blocks of work on review and tells who changed them', async () => {
    api.listSubmissions.mockResolvedValue({
      data: {
        items: [
          {
            ownerUserId: '2',
            projectId: 'p2',
            reviewStatus: 'submitted',
            title: 'Лабиринт',
            canEdit: true,
            canRestore: true,
            editedByName: 'Замена',
            editedAt: '2026-11-03T10:00:00Z',
          },
        ],
      },
    })
    renderPage(<TeacherClassBoardPage />)

    await screen.findByText('Боря', {}, { timeout: 15000 })
    expect(within(rowOf('Боря')).getByText('Изменено: Замена')).toBeTruthy()
    fireEvent.click(within(rowOf('Боря')).getByRole('button', { name: 'Проверить' }))

    fireEvent.click(await screen.findByRole('button', { name: /Открыть блоки в Scratch/ }))
    expect(openScratchEditorInNewTab).toHaveBeenCalledWith('p2')
    expect(screen.getByText(/и ученик получит уведомление/)).toBeTruthy()

    // Coming back from the editor's tab brings in what was saved there.
    api.listSubmissions.mockClear()
    fireEvent(window, new Event('focus'))
    await waitFor(() => expect(api.listSubmissions).toHaveBeenCalled())

    restoreStudentVersion.mockResolvedValue({ ok: true })
    fireEvent.click(screen.getByRole('button', { name: /Вернуть работу ученика/ }))
    const confirm = await screen.findByRole('tooltip')
    fireEvent.click(within(confirm).getByRole('button', { name: 'Вернуть работу ученика' }))
    await waitFor(() => expect(restoreStudentVersion).toHaveBeenCalledWith('p2'))
  }, 90000)

  it('shows who is editing a work right now', async () => {
    api.listSubmissions.mockResolvedValue({
      data: {
        items: [
          {
            ownerUserId: '2',
            projectId: 'p2',
            reviewStatus: 'submitted',
            editors: [{ role: 'teacher', name: 'Замена' }],
          },
          {
            ownerUserId: '3',
            projectId: 'p3',
            reviewStatus: 'returned',
            editors: [{ role: 'student', name: 'Вика' }],
          },
        ],
      },
    })
    renderPage(<TeacherClassBoardPage />)

    fireEvent.click(await screen.findByText('Все · 4', {}, { timeout: 15000 }))
    expect(within(rowOf('Боря')).getByText('Сейчас редактирует учитель: Замена')).toBeTruthy()
    expect(within(rowOf('Вика')).getByText('Сейчас дорабатывает ученик')).toBeTruthy()
  }, 90000)

  it('lets the teacher only look at work that is back with the student', async () => {
    api.listSubmissions.mockResolvedValue({
      data: {
        items: [{ ownerUserId: '3', projectId: 'p3', reviewStatus: 'returned', title: 'Лабиринт' }],
      },
    })
    renderPage(<TeacherClassBoardPage />)

    fireEvent.click(await screen.findByText('Все · 4', {}, { timeout: 15000 }))
    fireEvent.click(within(rowOf('Вика')).getByRole('button', { name: 'Проверить' }))

    expect(await screen.findByRole('button', { name: /Открыть блоки в Scratch/ })).toBeTruthy()
    expect(screen.getByText(/сохранить изменения нельзя/)).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Вернуть работу ученика/ })).toBeNull()
  }, 90000)

  it('keeps the class settings from a co-teacher', async () => {
    api.getTeacherClass.mockResolvedValue({
      data: {
        id: 'c1',
        displayName: '5A',
        inviteCode: 'ABC123',
        ownerName: 'Владелец',
        coTeacherUntil: '2026-11-18T20:59:59Z',
      },
    })
    renderPage(<TeacherClassBoardPage />)

    expect(await screen.findByText(/^Со-преподаватель до /, {}, { timeout: 15000 })).toBeTruthy()
    // A co-teacher invites students, so the code stays.
    expect(screen.getByText('ABC123')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Действия с классом' }))
    expect(await screen.findByText('Со-преподаватели')).toBeTruthy()
    expect(screen.queryByText('Переименовать')).toBeNull()
    expect(screen.queryByText('Архивировать класс')).toBeNull()
  }, 30000)

  it('opens on the newest assignment', async () => {
    api.listAssignments.mockResolvedValue({
      data: {
        items: [
          { id: 'a1', title: 'Лабиринт' },
          { id: 'a2', title: 'Танец' },
        ],
      },
    })
    api.listSubmissions.mockClear()
    renderPage(<TeacherClassBoardPage />)

    const openedIds = () => api.listSubmissions.mock.calls.map(([, assignmentId]) => assignmentId)
    await waitFor(() => expect(openedIds()).toContain('a2'), { timeout: 15000 })
    expect(openedIds()).not.toContain('a1')
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
            submissionNote: 'Крепление в part.stl',
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
    expect(screen.getByText('Комментарий ученика')).toBeTruthy()
    expect(screen.getByText('Крепление в part.stl')).toBeTruthy()
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

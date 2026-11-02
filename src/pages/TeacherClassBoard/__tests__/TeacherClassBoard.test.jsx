import React from 'react'
import { fireEvent, screen, within } from '@testing-library/react'

import TeacherClassBoardPage from '@/pages/TeacherClassBoard'
import * as api from '@/api/teacherClass'
import { renderPage } from '@/testUtils'

jest.mock('@/api/teacherClass', () => ({
  getTeacherClass: jest.fn(),
  listMembers: jest.fn(),
  progressMatrix: jest.fn(),
  listAssignments: jest.fn(),
  listSubmissions: jest.fn(),
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

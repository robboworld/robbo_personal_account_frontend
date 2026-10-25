import React from 'react'
import { screen } from '@testing-library/react'

import StudentClassesPage from '@/pages/StudentClasses'
import * as api from '@/api/teacherClass'
import { renderPage } from '@/testUtils'

jest.mock('@/api/teacherClass', () => ({
  listStudentClasses: jest.fn(),
  listStudentAssignments: jest.fn(),
  joinClass: jest.fn(),
  submitProject: jest.fn(),
}))
jest.mock('@/utils/scratchEditor', () => ({ openScratchEditor: jest.fn() }))

describe('StudentClassesPage', () => {
  beforeEach(() => jest.clearAllMocks())

  it('shows one empty state without classes', async () => {
    api.listStudentClasses.mockResolvedValue({ data: { items: [] } })
    renderPage(<StudentClassesPage />)
    expect(await screen.findByText('Вы пока не состоите ни в одном классе')).toBeTruthy()
    expect(screen.queryByText('Нет данных')).toBeNull()
  })

  it('lists assignments with status, teacher comment and hand-in actions', async () => {
    api.listStudentClasses.mockResolvedValue({
      data: { items: [{ id: 'c1', displayName: 'Audit 5A', ownerName: 'audit_teacher' }] },
    })
    api.listStudentAssignments.mockResolvedValue({
      data: {
        items: [
          {
            id: 'a1',
            title: 'Лабиринт',
            myProjectId: 'p1',
            myReviewStatus: 'returned',
            myReviewComment: 'Добавь счёт',
          },
          { id: 'a2', title: 'Кот', myProjectId: '' },
          { id: 'a3', title: 'Музыка', myProjectId: 'p3', myReviewStatus: 'accepted' },
        ],
      },
    })
    renderPage(<StudentClassesPage />)

    expect(await screen.findByText('Лабиринт')).toBeTruthy()
    expect(api.listStudentAssignments).toHaveBeenCalledWith('c1')
    expect(screen.getByText('На доработке')).toBeTruthy()
    expect(screen.getByText('Добавь счёт')).toBeTruthy()
    expect(screen.getByText('Сдать снова')).toBeTruthy()
    expect(screen.getByText('Не выдано')).toBeTruthy()
    expect(screen.getByText('Принято')).toBeTruthy()
    // An accepted work cannot be handed in again.
    const accepted = screen.getAllByRole('button', { name: 'Сдать' })
    expect(accepted.every(button => button.disabled)).toBe(true)
  })
})

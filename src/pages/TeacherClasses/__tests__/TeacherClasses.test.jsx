import React from 'react'
import { screen } from '@testing-library/react'

import TeacherClassesPage from '@/pages/TeacherClasses'
import * as api from '@/api/teacherClass'
import { renderPage } from '@/testUtils'

jest.mock('@/api/teacherClass', () => ({
  listTeacherClasses: jest.fn(),
  listTeacherCourses: jest.fn(),
  createTeacherClass: jest.fn(),
}))

describe('TeacherClassesPage', () => {
  it('shows a single empty state with a create button', async () => {
    api.listTeacherClasses.mockResolvedValue({ data: { items: [] } })
    renderPage(<TeacherClassesPage />)
    expect(await screen.findByText('Классов пока нет')).toBeTruthy()
    expect(screen.queryByText('Нет данных')).toBeNull()
    expect(screen.getAllByRole('button', { name: /Создать класс/ }).length).toBe(2)
  })

  it('shows class cards in Russian', async () => {
    api.listTeacherClasses.mockResolvedValue({
      data: {
        items: [
          {
            id: 'c1',
            displayName: 'Audit 5A',
            edxCourseId: 'course-v1:R+S+1',
            inviteCode: '86PR-GG',
          },
        ],
      },
    })
    renderPage(<TeacherClassesPage />)
    expect(await screen.findByText('Audit 5A')).toBeTruthy()
    expect(screen.getByText('Пригласить')).toBeTruthy()
    expect(screen.getByText('Доска')).toBeTruthy()
  })
})

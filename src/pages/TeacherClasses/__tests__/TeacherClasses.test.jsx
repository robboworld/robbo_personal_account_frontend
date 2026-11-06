import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import TeacherClassesPage from '@/pages/TeacherClasses'
import * as api from '@/api/teacherClass'
import { renderPage } from '@/testUtils'

jest.mock('@/api/teacherClass', () => ({
  listTeacherClasses: jest.fn(),
  listTeacherCourses: jest.fn(),
  createTeacherClass: jest.fn(),
}))

// antd forms batch field updates through MessageChannel, which jsdom lacks. Set after the
// imports, so React's scheduler keeps its setTimeout path and only the form uses this.
class TimeoutMessageChannel {
  constructor() {
    this.port1 = { onmessage: null }
    this.port2 = { postMessage: () => setTimeout(() => this.port1.onmessage?.({})) }
  }
}

beforeAll(() => {
  global.MessageChannel = TimeoutMessageChannel
})

afterAll(() => {
  delete global.MessageChannel
})

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

  it('creates a class without the LMS by default', async () => {
    api.listTeacherClasses.mockResolvedValue({ data: { items: [] } })
    api.createTeacherClass.mockResolvedValue({ data: { id: 'c2', displayName: 'Кружок' } })
    renderPage(<TeacherClassesPage />)
    fireEvent.click((await screen.findAllByRole('button', { name: /Создать класс/ }))[0])
    expect(screen.queryByText('Курс')).toBeNull()
    expect(screen.queryByText('Зачем привязывать класс к LMS')).toBeNull()
    fireEvent.change(screen.getByPlaceholderText('10А'), { target: { value: 'Кружок' } })
    fireEvent.click(screen.getAllByRole('button', { name: /Создать класс/ }).pop())
    await waitFor(() =>
      expect(api.createTeacherClass).toHaveBeenCalledWith({
        displayName: 'Кружок',
        linkLms: false,
        courseId: '',
      }),
    )
    expect(api.listTeacherCourses).not.toHaveBeenCalled()
  })

  it('asks for a course and explains the link once it is checked', async () => {
    api.listTeacherClasses.mockResolvedValue({ data: { items: [] } })
    api.listTeacherCourses.mockResolvedValue({ data: { items: [] } })
    renderPage(<TeacherClassesPage />)
    fireEvent.click((await screen.findAllByRole('button', { name: /Создать класс/ }))[0])
    fireEvent.click(screen.getByRole('checkbox', { name: /Привязать к курсу в LMS/ }))
    expect(await screen.findByText('Зачем привязывать класс к LMS')).toBeTruthy()
    expect(await screen.findByPlaceholderText('course-v1:Robbo+Scratch+2026')).toBeTruthy()
  })
})

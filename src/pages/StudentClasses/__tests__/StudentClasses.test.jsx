import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import StudentClassesPage from '@/pages/StudentClasses'
import * as api from '@/api/teacherClass'
import { renderPage } from '@/testUtils'

jest.mock('@/api/teacherClass', () => ({
  listStudentClasses: jest.fn(),
  listStudentAssignments: jest.fn(),
  joinClass: jest.fn(),
  leaveClass: jest.fn(),
  submitProject: jest.fn(),
  submitAssignmentFiles: jest.fn(),
  detachAssignmentFile: jest.fn(),
  attachAssignmentFile: jest.fn(),
  downloadStarterFile: jest.fn(),
}))
jest.mock('@/utils/scratchEditor', () => ({ openScratchEditor: jest.fn() }))

// antd Popconfirm measures itself; jsdom has no ResizeObserver.
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

describe('StudentClassesPage', () => {
  beforeEach(() => jest.clearAllMocks())

  it('tells about a wrong class code', async () => {
    api.listStudentClasses.mockResolvedValue({ data: { items: [] } })
    api.joinClass.mockRejectedValue({ response: { status: 404, data: { error: 'not found' } } })
    renderPage(<StudentClassesPage />)

    fireEvent.change(await screen.findByLabelText('Код класса'), { target: { value: 'nope-00' } })
    fireEvent.click(screen.getByRole('button', { name: 'Вступить' }))

    expect(
      await screen.findByText('Класса с таким кодом нет. Проверьте код или спросите его у учителя.'),
    ).toBeTruthy()
    expect(api.joinClass).toHaveBeenCalledWith({ code: 'NOPE-00' })
    expect(screen.getByLabelText('Код класса').value).toBe('NOPE-00')
  })

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

  it('does not let a draft be handed in once the teacher closed the assignment', async () => {
    api.listStudentClasses.mockResolvedValue({
      data: { items: [{ id: 'c1', displayName: 'Audit 5A' }] },
    })
    api.listStudentAssignments.mockResolvedValue({
      data: {
        items: [
          {
            id: 'a1',
            title: 'Лабиринт',
            myProjectId: 'p1',
            myReviewStatus: 'draft',
            closedAt: '2026-11-01T10:00:00Z',
          },
        ],
      },
    })
    renderPage(<StudentClassesPage />)

    expect(await screen.findByText('Приём закрыт')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Сдать' }).disabled).toBe(true)
  })

  it('hands in the files of a file assignment', async () => {
    api.listStudentClasses.mockResolvedValue({
      data: { items: [{ id: 'c1', displayName: 'Audit 5A' }] },
    })
    api.listStudentAssignments.mockResolvedValue({
      data: {
        items: [
          {
            id: 'a1',
            title: 'Кронштейн',
            kind: 'file',
            allowedKinds: ['fcstd', 'stl'],
            maxFiles: 10,
            templateFile: { id: 'tpl', name: 'base.FCStd', sizeBytes: 100 },
            mySubmissionId: 's1',
            myReviewStatus: 'draft',
            myFiles: [{ id: 'f1', name: 'part.stl', sizeBytes: 1024 }],
          },
          { id: 'a2', title: 'Скетч', kind: 'file', allowedKinds: ['ino'], maxFiles: 10 },
        ],
      },
    })
    api.submitAssignmentFiles.mockResolvedValue({})
    api.detachAssignmentFile.mockResolvedValue({})
    renderPage(<StudentClassesPage />)

    expect(await screen.findByText('part.stl')).toBeTruthy()
    expect(screen.getByText('Принимаются: .fcstd, .stl. Не больше 10 файлов.')).toBeTruthy()
    expect(screen.getByText('Стартовый файл')).toBeTruthy()
    // Nothing attached yet: nothing to hand in.
    expect(screen.getByText('Файлов пока нет')).toBeTruthy()
    const [withFiles, empty] = screen.getAllByText('Сдать').map(el => el.closest('button'))
    expect(withFiles.disabled).toBe(false)
    expect(empty.disabled).toBe(true)

    fireEvent.click(screen.getByLabelText('Убрать «part.stl» из работы'))
    await waitFor(() => expect(api.detachAssignmentFile).toHaveBeenCalledWith('a1', 'f1'))

    // The confirm popup has its own "Сдать".
    fireEvent.click(withFiles)
    await waitFor(() => expect(document.querySelector('.ant-popconfirm')).toBeTruthy())
    fireEvent.click(document.querySelector('.ant-popconfirm .ant-btn-primary'))
    await waitFor(() => expect(api.submitAssignmentFiles).toHaveBeenCalledWith('a1'))
  }, 30000)

  it('leaves a class after confirmation and drops it from the list', async () => {
    api.listStudentClasses
      .mockResolvedValueOnce({ data: { items: [{ id: 'c1', displayName: 'Audit 5A' }] } })
      .mockResolvedValueOnce({ data: { items: [] } })
    api.listStudentAssignments.mockResolvedValue({ data: { items: [] } })
    api.leaveClass.mockResolvedValue({})
    renderPage(<StudentClassesPage />)

    fireEvent.click(await screen.findByRole('button', { name: 'Покинуть класс' }))
    expect(await screen.findByText('Покинуть класс «Audit 5A»?')).toBeTruthy()
    expect(api.leaveClass).not.toHaveBeenCalled()

    fireEvent.click(document.querySelector('.ant-popconfirm .ant-btn-primary'))
    await waitFor(() => expect(api.leaveClass).toHaveBeenCalledWith('c1'))
    expect(await screen.findByText('Вы пока не состоите ни в одном классе')).toBeTruthy()
  }, 30000)

  it('keeps the class when leaving fails', async () => {
    api.listStudentClasses.mockResolvedValue({
      data: { items: [{ id: 'c1', displayName: 'Audit 5A' }] },
    })
    api.listStudentAssignments.mockResolvedValue({ data: { items: [] } })
    api.leaveClass.mockRejectedValue(new Error('network'))
    renderPage(<StudentClassesPage />)

    fireEvent.click(await screen.findByRole('button', { name: 'Покинуть класс' }))
    await waitFor(() => expect(document.querySelector('.ant-popconfirm')).toBeTruthy())
    fireEvent.click(document.querySelector('.ant-popconfirm .ant-btn-primary'))

    expect(await screen.findByText('Не удалось покинуть класс')).toBeTruthy()
    expect(api.listStudentClasses).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Audit 5A')).toBeTruthy()
  }, 30000)

  it('shows handed-in files read-only', async () => {
    api.listStudentClasses.mockResolvedValue({
      data: { items: [{ id: 'c1', displayName: 'Audit 5A' }] },
    })
    api.listStudentAssignments.mockResolvedValue({
      data: {
        items: [
          {
            id: 'a1',
            title: 'Кронштейн',
            kind: 'file',
            allowedKinds: [],
            maxFiles: 10,
            mySubmissionId: 's1',
            myReviewStatus: 'submitted',
            myFiles: [{ id: 'f1', name: 'part.stl', sizeBytes: 1024 }],
          },
        ],
      },
    })
    renderPage(<StudentClassesPage />)

    expect(await screen.findByText('part.stl')).toBeTruthy()
    expect(screen.getByText('На проверке')).toBeTruthy()
    expect(screen.queryByLabelText('Убрать «part.stl» из работы')).toBeNull()
    expect(screen.queryByText('Выбрать из «Моих файлов»')).toBeNull()
    expect(screen.getByText('Сдать').closest('button').disabled).toBe(true)
  }, 30000)
})

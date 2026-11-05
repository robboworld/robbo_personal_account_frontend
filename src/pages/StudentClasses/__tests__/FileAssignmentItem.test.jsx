import React from 'react'
import axios from 'axios'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import FileAssignmentItem from '@/pages/StudentClasses/FileAssignmentItem'
import { attachAssignmentFile, updateFileNote } from '@/api/teacherClass'
import { getEntitlements } from '@/api/licensing'
import { downloadFile, uploadFile } from '@/api/userFiles'
import { renderPage } from '@/testUtils'

jest.mock('@/api/teacherClass', () => ({
  attachAssignmentFile: jest.fn(),
  detachAssignmentFile: jest.fn(),
  submitAssignmentFiles: jest.fn(),
  updateFileNote: jest.fn(),
  downloadStarterFile: jest.fn(),
}))
jest.mock('@/api/licensing', () => ({ getEntitlements: jest.fn() }))
jest.mock('@/api/userFiles', () => ({
  ...jest.requireActual('@/api/userFiles'),
  downloadFile: jest.fn(),
  listFiles: jest.fn(),
  uploadFile: jest.fn(),
}))

const assignment = over => ({
  id: 'a1',
  title: 'Кронштейн',
  allowedKinds: ['stl'],
  maxFiles: 3,
  myFiles: [{ id: 'f1', name: 'part.stl', sizeBytes: 100 }],
  ...over,
})

describe('FileAssignmentItem', () => {
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

  beforeEach(() => {
    jest.clearAllMocks()
    getEntitlements.mockResolvedValue(null)
  })

  /** Each upload hangs until cancelled; finish[name]() ends it as a success. */
  const hangingUploads = () => {
    const finish = {}
    uploadFile.mockImplementation(
      (file, onProgress, signal) =>
        new Promise((resolve, reject) => {
          onProgress(10)
          finish[file.name] = () => resolve({ id: file.name, name: file.name })
          signal.addEventListener('abort', () => reject(new axios.CanceledError()))
        }),
    )
    return finish
  }

  const drop = (container, ...names) =>
    fireEvent.change(container.querySelector('input[type=file]'), {
      target: { files: names.map(name => new File(['x'], name)) },
    })

  it('cancels a queued file without sending it, and the next one still goes', async () => {
    const finish = hangingUploads()
    const onChanged = jest.fn()
    const { container } = renderPage(
      <FileAssignmentItem assignment={assignment({ maxFiles: 5 })} onChanged={onChanged} />,
    )
    drop(container, 'a.stl', 'b.stl', 'c.stl')
    expect(await screen.findByText('Загружаем «a.stl»')).toBeTruthy()
    expect(await screen.findByText('В очереди: «b.stl»')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Отменить загрузку «b.stl»' }))
    await waitFor(() => expect(screen.queryByText('В очереди: «b.stl»')).toBeNull())

    finish['a.stl']()
    await screen.findByText('Загружаем «c.stl»')
    expect(uploadFile.mock.calls.map(([file]) => file.name)).toEqual(['a.stl', 'c.stl'])
  })

  it('cancels the file being sent: nothing is attached, the next one starts', async () => {
    hangingUploads()
    const { container } = renderPage(
      <FileAssignmentItem assignment={assignment({ maxFiles: 5 })} onChanged={jest.fn()} />,
    )
    drop(container, 'a.stl', 'b.stl')
    await screen.findByText('Загружаем «a.stl»')

    fireEvent.click(screen.getByRole('button', { name: 'Отменить загрузку «a.stl»' }))

    await screen.findByText('Загружаем «b.stl»')
    expect(attachAssignmentFile).not.toHaveBeenCalled()
  })

  it('gives a cancelled file its place in the limit back at once', async () => {
    hangingUploads()
    const { container } = renderPage(
      <FileAssignmentItem assignment={assignment({ maxFiles: 3 })} onChanged={jest.fn()} />,
    )
    drop(container, 'a.stl', 'b.stl')
    await screen.findByText('В очереди: «b.stl»')
    fireEvent.click(screen.getByRole('button', { name: 'Отменить загрузку «b.stl»' }))
    await waitFor(() => expect(screen.queryByText('В очереди: «b.stl»')).toBeNull())

    drop(container, 'c.stl')
    expect(await screen.findByText('В очереди: «c.stl»')).toBeTruthy()
  })

  it.each([
    ['draft', ''],
    ['handed in', 'submitted'],
  ])('lets the student download their own file: %s', async (_, status) => {
    renderPage(
      <FileAssignmentItem
        assignment={assignment({ myReviewStatus: status })}
        onChanged={jest.fn()}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Скачать' }))
    await waitFor(() => expect(downloadFile).toHaveBeenCalledWith('f1', 'part.stl'))
  })

  it('adds a note to files on review, and refreshes when the teacher got there first', async () => {
    updateFileNote.mockRejectedValue({
      response: { status: 409, data: { error: 'work_not_on_review' } },
    })
    const onChanged = jest.fn()
    renderPage(
      <FileAssignmentItem
        assignment={assignment({ myReviewStatus: 'submitted' })}
        onChanged={onChanged}
      />,
    )
    fireEvent.click(screen.getByText('Добавить комментарий').closest('button'))
    fireEvent.change(await screen.findByLabelText('Комментарий для учителя (необязательно)'), {
      target: { value: 'Крепление в part.stl' },
    })
    fireEvent.click(document.querySelector('.ant-modal .ant-btn-primary'))
    await waitFor(() => expect(updateFileNote).toHaveBeenCalledWith('a1', 'Крепление в part.stl'))
    expect(
      await screen.findByText('Учитель уже проверил работу, поэтому комментарий изменить нельзя.'),
    ).toBeTruthy()
    expect(onChanged).toHaveBeenCalled()
  })

  it.each([
    [1, 'Не больше 1 файла.'],
    [3, 'Не больше 3 файлов.'],
    [21, 'Не больше 21 файла.'],
  ])('declines the file limit: %i', (maxFiles, text) => {
    renderPage(<FileAssignmentItem assignment={assignment({ maxFiles })} onChanged={jest.fn()} />)
    expect(screen.getByText(content => content.includes(text))).toBeTruthy()
  })
})

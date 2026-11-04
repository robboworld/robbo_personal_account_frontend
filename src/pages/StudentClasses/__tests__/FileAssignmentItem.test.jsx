import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import FileAssignmentItem from '@/pages/StudentClasses/FileAssignmentItem'
import { downloadFile } from '@/api/userFiles'
import { renderPage } from '@/testUtils'

jest.mock('@/api/teacherClass', () => ({
  attachAssignmentFile: jest.fn(),
  detachAssignmentFile: jest.fn(),
  submitAssignmentFiles: jest.fn(),
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

  beforeEach(() => jest.clearAllMocks())

  it.each([
    ['draft', ''],
    ['handed in', 'submitted'],
  ])('lets the student download their own file: %s', async (_, status) => {
    renderPage(
      <FileAssignmentItem assignment={assignment({ myReviewStatus: status })} onChanged={jest.fn()} />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Скачать' }))
    await waitFor(() => expect(downloadFile).toHaveBeenCalledWith('f1', 'part.stl'))
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

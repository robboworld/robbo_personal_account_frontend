import React from 'react'
import { screen } from '@testing-library/react'

import StudentClassesPage from '@/pages/StudentClasses'
import * as api from '@/api/teacherClass'
import { useIsKidAccount } from '@/helpers/kidAccount'
import { renderPage } from '@/testUtils'

jest.mock('@/api/teacherClass', () => ({
  listStudentClasses: jest.fn(),
  listStudentAssignments: jest.fn(),
  joinClass: jest.fn(),
  leaveClass: jest.fn(),
}))
jest.mock('@/helpers/kidAccount', () => ({
  ...jest.requireActual('@/helpers/kidAccount'),
  useIsKidAccount: jest.fn(() => false),
}))
jest.mock('@/utils/scratchEditor', () => ({ openScratchEditor: jest.fn() }))

describe('StudentClassesPage of a kid account', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    api.listStudentClasses.mockResolvedValue({ data: { items: [{ id: 'c1', displayName: '2Б' }] } })
    api.listStudentAssignments.mockResolvedValue({ data: { items: [] } })
  })

  it('shows other classes locked and offers no way out of the home class', async () => {
    useIsKidAccount.mockReturnValue(true)
    renderPage(<StudentClassesPage />)

    expect(await screen.findByText('2Б')).toBeTruthy()
    expect(screen.getByTestId('full-account-locked').textContent).toContain(
      'Другие классы откроются с полным аккаунтом.',
    )
    expect(screen.queryByText('Вступить по коду')).toBeNull()
    expect(screen.queryByRole('textbox')).toBeNull()
    expect(screen.queryByText('Покинуть класс')).toBeNull()
  })

  it('keeps joining and leaving for a full account', async () => {
    useIsKidAccount.mockReturnValue(false)
    renderPage(<StudentClassesPage />)

    expect(await screen.findByText('2Б')).toBeTruthy()
    expect(screen.queryByTestId('full-account-locked')).toBeNull()
    expect(screen.getByText('Вступить по коду')).toBeTruthy()
    expect(screen.getByRole('textbox')).toBeTruthy()
    expect(screen.getByText('Покинуть класс')).toBeTruthy()
  })
})

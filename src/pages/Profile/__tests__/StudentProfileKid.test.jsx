import React from 'react'
import { screen } from '@testing-library/react'

import StudentProfile from '@/pages/Profile/StudentProfile'
import { useIsKidAccount } from '@/helpers/kidAccount'
import { renderPage } from '@/testUtils'

jest.mock('@/helpers/kidAccount', () => ({
  ...jest.requireActual('@/helpers/kidAccount'),
  useIsKidAccount: jest.fn(() => false),
}))
// The full form (antd selects) needs browser APIs jsdom lacks; here only which card is shown matters.
jest.mock('@/components/ProfileCard', () => ({
  __esModule: true,
  default: () => <div data-testid='profile-form' />,
}))
jest.mock('@/components/UserBanPanel', () => ({ __esModule: true, default: () => null }))

const data = {
  loading: false,
  GetUser: {
    userHttp: {
      id: '5',
      email: 'k-abc@kids.robbo.invalid',
      nickname: 'k-abc',
      fullName: 'Маша К.',
      createdAt: '2026-11-01T10:00:00Z',
    },
  },
}

describe('StudentProfile of a kid account', () => {
  beforeEach(() => jest.clearAllMocks())

  it('shows what the teacher typed and takes nothing about the child', () => {
    useIsKidAccount.mockReturnValue(true)
    const update = jest.fn()
    renderPage(<StudentProfile data={data} UpdateStudent={update} accessUpdate={false} />)

    const card = screen.getByTestId('kid-profile')
    expect(card.textContent).toContain('Маша К.')
    expect(card.textContent).toContain('Данные аккаунта класса вносит учитель.')
    expect(screen.getByTestId('full-account-banner')).toBeTruthy()
    expect(screen.getByText('Только просмотр')).toBeTruthy()
    // No field to type or pick in, no save, and not the stand-in address.
    expect(screen.queryByRole('textbox')).toBeNull()
    expect(screen.queryByRole('combobox')).toBeNull()
    expect(screen.queryByText('Сохранить')).toBeNull()
    expect(document.body.textContent).not.toContain('kids.robbo.invalid')
  })

  it('keeps the editable form for a full account', () => {
    useIsKidAccount.mockReturnValue(false)
    renderPage(<StudentProfile data={data} UpdateStudent={jest.fn()} accessUpdate={false} />)

    expect(screen.queryByTestId('kid-profile')).toBeNull()
    expect(screen.getByTestId('profile-form')).toBeTruthy()
    expect(screen.queryByTestId('full-account-banner')).toBeNull()
  })

  it('keeps the admin form when an admin opens a kid account', () => {
    useIsKidAccount.mockReturnValue(true)
    renderPage(
      <StudentProfile
        data={data}
        UpdateStudent={jest.fn()}
        accessUpdate={false}
        peekUserId='5'
        peekUserRole={0}
      />,
    )

    expect(screen.queryByTestId('kid-profile')).toBeNull()
    expect(screen.getByTestId('profile-form')).toBeTruthy()
  })
})

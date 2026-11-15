import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import UserModerationPage from '@/pages/UserModeration'
import * as api from '@/api/users'
import { renderPage } from '@/testUtils'

jest.mock('@/api/users', () => ({
  listLmsUsers: jest.fn(),
  searchLmsUsers: jest.fn(),
}))
jest.mock('@/components/AdminUserContent', () => ({ AdminUserContentDrawer: () => null }))

const users = (from, count) =>
  Array.from({ length: count }, (_, i) => ({
    id: String(from - i),
    username: `user${from - i}`,
    isActive: true,
    role: 0,
  }))

describe('UserModerationPage', () => {
  beforeEach(() => jest.clearAllMocks())

  it('shows the newest users right away and pages on from the last one', async () => {
    api.listLmsUsers.mockResolvedValueOnce(users(120, 50)).mockResolvedValueOnce(users(70, 3))
    renderPage(<UserModerationPage />)

    expect(await screen.findByText('user120')).toBeTruthy()
    expect(api.searchLmsUsers).not.toHaveBeenCalled()
    expect(api.listLmsUsers).toHaveBeenCalledWith({ limit: 50, includeInactive: true })

    fireEvent.click(screen.getByRole('button', { name: 'Показать ещё' }))

    expect(await screen.findByText('user68')).toBeTruthy()
    expect(screen.getByText('user120')).toBeTruthy()
    expect(api.listLmsUsers).toHaveBeenLastCalledWith({
      limit: 50,
      beforeId: '71',
      includeInactive: true,
    })
    // A short page is the last one.
    expect(screen.queryByRole('button', { name: 'Показать ещё' })).toBeNull()
  })

  it('searches when a query is typed and does not offer more pages', async () => {
    api.listLmsUsers.mockResolvedValue(users(120, 50))
    api.searchLmsUsers.mockResolvedValue([
      { id: '7', username: 'ivanov', isActive: false, role: 0 },
    ])
    renderPage(<UserModerationPage />)
    await screen.findByText('user120')

    fireEvent.change(screen.getByPlaceholderText('Имя пользователя, email или ФИО'), {
      target: { value: 'iva' },
    })

    expect(await screen.findByText('ivanov')).toBeTruthy()
    expect(api.searchLmsUsers).toHaveBeenCalledWith('iva', 30, { includeInactive: true })
    expect(screen.queryByText('user120')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Показать ещё' })).toBeNull()
  })

  it('says so when there are no users at all', async () => {
    api.listLmsUsers.mockResolvedValue([])
    renderPage(<UserModerationPage />)

    await waitFor(() => expect(screen.getByText('Никого не нашли')).toBeTruthy())
  })
})

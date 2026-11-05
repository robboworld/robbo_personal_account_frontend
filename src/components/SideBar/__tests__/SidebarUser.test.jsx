import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { useQuery } from '@apollo/client/react'

import SidebarUserInfo from '@/components/SideBar/SidebarUser'
import { FREE_LISTENER, TEACHER } from '@/constants'
import { renderPage } from '@/testUtils'

jest.mock('@apollo/client/react', () => ({
  ...jest.requireActual('@apollo/client/react'),
  useQuery: jest.fn(),
}))

describe('SidebarUserInfo role tooltip', () => {
  beforeAll(() => {
    // antd's tooltip popup needs it; jsdom has none.
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  })

  beforeEach(() => {
    useQuery.mockReturnValue({ data: { GetUser: { userHttp: { fullName: 'Анна Иванова' } } } })
  })

  it('opens on the role icon', async () => {
    renderPage(<SidebarUserInfo role={TEACHER} />)

    fireEvent.mouseEnter(screen.getByTestId('sidebar-role-icon'))

    expect((await screen.findByRole('tooltip')).textContent).toBe('учитель')
  })

  it('does not open on the name', async () => {
    renderPage(<SidebarUserInfo role={TEACHER} />)

    fireEvent.mouseEnter(screen.getByText('Анна Иванова'))
    fireEvent.mouseEnter(screen.getByTestId('sidebar-user'))

    await new Promise(resolve => setTimeout(resolve, 200))
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('names the user on the icon when the sidebar is collapsed', async () => {
    renderPage(<SidebarUserInfo role={TEACHER} collapsed />)

    fireEvent.mouseEnter(screen.getByTestId('sidebar-role-icon'))

    expect((await screen.findByRole('tooltip')).textContent).toBe('Анна Иванова · учитель')
  })

  it('shows a free listener the name only', () => {
    renderPage(<SidebarUserInfo role={FREE_LISTENER} />)

    expect(screen.getByText('Анна Иванова')).toBeTruthy()
    expect(screen.queryByTestId('sidebar-role-icon')).toBeNull()
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import FullAccountPage from '@/pages/FullAccount'
import { useIsKidAccount } from '@/helpers/kidAccount'
import { installMatchMedia } from '@/testUtils'
import ru from '@/lang/ru.json'

jest.mock('@/helpers/kidAccount', () => ({
  ...jest.requireActual('@/helpers/kidAccount'),
  useIsKidAccount: jest.fn(() => true),
}))

const renderAt = () => {
  installMatchMedia()
  return render(
    <IntlProvider locale='ru' messages={ru} onError={() => {}}>
      <MemoryRouter initialEntries={['/full-account']}>
        <Routes>
          <Route path='/full-account' element={<FullAccountPage />} />
          <Route path='/home' element={<div>home page</div>} />
        </Routes>
      </MemoryRouter>
    </IntlProvider>,
  )
}

describe('FullAccountPage', () => {
  it('tells a child what opens and shows the parents where to register', () => {
    useIsKidAccount.mockReturnValue(true)
    renderAt()

    expect(screen.getByText('Полный аккаунт открывает всё')).toBeTruthy()
    expect(screen.getByText('Курсы LMS')).toBeTruthy()
    expect(screen.getByText('Вход из дома')).toBeTruthy()

    const parents = screen.getByTestId('full-account-parents')
    expect(parents.textContent).toContain('Для родителей')
    expect(parents.textContent).toContain(`${window.location.host}/register`)
    // Honest about what a new account does not get.
    expect(parents.textContent).toContain('пока не переносятся')
    expect(screen.getByRole('img', { name: 'QR-код со ссылкой на регистрацию' })).toBeTruthy()
  })

  it('sends a full account home: it has all of this already', () => {
    useIsKidAccount.mockReturnValue(false)
    renderAt()

    expect(screen.getByText('home page')).toBeTruthy()
    expect(screen.queryByTestId('full-account-parents')).toBeNull()
  })
})

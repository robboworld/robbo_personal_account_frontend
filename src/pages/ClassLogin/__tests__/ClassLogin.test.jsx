import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import ClassLoginPage from '@/pages/ClassLogin'
import * as api from '@/api/kidLogin'
import { CLASS_LOGIN_ROUTE } from '@/constants'
import { getKidSession, clearKidSession } from '@/helpers/kidSession'
import { installMatchMedia } from '@/testUtils'
import ru from '@/lang/ru.json'

jest.mock('@/api/kidLogin', () => ({
  getClassLoginPage: jest.fn(),
  loginWithPictures: jest.fn(),
}))

const SLUG = 'abcdefghijklmnop'

const renderPage = () => {
  installMatchMedia()
  return render(
    <IntlProvider locale='ru' messages={ru} onError={() => {}}>
      <MemoryRouter initialEntries={[`/c/${SLUG}`]}>
        <Routes>
          <Route path={CLASS_LOGIN_ROUTE} element={<ClassLoginPage />} />
        </Routes>
      </MemoryRouter>
    </IntlProvider>,
  )
}

const tap = (...names) =>
  names.forEach(name => fireEvent.click(screen.getByRole('button', { name })))

const openPage = {
  data: {
    className: '2Б',
    open: true,
    kids: [
      { userId: '1001', name: 'Маша К.', avatar: 3 },
      { userId: '1002', name: 'Петя С.', avatar: 7 },
    ],
  },
}

describe('ClassLoginPage', () => {
  const { location } = window

  beforeEach(() => {
    jest.clearAllMocks()
    clearKidSession()
    delete window.location
    window.location = { ...location, assign: jest.fn() }
  })

  afterAll(() => {
    window.location = location
  })

  it('asks to wait while the teacher keeps sign-in closed', async () => {
    api.getClassLoginPage.mockResolvedValue({ data: { className: '2Б', open: false, kids: [] } })
    renderPage()
    expect(await screen.findByText('Подожди: сейчас учитель откроет вход')).toBeTruthy()
    expect(screen.queryByText('Маша К.')).toBeNull()
  })

  it('signs a child in with two pictures and remembers the class page', async () => {
    api.getClassLoginPage.mockResolvedValue(openPage)
    api.loginWithPictures.mockResolvedValue({
      data: { userId: '1001', name: 'Маша К.', avatar: 3, classPage: `/c/${SLUG}` },
    })
    renderPage()

    fireEvent.click(await screen.findByText('Маша К.'))
    tap('Ракета', 'Яблоко', 'Яблоко', 'Мяч')
    expect(api.loginWithPictures).not.toHaveBeenCalled()
    tap('Зонтик')

    await waitFor(() => expect(window.location.assign).toHaveBeenCalledWith('/myclasses'))
    expect(api.loginWithPictures).toHaveBeenCalledWith(SLUG, '1001', [3, 0, 0, 5, 8])
    expect(getKidSession('1001')).toMatchObject({ name: 'Маша К.', classPage: `/c/${SLUG}` })
  })

  it('erases the last picture before sending', async () => {
    api.getClassLoginPage.mockResolvedValue(openPage)
    api.loginWithPictures.mockResolvedValue({ data: { userId: '1002', classPage: `/c/${SLUG}` } })
    renderPage()

    fireEvent.click(await screen.findByText('Петя С.'))
    tap('Солнце', 'Звезда', 'Дом', 'Мяч')
    tap('Стереть последнюю')
    tap('Дерево', 'Машина')

    await waitFor(() =>
      expect(api.loginWithPictures).toHaveBeenCalledWith(SLUG, '1002', [1, 2, 4, 6, 7]),
    )
  })

  it('says the pictures were wrong and lets the child try again', async () => {
    api.getClassLoginPage.mockResolvedValue(openPage)
    api.loginWithPictures.mockRejectedValue({
      response: { status: 403, data: { error: 'bad_pictures' } },
    })
    renderPage()

    fireEvent.click(await screen.findByText('Петя С.'))
    tap('Солнце', 'Звезда', 'Дом', 'Мяч', 'Дерево')

    expect(await screen.findByText('Не те картинки. Попробуй ещё раз')).toBeTruthy()
    expect(window.location.assign).not.toHaveBeenCalled()
  })

  it('sends a locked child to the teacher', async () => {
    api.getClassLoginPage.mockResolvedValue(openPage)
    api.loginWithPictures.mockRejectedValue({
      response: { status: 403, data: { error: 'kid_locked' } },
    })
    renderPage()

    fireEvent.click(await screen.findByText('Петя С.'))
    tap('Дом', 'Мяч', 'Дом', 'Мяч', 'Дом')

    expect(await screen.findByText('Позови учителя')).toBeTruthy()
  })
})

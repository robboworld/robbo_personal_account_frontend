import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import CodeEntryPage from '@/pages/ClassLogin/CodeEntry'
import * as api from '@/api/kidLogin'
import { CLASS_LOGIN_CODE_LINK_ROUTE, CLASS_LOGIN_CODE_ROUTE } from '@/constants'
import { installMatchMedia } from '@/testUtils'
import ru from '@/lang/ru.json'

jest.mock('@/api/kidLogin', () => ({ getRoomByCode: jest.fn() }))

const renderAt = url => {
  installMatchMedia()
  return render(
    <IntlProvider locale='ru' messages={ru} onError={() => {}}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path={CLASS_LOGIN_CODE_ROUTE} element={<CodeEntryPage />} />
          <Route path={CLASS_LOGIN_CODE_LINK_ROUTE} element={<CodeEntryPage />} />
          <Route path='/c/:slug' element={<div>страница класса</div>} />
          <Route path='/' element={<div>лендинг</div>} />
        </Routes>
      </MemoryRouter>
    </IntlProvider>,
  )
}

describe('CodeEntryPage', () => {
  beforeEach(() => jest.clearAllMocks())

  it('opens the class page once six digits are typed', async () => {
    api.getRoomByCode.mockResolvedValue({ data: { classPage: '/c/abcdefghijklmnop' } })
    renderAt('/k')
    const input = screen.getByLabelText('Код урока')

    fireEvent.change(input, { target: { value: '12 3a45' } })
    expect(input.value).toBe('12345')
    expect(api.getRoomByCode).not.toHaveBeenCalled()

    fireEvent.change(input, { target: { value: '123456' } })
    expect(await screen.findByText('страница класса')).toBeTruthy()
    expect(api.getRoomByCode).toHaveBeenCalledWith('123456')
  })

  it('says the code is wrong and clears it for another try', async () => {
    api.getRoomByCode.mockRejectedValue({ response: { status: 404, data: { error: 'not found' } } })
    renderAt('/k')
    const input = screen.getByLabelText('Код урока')

    fireEvent.change(input, { target: { value: '999999' } })

    expect(await screen.findByText('Нет такого кода. Посмотрите на экран учителя')).toBeTruthy()
    await waitFor(() => expect(input.value).toBe(''))
  })

  it('takes the code from the projector QR link', async () => {
    api.getRoomByCode.mockResolvedValue({ data: { classPage: '/c/abcdefghijklmnop' } })
    renderAt('/k/654321')
    expect(await screen.findByText('страница класса')).toBeTruthy()
    expect(api.getRoomByCode).toHaveBeenCalledWith('654321')
  })

  it('leads back to the landing, not to the usual sign-in', async () => {
    renderAt('/k')
    expect(screen.getByText('Наберите цифры с экрана учителя')).toBeTruthy()
    expect(screen.queryByText('Обычный вход')).toBeNull()

    fireEvent.click(screen.getByRole('link', { name: /На главную/ }))
    expect(await screen.findByText('лендинг')).toBeTruthy()
  })
})

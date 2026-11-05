import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import JoinClassPage from '@/pages/JoinClass'
import * as api from '@/api/teacherClass'
import { JOIN_CLASS_CODE_ROUTE, JOIN_CLASS_ROUTE } from '@/constants'
import ru from '@/lang/ru.json'

jest.mock('@/api/teacherClass', () => ({
  previewJoin: jest.fn(),
  previewJoinBySlug: jest.fn(),
  joinClass: jest.fn(),
}))

const WRONG_CODE = 'Класса с таким кодом нет. Проверьте код или спросите его у учителя.'
const notFound = { response: { status: 404, data: { error: 'not found' } } }

const renderAt = url =>
  render(
    <IntlProvider locale='ru' messages={ru} onError={() => {}}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path={JOIN_CLASS_ROUTE} element={<JoinClassPage />} />
          <Route path={JOIN_CLASS_CODE_ROUTE} element={<JoinClassPage />} />
        </Routes>
      </MemoryRouter>
    </IntlProvider>,
  )

describe('JoinClassPage', () => {
  beforeEach(() => jest.clearAllMocks())

  it('shows no error before a code is submitted', async () => {
    renderAt('/join')
    expect(await screen.findByLabelText('Введите код класса')).toBeTruthy()
    expect(screen.queryByRole('alert')).toBeNull()
    expect(api.previewJoin).not.toHaveBeenCalled()
  })

  it('tells about a wrong code and keeps it in the field to fix', async () => {
    api.previewJoin.mockRejectedValue(notFound)
    renderAt('/join')

    fireEvent.change(await screen.findByLabelText('Введите код класса'), {
      target: { value: 'nope-00' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect((await screen.findByRole('alert')).textContent).toContain(WRONG_CODE)
    expect(api.previewJoin).toHaveBeenCalledWith('NOPE-00')
    expect(screen.getByLabelText('Введите код класса').value).toBe('NOPE-00')
  })

  it('drops the error once a right code is entered', async () => {
    api.previewJoin.mockRejectedValueOnce(notFound).mockResolvedValueOnce({
      data: { displayName: 'Audit 5A', edxCourseId: 'course-v1:x' },
    })
    renderAt('/join?code=NOPE-00')

    await screen.findByRole('alert')
    fireEvent.change(screen.getByLabelText('Введите код класса'), {
      target: { value: 'GOOD-11' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(await screen.findByText('Audit 5A')).toBeTruthy()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('does not blame the code when the server is down', async () => {
    api.previewJoin.mockRejectedValue({ response: { status: 500, data: {} } })
    renderAt('/join?code=GOOD-11')

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Ошибка на сервере. Попробуйте позже.',
    )
  })

  it('keeps the not-found page for a broken invite link', async () => {
    api.previewJoinBySlug.mockRejectedValue(notFound)
    renderAt('/join/old-link')

    expect(await screen.findByText('Приглашение не найдено')).toBeTruthy()
    await waitFor(() => expect(api.previewJoinBySlug).toHaveBeenCalledWith('old-link'))
    expect(screen.queryByText(WRONG_CODE)).toBeNull()
  })
})

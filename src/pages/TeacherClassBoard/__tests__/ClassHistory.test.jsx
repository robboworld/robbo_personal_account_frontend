import React, { useState } from 'react'
import { act, fireEvent, screen, waitFor } from '@testing-library/react'

import ClassHistory from '../ClassHistory'

import * as api from '@/api/teacherClass'
import { renderPage } from '@/testUtils'

jest.mock('@/api/teacherClass', () => ({
  listClassHistory: jest.fn(),
}))

// antd Segmented and Table measure themselves; jsdom has no ResizeObserver.
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

const event = (id, rest) => ({
  id,
  actorId: '10',
  actorName: 'Мария Петровна',
  actorRole: 'owner',
  createdAt: '2026-11-04T10:00:00Z',
  ...rest,
})

const page = (items, nextCursor) => ({ data: { items, nextCursor } })

const textFor = async rest => {
  api.listClassHistory.mockResolvedValue(page([event('e1', rest)]))
  renderPage(<ClassHistory classId='c1' active />)
  await screen.findByText('Мария Петровна')
  return screen.getAllByRole('row')[1].textContent
}

describe('ClassHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('tells who did what', async () => {
    api.listClassHistory.mockResolvedValue(
      page([
        event('e1', { action: 'member_removed', targetId: '797', targetName: 'Аня Иванова' }),
        event('e2', {
          action: 'work_submitted',
          actorId: '797',
          actorName: 'Боря',
          actorRole: 'student',
          title: 'Лабиринт',
          detail: 'late',
        }),
      ]),
    )
    renderPage(<ClassHistory classId='c1' active />)

    await screen.findByText('Удаление ученика: Аня Иванова')
    screen.getByText('Владелец')
    screen.getByText('Сдача работы «Лабиринт» после срока')
    expect(api.listClassHistory).toHaveBeenCalledWith('c1', { cursor: undefined })
  })

  it('does not take a teacher sending work back to review for a hand-in', async () => {
    const text = await textFor({
      action: 'work_reviewed',
      detail: 'submitted',
      title: 'Лабиринт',
      targetId: '797',
      targetName: 'Аня',
    })
    expect(text).toContain('Работа снова на проверке: Аня, «Лабиринт»')
    expect(text).not.toContain('Сдача работы')
  })

  it('names a user the LMS no longer knows', async () => {
    const text = await textFor({ action: 'member_added', targetId: '797' })
    expect(text).toContain('Добавление ученика: Пользователь 797')
  })

  it('falls back to the login of a removed user without an id', async () => {
    const text = await textFor({ action: 'member_removed', detail: 'anya' })
    expect(text).toContain('Удаление ученика: anya')
  })

  it('counts a message to several students', async () => {
    const text = await textFor({ action: 'message_sent', detail: '12' })
    expect(text).toContain('Сообщение ученикам: 12')
  })

  it('survives an action it does not know yet', async () => {
    const text = await textFor({ action: 'from_the_future' })
    expect(text).toContain('Действие в классе')
  })

  it('loads the next page after the current one', async () => {
    api.listClassHistory.mockResolvedValueOnce(
      page([event('e1', { action: 'invite_rotated' })], 'next-1'),
    )
    renderPage(<ClassHistory classId='c1' active />)

    const more = await screen.findByRole('button', { name: 'Показать ещё' })
    api.listClassHistory.mockResolvedValueOnce(page([event('e2', { action: 'class_archived' })]))
    fireEvent.click(more)

    await screen.findByText('Класс отправлен в архив')
    screen.getByText('Новый код приглашения')
    expect(api.listClassHistory).toHaveBeenLastCalledWith('c1', { cursor: 'next-1' })
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Показать ещё' })).toBeNull())
  })

  it('asks the server to filter and drops a slower answer to the old filter', async () => {
    let answerOld
    api.listClassHistory.mockReturnValueOnce(
      new Promise(resolve => {
        answerOld = resolve
      }),
    )
    renderPage(<ClassHistory classId='c1' active />)

    api.listClassHistory.mockResolvedValueOnce(page([event('e2', { action: 'member_left' })]))
    fireEvent.click(screen.getByText('Состав'))

    await screen.findByText('Выход из класса')
    expect(api.listClassHistory).toHaveBeenLastCalledWith('c1', {
      category: 'members',
      cursor: undefined,
    })

    await act(async () => answerOld(page([event('e1', { action: 'class_archived' })])))
    screen.getByText('Выход из класса')
    expect(screen.queryByText('Класс отправлен в архив')).toBeNull()
  })

  it('loads nothing while its tab is not open and reloads on demand', async () => {
    api.listClassHistory.mockResolvedValue(page([]))
    const Board = () => {
      const [active, setActive] = useState(false)
      const [reloadKey, setReloadKey] = useState(0)
      return (
        <React.Fragment>
          <button onClick={() => setActive(true)}>open</button>
          <button onClick={() => setReloadKey(n => n + 1)}>refresh</button>
          <ClassHistory classId='c1' active={active} reloadKey={reloadKey} />
        </React.Fragment>
      )
    }
    renderPage(<Board />)
    expect(api.listClassHistory).not.toHaveBeenCalled()

    fireEvent.click(screen.getByText('open'))
    await waitFor(() => expect(api.listClassHistory).toHaveBeenCalledTimes(1))
    fireEvent.click(screen.getByText('refresh'))
    await waitFor(() => expect(api.listClassHistory).toHaveBeenCalledTimes(2))
  })
})

import React from 'react'
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'

import NotificationBell from '@/components/NotificationBell/NotificationBell'
import * as api from '@/api/notifications'
import { renderPage } from '@/testUtils'

jest.mock('@/api/notifications', () => ({
  fetchNotificationFeed: jest.fn(),
  fetchUnreadNotificationCount: jest.fn(),
  markPersonalNotificationRead: jest.fn(),
  markAnnouncementRead: jest.fn(),
  markAllNotificationsRead: jest.fn(),
  markLmsNotificationRead: jest.fn(),
}))

const today = new Date()
const at = (hours, days = 0) =>
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + days, hours).toISOString()

const lkFeed = {
  items: [
    {
      feedKind: 'personal',
      id: 'p1',
      title: 'Анна Иванова: Урок перенесён',
      body: 'Занятие в четверг в 16:00',
      kind: 'teacher_message',
      source: 'teacher',
      readAt: null,
      createdAt: at(0),
      actionUrl: null,
    },
    {
      feedKind: 'announcement',
      id: 'a1',
      title: 'Каникулы',
      body: 'С 1 по 7 ноября',
      source: 'system',
      readAt: at(10, -1),
      createdAt: at(10, -1),
      actionUrl: null,
    },
  ],
}

const lmsFeed = {
  items: [
    {
      feedKind: 'lms',
      id: '7',
      title: 'Задание проверено',
      body: 'Ваш ответ на задание Проект проверен: 4 из 5 баллов',
      kind: 'ora_grade_assigned',
      source: 'lms',
      courseName: 'Робототехника',
      readAt: null,
      createdAt: at(1),
      actionUrl: 'http://local.openedx.io/courses/x',
    },
  ],
  lms: {
    feed: 'http://local.openedx.io/account/notifications',
    settings: 'http://local.openedx.io/account/#notifications',
  },
}

const tick = 'Отметить прочитанным'

async function openBell(label = 'Уведомления, непрочитанных: 1, в обучении: 1') {
  renderPage(<NotificationBell />)
  const bell = await screen.findByRole('button', { name: label })
  await act(async () => {
    fireEvent.click(bell)
  })
  return screen.findByRole('dialog')
}

async function click(element) {
  await act(async () => {
    fireEvent.click(element)
  })
}

describe('NotificationBell', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    api.fetchUnreadNotificationCount.mockResolvedValue({
      count: 2,
      lk: 1,
      lms: 1,
      lmsEnabled: true,
    })
    api.fetchNotificationFeed.mockImplementation((limit, source) =>
      Promise.resolve(source === 'lms' ? lmsFeed : lkFeed),
    )
    api.markLmsNotificationRead.mockResolvedValue({ ok: true })
    api.markPersonalNotificationRead.mockResolvedValue({ ok: true })
    api.markAllNotificationsRead.mockResolvedValue({ ok: true })
  })

  it('opens on the LK tab, by day; the LMS tab is second and has the LMS links', async () => {
    const dialog = await openBell()
    const tabs = within(dialog).getAllByRole('tab')
    expect(tabs.map(tab => tab.textContent)).toEqual(['Личный кабинет1', 'Обучение1'])
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    expect(await within(dialog).findByText('Анна Иванова: Урок перенесён')).toBeTruthy()
    expect(within(dialog).getByText('Сегодня')).toBeTruthy()
    expect(within(dialog).getByText('Вчера')).toBeTruthy()
    expect(within(dialog).queryByText('Задание проверено')).toBeNull()
    expect(within(dialog).queryByRole('link', { name: /Все уведомления обучения/ })).toBeNull()
    expect(api.fetchNotificationFeed).toHaveBeenLastCalledWith(40, 'lk')

    await click(tabs[1])
    expect(await within(dialog).findByText('Задание проверено')).toBeTruthy()
    expect(within(dialog).getByText('Робототехника')).toBeTruthy()
    expect(within(dialog).queryByText('Анна Иванова: Урок перенесён')).toBeNull()
    const all = within(dialog).getByRole('link', { name: /Все уведомления обучения/ })
    expect(all.getAttribute('href')).toBe(lmsFeed.lms.feed)
    expect(api.fetchNotificationFeed).toHaveBeenLastCalledWith(40, 'lms')
  })

  it('marks one notification read without opening it', async () => {
    const dialog = await openBell()
    await within(dialog).findByText('Анна Иванова: Урок перенесён')
    await click(within(dialog).getByRole('button', { name: tick }))
    expect(api.markPersonalNotificationRead).toHaveBeenCalledWith('p1')
    await waitFor(() => expect(within(dialog).queryByRole('button', { name: tick })).toBeNull())

    await click(within(dialog).getAllByRole('tab')[1])
    await within(dialog).findByText('Задание проверено')
    await click(within(dialog).getByRole('button', { name: tick }))
    expect(api.markLmsNotificationRead).toHaveBeenCalledWith('7')
  })

  it('«Прочитать все» reads only the shown tab', async () => {
    const dialog = await openBell()
    await within(dialog).findByText('Анна Иванова: Урок перенесён')
    await click(within(dialog).getByRole('button', { name: 'Прочитать все' }))
    expect(api.markAllNotificationsRead).toHaveBeenCalledWith('lk')
    expect(await within(dialog).findByText('Все уведомления прочитаны')).toBeTruthy()
    expect(within(dialog).queryByRole('button', { name: tick })).toBeNull()
  })

  it('has no tabs without the LMS feed', async () => {
    api.fetchUnreadNotificationCount.mockResolvedValue({
      count: 1,
      lk: 1,
      lms: 0,
      lmsEnabled: false,
    })
    const dialog = await openBell('Уведомления, непрочитанных: 1')
    await within(dialog).findByText('Анна Иванова: Урок перенесён')
    expect(within(dialog).queryByRole('tab')).toBeNull()
  })

  it('closes on Escape', async () => {
    await openBell()
    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})

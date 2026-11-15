import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import FeatureInterestAnswersPanel from '../FeatureInterestAnswersPanel'

import { listFeatureInterestAnswers } from '@/api/licensing'
import { renderPage } from '@/testUtils'

jest.mock('@/api/licensing', () => ({ listFeatureInterestAnswers: jest.fn() }))

// antd Table measures itself; jsdom has no ResizeObserver.
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

const answer = (over = {}) => ({
  role: 'club_owner',
  feature: 'work_review',
  other: '',
  pain: '',
  org: '',
  notify: false,
  source: 'licenses',
  updatedAt: '2026-11-01T10:30:00Z',
  ...over,
})

describe('FeatureInterestAnswersPanel', () => {
  beforeEach(() => jest.clearAllMocks())

  it('shows the answers with translated role and feature, free texts and tags', async () => {
    listFeatureInterestAnswers.mockResolvedValue({
      total: 2,
      answers: [
        answer({ pain: 'Много бумажной работы', org: 'РОББО, Казань', notify: true, source: 'landing' }),
        answer({ role: 'parent', feature: 'other', other: 'Отчёты для родителей' }),
      ],
    })
    renderPage(<FeatureInterestAnswersPanel />)

    expect(await screen.findByText('Много бумажной работы')).toBeTruthy()
    expect(screen.getByText('РОББО, Казань')).toBeTruthy()
    expect(screen.getByText('Руководитель клуба')).toBeTruthy() // role.club_owner
    expect(screen.getByText('Родитель')).toBeTruthy()
    expect(screen.getByText('Отчёты для родителей')).toBeTruthy() // the "other" text
    expect(screen.getByText('Ждёт письма')).toBeTruthy()
    expect(screen.getByText('landing')).toBeTruthy()
    expect(screen.getByText(/Всего ответов: 2/)).toBeTruthy()
  })

  it('does not say in the hint who can see the block', async () => {
    listFeatureInterestAnswers.mockResolvedValue({ total: 0, answers: [] })
    renderPage(<FeatureInterestAnswersPanel />)
    await screen.findByText('Ответов пока нет')
    expect(screen.queryByText(/суперадмин/i)).toBeNull()
  })

  it.each([
    ['landing', /лендинг/],
    ['home', /главной странице ЛК/],
    ['licenses', /Источник не указан/],
    ['rs-desktop', /десктопная версия RobboScratch/],
    ['rs-web', /веб-версия RobboScratch/],
    ['something-new', /Неизвестный источник/],
  ])('explains the %s source tag on hover', async (source, tip) => {
    listFeatureInterestAnswers.mockResolvedValue({ total: 1, answers: [answer({ source })] })
    renderPage(<FeatureInterestAnswersPanel />)
    fireEvent.mouseEnter(await screen.findByText(source))
    expect(await screen.findByText(tip)).toBeTruthy()
  })

  it('explains the "waits for an email" tag on hover', async () => {
    listFeatureInterestAnswers.mockResolvedValue({ total: 1, answers: [answer({ notify: true })] })
    renderPage(<FeatureInterestAnswersPanel />)
    fireEvent.mouseEnter(await screen.findByText('Ждёт письма'))
    expect(await screen.findByText(/можно написать на почту аккаунта/)).toBeTruthy()
  })

  it('marks empty optional answers with a dash instead of a blank cell', async () => {
    listFeatureInterestAnswers.mockResolvedValue({ total: 1, answers: [answer()] })
    renderPage(<FeatureInterestAnswersPanel />)
    await screen.findByText('Руководитель клуба')
    expect(screen.getAllByText('—')).toHaveLength(2) // pain and org
  })

  it('says so when nobody has answered yet', async () => {
    listFeatureInterestAnswers.mockResolvedValue({ total: 0, answers: [] })
    renderPage(<FeatureInterestAnswersPanel />)
    expect(await screen.findByText('Ответов пока нет')).toBeTruthy()
  })

  it('shows a readable error instead of raw backend text', async () => {
    listFeatureInterestAnswers.mockRejectedValue({ response: { status: 403, data: { error: 'forbidden' } } })
    renderPage(<FeatureInterestAnswersPanel />)
    expect(await screen.findByText(/Нет доступа/)).toBeTruthy()
    expect(screen.queryByText('forbidden')).toBeNull()
  })

  it('loads the first page of 20 and the next page on demand', async () => {
    const many = Array.from({ length: 20 }, (_, i) => answer({ pain: `боль ${i}` }))
    listFeatureInterestAnswers.mockResolvedValue({ total: 45, answers: many })
    renderPage(<FeatureInterestAnswersPanel />)
    await screen.findByText('боль 0')
    expect(listFeatureInterestAnswers).toHaveBeenLastCalledWith({ limit: 20, offset: 0 })

    fireEvent.click(screen.getByTitle('2'))
    await waitFor(() =>
      expect(listFeatureInterestAnswers).toHaveBeenLastCalledWith({ limit: 20, offset: 20 }),
    )
  })
})

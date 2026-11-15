import React from 'react'
import { screen, waitFor } from '@testing-library/react'

import MyLicensesPage from '../MyLicenses'

import { useAuthRole } from '@/helpers'
import { renderPage } from '@/testUtils'
import { STUDENT, TEACHER, UNIT_ADMIN, SUPER_ADMIN } from '@/constants'

jest.mock('@/helpers', () => ({ ...jest.requireActual('@/helpers'), useAuthRole: jest.fn() }))
jest.mock('@/api/licensing', () => ({
  listMyLicenses: jest.fn(() => Promise.resolve([])),
  getEntitlements: jest.fn(() => Promise.resolve(null)),
}))
jest.mock('@/api/auth', () => ({ authAPI: { listSessions: jest.fn(() => Promise.resolve([])) } }))
jest.mock('../FeatureInterestPanel', () => () => <div data-testid='survey' />)
jest.mock('../FeatureInterestAnswersPanel', () => () => <div data-testid='survey-answers' />)

describe('MyLicensesPage survey answers block', () => {
  it.each([
    ['SuperAdmin', SUPER_ADMIN, true],
    ['UnitAdmin', UNIT_ADMIN, false],
    ['Teacher', TEACHER, false],
    ['Student', STUDENT, false],
  ])('%s: answers block visible = %s', async (_, role, visible) => {
    useAuthRole.mockReturnValue(role)
    renderPage(<MyLicensesPage />)
    expect(await screen.findByTestId('survey')).toBeTruthy() // the survey itself is for everyone
    await waitFor(() => {
      if (visible) expect(screen.getByTestId('survey-answers')).toBeTruthy()
      else expect(screen.queryByTestId('survey-answers')).toBeNull()
    })
  })
})

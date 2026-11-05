import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import CoTeachersModal from '../CoTeachersModal'

import * as api from '@/api/teacherClass'
import { renderPage } from '@/testUtils'

jest.mock('@/api/teacherClass', () => ({
  listCoTeachers: jest.fn(),
  addCoTeacher: jest.fn(),
  extendCoTeacher: jest.fn(),
  removeCoTeacher: jest.fn(),
}))

// antd pickers and popups measure themselves; jsdom has neither of these. They are also slow
// there, hence the longer timeouts.
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  global.MessageChannel = class {
    port1 = {}
    port2 = { postMessage: () => setTimeout(() => this.port1.onmessage?.()) }
  }
})

afterAll(() => {
  delete global.ResizeObserver
  delete global.MessageChannel
})

const substitute = { teacherId: '20', name: 'Замена', expiresAt: '2026-11-18T20:59:59Z' }

const show = props =>
  renderPage(
    <CoTeachersModal
      open
      classId='c1'
      isCoTeacher={false}
      onClose={jest.fn()}
      onLeft={jest.fn()}
      {...props}
    />,
  )

describe('CoTeachersModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    api.listCoTeachers.mockResolvedValue({ data: { items: [substitute] } })
    api.removeCoTeacher.mockResolvedValue({})
  })

  it('lets the owner appoint and remove', async () => {
    show()
    expect(await screen.findByText('Замена', {}, { timeout: 15000 })).toBeTruthy()
    expect(screen.getByLabelText('Email учителя')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Снять' }))
    const confirm = await screen.findAllByRole('button', { name: 'Снять' })
    fireEvent.click(confirm[confirm.length - 1])

    await waitFor(() => expect(api.removeCoTeacher).toHaveBeenCalledWith('c1', '20'))
    await waitFor(() => expect(api.listCoTeachers).toHaveBeenCalledTimes(2))
  }, 30000)

  it('gives a co-teacher the list and the way out, not the appointments', async () => {
    const onLeft = jest.fn()
    show({ isCoTeacher: true, onLeft })
    expect(await screen.findByText('Замена', {}, { timeout: 15000 })).toBeTruthy()
    expect(screen.queryByLabelText('Email учителя')).toBeNull()
    // The hint speaks to the owner ("with you").
    expect(screen.queryByText(/вместе с вами/)).toBeNull()
    expect(screen.queryByRole('button', { name: 'Снять' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Отказаться от роли' }))
    const confirm = await screen.findAllByRole('button', { name: 'Отказаться от роли' })
    fireEvent.click(confirm[confirm.length - 1])

    await waitFor(() => expect(api.removeCoTeacher).toHaveBeenCalledWith('c1', 'me'))
    await waitFor(() => expect(onLeft).toHaveBeenCalled())
  }, 30000)

  it('does not load while closed', () => {
    show({ open: false })
    expect(api.listCoTeachers).not.toHaveBeenCalled()
  })
})

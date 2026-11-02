import React from 'react'
import { fireEvent, screen } from '@testing-library/react'

import ModerationReasonModal from '@/components/ModerationReasonModal'
import { renderPage } from '@/testUtils'

const renderModal = props =>
  renderPage(
    <ModerationReasonModal
      open
      title='Удалить файл'
      okText='Удалить'
      body='Файл будет удалён'
      onSubmit={jest.fn()}
      onCancel={jest.fn()}
      {...props}
    />,
  )

const okButton = () => screen.getByRole('button', { name: 'Удалить' })

describe('ModerationReasonModal', () => {
  beforeAll(() => {
    // jsdom has none; the antd modal observes its size.
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  })

  it('shows the warning above the body only when given one', () => {
    const { unmount } = renderModal({ warning: 'Внутри есть Python-скрипты.' })
    expect(screen.getByRole('alert').textContent).toContain('Внутри есть Python-скрипты.')
    unmount()
    renderModal()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('keeps OK disabled until the reason has 3 characters and submits it trimmed', () => {
    const onSubmit = jest.fn()
    renderModal({ onSubmit })

    expect(screen.getByText('Файл будет удалён')).toBeTruthy()
    expect(okButton().disabled).toBe(true)

    const input = screen.getByPlaceholderText('Укажите причину удаления')
    fireEvent.change(input, { target: { value: '  ab  ' } })
    expect(okButton().disabled).toBe(true)

    fireEvent.change(input, { target: { value: '  спам  ' } })
    expect(okButton().disabled).toBe(false)
    fireEvent.click(okButton())
    expect(onSubmit).toHaveBeenCalledWith('спам')
  })

  it('marks OK as danger only in danger mode', () => {
    const { unmount } = renderModal({ danger: true })
    expect(okButton().className).toMatch(/dangerous/)
    unmount()

    renderModal({ okText: 'Скачать', placeholder: 'Зачем' })
    expect(screen.getByRole('button', { name: 'Скачать' }).className).not.toMatch(/dangerous/)
    expect(screen.getByPlaceholderText('Зачем')).toBeTruthy()
  })

  it('does not cancel while the action is running', () => {
    const onCancel = jest.fn()
    const { unmount } = renderModal({ onCancel, loading: true })
    fireEvent.click(screen.getByRole('button', { name: 'Отмена' }))
    expect(onCancel).not.toHaveBeenCalled()
    unmount()

    renderModal({ onCancel })
    fireEvent.click(screen.getByRole('button', { name: 'Отмена' }))
    expect(onCancel).toHaveBeenCalled()
  })
})

import React from 'react'
import { message } from 'antd'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import ImportProjectModal from '@/pages/MyProjects/ImportProjectModal'
import { importProjectSb3 } from '@/api/projectPage'
import { getEntitlements } from '@/api/licensing'
import { renderPage } from '@/testUtils'

jest.mock('@/api/projectPage', () => ({
  ...jest.requireActual('@/api/projectPage'),
  importProjectSb3: jest.fn(),
}))
jest.mock('@/api/licensing', () => ({ getEntitlements: jest.fn() }))

// antd forms batch field updates through MessageChannel, which jsdom lacks.
class TimeoutMessageChannel {
  port1 = {}
  port2 = { postMessage: () => setTimeout(() => this.port1.onmessage?.()) }
}

describe('ImportProjectModal', () => {
  beforeAll(() => {
    global.MessageChannel = TimeoutMessageChannel
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  })

  afterAll(() => {
    delete global.MessageChannel
    delete global.ResizeObserver
  })

  beforeEach(() => {
    jest.clearAllMocks()
    getEntitlements.mockResolvedValue(null)
  })

  const startImport = async onClose => {
    renderPage(<ImportProjectModal open onClose={onClose} onImported={jest.fn()} />)
    fireEvent.change(document.querySelector('input[type=file]'), {
      target: { files: [new File(['x'], 'game.sb3')] },
    })
    await waitFor(() => expect(document.querySelector('.ant-upload-list-item')).toBeTruthy())
    fireEvent.click(screen.getByRole('button', { name: 'Создать проект' }))
    await waitFor(() => expect(importProjectSb3).toHaveBeenCalled())
  }

  it('stops the upload on "Отмена" and closes without an error', async () => {
    const info = jest.spyOn(message, 'info').mockImplementation(() => {})
    const error = jest.spyOn(message, 'error').mockImplementation(() => {})
    importProjectSb3.mockImplementation(
      (file, title, signal) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
        }),
    )
    const onClose = jest.fn()
    await startImport(onClose)
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Отмена' }))

    await waitFor(() => expect(onClose).toHaveBeenCalled())
    expect(info).toHaveBeenCalledWith('Загрузка «game.sb3» отменена.')
    expect(error).not.toHaveBeenCalled()
    info.mockRestore()
    error.mockRestore()
  })

  it('keeps the dialog open on a real failure', async () => {
    const error = jest.spyOn(message, 'error').mockImplementation(() => {})
    importProjectSb3.mockRejectedValue(new Error('INVALID_PROJECT_FILE'))
    const onClose = jest.fn()
    await startImport(onClose)

    await waitFor(() => expect(error).toHaveBeenCalled())
    expect(onClose).not.toHaveBeenCalled()
    error.mockRestore()
  })
})

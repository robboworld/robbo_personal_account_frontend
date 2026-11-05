import React from 'react'
import axios from 'axios'
import { message } from 'antd'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'

import MyFilesPage from '@/pages/MyFiles'
import * as api from '@/api/userFiles'
import { getEntitlements } from '@/api/licensing'
import { renderPage } from '@/testUtils'

jest.mock('@/api/userFiles', () => ({
  ...jest.requireActual('@/api/userFiles'),
  listFiles: jest.fn(),
  uploadFile: jest.fn(),
  downloadFile: jest.fn(),
  deleteFile: jest.fn(),
}))
jest.mock('@/api/licensing', () => ({ getEntitlements: jest.fn() }))

const MB = 1024 * 1024

describe('MyFilesPage', () => {
  beforeAll(() => {
    // jsdom has neither: the Popconfirm popup needs ResizeObserver, and the size/date
    // columns are responsive, so every breakpoint has to match for them to render.
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    window.matchMedia = query => ({
      matches: true,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    getEntitlements.mockResolvedValue({
      storageQuotaMb: 100,
      usedBytes: 30 * MB,
      usedBytesProjects: 20 * MB,
      usedBytesFiles: 10 * MB,
      maxFileSizeMb: 10,
    })
  })

  it('shows the meter with the breakdown, the allow-list and the files', async () => {
    api.listFiles.mockResolvedValue([
      { id: 'f1', name: 'Отчёт.pdf', sizeBytes: 2048, createdAt: '2026-10-30T10:00:00Z' },
    ])
    const { container } = renderPage(<MyFilesPage />)

    expect(await screen.findByText('Отчёт.pdf')).toBeTruthy()
    expect(screen.getByText('2 КБ')).toBeTruthy()
    expect(await screen.findByText('30 МБ / 100 МБ')).toBeTruthy()
    expect(screen.getByText('Проекты: 20 МБ · Файлы: 10 МБ')).toBeTruthy()
    expect(container.querySelector('input[type=file]').getAttribute('accept')).toBe(
      api.ALLOWED_FILE_ACCEPT,
    )
  })

  it('cancels an upload in progress without calling it a failure', async () => {
    api.listFiles.mockResolvedValue([])
    const info = jest.spyOn(message, 'info').mockImplementation(() => {})
    const error = jest.spyOn(message, 'error').mockImplementation(() => {})
    api.uploadFile.mockImplementation(
      (file, onProgress, signal) =>
        new Promise((_resolve, reject) => {
          onProgress(40)
          signal.addEventListener('abort', () => reject(new axios.CanceledError()))
        }),
    )
    const { container } = renderPage(<MyFilesPage />)
    await waitFor(() => expect(getEntitlements).toHaveBeenCalled())

    fireEvent.change(container.querySelector('input[type=file]'), {
      target: { files: [new File(['x'], 'a.pdf')] },
    })
    fireEvent.click(await screen.findByRole('button', { name: 'Отменить загрузку «a.pdf»' }))

    await waitFor(() => expect(info).toHaveBeenCalledWith('Загрузка «a.pdf» отменена.'))
    expect(error).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByText('Загружаем «a.pdf»')).toBeNull())
    info.mockRestore()
    error.mockRestore()
  })

  it('deletes after confirmation', async () => {
    api.listFiles.mockResolvedValue([{ id: 'f1', name: 'a.txt', sizeBytes: 1, createdAt: '' }])
    api.deleteFile.mockResolvedValue()
    renderPage(<MyFilesPage />)

    fireEvent.click(await screen.findByLabelText('Удалить'))
    fireEvent.click(await screen.findByRole('button', { name: 'Да' }))
    await waitFor(() => expect(api.deleteFile).toHaveBeenCalledWith('f1'))
    await waitFor(() => expect(screen.queryByText('a.txt')).toBeNull())
  })

  it('downloads a plain file at once', async () => {
    api.listFiles.mockResolvedValue([{ id: 'f1', name: 'a.txt', sizeBytes: 1, createdAt: '' }])
    api.downloadFile.mockResolvedValue()
    renderPage(<MyFilesPage />)

    fireEvent.click(await screen.findByLabelText('Скачать'))
    await waitFor(() => expect(api.downloadFile).toHaveBeenCalledWith('f1', 'a.txt'))
    expect(screen.queryByLabelText('Есть Python-скрипты')).toBeNull()
  })

  it('marks a file with Python scripts and asks before the download', async () => {
    api.listFiles.mockResolvedValue([
      { id: 'f2', name: 'robot.zip', sizeBytes: 1, createdAt: '', hasScripts: true },
    ])
    api.downloadFile.mockResolvedValue()
    renderPage(<MyFilesPage />)

    expect(await screen.findByLabelText('Есть Python-скрипты')).toBeTruthy()
    fireEvent.click(screen.getByLabelText('Скачать'))
    expect(api.downloadFile).not.toHaveBeenCalled()
    const popup = await waitFor(() => {
      const el = document.querySelector('.ant-popconfirm')
      expect(el).toBeTruthy()
      return el
    })
    expect(within(popup).getByText('Скачать файл со скриптами?')).toBeTruthy()
    expect(within(popup).getByText(/Запускайте их, если доверяете источнику/)).toBeTruthy()
    fireEvent.click(within(popup).getByRole('button', { name: 'Скачать' }))
    await waitFor(() => expect(api.downloadFile).toHaveBeenCalledWith('f2', 'robot.zip'))
  })

  it('explains that the section is off when the backend answers 404', async () => {
    api.listFiles.mockRejectedValue({ response: { status: 404, data: '' } })
    renderPage(<MyFilesPage />)
    expect(await screen.findByText('Раздел «Мои файлы» пока недоступен.')).toBeTruthy()
  })
})

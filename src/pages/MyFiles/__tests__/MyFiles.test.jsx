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
  renameFile: jest.fn(),
}))
jest.mock('@/api/licensing', () => ({ getEntitlements: jest.fn() }))

const MB = 1024 * 1024

// antd forms batch field updates through MessageChannel, which jsdom lacks.
class TimeoutMessageChannel {
  port1 = {}
  port2 = { postMessage: () => setTimeout(() => this.port1.onmessage?.()) }
}

describe('MyFilesPage', () => {
  beforeAll(() => {
    global.MessageChannel = TimeoutMessageChannel
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

  afterAll(() => {
    delete global.MessageChannel
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

  it('renames a file and keeps its extension', async () => {
    api.listFiles.mockResolvedValue([{ id: 'f1', name: 'a.b.txt', sizeBytes: 1, createdAt: '' }])
    api.renameFile.mockResolvedValue({ id: 'f1', name: 'Домашка.txt', sizeBytes: 1, createdAt: '' })
    renderPage(<MyFilesPage />)

    fireEvent.click(await screen.findByLabelText('Переименовать'))
    const input = await screen.findByLabelText('Новое имя')
    expect(input.value).toBe('a.b')
    fireEvent.change(input, { target: { value: ' Домашка ' } })
    fireEvent.click(screen.getByText('Сохранить'))

    await waitFor(() => expect(api.renameFile).toHaveBeenCalledWith('f1', 'Домашка.txt'))
    expect(await screen.findByText('Домашка.txt')).toBeTruthy()
    await waitFor(() => expect(screen.queryByLabelText('Новое имя')).toBeNull())
  })

  it('refuses a path as the new name and skips an unchanged one', async () => {
    api.listFiles.mockResolvedValue([{ id: 'f1', name: 'a.txt', sizeBytes: 1, createdAt: '' }])
    renderPage(<MyFilesPage />)

    fireEvent.click(await screen.findByLabelText('Переименовать'))
    const input = await screen.findByLabelText('Новое имя')
    fireEvent.change(input, { target: { value: 'x/y' } })
    fireEvent.click(screen.getByText('Сохранить'))
    expect(await screen.findByText('Введите имя без символов / и \\.')).toBeTruthy()
    expect(api.renameFile).not.toHaveBeenCalled()

    fireEvent.change(input, { target: { value: 'a' } })
    fireEvent.click(screen.getByText('Сохранить'))
    await waitFor(() => expect(screen.queryByLabelText('Новое имя')).toBeNull())
    expect(api.renameFile).not.toHaveBeenCalled()
  })

  it('keeps the dialog open with the error when the rename fails', async () => {
    api.listFiles.mockResolvedValue([{ id: 'f1', name: 'a.txt', sizeBytes: 1, createdAt: '' }])
    api.renameFile.mockRejectedValue({ response: { status: 500, data: {} } })
    const error = jest.spyOn(message, 'error').mockImplementation(() => {})
    renderPage(<MyFilesPage />)

    fireEvent.click(await screen.findByLabelText('Переименовать'))
    fireEvent.change(await screen.findByLabelText('Новое имя'), { target: { value: 'b' } })
    fireEvent.click(screen.getByText('Сохранить'))

    await waitFor(() => expect(error).toHaveBeenCalled())
    expect(screen.getByLabelText('Новое имя')).toBeTruthy()
    expect(screen.getByText('a.txt')).toBeTruthy()
    error.mockRestore()
  })

  it('downloads a plain file at once', async () => {
    api.listFiles.mockResolvedValue([{ id: 'f1', name: 'a.txt', sizeBytes: 1, createdAt: '' }])
    api.downloadFile.mockResolvedValue()
    renderPage(<MyFilesPage />)

    fireEvent.click(await screen.findByLabelText('Скачать'))
    await waitFor(() => expect(api.downloadFile).toHaveBeenCalledWith('f1', 'a.txt'))
    expect(screen.queryByLabelText('Может запускать код')).toBeNull()
  })

  it('marks a file with code and asks before the download', async () => {
    api.listFiles.mockResolvedValue([
      { id: 'f2', name: 'robot.zip', sizeBytes: 1, createdAt: '', hasScripts: true },
    ])
    api.downloadFile.mockResolvedValue()
    renderPage(<MyFilesPage />)

    expect(await screen.findByLabelText('Может запускать код')).toBeTruthy()
    fireEvent.click(screen.getByLabelText('Скачать'))
    expect(api.downloadFile).not.toHaveBeenCalled()
    const popup = await waitFor(() => {
      const el = document.querySelector('.ant-popconfirm')
      expect(el).toBeTruthy()
      return el
    })
    expect(within(popup).getByText('Скачать файл с кодом?')).toBeTruthy()
    expect(within(popup).getByText(/только если доверяете источнику/)).toBeTruthy()
    fireEvent.click(within(popup).getByText('Скачать'))
    await waitFor(() => expect(api.downloadFile).toHaveBeenCalledWith('f2', 'robot.zip'))
  })

  it('explains that the section is off when the backend answers 404', async () => {
    api.listFiles.mockRejectedValue({ response: { status: 404, data: '' } })
    renderPage(<MyFilesPage />)
    expect(await screen.findByText('Раздел «Мои файлы» пока недоступен.')).toBeTruthy()
  })
})

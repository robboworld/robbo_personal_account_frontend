import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import AdminUserContent from '@/components/AdminUserContent'
import * as api from '@/api/adminContent'
import { renderPage } from '@/testUtils'

jest.mock('@/api/adminContent', () => ({
  getUserContent: jest.fn(),
  getUserAudit: jest.fn(),
  downloadUserProject: jest.fn(),
  downloadUserFile: jest.fn(),
  deleteUserProject: jest.fn(),
  deleteUserFile: jest.fn(),
}))

const MB = 1024 * 1024

const content = (overrides = {}) => ({
  usage: {
    usedBytes: 30 * MB,
    usedBytesProjects: 20 * MB,
    usedBytesFiles: 10 * MB,
    storageQuotaMb: 100,
  },
  filesEnabled: true,
  projects: [{ id: 'p1', title: 'Космос', isPublic: true, sizeBytes: 2048, updatedAt: null }],
  files: [{ id: 'f1', name: 'Отчёт.pdf', sizeBytes: 4096, createdAt: null }],
  ...overrides,
})

describe('AdminUserContent', () => {
  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()
    api.getUserAudit.mockResolvedValue([])
  })

  it('shows the meter and the projects; deleting asks for a reason and reloads', async () => {
    api.getUserContent
      .mockResolvedValueOnce(content())
      .mockResolvedValueOnce(content({ projects: [] }))
    api.deleteUserProject.mockResolvedValue()
    renderPage(<AdminUserContent userId='42' />)

    expect(await screen.findByText('Космос')).toBeTruthy()
    expect(screen.getByText('публичный')).toBeTruthy()
    expect(screen.getByText('30 МБ / 100 МБ')).toBeTruthy()
    expect(api.getUserAudit).toHaveBeenCalledWith('42', 50)

    // Row actions are icon buttons named by title.
    fireEvent.click(screen.getAllByTitle('Удалить')[0])
    const reason = await screen.findByPlaceholderText('Укажите причину удаления')
    fireEvent.change(reason, { target: { value: 'нарушение правил' } })
    const confirm = document.querySelector('.ant-modal .ant-btn-dangerous')
    fireEvent.click(confirm)

    await waitFor(() =>
      expect(api.deleteUserProject).toHaveBeenCalledWith('42', 'p1', 'нарушение правил'),
    )
    expect(await screen.findByText('Проектов нет')).toBeTruthy()
    expect(api.getUserContent).toHaveBeenCalledTimes(2)
    expect(api.getUserAudit).toHaveBeenCalledTimes(2)
  })

  it('explains that files are off and lists the audit log', async () => {
    api.getUserContent.mockResolvedValue(content({ filesEnabled: false, files: [] }))
    api.getUserAudit.mockResolvedValue([
      {
        id: 1,
        actorName: 'admin',
        action: 'file_delete',
        objectName: 'x.zip',
        reason: 'вирус',
        createdAt: null,
      },
    ])
    renderPage(<AdminUserContent userId='42' />)

    fireEvent.click(await screen.findByText('Файлы (0)'))
    expect(await screen.findByText(/«Мои файлы» на этом инстансе выключен/)).toBeTruthy()

    fireEvent.click(screen.getByText('Журнал'))
    expect(await screen.findByText('Удалён файл')).toBeTruthy()
    expect(screen.getByText('вирус')).toBeTruthy()
  })
})

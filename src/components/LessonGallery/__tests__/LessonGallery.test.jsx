import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import LessonGalleryButton, { LessonGallery } from '@/components/LessonGallery'
import * as api from '@/api/teacherClass'
import { listFiles } from '@/api/userFiles'
import { renderPage } from '@/testUtils'

jest.mock('@/api/teacherClass', () => ({
  getGallery: jest.fn(),
  addGalleryFile: jest.fn(),
  removeGalleryItem: jest.fn(),
  updateGalleryItem: jest.fn(),
  reorderGallery: jest.fn(),
  setGalleryClosed: jest.fn(),
  downloadGalleryFile: jest.fn(),
  fetchGalleryBlob: jest.fn(() => new Promise(() => {})),
}))

jest.mock('@/api/userFiles', () => ({
  ...jest.requireActual('@/api/userFiles'),
  listFiles: jest.fn(),
  fetchFileBlob: jest.fn(() => new Promise(() => {})),
}))

jest.mock('@/api/licensing', () => ({
  getEntitlements: jest.fn(() => Promise.resolve({})),
}))

// antd Card, Popconfirm and Text measure themselves; jsdom has no ResizeObserver.
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

const file = (id, name, kind = 'stl') => ({ id, name, kind, sizeBytes: 2048 })

const gallery = over => ({
  assignmentId: 'a1',
  title: 'Урок 1',
  maxFilesPerUser: 10,
  canUpload: true,
  items: [
    {
      id: 'g1',
      file: file('f1', 'robot.stl'),
      uploaderId: '797',
      uploaderName: 'Иван Петров',
      createdAt: '2026-11-11T10:00:00Z',
      mine: false,
      canRemove: false,
    },
    {
      id: 'g2',
      file: file('f2', 'car.stl'),
      uploaderId: '798',
      caption: 'Моя машина',
      createdAt: '2026-11-11T10:01:00Z',
      mine: true,
      canRemove: true,
    },
  ],
  ...over,
})

describe('LessonGallery', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.localStorage.removeItem('lessonGallery.splitMine')
  })

  it('shows everyone’s files to a student, who removes only their own', async () => {
    api.getGallery.mockResolvedValue({ data: gallery() })
    renderPage(<LessonGallery assignmentId='a1' />)

    expect(await screen.findByText('robot.stl')).toBeTruthy()
    expect(screen.getByText('Моя машина')).toBeTruthy()
    expect(screen.getByText(/Иван Петров/)).toBeTruthy()
    expect(screen.getAllByRole('button', { name: 'Убрать из галереи' })).toHaveLength(1)
    expect(screen.queryByRole('button', { name: 'Закрепить' })).toBeNull()
    expect(screen.queryByRole('switch', { name: 'Ученики могут добавлять файлы' })).toBeNull()
    expect(screen.getByText(/Добавлено 1 из 10/)).toBeTruthy()
  })

  it('lets a student pick own files as tiles, the shared one greyed out', async () => {
    api.getGallery.mockResolvedValue({ data: gallery() })
    api.addGalleryFile.mockResolvedValue({ data: gallery() })
    listFiles.mockResolvedValue([
      { id: 'f2', name: 'car.stl', kind: 'stl', sizeBytes: 10, createdAt: '2026-11-11T10:00:00Z' },
      { id: 'f3', name: 'boat.png', kind: 'png', sizeBytes: 10, createdAt: '2026-11-10T10:00:00Z' },
    ])
    renderPage(<LessonGallery assignmentId='a1' />)

    fireEvent.click(await screen.findByRole('button', { name: /Из «Моих файлов»/ }))
    expect(await screen.findByText('Уже в галерее')).toBeTruthy()
    expect(screen.getByRole('checkbox', { name: 'car.stl' }).disabled).toBe(true)
    expect(screen.getByText(/можно ещё 9/)).toBeTruthy()

    fireEvent.click(screen.getByRole('checkbox', { name: 'boat.png' }))
    fireEvent.click(screen.getByRole('button', { name: /Добавить в галерею \(1\)/ }))
    await waitFor(() => expect(api.addGalleryFile).toHaveBeenCalledWith('a1', 'f3'))
  })

  it('shows own files apart by default, and remembers when they are mixed back', async () => {
    api.getGallery.mockResolvedValue({ data: gallery() })
    const first = renderPage(<LessonGallery assignmentId='a1' />)

    const mineTitle = await screen.findByText('Мои файлы · 1')
    const othersTitle = screen.getByText('Файлы класса · 1')
    const car = screen.getByText('car.stl')
    const robot = screen.getByText('robot.stl')
    const follows = (a, b) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
    expect(
      follows(mineTitle, car) && follows(car, othersTitle) && follows(othersTitle, robot),
    ).toBe(true)
    expect(
      screen.getByRole('switch', { name: 'Мои файлы отдельно' }).getAttribute('aria-checked'),
    ).toBe('true')

    fireEvent.click(screen.getByRole('switch', { name: 'Мои файлы отдельно' }))
    expect(screen.queryByText('Мои файлы · 1')).toBeNull()
    expect(window.localStorage.getItem('lessonGallery.splitMine')).toBe('0')

    first.unmount()
    renderPage(<LessonGallery assignmentId='a1' />)
    await screen.findByText('robot.stl')
    expect(screen.queryByText('Мои файлы · 1')).toBeNull()
  })

  it('moves a file next to the neighbour the teacher sees when own files are apart', async () => {
    const [g1, g2] = gallery().items
    const g3 = { ...g1, id: 'g3', file: file('f3', 'boat.stl') }
    const managed = gallery({
      canManage: true,
      items: [g1, g2, g3].map(it => ({ ...it, canRemove: true })),
    })
    api.getGallery.mockResolvedValue({ data: managed })
    api.reorderGallery.mockResolvedValue({ data: managed })
    renderPage(<LessonGallery assignmentId='a1' />)

    await screen.findByText('Файлы класса · 2')
    // Class files: robot (g1), boat (g3); "later" on robot swaps it with boat, not with car (g2).
    const later = screen.getAllByRole('button', { name: 'Переместить позже' })
    fireEvent.click(later[1])
    await waitFor(() => expect(api.reorderGallery).toHaveBeenCalledWith('a1', ['g3', 'g2', 'g1']))
  })

  it('tells a student the teacher closed the gallery', async () => {
    api.getGallery.mockResolvedValue({ data: gallery({ closed: true, canUpload: false }) })
    renderPage(<LessonGallery assignmentId='a1' />)

    expect(await screen.findByText('Учитель закрыл добавление файлов в эту галерею.')).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Загрузить файлы/ })).toBeNull()
  })

  it('lets a teacher pin, reorder and close the gallery', async () => {
    const managed = gallery({
      canManage: true,
      items: gallery().items.map(it => ({ ...it, canRemove: true, mine: false })),
    })
    api.getGallery.mockResolvedValue({ data: managed })
    api.updateGalleryItem.mockResolvedValue({ data: managed })
    api.reorderGallery.mockResolvedValue({ data: managed })
    api.setGalleryClosed.mockResolvedValue({ data: { ...managed, closed: true } })
    const onChanged = jest.fn()
    renderPage(<LessonGallery assignmentId='a1' onChanged={onChanged} />)

    await screen.findByText('robot.stl')
    expect(screen.getAllByRole('button', { name: 'Убрать из галереи' })).toHaveLength(2)

    fireEvent.click(screen.getAllByRole('button', { name: 'Закрепить' })[1])
    await waitFor(() =>
      expect(api.updateGalleryItem).toHaveBeenCalledWith('a1', 'g2', { pinned: true }),
    )

    fireEvent.click(screen.getAllByRole('button', { name: 'Переместить позже' })[0])
    await waitFor(() => expect(api.reorderGallery).toHaveBeenCalledWith('a1', ['g2', 'g1']))

    fireEvent.click(screen.getByRole('switch', { name: 'Ученики могут добавлять файлы' }))
    await waitFor(() => expect(api.setGalleryClosed).toHaveBeenCalledWith('a1', true))
    expect(onChanged).toHaveBeenCalled()
  })

  it('keeps a pinned file ahead of the others', async () => {
    // One list for everyone's files, so both are side by side.
    window.localStorage.setItem('lessonGallery.splitMine', '0')
    const { items } = gallery()
    api.getGallery.mockResolvedValue({
      data: gallery({ canManage: true, items: [{ ...items[0], pinned: true }, items[1]] }),
    })
    renderPage(<LessonGallery assignmentId='a1' />)

    await screen.findByText('robot.stl')
    const later = screen.getAllByRole('button', { name: 'Переместить позже' })
    expect(later[0].disabled).toBe(true)
  })
})

describe('LessonGalleryButton', () => {
  it('is hidden while galleries are off', () => {
    const { container } = renderPage(
      <LessonGalleryButton assignment={{ id: 'a1', title: 'Урок', galleryCount: 3 }} />,
    )
    expect(container.textContent).toBe('')
  })

  it('shows the number of files', () => {
    renderPage(
      <LessonGalleryButton
        assignment={{ id: 'a1', title: 'Урок', galleryEnabled: true, galleryCount: 3 }}
      />,
    )
    expect(screen.getByRole('button', { name: /Галерея урока \(3\)/ })).toBeTruthy()
  })
})

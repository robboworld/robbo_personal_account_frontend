import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import FilePickerModal from '@/components/FilePickerModal'
import { fetchFileBlob } from '@/api/userFiles'
import { renderPage } from '@/testUtils'

jest.mock('@/api/userFiles', () => ({
  ...jest.requireActual('@/api/userFiles'),
  fetchFileBlob: jest.fn(() => new Promise(() => {})),
}))

// antd Select, Checkbox and Text measure themselves; jsdom has no ResizeObserver. The Select
// opens through MessageChannel, which jsdom lacks too.
class TimeoutMessageChannel {
  port1 = {}

  port2 = { postMessage: () => setTimeout(() => this.port1.onmessage?.()) }
}

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

const files = [
  { id: 'p1', name: 'robot.png', kind: 'png', sizeBytes: 2048, createdAt: '2026-11-10T10:00:00Z' },
  { id: 'p2', name: 'car.jpg', kind: 'jpeg', sizeBytes: 4096, createdAt: '2026-11-09T10:00:00Z' },
  { id: 's1', name: 'model.stl', kind: 'stl', sizeBytes: 9000, createdAt: '2026-11-11T10:00:00Z' },
  { id: 'd1', name: 'схема.pdf', kind: 'pdf', sizeBytes: 100, createdAt: '2026-11-01T10:00:00Z' },
  { id: 'w1', name: 'отчёт.docx', kind: 'docx', sizeBytes: 500, createdAt: '2026-11-05T10:00:00Z' },
]

const render = props => {
  const onPick = jest.fn()
  renderPage(
    <FilePickerModal
      open
      title='Из «Моих файлов»'
      okText='Добавить'
      files={files}
      onCancel={() => {}}
      onPick={onPick}
      {...props}
    />,
  )
  return onPick
}

// Tile checkboxes are inputs; the type chips are checkboxes too, but spans.
const tileNames = () =>
  screen
    .getAllByRole('checkbox')
    .filter(c => c.tagName === 'INPUT')
    .map(c => c.getAttribute('aria-label'))

describe('FilePickerModal', () => {
  beforeEach(() => jest.clearAllMocks())

  it('shows every file as a tile, newest first, and loads only picture previews', async () => {
    render()
    expect(tileNames()).toEqual(['model.stl', 'robot.png', 'car.jpg', 'отчёт.docx', 'схема.pdf'])
    expect(screen.getByText(/2 КБ · 10\.11\.2026/)).toBeTruthy()
    await waitFor(() =>
      expect(fetchFileBlob.mock.calls.map(c => c[0]).sort()).toEqual(['p1', 'p2']),
    )
  })

  it('finds files by name', () => {
    render()
    fireEvent.change(screen.getByRole('textbox', { name: 'Поиск по имени' }), {
      target: { value: 'ROB' },
    })
    expect(tileNames()).toEqual(['robot.png'])
    fireEvent.change(screen.getByRole('textbox', { name: 'Поиск по имени' }), {
      target: { value: 'zzz' },
    })
    expect(screen.getByText('Ничего не нашлось')).toBeTruthy()
  })

  it('filters by several types at once, documents split by kind', () => {
    render()
    expect(screen.getByText('Все 5')).toBeTruthy()
    expect(screen.getByText('PDF 1')).toBeTruthy()
    expect(screen.getByText('Тексты 1')).toBeTruthy()
    expect(screen.queryByText(/Таблицы/)).toBeNull()

    fireEvent.click(screen.getByText('Картинки 2'))
    expect(tileNames()).toEqual(['robot.png', 'car.jpg'])
    fireEvent.click(screen.getByText('PDF 1'))
    expect(tileNames()).toEqual(['robot.png', 'car.jpg', 'схема.pdf'])
    fireEvent.click(screen.getByText('Картинки 2'))
    expect(tileNames()).toEqual(['схема.pdf'])
    fireEvent.click(screen.getByText('Все 5'))
    expect(tileNames()).toHaveLength(5)
  })

  it('sorts by any field in either direction', async () => {
    render()
    fireEvent.click(screen.getByRole('button', { name: 'По убыванию' }))
    expect(tileNames()).toEqual(['схема.pdf', 'отчёт.docx', 'car.jpg', 'robot.png', 'model.stl'])

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Сортировать' }))
    fireEvent.click(await screen.findByText('По типу'))
    expect(tileNames()).toEqual(['car.jpg', 'robot.png', 'model.stl', 'схема.pdf', 'отчёт.docx'])

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Сортировать' }))
    fireEvent.click(await screen.findByText('По размеру'))
    expect(tileNames()).toEqual(['model.stl', 'car.jpg', 'robot.png', 'отчёт.docx', 'схема.pdf'])
    fireEvent.click(screen.getByRole('button', { name: 'По убыванию' }))
    expect(tileNames()).toEqual(['схема.pdf', 'отчёт.docx', 'robot.png', 'car.jpg', 'model.stl'])
  })

  it('shows the type chips even when every file is of one type', () => {
    render({ files: files.filter(f => f.kind === 'stl') })
    expect(screen.getByText('Все 1')).toBeTruthy()
    expect(screen.getByText('3D-модели 1')).toBeTruthy()
  })

  it('greys out a file that cannot be picked and tells why', () => {
    render({ unavailable: f => (f.id === 'p1' ? 'Уже в галерее' : null) })
    expect(screen.getByText('Уже в галерее')).toBeTruthy()
    expect(screen.getByRole('checkbox', { name: 'robot.png' }).disabled).toBe(true)
    expect(screen.getByRole('checkbox', { name: 'car.jpg' }).disabled).toBe(false)
  })

  it('stops at the limit and hands over the picked files', async () => {
    const onPick = render({ max: 2 })
    expect(screen.getByText(/Выбрано: 0 · можно ещё 2/)).toBeTruthy()

    fireEvent.click(screen.getByRole('checkbox', { name: 'car.jpg' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'model.stl' }))
    expect(screen.getByText(/Выбрано: 2 · можно ещё 0/)).toBeTruthy()
    expect(screen.getByRole('checkbox', { name: 'robot.png' }).disabled).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: /Добавить \(2\)/ }))
    await waitFor(() => expect(onPick).toHaveBeenCalled())
    expect(onPick.mock.calls[0][0].map(f => f.id)).toEqual(['s1', 'p2'])
  })

  it('keeps a picked file picked while the search hides it', () => {
    const onPick = render()
    fireEvent.click(screen.getByRole('checkbox', { name: 'robot.png' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Поиск по имени' }), {
      target: { value: 'car' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: 'car.jpg' }))
    fireEvent.click(screen.getByRole('button', { name: /Добавить \(2\)/ }))
    expect(onPick.mock.calls[0][0].map(f => f.id)).toEqual(['p1', 'p2'])
  })

  it('says so when the library is empty', () => {
    render({ files: [], emptyText: 'Подходящих файлов нет. Загрузите новый.' })
    expect(screen.getByText('Подходящих файлов нет. Загрузите новый.')).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Добавить/ })).toBeNull()
  })
})

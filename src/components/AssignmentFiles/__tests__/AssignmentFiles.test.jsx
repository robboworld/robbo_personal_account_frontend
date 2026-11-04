import React from 'react'
import { screen } from '@testing-library/react'

import AssignmentFiles from '@/components/AssignmentFiles'
import { renderPage } from '@/testUtils'

describe('AssignmentFiles', () => {
  it('puts the empty text on its own line, under the heading', () => {
    renderPage(
      <div>
        <strong>Ваши файлы</strong>
        <AssignmentFiles files={[]} emptyText='Файлов пока нет' />
      </div>,
    )
    expect(screen.getByText('Файлов пока нет').style.display).toBe('block')
  })

  it('renders nothing without files and empty text', () => {
    const { container } = renderPage(<AssignmentFiles files={[]} />)
    expect(container.textContent).toBe('')
  })

  it('lists the name and size of each file', () => {
    renderPage(<AssignmentFiles files={[{ id: 'f1', name: 'model.stl', sizeBytes: 2048 }]} />)
    expect(screen.getByText('model.stl')).toBeTruthy()
    expect(screen.getByText('2 КБ')).toBeTruthy()
  })

  it('keeps the row actions level with the name inside a vertical list', () => {
    const { container } = renderPage(
      <AssignmentFiles
        files={[{ id: 'f1', name: 'model.stl', sizeBytes: 2048 }]}
        download={jest.fn()}
      />,
    )
    expect(container.querySelector('.ant-list-item').style.alignItems).toBe('center')
    expect(container.querySelector('.ant-list-item-action').style.marginTop).toBe('0px')
  })
})

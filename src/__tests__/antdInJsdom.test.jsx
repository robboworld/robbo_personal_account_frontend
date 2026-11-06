import React from 'react'
import { Button, ConfigProvider, Popover } from 'antd'
import { render, screen, waitFor } from '@testing-library/react'

const countRules = () =>
  Array.from(document.styleSheets).reduce((sum, sheet) => sum + sheet.cssRules.length, 0)

const popover = open => (
  <ConfigProvider theme={{ motion: false }}>
    <Popover open={open} content={<button>Внутри</button>}>
      <span>Цель</span>
    </Popover>
  </ConfigProvider>
)

// What src/setupTests.js does to antd. The hook there is an antd internal: if it moves, the rules
// quietly come back and role queries go from milliseconds to seconds, so the first test says so.
describe('antd in jsdom', () => {
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

  it('keeps the look out of the document', () => {
    render(<Button>Сохранить</Button>)
    expect(document.querySelector('style[data-css-hash]')).toBeTruthy()
    expect(countRules()).toBeLessThan(50)
  })

  it('still hides what antd hides by a class', async () => {
    const { rerender } = render(popover(true))
    expect(await screen.findByRole('button', { name: 'Внутри' })).toBeTruthy()

    rerender(popover(false))
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Внутри' })).toBeNull())
    expect(screen.getByRole('button', { name: 'Внутри', hidden: true })).toBeTruthy()
  })
})

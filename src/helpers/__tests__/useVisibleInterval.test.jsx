import React from 'react'
import { act, render } from '@testing-library/react'

import { useVisibleInterval } from '@/helpers/useVisibleInterval'

const Poller = ({ onTick }) => {
  useVisibleInterval(onTick, 1000)
  return null
}

describe('useVisibleInterval', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => {
    jest.useRealTimers()
    delete document.hidden
  })

  it('repeats while the tab is visible and stays silent in a hidden one', () => {
    const onTick = jest.fn()
    render(<Poller onTick={onTick} />)
    act(() => jest.advanceTimersByTime(2000))
    expect(onTick).toHaveBeenCalledTimes(2)

    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    act(() => jest.advanceTimersByTime(5000))
    expect(onTick).toHaveBeenCalledTimes(2)
  })

  it('stops with the component', () => {
    const onTick = jest.fn()
    const { unmount } = render(<Poller onTick={onTick} />)
    unmount()
    act(() => jest.advanceTimersByTime(5000))
    expect(onTick).not.toHaveBeenCalled()
  })
})

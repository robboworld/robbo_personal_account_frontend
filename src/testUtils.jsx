import React from 'react'
import { render } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { MemoryRouter } from 'react-router-dom'

import ru from '@/lang/ru.json'

/** antd reads matchMedia; jsdom has none. */
export function installMatchMedia() {
  if (!window.matchMedia) {
    window.matchMedia = query => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    })
  }
}

/** A page with the real Russian texts and a router. */
export function renderPage(ui) {
  installMatchMedia()
  return render(
    <IntlProvider locale='ru' messages={ru} onError={() => {}}>
      <MemoryRouter>{ui}</MemoryRouter>
    </IntlProvider>,
  )
}

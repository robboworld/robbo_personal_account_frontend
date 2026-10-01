import React from 'react'
import { act, render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'

import ScratchPlayerEmbed from '@/components/ScratchPlayerEmbed'

const playToken = { jsonUrl: 'http://localhost:8080/projectPage/1/json?token=t' }

const renderPlayer = props => render(
  <IntlProvider
    locale='ru'
    messages={{}}
    onError={() => {}}
  >
    <ScratchPlayerEmbed
      projectPageId='1'
      playToken={playToken}
      {...props}
    />
  </IntlProvider>,
)

const sendReady = () => {
  const iframe = document.querySelector('iframe')
  act(() => {
    window.dispatchEvent(new MessageEvent('message', { data: { type: 'scratch:ready' }, source: iframe.contentWindow }))
  })
}

describe('ScratchPlayerEmbed cover', () => {
  it('uses the uploaded preview image when there is one', () => {
    renderPlayer({ preview: '/projectPage/1/preview', previewCacheKey: '5' })
    sendReady()
    // jsdom drops gradient backgrounds, so check the mode: the image cover stays.
    expect(screen.getByRole('button').className).not.toContain('--stage')
  })

  it('without a preview shows the loaded stage through a light cover', () => {
    renderPlayer({ preview: '' })
    const cover = screen.getByRole('button')
    expect(cover.className).not.toContain('--stage') // dark while loading
    sendReady()
    expect(cover.className).toContain('scratch-player-embed__cover--stage')
  })
})

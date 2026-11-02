import React from 'react'
import { act, render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'

import ScratchPlayerEmbed from '@/components/ScratchPlayerEmbed'
import { mapPlayerErrorMessage } from '@/components/ScratchPlayerEmbed/ScratchPlayerEmbed'

const playToken = { jsonUrl: 'http://localhost:8080/projectPage/1/json?token=t' }

const renderPlayer = props =>
  render(
    <IntlProvider locale='ru' messages={{}} onError={() => {}}>
      <ScratchPlayerEmbed projectPageId='1' playToken={playToken} {...props} />
    </IntlProvider>,
  )

const sendReady = () => {
  const iframe = document.querySelector('iframe')
  act(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'scratch:ready' },
        source: iframe.contentWindow,
      }),
    )
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

describe('mapPlayerErrorMessage', () => {
  const intl = { formatMessage: ({ id }) => id }

  it.each([
    'can\'t access property "assetId", costume.asset is null',
    "Cannot read properties of null (reading 'assetId')",
  ])('maps a missing costume or sound to missing_assets: %s', raw => {
    expect(mapPlayerErrorMessage(raw, intl)).toBe('project_page.missing_assets')
  })

  it('keeps other player messages as they are', () => {
    expect(mapPlayerErrorMessage('INVALID_PROJECT_FILE', intl)).toBe('project_page.invalid_project_file')
    expect(mapPlayerErrorMessage('boom', intl)).toBe('boom')
  })
})

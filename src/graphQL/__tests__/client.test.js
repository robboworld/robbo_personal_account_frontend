/** @jest-environment node */
import { gql } from '@apollo/client'

import { graphQLClient } from '@/graphQL/client'
import { getAccessToken, setAccessToken } from '@/helpers/accessTokenMemory'

const QUERY = gql`query Ping { Ping { ok } }`
const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json' },
})

describe('graphQLClient token refresh', () => {
  afterEach(() => {
    delete global.fetch
    graphQLClient.clearStore()
  })

  it('refreshes an expired access token once and repeats the operation', async () => {
    setAccessToken('expired')
    const seenTokens = []
    global.fetch = jest.fn(async (url, init) => {
      if (String(url).endsWith('/auth/refresh')) {
        return json(200, { accessToken: 'fresh' })
      }
      const auth = new Headers(init.headers).get('authorization')
      seenTokens.push(auth)
      return auth === 'Bearer fresh'
        ? json(200, { data: { Ping: { __typename: 'Pong', ok: true } } })
        : json(401, { error: 'INVALID_TOKEN', code: 'INVALID_TOKEN' })
    })

    const { data } = await graphQLClient.query({ query: QUERY, fetchPolicy: 'network-only' })
    expect(data.Ping.ok).toBe(true)
    expect(seenTokens).toEqual(['Bearer expired', 'Bearer fresh'])
    expect(getAccessToken()).toBe('fresh')
  })

  it('does not retry other 401s (no token: BFF cookie session)', async () => {
    setAccessToken('')
    global.fetch = jest.fn(async () => json(401, { error: 'SESSION_NOT_FOUND', code: 'SESSION_NOT_FOUND' }))
    await expect(graphQLClient.query({ query: QUERY, fetchPolicy: 'network-only' })).rejects.toBeTruthy()
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
})

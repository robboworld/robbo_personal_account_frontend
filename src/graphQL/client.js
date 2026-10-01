import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, ServerError } from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'

import config from '@/config'
import { readStoredLanguage } from '@/helpers/intl'
import { buildInactiveLoginURL } from '@/helpers/inactiveLogin'
import { clearAccessToken, getAccessToken } from '@/helpers/accessTokenMemory'
import { refreshAccessToken } from '@/api/authRefresh'

/** JSON body ({ code, error, ban }) of a non-2xx backend response, or null. */
export function serverErrorBody (error) {
    if (!ServerError.is(error)) {
        return null
    }
    try {
        return JSON.parse(error.bodyText)
    } catch {
        return null
    }
}

const httpLink = new HttpLink({
    uri: config.graphQLURL[0],
    credentials: 'include',
})

const authLink = new SetContextLink(prevContext => {
    const token = getAccessToken()
    return {
        headers: {
            ...prevContext.headers,
            authorization: token ? `Bearer ${token}` : '',
            'Accept-Language': readStoredLanguage(),
            'X-Requested-With': 'XMLHttpRequest',
        },
    }
})

// An expired access token (LMS password login) answers 401 INVALID_TOKEN: refresh once
// and repeat the operation. The old check looked for an ExpiredBy field the backend never
// sends, so GraphQL calls never refreshed. BFF cookie sessions send no token: no retry.
const retryLink = new RetryLink({
    delay: {
        initial: 100,
        max: 5000,
    },
    attempts: {
        max: 3,
        retryIf: async error => {
            if (!ServerError.is(error) || error.statusCode !== 401) {
                return false
            }
            if (serverErrorBody(error)?.code !== 'INVALID_TOKEN' || !getAccessToken()) {
                return false
            }
            clearAccessToken()
            try {
                await refreshAccessToken()
                return true
            } catch (_) {
                return false
            }
        },
    },
})

const errorLink = new ErrorLink(({ error }) => {
    if (!ServerError.is(error) || error.statusCode !== 403) {
        return
    }
    const body = serverErrorBody(error)
    if (body?.code === 'USER_INACTIVE' || error.bodyText === 'USER_INACTIVE') {
        clearAccessToken()
        window.location.assign(buildInactiveLoginURL(body?.ban || null))
    }
})

export const graphQLClient = new ApolloClient({
    link: ApolloLink.from([errorLink, retryLink, authLink, httpLink]),
    cache: new InMemoryCache(),
})

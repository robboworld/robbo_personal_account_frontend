import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from "@apollo/client/link/retry"

import config from '@/config'
import { readStoredLanguage } from '@/helpers/intl'
import { buildInactiveLoginURL } from '@/helpers/inactiveLogin'
import { clearAccessToken, getAccessToken } from '@/helpers/accessTokenMemory'
import { refreshAccessToken } from '@/api/authRefresh'


const httpLink = createHttpLink({
    uri: config.graphQLURL[0],
    credentials: 'include',
})

const authLink = setContext((_, { headers }) => {
    const token = getAccessToken()
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
            'Accept-Language': readStoredLanguage(),
            'X-Requested-With': 'XMLHttpRequest',
        },
    }
})

const retryLink = new RetryLink({
    delay: {
        initial: 100,
        max: 5000,
    },
    attempts: {
        max: 3,
        // Network errors have no .result: reading error.result.ExpiredBy threw a TypeError.
        retryIf: async error => {
            if (!error?.result?.ExpiredBy || error?.statusCode !== 401) {
                return false
            }
            clearAccessToken()
            try {
                await refreshToken()
                return true
            } catch (_) {
                return false
            }
        },
    },
})

const errorLink = onError(({ networkError }) => {
    const result = typeof networkError?.result === 'object' ? networkError.result : null
    const code = result?.code || networkError?.result?.code || networkError?.bodyText
    if (networkError?.statusCode === 403 && code === 'USER_INACTIVE') {
        clearAccessToken()
        window.location.assign(buildInactiveLoginURL(result?.ban || null))
    }
})

export const graphQLClient = new ApolloClient({
    link: from([errorLink, retryLink, authLink, httpLink]),
    cache: new InMemoryCache(),
})

const refreshToken = async () => {
    try {
        return await refreshAccessToken()
    } catch (err) {
        clearAccessToken()
        throw err
    }
}

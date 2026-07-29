import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from "apollo-link-error"
import { RetryLink } from "@apollo/client/link/retry"

import { authMutationsGQL } from './mutation'

import config from '@/config'
import { readStoredLanguage } from '@/helpers/intl'
import { buildInactiveLoginURL } from '@/helpers/inactiveLogin'


const httpLink = createHttpLink({
    uri: config.graphQLURL[0],
    credentials: 'include',
})

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
            'Accept-Language': readStoredLanguage(),
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
        retryIf: async error => {
            if (error && error.result.ExpiredBy && error.statusCode === 401) {
                localStorage.removeItem('token')
                const accessToken = await refreshToken()
                return true
            }
        },
    },
})

const errorLink = onError(({ networkError }) => {
    const result = typeof networkError?.result === 'object' ? networkError.result : null
    const code = result?.code || networkError?.result?.code || networkError?.bodyText
    if (networkError?.statusCode === 403 && code === 'USER_INACTIVE') {
        localStorage.removeItem('token')
        window.location.assign(buildInactiveLoginURL(result?.ban || null))
    }
})

export const graphQLClient = new ApolloClient({
    link: from([errorLink, retryLink, authLink, httpLink]),
    cache: new InMemoryCache(),
})

const refreshToken = async () => {
    try {
        const refreshResolverResponse = await graphQLClient.mutate({
            mutation: authMutationsGQL.REFRESH_TOKEN,
        })
        const accessToken = refreshResolverResponse.data?.Refresh.accessToken
        localStorage.setItem('token', accessToken || '')
        return accessToken
    } catch (err) {
        localStorage.clear()
        console.error(err)
        throw err
    }
}
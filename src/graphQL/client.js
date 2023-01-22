import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from "apollo-link-error"
import { RetryLink } from "@apollo/client/link/retry"

import { authMutationsGQL } from './mutation'

import config from '@/config'


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

const errorLink = onError(
    async ({ graphQLErrors, networkError, operation, forward }) => {
        if (networkError.statusCode === 401 && networkError.result.ExpiredBy) {
            localStorage.removeItem('token')
            const accessToken = await refreshToken()
            const oldHeaders = operation.getContext().headers
            operation.setContext({
                headers: {
                    ...oldHeaders,
                    authorization: accessToken ? `Bearer ${accessToken}` : "",
                },
            })
            console.log(operation)
            return forward(operation)
        }
    },
)

export const graphQLClient = new ApolloClient({
    link: from([retryLink, authLink, httpLink]),
    cache: new InMemoryCache(),
})

const refreshToken = async () => {
    try {
        const refreshResolverResponse = await graphQLClient.mutate({
            mutation: authMutationsGQL.REFRESH_TOKEN,
        })
        const accessToken = refreshResolverResponse.data?.Refresh.accessToken
        console.log(accessToken)
        localStorage.setItem('token', accessToken || '')
        return accessToken
    } catch (err) {
        localStorage.clear()
        console.error(err)
        throw err
    }
}
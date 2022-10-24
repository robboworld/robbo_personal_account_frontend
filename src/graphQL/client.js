import { ApolloClient, InMemoryCache } from '@apollo/client'

import config from '@/config'

export const graphQLClient = new ApolloClient({
    uri: config.graphQLURL[0],
    cache: new InMemoryCache(),
})
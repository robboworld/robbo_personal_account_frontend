import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const authMutationsGQL = {
    SIGN_IN: gql`
        mutation SingIn($input: SignInInput!){
            SingIn(input: $input) {
                ... on SingInResponse {
                    accessToken
                }
            }
        }
    `,

    REFRESH_TOKEN: gql`
        mutation {
            Refresh{
                ... on SingInResponse {
                    accessToken
                }
            }
        }
    `,

    SING_OUT: gql`
        mutation{
            SingOut{
                message
            }
        }
    `,
}

export const authMutationsGraphQL = {
    SingIn(email, password, userRole) {
        return graphQLClient.mutate(
            {
                mutation: authMutationsGQL.SIGN_IN,
                variables: { input: { email, password, userRole } },
            },
        )
    },

    Refresh() {
        return graphQLClient.mutate(
            {
                mutation: authMutationsGQL.REFRESH_TOKEN,
            },
        )
    },

    SingOut() {
        return graphQLClient.mutate(
            {
                mutation: authMutationsGQL.SING_OUT,
            },
        )
    },
}
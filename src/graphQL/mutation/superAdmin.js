import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const superAdminMutationsGQL = {
    UPDATE_SUPER_ADMIN: gql`
    mutation UpdateSuperAdmin($input: UpdateProfileInput!) {
        UpdateSuperAdmin(input: $input) {
            ... on SuperAdminHttp {
                userHttp{
                    id
                    lastname
                    firstname
                    middlename
                    nickname
                    email
                    createdAt
                    role
                }
            }

            ... on Error {
                message
            }
        }
    }
    `,
}

export const superAdminMutationsGraphQL = {

}
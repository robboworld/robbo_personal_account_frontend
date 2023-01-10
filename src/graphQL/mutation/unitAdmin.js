import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const unitAdminMutationsGQL = {
    UPDATE_UNIT_ADMIN: gql`
    mutation UpdateUnitAdmin($input: UpdateProfileInput!) {
        UpdateUnitAdmin(input: $input) {
            ... on UnitAdminHttp {
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

export const unitAdminMutationsGraphQL = {

}
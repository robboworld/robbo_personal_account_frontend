import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"
import { USER_PROFILE_FIELDS } from "@/graphQL/fragments/userProfileFields"

export const superAdminMutationsGQL = {
    UPDATE_SUPER_ADMIN: gql`
    mutation UpdateSuperAdmin($input: UpdateProfileInput!) {
        UpdateSuperAdmin(input: $input) {
            ... on SuperAdminHttp {
                userHttp{
                    ${USER_PROFILE_FIELDS}
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
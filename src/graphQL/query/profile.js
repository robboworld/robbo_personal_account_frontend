import { gql } from "@apollo/client"

import { USER_PROFILE_FIELDS } from "@/graphQL/fragments/userProfileFields"

const userHttpFragment = `
    userHttp {
        ${USER_PROFILE_FIELDS}
    }
`

export const profileGQL = {
    GET_USER: gql`
        query GetUser($peekUserId: String, $peekUserRole: Int) {
            GetUser(peekUserId: $peekUserId, peekUserRole: $peekUserRole) {
                __typename
                ... on StudentHttp{
                    ${userHttpFragment}
                    robboGroupId
                    robboUnitId
                }
                ... on ParentHttp{
                    ${userHttpFragment}
                }
                ... on TeacherHttp{
                    ${userHttpFragment}
                }
                ... on UnitAdminHttp{
                    ${userHttpFragment}
                }
                ... on SuperAdminHttp{
                    ${userHttpFragment}
                }
                ... on FreeListenerHttp {
                    ${userHttpFragment}
                }
            }
        }
    `,
}

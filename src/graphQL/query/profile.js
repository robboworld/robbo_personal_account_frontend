import { gql } from "@apollo/client"

export const profileGQL = {
    GET_USER: gql`
        query GetUser($peekUserId: String, $peekUserRole: Int) {
            GetUser(peekUserId: $peekUserId, peekUserRole: $peekUserRole) {
                __typename
                ... on StudentHttp{
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
                    robboGroupId
                    robboUnitId
                }
                ... on ParentHttp{
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
                ... on TeacherHttp{
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
                ... on UnitAdminHttp{
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
                ... on SuperAdminHttp{
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
            }
        }
    `,
}
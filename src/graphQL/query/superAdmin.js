import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const superAdminQuerysGQL = {
    GET_SUPER_ADMIN_BY_ID: gql`
    query GetSuperAdminById($superAdminId: String!){
        GetStudentById(superAdminId: $superAdminId){
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
            ... on Error{
                message
            }
        }
    }
    `,
}

export const superAdminQuerysGraphQL = {
    getSuperAdminById(superAdminId) {
        return graphQLClient.query(
            {
                query: superAdminQuerysGQL.GET_SUPER_ADMIN_BY_ID,
                variables: superAdminId,
            },
        )
    },
}
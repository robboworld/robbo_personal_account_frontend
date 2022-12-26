import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const unitAdminQuerysGQL = {
    GET_UNIT_ADMIN_BY_ID: gql`
    query GetUnitAdminById($unitAdminId: String!){
        GetUnitAdminById(unitAdminId: $unitAdminId){
            ... on UnitAdminHttp{
                    userHttp {
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

    GET_ALL_UNIT_ADMINS: gql`
        query{
            GetAllUnitAdmins{
                userHttp{
                    id
                    lastname
                    firstname
                    middlename
                }
        }
    }`,

    GET_UNIT_ADMIN_BY_ROBBO_UNIT_ID:
        gql`
        query GetUnitAdminsByRobboUnitId($robboUnitId: String!){
            GetUnitAdminsByRobboUnitId(robboUnitId: $robboUnitId){
                userHttp{
                    id
                    lastname
                    firstname
                    middlename
                }
            }
        }
    `,

    SEARCH_UNIT_ADMIN_BY_EMAIL: gql`
        query SearchUnitAdminsByEmail($email: String!) {
            SearchUnitAdminsByEmail(email: $email) {
                userHttp{
                    id
                    lastname
                    firstname
                    middlename
                }
            }
        }
    `,
}

export const unitAdminQuerysGraphQL = {
    getUnitAdminById(unitAdminId) {
        return graphQLClient.query(
            {
                query: unitAdminQuerysGQL.GET_UNIT_ADMIN_BY_ID,
                variables: unitAdminId,
            },
        )
    },

    getUnitAdminsByRobboUnitId(robboUnitId) {
        return graphQLClient.query(
            {
                query: unitAdminQuerysGQL.GET_UNIT_ADMIN_BY_ROBBO_UNIT_ID,
                variables: robboUnitId,
            },
        )
    },

    searchUnitAdminsByEmail(email) {
        return graphQLClient.query(
            {
                query: unitAdminQuerysGQL.SEARCH_UNIT_ADMIN_BY_EMAIL,
                variables: email,
            },
        )
    },
}
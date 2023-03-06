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
        query GetAllUnitAdmins($page: String!, $pageSize: String!){
            GetAllUnitAdmins(page: $page, pageSize: $pageSize){
                ... on UnitAdminHttpList{
                unitAdmins {
                    userHttp{
                        id
                        lastname
                        firstname
                        middlename
                    }
                }
                countRows
            }
            ... on Error{
                message
            }
        }
    }`,

    GET_UNIT_ADMINS_BY_ROBBO_UNIT_ID: gql`
    query GetUnitAdminsByRobboUnitId($robboUnitId: String!){
        GetUnitAdminsByRobboUnitId(robboUnitId: $robboUnitId){
            ... on UnitAdminHttpList{
                unitAdmins {
                    userHttp{
                        id
                        lastname
                        firstname
                        middlename
                    }
                }
            }
            ... on Error{
                message
            }
        }
    }
    `,

    SEARCH_UNIT_ADMINS_BY_EMAIL: gql`
    query SearchUnitAdminsByEmail($email: String!, $page: String!, $pageSize: String!){
        SearchUnitAdminsByEmail(email: $email, page: $page, pageSize: $pageSize){
            ... on UnitAdminHttpList{
                unitAdmins {
                    userHttp{
                        id
                        lastname
                        firstname
                        middlename
                    }
                }
            }
            ... on Error{
                message
            }
        }
    }
    `,
}

export const unitAdminQuerysGraphQL = {
    GetUnitAdminById(unitAdminId) {
        return graphQLClient.query(
            {
                query: unitAdminQuerysGQL.GET_UNIT_ADMIN_BY_ID,
                variables: unitAdminId,
            },
        )
    },

    GetAllUnitAdmins(page, pageSize) {
        return graphQLClient.query(
            {
                query: unitAdminQuerysGQL.GET_ALL_UNIT_ADMINS,
                variables: { page: "1", pageSize: "10" },
            },
        )
    },

    GetUnitAdminsByRobboUnitId(robboUnitId) {
        return graphQLClient.query(
            {
                query: unitAdminQuerysGQL.GET_UNIT_ADMINS_BY_ROBBO_UNIT_ID,
                variables: robboUnitId,
            },
        )
    },

    SearchUnitAdminByEmail(email, robboUnitId) {
        return graphQLClient.query(
            {
                query: unitAdminQuerysGQL.SEARCH_UNIT_ADMINS_BY_EMAIL,
                variables: { email, robboUnitId },
            },
        )
    },
}
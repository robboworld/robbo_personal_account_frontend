import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const robboUnitGQL = {
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
        query SearchUnitAdminsByEmail($email: String!){
            SearchUnitAdminsByEmail(email: $email){
                ... on UnitAdminsHttpList{
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

    GET_ROBBO_UNIT_BY_ID: gql`
        query GetRobboUnitById($id: String!){
            GetRobboUnitById(id: $id){
                ... on RobboUnitHttp {
                    id
                    name
                    city
                    lastModified
                }
                ... on Error {
                    message
                }
            }
        }
    `,

    GET_ALL_ROBBO_UNITS: gql`
        query {
            GetAllRobboUnits{
                ... on RobboUnitHttpList {
                    robboUnits {name}
                }
                ... on Error {
                    message
                }
            }
        }
    `,

    GET_ROBBO_UNITS_BY_UNIT_ADMIN_ID: gql`
        query GetRobboUnitsByUnitAdminId($unitAdminId: String!){
            GetRobboUnitsByUnitAdminId(unitAdminId: $unitAdminId){
                ... on RobboUnitHttpList {
                    robboUnits{
                        id
                        name
                        city
                        lastModified
                    }
                }
                ... on Error {
                    message
                }
            }
        }
    `,
}

export const robboUnitQueryGraphQL = {
    GetUnitAdminsByRobboUnitId(robboUnitId) {
        return graphQLClient.query(
            {
                query: robboUnitGQL.GET_UNIT_ADMINS_BY_ROBBO_UNIT_ID,
                variables: robboUnitId,
            },
        )
    },

    SearchUnitAdminByEmail(email) {
        return graphQLClient.query(
            {
                query: robboUnitGQL.SEARCH_UNIT_ADMINS_BY_EMAIL,
                variables: email,
            },
        )
    },
    getRobboUnitsByUnitAdminId(unitAdminId) {
        return graphQLClient.query(
            {
                query: robboUnitGQL.GET_ROBBO_UNITS_BY_UNIT_ADMIN_ID,
                variables: unitAdminId,
            },
        )
    },
}
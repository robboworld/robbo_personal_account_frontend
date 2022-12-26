import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const robboUnitQuerysGQL = {
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
        query GetAllRobboUnits($page: String!, $pageSize: String!){
            GetAllRobboUnits(page: $page, pageSize: $pageSize){
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

export const robboUnitQuerysGraphQL = {
    getRobboUnitById(id) {
        return graphQLClient.query(
            {
                query: robboUnitQuerysGQL.GET_ROBBO_UNIT_BY_ID,
                variables: id,
            },
        )
    },

    getRobboUnitsByUnitAdminId(unitAdminId) {
        return graphQLClient.query(
            {
                query: robboUnitQuerysGQL.GET_ROBBO_UNITS_BY_UNIT_ADMIN_ID,
                variables: unitAdminId,
            },
        )
    },

    getAllRobboUnits(page, pageSize) {
        return graphQLClient.query(
            {
                query: robboUnitQuerysGQL.GET_ALL_ROBBO_UNITS,
                variables: { page: "1", pageSize: "10" },
            },
        )
    },
}
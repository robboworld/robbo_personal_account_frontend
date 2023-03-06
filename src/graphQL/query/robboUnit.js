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
                    robboUnits {
                        id
                        name
                    }
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

    GET_ROBBO_UNITS_BY_ACCESS_TOKEN: gql`
        query GetRobboUnitsByAccessToken($page: String!, $pageSize: String!){
            GetRobboUnitsByAccessToken(page: $page, pageSize: $pageSize){
                ... on RobboUnitHttpList {
                    robboUnits{
                        id
                        name
                        city
                        lastModified
                    }
                    countRows
                }
                ... on Error {
                    message
                }
            }
        }
    `,

    SEARCH_ROBBO_UNITS_BY_NAME: gql`
        query SearchRobboUnitsByName($name: String!,$page: String!, $pageSize: String!) {
            SearchRobboUnitsByName(name: $name, page: $page, pageSize: $pageSize) {
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
    GetRobboUnitById(id) {
        return graphQLClient.query(
            {
                query: robboUnitQuerysGQL.GET_ROBBO_UNIT_BY_ID,
                variables: id,
            },
        )
    },

    GetRobboUnitsByUnitAdminId(unitAdminId) {
        return graphQLClient.query(
            {
                query: robboUnitQuerysGQL.GET_ROBBO_UNITS_BY_UNIT_ADMIN_ID,
                variables: unitAdminId,
            },
        )
    },

    GetAllRobboUnits(page, pageSize) {
        return graphQLClient.query(
            {
                query: robboUnitQuerysGQL.GET_ALL_ROBBO_UNITS,
                variables: { page: "1", pageSize: "10" },
            },
        )
    },

    GetRobboUnitsByAccessToken(page, pageSize) {
        return graphQLClient.query(
            {
                query: robboUnitQuerysGQL.GET_ROBBO_UNITS_BY_ACCESS_TOKEN,
                variables: { page, pageSize },
            },
        )
    },

    SearchRobboUnitsByName(name) {
        return graphQLClient.query(
            {
                query: robboUnitQuerysGQL.SEARCH_ROBBO_UNITS_BY_NAME,
                variables: { name },
            },
        )
    },
}
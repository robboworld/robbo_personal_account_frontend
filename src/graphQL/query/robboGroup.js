import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const robboGroupQuerysGQL = {
    GET_ROBBO_GROUPS_BY_TEACHER_ID: gql`
    query GetRobboGroupsByTeacherId($teacherId: String!, $page: String!, $pageSize: String!) {
        GetRobboGroupsByTeacherId(teacherId: $teacherId, page: $page, pageSize: $pageSize){
            ... on RobboGroupHttpList {
                robboGroups {
                    id
                    robboUnitId
                    name
                }
            }
            ... on Error {
                message
            }
        }
    }
    `,
    SEARCH_GROUPS_BY_NAME: gql`
    query SearchGroupsByName($name: String!, $page: String!, $pageSize: String!) {
        SearchGroupsByName(name: $name, page: $page, pageSize: $pageSize) {
            ... on RobboGroupHttpList {
                robboGroups {
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
    GET_ROBBO_GROUP_BY_ID: gql`
    query GetRobboGroupById($id: String!) {
        GetRobboGroupById(id: $id) {
           
            ... on RobboGroupHttp {
                id
                name
                robboUnitId
                lastModified
            }
            ... on Error {
                message
            }
        }
    }
    `,
    GET_ALL_ROBBO_GROUPS: gql`
    query GetAllRobboGroups($page: String!, $pageSize: String!){
        GetAllRobboGroups(page: $page, pageSize: $pageSize){
            ... on RobboGroupHttpList {
                robboGroups {
                    id
                    name
                    robboUnitId
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

    GET_ROBBO_GROUPS_BY_ACCESS_TOKEN: gql`
        query GetRobboGroupsByAccessToken($page: String!, $pageSize: String!){
            GetRobboGroupsByAccessToken(page: $page, pageSize: $pageSize){
                ... on RobboGroupHttpList {
                robboGroups {
                    id
                    name
                    robboUnitId
                }
                }
                ... on Error {
                    message
                }
            }
        }
    `,

    GET_ROBBO_GROUPS_BY_ROBBO_UNIT_ID: gql`
    query GetRobboGroupsByRobboUnitId($robboUnitId: String!){
        GetRobboGroupsByRobboUnitId(robboUnitId: $robboUnitId){
            ... on RobboGroupHttpList {
                robboGroups {
                    id
                    name
                    robboUnitId
                }
            }
            ... on Error {
                message
            }
        }
    }     
    `,
    GET_ALL_ROBBO_GROUPS_FOR_UNIT_ADMIN: gql`
    query GetAllRobboGroupsForUnitAdmin($page: String!, $pageSize: String!){
        GetAllRobboGroupsForUnitAdmin(page: $page, pageSize: $pageSize){
            ... on RobboGroupHttpList {
                robboGroups {
                    id
                    name
                    robboUnitId
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

export const robboGroupsQuerysGraphQL = {
    SearchRobboGroupsByName(name) {
        return graphQLClient.query(
            {
                query: robboGroupQuerysGQL.SEARCH_GROUPS_BY_NAME,
                variables: { name },
            },
        )
    },

    GetAllRobboGroups(page, pageSize) {
        return graphQLClient.query(
            {
                query: robboGroupQuerysGQL.GET_ALL_ROBBO_GROUPS,
                variables: { page, pageSize },
            },
        )
    },

    GetRobboGroupById(id) {
        return graphQLClient.query(
            {
                query: robboGroupQuerysGQL.GET_ROBBO_GROUP_BY_ID,
                variables: id,
            },
        )
    },

    GetRobboGroupsByTeacherId(teacherId, page, pageSize) {
        console.log(page, pageSize)
        return graphQLClient.query(
            {
                query: robboGroupQuerysGQL.GET_ROBBO_GROUPS_BY_TEACHER_ID,
                variables: { teacherId, page, pageSize },
            },
        )
    },

    GetRobboGroupsByAccessToken(page, pageSize) {
        return graphQLClient.query(
            {
                query: robboGroupQuerysGQL.GET_ROBBO_GROUPS_BY_ACCESS_TOKEN,
                variables: { page: "1", pageSize: "10" },
            },
        )
    },

    GetRobboGroupsByRobboUnitId(page, pageSize, robboUnitId) {
        return graphQLClient.query(
            {
                query: robboGroupQuerysGQL.GET_ROBBO_GROUPS_BY_ROBBO_UNIT_ID,
                variables: { robboUnitId },
            },
        )
    },

    GetAllRobboGroupsForUnitAdmin(page, pageSize) {
        return graphQLClient.query(
            {
                query: robboGroupQuerysGQL.GET_ALL_ROBBO_GROUPS_FOR_UNIT_ADMIN,
                variables: { page, pageSize: "10" },
            },
        )
    },
}
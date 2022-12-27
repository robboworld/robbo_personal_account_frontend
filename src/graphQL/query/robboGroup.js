import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const robboGroupGQL = {
    GET_ROBBO_GROUPS_BY_TEACHER_ID: gql`
    query GetRobboGroupsByTeacherId($teacherId: String!) {
        GetRobboGroupsByTeacherId(teacherId: $teacherId){
            ... on RobboGroupHttp {
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
    query SearchGroupsByName($name: String!) {
        SearchGroupsByName(name: $name) {
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
            }
            ... on Error {
                message
            }
        }
    }     
    `,

    GET_ROBBO_GROUPS_BY_ACCESS_TOKEN: gql`
        query {
            GetRobboGroupsByAccessToken{
                id
                name
                robboUnitId
            }
        }
    `,
}

export const robboGroupsQueryGraphQL = {
    SearchRobboGroupsByName(name) {
        return graphQLClient.query(
            {
                query: robboGroupGQL.SEARCH_GROUPS_BY_NAME,
                variables: name,
            },
        )
    },

    GetAllRobboGroups(page, pageSize) {
        return graphQLClient.query(
            {
                query: robboGroupGQL.GET_ALL_ROBBO_GROUPS,
                variables: { page, pageSize: "10" },
            },
        )
    },

    GetRobboGroupById(id) {
        return graphQLClient.query(
            {
                query: robboGroupGQL.GET_ROBBO_GROUP_BY_ID,
                variables: id,
            },
        )
    },

    GetRobboGroupsByTeacherId(teacherId) {
        return graphQLClient.query(
            {
                query: robboGroupGQL.GET_ROBBO_GROUPS_BY_TEACHER_ID,
                variables: teacherId,
            },
        )
    },

    GetRobboGroupsByAccessToken(page, pageSize) {
        return graphQLClient.query(
            {
                query: robboGroupGQL.GET_ROBBO_GROUPS_BY_ACCESS_TOKEN,
            },
        )
    },
}
import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const robboGroupGQL = {
    GET_ROBBO_GROUPS_BY_TEACHER_ID: gql`
    query GetRobboGroupsByTeacherId($teacherId: String!) {
        GetRobboGroupsByTeacherId(teacherId: $teacherId){
            id
            robboUnitId
            name
        }
    }
    `,
    SEARCH_GROUPS_BY_NAME: gql`
    query SearchGroupsByName($name: String!) {
        SearchGroupsByName(name: $name) {
            id
            name
        }
    }
    `,
    GET_ROBBO_GROUP_BY_ID: gql`
    query GetRobboGroupById($id: String!) {
        GetRobboGroupById(id: $id) {
            id
            name
            robboUnitId
            lastModified
        }
    }
    `,
    GET_ALL_ROBBO_GROUPS: gql`
    query{
        GetAllRobboGroups{
            id
            name
            robboUnitId
        }
    }     
    `,
}

export const robboGroupsQueryGraphQL = {
    searchRobboGroupsByName(name) {
        return graphQLClient.query(
            {
                query: robboGroupGQL.SEARCH_GROUPS_BY_NAME,
                variables: name,
            },
        )
    },

    getAllRobboGroups() {
        return graphQLClient.query(
            {
                query: robboGroupGQL.GET_ALL_ROBBO_GROUPS,
            },
        )
    },

    getRobboGroupById(id) {
        return graphQLClient.query(
            {
                query: robboGroupGQL.GET_ROBBO_GROUP_BY_ID,
                variables: id,
            },
        )
    },

    getRobboGroupsByTeacherId(teacherId) {
        return graphQLClient.query(
            {
                query: robboGroupGQL.GET_ROBBO_GROUPS_BY_TEACHER_ID,
                variables: teacherId,
            },
        )
    },

    getRobboGroupsByAccessToken() {
        return graphQLClient.query(
            {
                query: gql`
                    query {
                        GetRobboGroupsByAccessToken{
                            id
                            name
                            robboUnitId
                        }
                    }
                `,
            },
        )
    },
}
import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const robboGroupMutationsGQL = {

    CREATE_ROBBO_GROUP: gql`
        mutation  CreateRobboGroup($input:  NewRobboGroup!) {
            CreateRobboGroup(input: $input) {
                ... on RobboGroupHttp{
                    id
                    robboUnitId
                    name
                }
                ... on Error{
                    message
                } 
            }
        }
    `,

    UPDATE_ROBBO_GROUP: gql`
        mutation  UpdateRobboGroup($input:  UpdateRobboGroup!) {
            UpdateRobboGroup(input: $input) {
                ... on RobboGroupHttp{
                    id
                    robboUnitId
                    name
                }
                ... on Error{
                message
                } 
            }
        }
    `,

    DELETE_ROBBO_GROUP: gql`
    mutation  DeleteRobboGroup($robboGroupId:  String!) {
        DeleteRobboGroup(robboGroupId: $robboGroupId) {
            robboGroupId
        }
    }
    `,


    SET_ROBBO_GROUP_ID_FOR_STUDENT: gql`
    mutation SetRobboGroupIdForStudent($studentId: String!, $robboGroupId: String!, $robboUnitId: String!) {
        SetRobboGroupIdForStudent(studentId: $studentId, robboGroupId: $robboGroupId, robboUnitId: $robboUnitId) {
            message
        }
    }
    `,
}

export const robboGroupMutationsGraphQL = {
    CreateRobboGroup(input) {
        return graphQLClient.mutate(
            {
                mutation: robboGroupMutationsGQL.CREATE_ROBBO_GROUP,
                variables: { input },
            },
        )
    },

    UpdateRobboGroup(input) {
        return graphQLClient.mutate(
            {
                mutation: robboGroupMutationsGQL.UPDATE_ROBBO_GROUP,
                variables: input,
            },
        )
    },

    DeleteRobboGroup(robboGroupId) {
        return graphQLClient.mutate(
            {
                mutation: robboGroupMutationsGQL.DELETE_ROBBO_GROUP,
                variables: { robboGroupId },
            },
        )
    },

    SetRobboGroupIdForStudent(studentId, robboGroupId, robboUnitId) {
        return graphQLClient.mutate(
            {
                mutation: robboGroupMutationsGQL.SET_ROBBO_GROUP_ID_FOR_STUDENT,
                variables: { studentId, robboGroupId, robboUnitId },
            },
        )
    },
}
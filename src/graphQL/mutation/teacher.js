import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const teacherMutationsGQL = {
    UPDATE_TEACHER: gql`
    mutation UpdateTeacher($input: UpdateProfileInput!) {
        UpdateTeacher(input: $input) {
            ... on TeacherHttp {
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

            ... on Error {
                message
            }
        }
    }
    `,

    CREATE_TEACHER: gql`
        mutation CreateTeacher($input: NewTeacher!) {
            CreateTeacher(input: $input) {
                ... on TeacherHttp {
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
                ... on Error {
                    message
                }
            }
        }
    `,

    DELETE_TEACHER: gql`
    mutation DeleteTeacher($teacherId: String!) {
        DeleteTeacher(teacherId: $teacherId) {
           teacherId
        }
    }
    `,

    SET_TEACHER_FOR_ROBBO_GROUP: gql`
        mutation SetTeacherForRobboGroup($teacherId: String!, $robboGroupId: String!) {
            SetTeacherForRobboGroup(teacherId: $teacherId, robboGroupId: $robboGroupId) {
                ... on Error {
                    message
                }
            }
        }
    `,

    DELETE_TEACHER_FOR_ROBBO_GROUP: gql`
    mutation DeleteTeacherForRobboGroup($teacherId: String!, $robboGroupId: String!) {
        DeleteTeacherForRobboGroup(teacherId: $teacherId, robboGroupId: $robboGroupId) {
        
            ... on Error {
                message
            }
        }
    }
    `,
}

export const teacherMutationsGraphQL = {
    CreateTeacher(input) {
        return graphQLClient.mutate(
            {
                mutation: teacherMutationsGQL.CREATE_TEACHER,
                variables: input,
            },
        )
    },

    DeleteTeacher(teacherId) {
        return graphQLClient.mutate(
            {
                mutation: teacherMutationsGQL.DELETE_TEACHER,
                variables: { teacherId },
            },
        )
    },

    SetTeacherForRobboGroup(teacherId, robboGroupId) {
        return graphQLClient.mutate(
            {
                mutation: teacherMutationsGQL.SET_TEACHER_FOR_ROBBO_GROUP,
                variables: { teacherId, robboGroupId },
            },
        )
    },

    DeleteTeacherForRobboGroup(teacherId, robboGroupId) {
        return graphQLClient.mutate(
            {
                mutation: teacherMutationsGQL.DELETE_TEACHER_FOR_ROBBO_GROUP,
                variables: { teacherId, robboGroupId },
            },
        )
    },
}
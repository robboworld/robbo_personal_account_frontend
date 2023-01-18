import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"


export const coursePageMutationsGQL = {
    CREATE_ACCESS_COURSE_RELATION_STUDENT: gql`
        mutation CreateAccessCourseRelationStudent($input: NewAccessCourseRelationStudent!) {
            CreateAccessCourseRelationStudent(input: $input) {
                ... on CourseRelationHttp {
                    id
                    parameter
                    objectId
                }

                ... on Error {
                    message
                }
            }
        }
    `,

    CREATE_ACCESS_COURSE_RELATION_TEACHER: gql`
    mutation CreateAccessCourseRelationTeacher($input: NewAccessCourseRelationTeacher!) {
        CreateAccessCourseRelationTeacher(input: $input) {
            ... on CourseRelationHttp {
                id
                parameter
                objectId
            }

            ... on Error {
                message
            }
        }
    }
    `,

    CREATE_ACCESS_COURSE_RELATION_UNIT_ADMIN: gql`
    mutation CreateAccessCourseRelationUnitAdmin($input: NewAccessCourseRelationUnitAdmin!) {
        CreateAccessCourseRelationUnitAdmin(input: $input) {
            ... on CourseRelationHttp {
                id
                parameter
                objectId
            }

            ... on Error {
                message
            }
        }
    }
    `,

    CREATE_ACCESS_COURSE_RELATION_ROBBO_UNIT: gql`
    mutation CreateAccessCourseRelationRobboUnit($input: NewAccessCourseRelationRobboUnit!) {
        CreateAccessCourseRelationRobboUnit(input: $input) {
            ... on CourseRelationHttp {
                id
                parameter
                objectId
            }

            ... on Error {
                message
            }
        }
    }
    `,

    CREATE_ACCESS_COURSE_RELATION_ROBBO_GROUP: gql`
    mutation CreateAccessCourseRelationRobboGroup($input: NewAccessCourseRelationRobboGroup!) {
        CreateAccessCourseRelationRobboGroup(input: $input) {
            ... on CourseRelationHttp {
                id
                parameter
                objectId
            }

            ... on Error {
                message
            }
        }
    }
    `,
}

export const coursePageMutationsGraphQL = {
    CreateAccessCourseRelationStudent(input) {
        return graphQLClient.mutate(
            {
                mutation: coursePageMutationsGQL.CREATE_ACCESS_COURSE_RELATION_STUDENT,
                variables: input,
            },
        )
    },

    CreateAccessCourseRelationTeacher(input) {
        return graphQLClient.mutate(
            {
                mutation: coursePageMutationsGQL.CREATE_ACCESS_COURSE_RELATION_TEACHER,
                variables: input,
            },
        )
    },

    CreateAccessCourseRelationUnitAdmin(input) {
        return graphQLClient.mutate(
            {
                mutation: coursePageMutationsGQL.CREATE_ACCESS_COURSE_RELATION_UNIT_ADMIN,
                variables: input,
            },
        )
    },

    CreateAccessCourseRelationRobboUnit(input) {
        return graphQLClient.mutate(
            {
                mutation: coursePageMutationsGQL.CREATE_ACCESS_COURSE_RELATION_ROBBO_UNIT,
                variables: input,
            },
        )
    },

    CreateAccessCourseRelationRobboGroup(input) {
        return graphQLClient.mutate(
            {
                mutation: coursePageMutationsGQL.CREATE_ACCESS_COURSE_RELATION_ROBBO_GROUP,
                variables: input,
            },
        )
    },
}
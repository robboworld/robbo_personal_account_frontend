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
}
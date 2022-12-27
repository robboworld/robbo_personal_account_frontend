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
}

export const teacherMutationsGraphQL = {

}
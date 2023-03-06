import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const studentQuerysGQL = {
    GET_STUDENT_BY_ID: gql`
        query GetStudentById($studentId: String!){
            GetStudentById(studentId: $studentId){
                ... on StudentHttp {
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

    GET_STUDENTS_BY_ROBBO_GROUP_ID: gql`
        query GetStudentsByRobboGroup($robboGroupId: String!){
            GetStudentsByRobboGroup(robboGroupId: $robboGroupId){
                ... on StudentHttpList {
                    students{
                        userHttp {
                        id
                        lastname
                        firstname
                        middlename 
                    }
                    }
                }
                ... on Error {
                    message
                }
            }
        }
    `,

    GET_STUDENTS_BY_ROBBO_UNIT_ID: gql`
    query GetStudentsByRobboUnitId($robboUnitId: String!){
        GetStudentsByRobboUnitId(robboUnitId: $robboUnitId){
            ... on StudentHttpList{
                    students {
                        userHttp{
                            id
                            lastname
                            firstname
                            middlename                   
                        }
                }
            }
            ... on Error{
                message
            }
        }
    }
    `,

    GET_STUDENTS_BY_PARENT_ID: gql`
    query GetStudentsByParentId($parentId: String!){
        GetStudentsByParentId(parentId: $parentId) {
            ... on StudentHttpList{
                    students {
                        userHttp{
                        id
                        lastname
                        firstname
                        middlename
                    }
                }
            }
            ... on Error{
                message
            }
        }
    }`,

    SEARCH_STUDENTS_BY_EMAIL: gql`
        query SearchStudentsByEmail($email: String!, $page: String!, $pageSize: String!) {
            SearchStudentsByEmail(email: $email, page: $page, pageSize: $pageSize) {
                ... on StudentHttpList{
                    students {
                        userHttp{
                            id
                            lastname
                            firstname
                            middlename
                        }
                    }
                    countRows
                }
                ... on Error{
                    message
                }
            }
        }
    `,
}

export const studentQuerysGraphQL = {
    GetStudentsByParentId(parentId) {
        return graphQLClient.query(
            {
                query: studentQuerysGQL.GET_STUDENTS_BY_PARENT_ID,
                variables: parentId,
            },
        )
    },

    GetStudentById(studentId) {
        return graphQLClient.query(
            {
                query: studentQuerysGQL.GET_STUDENT_BY_ID,
                variables: studentId,
            },
        )
    },

    SearchStudentsByEmail(email, parentId) {
        return graphQLClient.query(
            {
                query: studentQuerysGQL.SEARCH_STUDENTS_BY_EMAIL,
                variables: {
                    email,
                    parentId,
                },
            },
        )
    },

    GetStudentsByRobboGroupId(robboGroupId) {
        return graphQLClient.query(
            {
                query: studentQuerysGQL.GET_STUDENTS_BY_ROBBO_GROUP_ID,
                variables: robboGroupId,
            },
        )
    },

    GetStudentsByRobboUnitId(robboUnitId) {
        return graphQLClient.query(
            {
                query: studentQuerysGQL.GET_STUDENTS_BY_ROBBO_UNIT_ID,
                variables: robboUnitId,
            },
        )
    },
}
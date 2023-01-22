import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const teacherQuerysGQL = {
    GET_TEACHERS_BY_ROBBO_GROUP_ID: gql`
    query GetTeachersByRobboGroupId($robboGroupId: String!){
        GetTeachersByRobboGroupId(robboGroupId: $robboGroupId){
            ... on TeacherHttpList {
                teachers {
                    userHttp{
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

    GET_TEACHER_BY_ID: gql`
    query GetTeacherById($teacherId: String!){
        GetTeacherById(teacherId: $teacherId){
            ... on TeacherHttp{
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
            ... on Error{
                message
            }
        }
    }
    `,

    GET_ALL_TEACHERS: gql`
        query GetAllTeachers($page: String!, $pageSize: String!){
            GetAllTeachers(page: $page, pageSize: $pageSize){
                ... on TeacherHttpList{
                    teachers {
                        userHttp {
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

    SEARCH_TEACHERS_BY_EMAIL: gql`
        query SearchTeachersByEmail($email: String!) {
            SearchTeachersByEmail(email: $email) {
                ... on TeacherHttpList{
                    teachers {
                        userHttp {
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
}

export const teacherQuerysGraphQL = {
    GetAllTeachers(page, pageSize) {
        return graphQLClient.query(
            {
                query: teacherQuerysGQL.GET_ALL_TEACHERS,
                variables: { page, pageSize },
            },
        )
    },

    GetTeacherById(teacherId) {
        return graphQLClient.query(
            {
                query: teacherQuerysGQL.GET_TEACHER_BY_ID,
                variables: teacherId,
            },
        )
    },

    GetTeachersByRobboGroupId(robboGroupId) {
        return graphQLClient.query(
            {
                query: teacherQuerysGQL.GET_TEACHERS_BY_ROBBO_GROUP_ID,
                variables: robboGroupId,
            },
        )
    },

    SearchTeachersByEmail(email) {
        return graphQLClient.query(
            {
                query: teacherQuerysGQL.SEARCH_TEACHERS_BY_EMAIL,
                variables: {
                    email,
                },
            },
        )
    },
}
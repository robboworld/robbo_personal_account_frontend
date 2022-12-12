import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const userQuerysGQL = {
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

    GET_UNIT_ADMIN_BY_ID: gql`
        query GetUnitAdminById($unitAdminId: String!){
            GetUnitAdminById(unitAdminId: $unitAdminId){
                ... on UnitAdminHttp{
                        userHttp {
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

    GET_ALL_PARENTS: gql`
        query{ 
            GetAllParents{
                __typename
                ... on ParentHttpList{
                    parents{
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

    GET_PARENT_BY_ID: gql`
    query GetParentById($parentId: String!){
        GetParentById(parentId: $parentId) {
            ... on ParentHttp{
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
        query SearchStudentsByEmail($email: String!, $parentId: String!) {
            SearchStudentsByEmail(email: $email, parentId: $parentId) {
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

    GET_SUPER_ADMIN_BY_ID: gql`
        query GetSuperAdminById($superAdminId: String!){
            GetStudentById(superAdminId: $superAdminId){
                ... on ParentHttpList{
                    superAdmniHttp{
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
                }
                ... on Error{
                    message
                }
            }
        }
    `,
}

export const usersQueryGraphQL = {
    getAllParents() {
        return graphQLClient.query(
            {
                query: userQuerysGQL.GET_ALL_PARENTS,
            },
        )
    },

    getAllTeachers() {
        return graphQLClient.query(
            {
                query: gql`
                    query{
                        GetAllTeachers{
                            userHttp{
                                id
                                lastname
                                firstname
                                middlename
                            }
                        }
                    }
                `,
            },
        )
    },

    getAllUnitAdmins() {
        return graphQLClient.query(
            {
                query: gql`
                    query{
                        GetAllUnitAdmins{
                            userHttp{
                                id
                                lastname
                                firstname
                                middlename
                            }
                        }
                    }
                `,
            },
        )
    },

    getStudentsByParentId(parentId) {
        return graphQLClient.query(
            {
                query: userQuerysGQL.GET_STUDENTS_BY_PARENT_ID,
                variables: parentId,
            },
        )
    },

    getParentById(parentId) {
        return graphQLClient.query(
            {
                query: userQuerysGQL.GET_PARENT_BY_ID,
                variables: parentId,
            },
        )
    },

    getStudentById(studentId) {
        return graphQLClient.query(
            {
                query: userQuerysGQL.GET_STUDENT_BY_ID,
                variables: studentId,
            },
        )
    },

    getUnitAdminById(unitAdminId) {
        return graphQLClient.query(
            {
                query: userQuerysGQL.GET_UNIT_ADMIN_BY_ID,
                variables: unitAdminId,
            },
        )
    },

    getUnitAdminsByRobboUnitId(robboUnitId) {
        return graphQLClient.query(
            {
                query: gql`
                    query GetUnitAdminsByRobboUnitId($robboUnitId: String!){
                        GetUnitAdminsByRobboUnitId(robboUnitId: $robboUnitId){
                            userHttp{
                                id
                                lastname
                                firstname
                                middlename
                            }
                        }
                    }
                `,
            },
        )
    },

    getTeacherById(teacherId) {
        return graphQLClient.query(
            {
                query: userQuerysGQL.GET_TEACHER_BY_ID,
                variables: teacherId,
            },
        )
    },

    getSuperAdminById(superAdminId) {
        return graphQLClient.query(
            {
                query: userQuerysGQL.GET_SUPER_ADMIN_BY_ID,
                variables: superAdminId,
            },
        )
    },

    searchStudentsByEmail(email, parentId) {
        return graphQLClient.query(
            {
                query: userQuerysGQL.SEARCH_STUDENTS_BY_EMAIL,
                variables: {
                    email,
                    parentId,
                },
            },
        )
    },

    searchUnitAdminsByEmail(email) {
        return graphQLClient.query(
            {
                query: gql`
                    query SearchUnitAdminsByEmail($email: String!) {
                        SearchUnitAdminsByEmail(email: $email) {
                            userHttp{
                                id
                                lastname
                                firstname
                                middlename
                            }
                        }
                    }
                `,
            },
        )
    },

    getStudentsByRobboGroupId(robboGroupId) {
        return graphQLClient.query(
            {
                query: userQuerysGQL.GET_STUDENTS_BY_ROBBO_GROUP_ID,
                variables: robboGroupId,
            },
        )
    },

    getTeachersByRobboGroupId(robboGroupId) {
        return graphQLClient.query(
            {
                query: userQuerysGQL.GET_TEACHERS_BY_ROBBO_GROUP_ID,
                variables: robboGroupId,
            },
        )
    },
    getStudentsByRobboUnitId(robboUnitId) {
        return graphQLClient.query(
            {
                query: userQuerysGQL.GET_STUDENTS_BY_ROBBO_UNIT_ID,
                variables: robboUnitId,
            },
        )
    },
}
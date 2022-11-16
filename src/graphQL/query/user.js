import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const userGQL = {
    GET_STUDENTS_PY_PARENT_ID: gql`
        query GetStudentsByParentId($parentId: String!){
            GetStudentsByParentId(parentId: $parentId){
                userHttp{
                    id
                    lastname
                    firstname
                    middlename
                }
            }
        }
    `,

    GET_STUDENT_BY_ID: gql`
        query GetStudentById($studentId: String!){
            GetStudentById(studentId: $studentId){
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
    `,
}

export const usersQueryGraphQL = {
    getAllParents() {
        return graphQLClient.query(
            {
                query: gql`
                    query{
                        GetAllParents{
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
                query: userGQL.GET_STUDENTS_PY_PARENT_ID,
                variables: parentId,
            },
        )
    },

    getParentById(parentId) {
        return graphQLClient.query(
            {
                query: gql`
                    query GetParentById($parentId: String!){
                        GetParentById(parentId: $parentId) {
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
                `,
                variables: parentId,
            },
        )
    },

    getStudentById(studentId) {
        return graphQLClient.query(
            {
                query: userGQL.GET_STUDENT_BY_ID,
                variables: studentId,
            },
        )
    },

    getUnitAdminById(unitAdminId) {
        return graphQLClient.query(
            {
                query: gql`
                    query GetUnitAdminById($unitAdminId: String!){
                        GetStudentById(unitAdminId: $unitAdminId){
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
                `,
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
                query: gql`
                    query GetTeacherById($teacherId: String!){
                        GetTeacherById(teacherId: $teacherId){
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
                `,
                variables: teacherId,
            },
        )
    },

    getSuperAdminById(superAdminId) {
        return graphQLClient.query(
            {
                query: gql`
                    query GetSuperAdminById($superAdminId: String!){
                        GetStudentById(superAdminId: $superAdminId){
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
                `,
                variables: superAdminId,
            },
        )
    },

    searchStudentsByEmail(email) {
        return graphQLClient.query(
            {
                query: gql`
                    query SearchStudentsByEmail($email: String!) {
                        SearchStudentsByEmail(email: $email) {
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
}
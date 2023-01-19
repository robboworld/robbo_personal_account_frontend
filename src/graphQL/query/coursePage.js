import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const coursePageQuerysGQL = {
    GET_COURSES_BY_USER: gql`
        query {
            GetCoursesByUser{
                ... on CoursesListHttp{
                    results{
                        id
                        blocks_url
                        effort
                        enrollment_start
                        enrollment_end
                        end
                        name
                        number
                        org
                        short_description
                        start
                        start_display
                        start_type
                        pacing
                        mobile_available
                        hidden
                        invitation_only
                        overview
                        course_id
                        media{
                            id
                            banner_image {
                                id
                                uri
                                uri_absolute
                            }
                            course_image {
                                id
                                uri
                            }
                            course_video {
                                id
                                uri
                            }
                            image {
                                id
                                raw
                                small
                                large
                            }
                        }
                    }
                }
            }
        }
    `,

    GET_STUDENTS_ADMITTED_TO_THE_COURSE: gql`
        query GetStudentsAdmittedToTheCourse($courseId: String!, $page: String, $pageSize: String) {
            GetStudentsAdmittedToTheCourse(courseId: $courseId, page: $page, pageSize: $pageSize) {
                ... on StudentHttpList {
                        students {
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

    GET_TEACHERS_ADMITTED_TO_THE_COURSE: gql`
    query GetTeachersAdmittedToTheCourse($courseId: String!, $page: String, $pageSize: String) {
        GetTeachersAdmittedToTheCourse(courseId: $courseId, page: $page, pageSize: $pageSize) {
            ... on TeacherHttpList {
                teachers{
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

    GET_UNIT_ADMINS_ADMITTED_TO_THE_COURSE: gql`
    query GetUnitAdminsAdmittedToTheCourse($courseId: String!, $page: String, $pageSize: String) {
        GetUnitAdminsAdmittedToTheCourse(courseId: $courseId, page: $page, pageSize: $pageSize) {
            ... on UnitAdminHttpList {
                unitAdmins {
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

    GET_ROBBO_UNITS_ADMITTED_TO_THE_COURSE: gql`
    query GetRobboUnitsAdmittedToTheCourse($courseId: String!, $page: String, $pageSize: String) {
        GetRobboUnitsAdmittedToTheCourse(courseId: $courseId, page: $page, pageSize: $pageSize) {
            ... on RobboUnitHttpList {
                robboUnits{
                    id
                    name
                    city
                }
            }
            ... on Error {
                message
            }
        }
    }
    `,

    GET_ROBBO_GROUPS_ADMITTED_TO_THE_COURSE: gql`
    query GetRobboGroupsAdmittedToTheCourse($courseId: String!, $page: String, $pageSize: String) {
        GetRobboGroupsAdmittedToTheCourse(courseId: $courseId, page: $page, pageSize: $pageSize) {
            ... on RobboGroupHttpList {
                robboGroups {
                    id
                    name
                }  
            }
            ... on Error {
                message
            }
        }
    }
    `,
}

export const coursePageQuerysGraphQL = {
    GetCoursesByUser() {
        return graphQLClient.query(
            {
                query: coursePageQuerysGQL.GET_COURSES_BY_USER,
            },
        )
    },

    GetStudentsAdmittedToTheCourse(courseId, page, pageSize) {
        return graphQLClient.query(
            {
                query: coursePageQuerysGQL.GET_STUDENTS_ADMITTED_TO_THE_COURSE,
                variables: { courseId, page, pageSize },
            },
        )
    },

    GetTeachersAdmittedToTheCourse(courseId, page, pageSize) {
        return graphQLClient.query(
            {
                query: coursePageQuerysGQL.GET_TEACHERS_ADMITTED_TO_THE_COURSE,
                variables: { courseId, page, pageSize },
            },
        )
    },

    GetUnitAdminsAdmittedToTheCourse(courseId, page, pageSize) {
        return graphQLClient.query(
            {
                query: coursePageQuerysGQL.GET_UNIT_ADMINS_ADMITTED_TO_THE_COURSE,
                variables: { courseId, page, pageSize },
            },
        )
    },

    GetRobboGroupsAdmittedToTheCourse(courseId, page, pageSize) {
        return graphQLClient.query(
            {
                query: coursePageQuerysGQL.GET_ROBBO_GROUPS_ADMITTED_TO_THE_COURSE,
                variables: { courseId, page, pageSize },
            },
        )
    },

    GetRobboUnitsAdmittedToTheCourse(courseId, page, pageSize) {
        return graphQLClient.query(
            {
                query: coursePageQuerysGQL.GET_UNIT_ADMINS_ADMITTED_TO_THE_COURSE,
                variables: { courseId, page, pageSize },
            },
        )
    },
}
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
}

export const coursePageQuerysGraphQL = {
    GetCoursesByUser() {
        return graphQLClient.query(
            {
                query: coursePageQuerysGQL.GET_COURSES_BY_USER,
            },
        )
    },
}
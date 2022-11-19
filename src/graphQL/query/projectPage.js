import { gql } from '@apollo/client'

import { graphQLClient } from '@/graphQL'

export const projectPageGQL = {
    GET_PROJECT_PAGE_BY_STUDENT_ID: gql`
        query {
            GetAllProjectPagesByAccessToken{
                title
                linkScratch
                lastModified
                projectId
                projectPageId
            }
        }
    `,
}

export const projectPageQueryGraphQL = {
    getProjectPagesByAccessToken() {
        return graphQLClient.query(
            {
                query: projectPageGQL.GET_PROJECT_PAGE_BY_STUDENT_ID,
            },
        )
    },
}
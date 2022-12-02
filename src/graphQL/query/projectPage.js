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

    GET_PROJECT_PAGE_BY_ID: gql`
        query GetProjectPageById($projectPageID: String!){
            GetProjectPageById(projectPageID: $projectPageID){
                projectPageId
                lastModified
                projectId
                instruction
                notes
                preview
                linkScratch
                title
                isShared
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

    getProjectPageById(projectPageID) {
        return graphQLClient.query(
            {
                query: projectPageGQL.GET_PROJECT_PAGE_BY_ID,
                variables: projectPageID,
            },
        )
    },
}
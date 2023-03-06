import { gql } from '@apollo/client'

import { graphQLClient } from '@/graphQL'

export const projectPageQueryGQL = {
    GET_PROJECT_PAGES_BY_ACCESS_TOKEN: gql`
        query GetAllProjectPagesByAccessToken($page: String!, $pageSize: String!){
            GetAllProjectPagesByAccessToken(page: $page, pageSize: $pageSize){ 
                __typename
                ... on ProjectPageHttpList {
                    projectPages{
                        title
                        linkScratch
                        projectPageId
                        projectId
                        lastModified
                    }
                    countRows
                }
                ... on Error {
                    message
                }
            }
        }
    `,

    GET_PROJECT_PAGE_BY_ID: gql`
        query GetProjectPageById($projectPageID: String!){
            GetProjectPageById(projectPageID: $projectPageID){
                __typename
                ... on ProjectPageHttp {
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
                ... on Error {
                    message
                }
            }
        }
    `,
}

export const projectPageQueryGraphQL = {
    getProjectPagesByAccessToken({ page, pageSize }) {
        return graphQLClient.query(
            {
                query: projectPageQueryGQL.GET_PROJECT_PAGES_BY_ACCESS_TOKEN,
                variables: { page, pageSize: "10" },
            },
        )
    },

    getProjectPageById(projectPageID) {
        return graphQLClient.query(
            {
                query: projectPageQueryGQL.GET_PROJECT_PAGE_BY_ID,
                variables: projectPageID,
            },
        )
    },
}
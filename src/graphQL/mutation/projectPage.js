import { gql } from "@apollo/client"

import { graphQLClient, projectPageQueryGQL } from "@/graphQL"

export const projectPageMutationGQL = {
    UPDATE_PROJECT_PAGE: gql`
    mutation UpdateProjectPage($input: UpdateProjectPage!) {
        UpdateProjectPage(input: $input) {
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

    CREATE_PROJECT_PAGE: gql`
    mutation {
        CreateProjectPage{
            __typename
                ... on ProjectPageHttp {
                    title
                    linkScratch
                    lastModified
                    projectId
                    projectPageId
                }
                ... on Error {
                    message
                }
        }
    }
    `,

    DELETE_PROJECT_PAGE: gql`
    mutation DeleteProjectPage($projectID: String!) {
        DeleteProjectPage(projectID: $projectID) {
            projectPageId
        }
    }
    `,
}

export const projectPageMutationGraphQL = {
    updateProjectPage(input) {
        return graphQLClient.mutate(
            {
                mutation: projectPageMutationGQL.UPDATE_PROJECT_PAGE,
                variables: input,
                update(cache, { data: { UpdateProjectPage } }) {
                    cache.modify({
                        fields: {
                            GetProjectPageById(existingProjectPage = {}) {
                                return { ...existingProjectPage, ...UpdateProjectPage }
                            },
                        },
                    })
                },
                refetchQueries: [
                    {
                        query: projectPageQueryGQL.GET_PROJECT_PAGES_BY_ACCESS_TOKEN,
                        variables: { page: "1", pageSize: "10" },
                    },
                    'GetAllProjectPagesByAccessToken',
                ],
            },
        )
    },

    createProjectPage() {
        return graphQLClient.mutate(
            {
                mutation: projectPageMutationGQL.CREATE_PROJECT_PAGE,
                update(cache, { data: { CreateProjectPage } }) {
                    cache.modify({
                        fields: {
                            GetAllProjectPagesByAccessToken(existingProjectPages = []) {
                                return {
                                    ...existingProjectPages,
                                    projectPages: [...existingProjectPages.projectPages, CreateProjectPage],
                                }
                            },
                        },
                    })
                },
            },
        )
    },

    deleteProjectPage(projectPageId) {
        return graphQLClient.mutate(
            {
                mutation: projectPageMutationGQL.DELETE_PROJECT_PAGE,
                variables: { projectID: projectPageId },
                update(cache, { data: { DeleteProjectPage } }) {
                    cache.modify({
                        fields: {
                            GetAllProjectPagesByAccessToken(existingProjectPages = []) {
                                const newProjectPages = [...existingProjectPages.projectPages]
                                    .filter(projectPage => projectPage.projectPageId !== DeleteProjectPage.projectPageId)
                                return { ...existingProjectPages, projectPages: newProjectPages }
                            },
                        },
                    })
                },
            },
        )
    },
}
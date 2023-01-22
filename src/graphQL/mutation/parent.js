import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const parentMutationsGQL = {
    CREATE_PARENT: gql`
    mutation CreateParent($input: NewParent!) {
        CreateParent(input: $input) {
        __typename
        ... on ParentHttp{
            userHttp{
                firstname
                lastname
                middlename
                id
            }
        }
        ... on Error{
            message
        }
    }
    }
    `,

    DELETE_PARENT: gql`
    mutation DeleteParent($parentId: String!){
        DeleteParent(parentId: $parentId) {
            ... on DeletedParent{
            parentId
            }
        } 
    }
    `,

    UPDATE_PARENT: gql`
    mutation UpdateParent($input: UpdateProfileInput!) {
        UpdateParent(input: $input) {
            ... on ParentHttp {
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
}

export const parentMutationsGraphQL = {
    CreateParent(input) {
        return graphQLClient.mutate(
            {
                mutation: parentMutationsGQL.CREATE_PARENT,
                variables: input,
                update(cache, { data: { CreateParent } }) {
                    cache.modify({
                        fields: {
                            GetAllParents(existingParents = []) {
                                return {
                                    ...existingParents,
                                    parents: [...existingParents.parents, CreateParent],
                                }
                            },
                        },
                    })
                },
            },
        )
    },

    DeleteParent(parentId) {
        return graphQLClient.mutate(
            {
                mutation: parentMutationsGQL.DELETE_PARENT,
                variables: parentId,
                update(cache, { data: { DeleteParent } }) {
                    cache.modify({
                        fields: {
                            GetAllParents(existingParents = []) {
                                const newParents = [...existingParents.parents]
                                    .filter(parent => parent.userHttp.id !== DeleteParent.parentId)
                                return { ...existingParents, parents: newParents }
                            },
                        },
                    })
                },
            },
        )
    },
}
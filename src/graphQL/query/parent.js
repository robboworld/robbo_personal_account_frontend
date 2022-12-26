import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const parentQuerysGQL = {
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
}

export const parentQuerysGraphQL = {
    getAllParents() {
        return graphQLClient.query(
            {
                query: parentQuerysGQL.GET_ALL_PARENTS,
            },
        )
    },

    getParentById(parentId) {
        return graphQLClient.query(
            {
                query: parentQuerysGQL.GET_PARENT_BY_ID,
                variables: parentId,
            },
        )
    },

}
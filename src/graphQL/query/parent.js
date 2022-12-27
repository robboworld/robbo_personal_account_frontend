import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const parentQuerysGQL = {
    GET_ALL_PARENTS: gql`
        query GetAllParent($page: String!, $pageSize: String!){ 
            GetAllParents(page: $page, pageSize: $pageSize){
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

    SEARCH_PARENT_BY_EMAIL: gql`
     query SearchParentsByEmail($email: String!) {
        SearchParentsByEmail(email: $email) {
                ... on ParentHttpList{
                    parents {
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
}

export const parentQuerysGraphQL = {
    GetAllParents(page, pageSize) {
        return graphQLClient.query(
            {
                query: parentQuerysGQL.GET_ALL_PARENTS,
                variables: { page, pageSize: "10" },
            },
        )
    },

    GetParentById(parentId) {
        return graphQLClient.query(
            {
                query: parentQuerysGQL.GET_PARENT_BY_ID,
                variables: parentId,
            },
        )
    },

    SearchParentByEmail(email) {
        return graphQLClient.query(
            {
                query: parentQuerysGQL.SEARCH_PARENT_BY_EMAIL,
                variables: email,
            },
        )
    },
}
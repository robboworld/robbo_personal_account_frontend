import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const usersGraphQL = {
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

    getParentById(parentId) {
        console.log(parentId)
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

    getStudentsByParentId(parentId) {
        return graphQLClient.query(
            {
                query: gql`
                    query{
                        GetStudentsByParentId(parentId: parentId){
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
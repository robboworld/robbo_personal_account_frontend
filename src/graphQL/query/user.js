import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const getAllUsers = () =>
    graphQLClient.query(
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
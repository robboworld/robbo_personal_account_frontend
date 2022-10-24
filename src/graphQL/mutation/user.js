import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const usersMutationGraphQL = {
    createStudent(input) {
        console.log(input)
        return graphQLClient.mutate(
            {
                mutation: gql`
                    mutation CreateStudent($input: NewStudent!){
                        CreateStudent(input: $input){
                            userHttp{
                                id
                            }
                        }
                    }
                `,
                variables: input,
            },
        )
    },
}

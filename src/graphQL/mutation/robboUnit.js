import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const robboUnitMutationsGQL = {
    CREATE_ROBBO_UNIT: gql`
         mutation CreateRobboUnit($input: NewRobboUnit!) {
            CreateRobboUnit(input: $input) {
            __typename
            ... on RobboUnitHttp{
                id
                name
                city

            }
            ... on Error{
                message
            }
        }
        }
    `,

    DELETE_ROBBO_UNIT: gql`
        mutation DeleteRobboUnit($robboUnitId: String!){
            DeleteRobboUnit(robboUnitId: $robboUnitId) {
                __typename
                robboUnitId
            }
        }
    `,
}

export const robboUnitMutationsGraphQL = {
    createRobboUnit(input) {
        return graphQLClient.mutate(
            {
                mutation: robboUnitMutationsGQL.CREATE_ROBBO_UNIT,
                variables: input,
            },
        )
    },

    deleteRobboUnit(robboUnitId) {
        return graphQLClient.mutate(
            {
                mutation: robboUnitMutationsGQL.DELETE_ROBBO_UNIT,
                variables: robboUnitId,
            },
        )
    },
}
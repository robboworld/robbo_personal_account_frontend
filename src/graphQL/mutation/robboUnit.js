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

    UPDATE_ROBBO_UNIT: gql`
        mutation UpdateRobboUnit($input: UpdateRobboUnit!){
                UpdateRobboUnit(input: $input) {
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
}

export const robboUnitMutationsGraphQL = {
    CreateRobboUnit(input) {
        return graphQLClient.mutate(
            {
                mutation: robboUnitMutationsGQL.CREATE_ROBBO_UNIT,
                variables: input,
            },
        )
    },

    DeleteRobboUnit(robboUnitId) {
        return graphQLClient.mutate(
            {
                mutation: robboUnitMutationsGQL.DELETE_ROBBO_UNIT,
                variables: robboUnitId,
            },
        )
    },

    UpdateRobboUnit(input) {
        return graphQLClient.mutate(
            {
                mutation: robboUnitMutationsGQL.UPDATE_ROBBO_UNIT,
                variables: input,
            },
        )
    },
}
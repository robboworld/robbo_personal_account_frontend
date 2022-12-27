import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const robboGroupMutationsGQL = {
    UPDATE_ROBBO_GROUP: gql`
        mutation  UpdateRobboGroup($input:  UpdateRobboGroup!) {
            UpdateRobboGroup(input: $input) {
                ... on RobboGroupHttp{
                    id
                    robboUnitId
                    name
                }
                ... on Error{
                message
                } 
            }
        }
    `,
}

export const robboGroupMutationsGraphQL = {
    UpdateRobboGroup(input) {
        return graphQLClient.mutate(
            {
                mutation: robboGroupMutationsGQL.UPDATE_ROBBO_GROUP,
                variables: input,
            },
        )
    },
}
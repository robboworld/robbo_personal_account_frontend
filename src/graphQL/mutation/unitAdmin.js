import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const unitAdminMutationsGQL = {
    CREATE_UNIT_ADMIN: gql`
    mutation CreateUnitAdmin($input: NewUnitAdmin!) {
        CreateUnitAdmin(input: $input) {
        __typename
        ... on UnitAdminHttp{
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

    UPDATE_UNIT_ADMIN: gql`
    mutation UpdateUnitAdmin($input: UpdateProfileInput!) {
        UpdateUnitAdmin(input: $input) {
            ... on UnitAdminHttp {
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

    DELETE_UNIT_ADMIN: gql`
    mutation DeleteUnitAdmin($unitAdminId: String!){
        DeleteUnitAdmin(unitAdminId: $unitAdminId) {
            ... on DeletedUnitAdmin{
                unitAdminId
            }
        } 
    }
    `,

    SET_NEW_UNIT_ADMIN_FOR_ROBBO_UNIT: gql`
    mutation SetNewUnitAdminForRobboUnit($unitAdminId: String!, $robboUnitId: String!){
        SetNewUnitAdminForRobboUnit(unitAdminId: $unitAdminId, robboUnitId: $robboUnitId) {
            message
        }
    }
    `,
}

export const unitAdminMutationsGraphQL = {
    CreateUnitAdmin(input) {
        return graphQLClient.mutate(
            {
                mutation: unitAdminMutationsGQL.CREATE_UNIT_ADMIN,
                variables: input,
            },
        )
    },

    DeleteUnitAdmin(unitAdminId) {
        return graphQLClient.mutate(
            {
                mutation: unitAdminMutationsGQL.DELETE_UNIT_ADMIN,
                variables: { unitAdminId },
            },
        )
    },

    SetNewUnitAdminForRobboUnit(unitAdminId, robboUnitId) {
        return graphQLClient.mutate(
            {
                mutation: unitAdminMutationsGQL.SET_NEW_UNIT_ADMIN_FOR_ROBBO_UNIT,
                variables: { unitAdminId, robboUnitId },
            },
        )
    },
}
import { gql } from "@apollo/client"

import { graphQLClient } from "@/graphQL"

export const robboUnitGQL = {
    GET_UNIT_ADMINS_BY_ROBBO_UNIT_ID: gql`
        query GetUnitAdminsByRobboUnitId($robboUnitId: String!){
            GetUnitAdminsByRobboUnitId(robboUnitId: $robboUnitId){
                userHttp{
                    id
                    lastname
                    firstname
                    middlename
                }
            }
        }
    `,

    SEARCH_UNIT_ADMINS_BY_EMAIL: gql`
        query SearchUnitAdminsByEmail($email: String!){
            SearchUnitAdminsByEmail(email: $email){
                userHttp{
                    id
                    lastname
                    firstname
                    middlename
                }
            }
        }
    `,

    // GET_ROBBO_UNIT_BY_ID: gql`
    //     query G
    // `,
}

export const robboUnitQueryGraphQL = {
    GetUnitAdminsByRobboUnitId(robboUnitId) {
        return graphQLClient.query(
            {
                query: robboUnitGQL.GET_UNIT_ADMINS_BY_ROBBO_UNIT_ID,
                variables: robboUnitId,
            },
        )
    },

    SearchUnitAdminByEmail(email) {
        return graphQLClient.query(
            {
                query: robboUnitGQL.SEARCH_UNIT_ADMINS_BY_EMAIL,
                variables: email,
            },
        )
    },
}
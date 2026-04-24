import { gql } from '@apollo/client'

export const freeListenerMutationsGQL = {
  UPDATE_FREE_LISTENER: gql`
    mutation UpdateFreeListener($input: UpdateProfileInput!) {
      UpdateFreeListener(input: $input) {
        ... on FreeListenerHttp {
          userHttp {
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
}

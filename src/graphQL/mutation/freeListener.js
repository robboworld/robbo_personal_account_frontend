import { gql } from '@apollo/client'

import { USER_PROFILE_FIELDS } from '@/graphQL/fragments/userProfileFields'

export const freeListenerMutationsGQL = {
  UPDATE_FREE_LISTENER: gql`
    mutation UpdateFreeListener($input: UpdateProfileInput!) {
      UpdateFreeListener(input: $input) {
        ... on FreeListenerHttp {
          userHttp {
            ${USER_PROFILE_FIELDS}
          }
        }
        ... on Error {
          message
        }
      }
    }
  `,
}

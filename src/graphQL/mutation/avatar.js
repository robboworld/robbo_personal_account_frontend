import { gql } from '@apollo/client'

import { graphQLClient } from '@/graphQL'
import { USER_PROFILE_FIELDS } from '@/graphQL/fragments/userProfileFields'

export const avatarMutationsGQL = {
  SET_USER_AVATAR: gql`
    mutation SetUserAvatar($avatarId: String) {
      SetUserAvatar(avatarId: $avatarId) {
        ${USER_PROFILE_FIELDS}
      }
    }
  `,
}

export const avatarMutationsGraphQL = {
  SetUserAvatar(avatarId) {
    return graphQLClient.mutate({
      mutation: avatarMutationsGQL.SET_USER_AVATAR,
      variables: { avatarId: avatarId || null },
    })
  },
}

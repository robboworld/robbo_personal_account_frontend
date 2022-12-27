import { gql } from "@apollo/client"

import {
    graphQLClient,
    parentQuerysGQL,
    studentMutationsGQL,
    parentMutationsGQL,
    teacherMutationsGQL,
    unitAdminMutationsGQL,
    superAdminMutationsGQL,
} from "@/graphQL"
import {
    FREE_LISTENER,
    PARENT,
    STUDENT,
    SUPER_ADMIN,
    TEACHER,
    UNIT_ADMIN,
} from "@/constants"

export const profileMutationsGQL = {

}

export const profileMutationGraphQL = {
    UpdateProfile(input, role) {
        let update = {}
        let refetchQueries = null
        let gqlString = null
        switch (role) {
            case STUDENT:
                gqlString = studentMutationsGQL.UPDATE_STUDENT
                break
            case TEACHER:
                gqlString = teacherMutationsGQL.UPDATE_TEACHER
                break
            case PARENT:
                gqlString = parentMutationsGQL.UPDATE_PARENT
                update = {
                    update(cache, { data: { UpdateParent } }) {
                        cache.modify({
                            fields: {
                                GetParentById(existingParent = {}) {
                                    return { ...existingParent, ...UpdateParent }
                                },
                            },
                        })
                    },
                }
                refetchQueries = [
                    { query: parentQuerysGQL.GET_ALL_PARENTS },
                ]
                break
            case FREE_LISTENER:

                break
            case UNIT_ADMIN:
                gqlString = unitAdminMutationsGQL.UPDATE_UNIT_ADMIN
                break
            case SUPER_ADMIN:
                gqlString = superAdminMutationsGQL.UPDATE_SUPER_ADMIN
                break
            default:
                break
        }
        return graphQLClient.mutate(
            {
                mutation: gqlString,
                variables: input,
                ...update,
                refetchQueries: refetchQueries,
            },
        )
    },
}

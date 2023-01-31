import React from 'react'
import { compose } from 'redux'
import { useLocation } from 'react-router-dom'
import { graphql } from '@apollo/client/react/hoc'

import StudentProfile from './StudentProfile'
import SuperAdminProfile from './SuperAdminProfile'
import UnitAdminProfile from './UnitAdminProfile'
import ParentProfile from './ParentProfile'
import TeacherProfile from './TeacherProfile'

import {
    parentMutationsGQL,
    profileGQL,
    studentQuerysGQL,
} from '@/graphQL'
import {
    PARENT,
    STUDENT,
    SUPER_ADMIN,
    TEACHER,
    UNIT_ADMIN,
} from '@/constants'

const ProfileContainer = ({
    userId,
    userRole,
}) => {
    const location = useLocation()
    const peekUserId = location?.state?.userId
    const peekUserRole = location?.state?.userRole
    let Profile

    if (peekUserId) {
        // case when a user peek profile of another user
        switch (peekUserRole) {
            case STUDENT:
                Profile = PeekProfileWithGraphQL(StudentProfile)
                return <Profile peekUserId={peekUserId} peekUserRole={peekUserRole} />
            case UNIT_ADMIN:
                Profile = PeekProfileWithGraphQL(UnitAdminProfile)
                return <Profile peekUserId={peekUserId} peekUserRole={peekUserRole} />
            case TEACHER:
                Profile = PeekProfileWithGraphQL(TeacherProfile)
                return <Profile peekUserId={peekUserId} peekUserRole={peekUserRole} />
            case PARENT:
                return <WithGraphQLParentProfile peekUserId={peekUserId} peekUserRole={peekUserRole} />
        }
    } else {
        // case when a user receive self profile
        switch (userRole) {
            case STUDENT:
                Profile = graphql(profileGQL.GET_USER)(StudentProfile)
                return <Profile />
            case SUPER_ADMIN:
                Profile = graphql(profileGQL.GET_USER)(SuperAdminProfile)
                return <Profile />
            case UNIT_ADMIN:
                Profile = graphql(profileGQL.GET_USER)(UnitAdminProfile)
                return <Profile />
            case TEACHER:
                Profile = graphql(profileGQL.GET_USER)(TeacherProfile)
                return <Profile />
            case PARENT:
                Profile = compose(
                    graphql(profileGQL.GET_USER, { name: 'GetUser' }),
                    graphql(
                        studentQuerysGQL.GET_STUDENTS_BY_PARENT_ID,
                        {
                            options: props => {
                                return {
                                    variables: {
                                        parentId: props.userId,
                                    },
                                }
                            },
                            name: 'GetStudents',
                        },
                    ),
                    graphql(parentMutationsGQL.UPDATE_PARENT,
                        {
                            name: 'UpdateParent',
                        },
                    ),
                )(ParentProfile)
                return <Profile userId={userId} />
        }
    }
}

const PeekProfileWithGraphQL = Component => (
    graphql(profileGQL.GET_USER,
        {
            options: props => {
                return {
                    variables: {
                        peekUserId: props.peekUserId,
                        peekUserRole: props.peekUserRole,
                    },
                }
            },
        },
    )(Component)
)

const WithGraphQLParentProfile = compose(
    graphql(
        profileGQL.GET_USER,
        {
            options: props => {
                return {
                    variables: {
                        peekUserId: props.peekUserId,
                        peekUserRole: props.peekUserRole,
                    },
                }
            },
        },
    ),
    graphql(
        studentQuerysGQL.GET_STUDENTS_BY_PARENT_ID,
        {
            options: props => {
                return {
                    variables: {
                        parentId: props.peekUserId,
                    },
                }
            },
        },
    ),
)

export default ProfileContainer
import React from 'react'
import { notification } from 'antd'
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
    studentMutationsGQL,
    studentQuerysGQL,
    superAdminMutationsGQL,
    teacherMutationsGQL,
    unitAdminMutationsGQL,
} from '@/graphQL'
import {
    PARENT,
    STUDENT,
    SUPER_ADMIN,
    TEACHER,
    UNIT_ADMIN,
} from '@/constants'
import { checkAccess } from '@/helpers'

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
                return <WithGraphQLStudentPeekProfile
                    peekUserId={peekUserId}
                    peekUserRole={peekUserRole}
                    accessUpdate={!checkAccess(userRole, [SUPER_ADMIN])}
                />
            case UNIT_ADMIN:
                return <WithGraphQLSUnitAdminPeekProfile
                    peekUserId={peekUserId}
                    peekUserRole={peekUserRole}
                    accessUpdate={!checkAccess(userRole, [SUPER_ADMIN])}
                />
            case TEACHER:
                return <WithGraphQLSTeacherPeekProfile
                    peekUserId={peekUserId}
                    peekUserRole={peekUserRole}
                    accessUpdate={!checkAccess(userRole, [SUPER_ADMIN, UNIT_ADMIN])}
                />
            case PARENT:
                return <WithGraphQLParentProfile
                    peekUserId={peekUserId}
                    peekUserRole={peekUserRole}
                    accessUpdate={!checkAccess(userRole, [SUPER_ADMIN])}
                />
        }
    } else {
        // case when a user receive self profile
        switch (userRole) {
            case STUDENT:
                Profile = compose(
                    graphql(profileGQL.GET_USER,
                        {
                            onError: error => {
                                notification.error({ message: 'Ошибка', description: error?.message })
                            },
                        }),
                    graphql(studentMutationsGQL.UPDATE_STUDENT,
                        {
                            name: 'UpdateStudent',
                            options: {
                                onCompleted: () => {
                                    notification.success({ description: 'Профиль успешно обновлен!' })
                                },
                                onError: error => {
                                    notification.error({ message: 'Ошибка', description: error?.message })
                                },
                            },
                        },
                    ),
                )(StudentProfile)
                return <Profile />
            case SUPER_ADMIN:
                Profile = compose(
                    graphql(profileGQL.GET_USER, {
                        onError: error => {
                            notification.error({ message: 'Ошибка', description: error?.message })
                        },
                    }),
                    graphql(superAdminMutationsGQL.UPDATE_SUPER_ADMIN,
                        {
                            name: 'UpdateSuperAdmin',
                            options: {
                                onCompleted: () => {
                                    notification.success({ description: 'Профиль успешно обновлен!' })
                                },
                                onError: error => {
                                    notification.error({ message: 'Ошибка', description: error?.message })
                                },
                            },
                        },
                    ),
                )(SuperAdminProfile)
                return <Profile />
            case UNIT_ADMIN:
                Profile = compose(
                    graphql(profileGQL.GET_USER,
                        {
                            onError: error => {
                                notification.error({ message: 'Ошибка', description: error?.message })
                            },
                        }),
                    graphql(unitAdminMutationsGQL.UPDATE_UNIT_ADMIN,
                        {
                            name: 'UpdateUnitAdmin',
                            options: {
                                onCompleted: () => {
                                    notification.success({ description: 'Профиль успешно обновлен!' })
                                },
                                onError: error => {
                                    notification.error({ message: 'Ошибка', description: error?.message })
                                },
                            },
                        },
                    ),
                )(UnitAdminProfile)
                return <Profile />
            case TEACHER:
                Profile = compose(
                    graphql(profileGQL.GET_USER, {
                        onError: error => {
                            notification.error({ message: 'Ошибка', description: error?.message })
                        },
                    }),
                    graphql(teacherMutationsGQL.UPDATE_TEACHER,
                        {
                            name: 'UpdateTeacher',
                            options: {
                                onCompleted: () => {
                                    notification.success({ description: 'Профиль успешно обновлен!' })
                                },
                                onError: error => {
                                    notification.error({ message: 'Ошибка', description: error?.message })
                                },
                            },
                        },
                    ),
                )(TeacherProfile)
                return <Profile />
            case PARENT:
                Profile = compose(
                    graphql(profileGQL.GET_USER,
                        {
                            name: 'GetUser',
                            onError: error => {
                                notification.error({ message: 'Ошибка', description: error?.message })
                            },
                        }),
                    graphql(
                        studentQuerysGQL.GET_STUDENTS_BY_PARENT_ID,
                        {
                            options: props => {
                                return {
                                    variables: {
                                        parentId: props.userId,
                                    },
                                    onError: error => {
                                        notification.error({ message: 'Ошибка', description: error?.message })
                                    },
                                }
                            },
                            name: 'GetStudents',
                        },
                    ),
                    graphql(parentMutationsGQL.UPDATE_PARENT,
                        {
                            name: 'UpdateParent',
                            options: {
                                onCompleted: () => {
                                    notification.success({ description: 'Профиль успешно обновлен!' })
                                },
                                onError: error => {
                                    notification.error({ message: 'Ошибка', description: error?.message })
                                },
                            },
                        },
                    ),
                )(ParentProfile)
                return <Profile userId={userId} />
        }
    }
}

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
                    onError: error => {
                        notification.error({ message: 'Ошибка', description: error?.message })
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
                    onError: error => {
                        notification.error({ message: 'Ошибка', description: error?.message })
                    },
                }
            },
        },
    ),
    graphql(parentMutationsGQL.UPDATE_PARENT,
        {
            name: 'UpdateParent',
            skip: props => props.userRole !== SUPER_ADMIN,
            options: {
                onCompleted: () => {
                    notification.success({ description: 'Профиль успешно обновлен!' })
                },
                onError: error => {
                    notification.error({ message: 'Ошибка', description: error?.message })
                },
            },
        },
    ),
)(ParentProfile)

const WithGraphQLStudentPeekProfile = compose(
    graphql(
        profileGQL.GET_USER,
        {
            options: props => {
                return {
                    variables: {
                        peekUserId: props.peekUserId,
                        peekUserRole: props.peekUserRole,
                    },
                    onError: error => {
                        notification.error({ message: 'Ошибка', description: error?.message })
                    },
                }
            },
        },
    ),
    graphql(studentMutationsGQL.UPDATE_STUDENT,
        {
            name: 'UpdateStudent',
            options: {
                onCompleted: () => {
                    notification.success({ description: 'Профиль успешно обновлен!' })
                },
                onError: error => {
                    notification.error({ message: 'Ошибка', description: error?.message })
                },
            },
        },
    ),
)(StudentProfile)

const WithGraphQLSTeacherPeekProfile = compose(
    graphql(
        profileGQL.GET_USER,
        {
            options: props => {
                return {
                    variables: {
                        peekUserId: props.peekUserId,
                        peekUserRole: props.peekUserRole,
                    },
                    onError: error => {
                        notification.error({ message: 'Ошибка', description: error?.message })
                    },
                }
            },
        },
    ),
    graphql(teacherMutationsGQL.UPDATE_TEACHER,
        {
            name: 'UpdateTeacher',
            options: {
                onCompleted: () => {
                    notification.success({ description: 'Профиль успешно обновлен!' })
                },
                onError: error => {
                    notification.error({ message: 'Ошибка', description: error?.message })
                },
            },
        },
    ),
)(TeacherProfile)

const WithGraphQLSUnitAdminPeekProfile = compose(
    graphql(
        profileGQL.GET_USER,
        {
            options: props => {
                return {
                    variables: {
                        peekUserId: props.peekUserId,
                        peekUserRole: props.peekUserRole,
                    },
                    onError: error => {
                        notification.error({ message: 'Ошибка', description: error?.message })
                    },
                }
            },
        },
    ),
    graphql(unitAdminMutationsGQL.UPDATE_UNIT_ADMIN,
        {
            name: 'UpdateUnitAdmin',
            options: {
                onCompleted: () => {
                    notification.success({ description: 'Профиль успешно обновлен!' })
                },
                onError: error => {
                    notification.error({ message: 'Ошибка', description: error?.message })
                },
            },
        },
    ),
)(UnitAdminProfile)

export default ProfileContainer
import React from 'react'
import { Alert, notification } from 'antd'
import { compose } from 'redux'
import { useLocation } from 'react-router-dom'
import { graphql } from '@apollo/client/react/hoc'
import { useIntl } from 'react-intl'

import StudentProfile from './StudentProfile'
import FreeListenerProfile from './FreeListenerProfile'
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
    FREE_LISTENER,
    PARENT,
    STUDENT,
    SUPER_ADMIN,
    TEACHER,
    UNIT_ADMIN,
} from '@/constants'
import { freeListenerMutationsGQL } from '@/graphQL/mutation/freeListener'
import { checkAccess } from '@/helpers'
import PageLayout from '@/components/PageLayout'

const ProfileContainer = ({
    userId,
    userRole,
}) => {
    const intl = useIntl()
    const location = useLocation()
    const peekUserId = location?.state?.userId
    const peekUserRole = location?.state?.userRole
    let Profile

    if (peekUserId) {
        // case when a user peek profile of another user
        switch (peekUserRole) {
            case STUDENT:
                return <WithGraphQLStudentPeekProfile
                    intl={intl}
                    peekUserId={peekUserId}
                    peekUserRole={peekUserRole}
                    accessUpdate={!checkAccess(userRole, [SUPER_ADMIN])}
                />
            case UNIT_ADMIN:
                return <WithGraphQLSUnitAdminPeekProfile
                    intl={intl}
                    peekUserId={peekUserId}
                    peekUserRole={peekUserRole}
                    accessUpdate={!checkAccess(userRole, [SUPER_ADMIN])}
                />
            case TEACHER:
                return <WithGraphQLSTeacherPeekProfile
                    intl={intl}
                    peekUserId={peekUserId}
                    peekUserRole={peekUserRole}
                    accessUpdate={!checkAccess(userRole, [SUPER_ADMIN, UNIT_ADMIN])}
                />
            case PARENT:
                return <WithGraphQLParentProfile
                    intl={intl}
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
                                notification.error({
                                    message: intl.formatMessage({ id: 'notification.error_message' }),
                                    description: error?.message,
                                })
                            },
                        }),
                    graphql(studentMutationsGQL.UPDATE_STUDENT,
                        {
                            name: 'UpdateStudent',
                            options: {
                                refetchQueries: [{ query: profileGQL.GET_USER }],
                                awaitRefetchQueries: true,
                                onCompleted: () => {
                                    notification.success({ description: intl.formatMessage({ id: 'notification.update_profile_success' }) })
                                },
                                onError: error => {
                                    notification.error({
                                        message: intl.formatMessage({ id: 'notification.error_message' }),
                                        description: error?.message,
                                    })
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
                            notification.error({
                                message: intl.formatMessage({ id: 'notification.error_message' }),
                                description: error?.message,
                            })
                        },
                    }),
                    graphql(superAdminMutationsGQL.UPDATE_SUPER_ADMIN,
                        {
                            name: 'UpdateSuperAdmin',
                            options: {
                                onCompleted: () => {
                                    notification.success({ description: intl.formatMessage({ id: 'notification.update_profile_success' }) })
                                },
                                onError: error => {
                                    notification.error({
                                        message: intl.formatMessage({ id: 'notification.error_message' }),
                                        description: error?.message,
                                    })
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
                                notification.error({
                                    message: intl.formatMessage({ id: 'notification.error_message' }),
                                    description: error?.message,
                                })
                            },
                        }),
                    graphql(unitAdminMutationsGQL.UPDATE_UNIT_ADMIN,
                        {
                            name: 'UpdateUnitAdmin',
                            options: {
                                onCompleted: () => {
                                    notification.success({ description: intl.formatMessage({ id: 'notification.update_profile_success' }) })
                                },
                                onError: error => {
                                    notification.error({
                                        message: intl.formatMessage({ id: 'notification.error_message' }),
                                        description: error?.message,
                                    })
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
                            notification.error({
                                message: intl.formatMessage({ id: 'notification.error_message' }),
                                description: error?.message,
                            })
                        },
                    }),
                    graphql(teacherMutationsGQL.UPDATE_TEACHER,
                        {
                            name: 'UpdateTeacher',
                            options: {
                                onCompleted: () => {
                                    notification.success({ description: intl.formatMessage({ id: 'notification.update_profile_success' }) })
                                },
                                onError: error => {
                                    notification.error({
                                        message: intl.formatMessage({ id: 'notification.error_message' }),
                                        description: error?.message,
                                    })
                                },
                            },
                        },
                    ),
                )(TeacherProfile)
                return <Profile />
            case FREE_LISTENER:
                Profile = compose(
                    graphql(profileGQL.GET_USER, {
                        onError: error => {
                            notification.error({
                                message: intl.formatMessage({ id: 'notification.error_message' }),
                                description: error?.message,
                            })
                        },
                    }),
                    graphql(freeListenerMutationsGQL.UPDATE_FREE_LISTENER, {
                        name: 'UpdateFreeListener',
                        options: {
                            onCompleted: () => {
                                notification.success({ description: intl.formatMessage({ id: 'notification.update_profile_success' }) })
                            },
                            onError: error => {
                                notification.error({
                                    message: intl.formatMessage({ id: 'notification.error_message' }),
                                    description: error?.message,
                                })
                            },
                        },
                    }),
                )(FreeListenerProfile)
                return <Profile />
            case PARENT:
                Profile = compose(
                    graphql(profileGQL.GET_USER,
                        {
                            name: 'GetUser',
                            onError: error => {
                                notification.error({
                                    message: intl.formatMessage({ id: 'notification.error_message' }),
                                    description: error?.message,
                                })
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
                                        notification.error({
                                            message: intl.formatMessage({ id: 'notification.error_message' }),
                                            description: error?.message,
                                        })
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
                                    notification.success({ description: intl.formatMessage({ id: 'notification.update_profile_success' }) })
                                },
                                onError: error => {
                                    notification.error({
                                        message: intl.formatMessage({ id: 'notification.error_message' }),
                                        description: error?.message,
                                    })
                                },
                            },
                        },
                    ),
                )(ParentProfile)
                return <Profile userId={userId} />
            default:
                return (
                    <PageLayout>
                        <Alert
                            type='warning'
                            showIcon
                            message={intl.formatMessage({ id: 'profile.unavailable' })}
                            description={`role=${String(userRole)}`}
                        />
                    </PageLayout>
                )
        }
    }

    return (
        <PageLayout>
            <Alert type='info' showIcon
message={intl.formatMessage({ id: 'profile.select_user' })} />
        </PageLayout>
    )
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
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
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
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
        },
    ),
    graphql(parentMutationsGQL.UPDATE_PARENT,
        {
            name: 'UpdateParent',
            skip: props => props.userRole !== SUPER_ADMIN,
            options: props => {
                return {
                    onCompleted: () => {
                        notification.success({ description: props.intl.formatMessage({ id: 'notification.update_profile_success' }) })
                    },
                    onError: error => {
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
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
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
        },
    ),
    graphql(studentMutationsGQL.UPDATE_STUDENT,
        {
            name: 'UpdateStudent',
            options: props => {
                return {
                    onCompleted: () => {
                        notification.success({
                            description: props.intl.formatMessage({ id: 'notification.update_profile_success' }),
                        })
                    },
                    onError: error => {
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
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
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
        },
    ),
    graphql(teacherMutationsGQL.UPDATE_TEACHER,
        {
            name: 'UpdateTeacher',
            options: props => {
                return {
                    onCompleted: () => {
                        notification.success({ description: props.intl.formatMessage({ id: 'notification.update_profile_success' }) })
                    },
                    onError: error => {
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
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
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
        },
    ),
    graphql(unitAdminMutationsGQL.UPDATE_UNIT_ADMIN,
        {
            name: 'UpdateUnitAdmin',
            options: props => {
                return {
                    onCompleted: () => {
                        notification.success({ description: props.intl.formatMessage({ id: 'notification.update_profile_success' }) })
                    },
                    onError: error => {
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
        },
    ),
)(UnitAdminProfile)

export default ProfileContainer
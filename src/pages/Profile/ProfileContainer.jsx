import React, { useEffect } from 'react'
import { Alert, notification } from 'antd'
import { useMutation, useQuery } from '@apollo/client'
import { useLocation } from 'react-router-dom'
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

// Per role: profile view, its update mutation and the prop name the view expects it under.
const PROFILE_BY_ROLE = {
    [STUDENT]: { View: StudentProfile, mutation: studentMutationsGQL.UPDATE_STUDENT, updateProp: 'UpdateStudent' },
    [TEACHER]: { View: TeacherProfile, mutation: teacherMutationsGQL.UPDATE_TEACHER, updateProp: 'UpdateTeacher' },
    [PARENT]: { View: ParentProfile, mutation: parentMutationsGQL.UPDATE_PARENT, updateProp: 'UpdateParent' },
    [FREE_LISTENER]: { View: FreeListenerProfile, mutation: freeListenerMutationsGQL.UPDATE_FREE_LISTENER, updateProp: 'UpdateFreeListener' },
    [UNIT_ADMIN]: { View: UnitAdminProfile, mutation: unitAdminMutationsGQL.UPDATE_UNIT_ADMIN, updateProp: 'UpdateUnitAdmin' },
    [SUPER_ADMIN]: { View: SuperAdminProfile, mutation: superAdminMutationsGQL.UPDATE_SUPER_ADMIN, updateProp: 'UpdateSuperAdmin' },
}

// Who may edit a peeked profile: accessUpdate=true disables the form.
const PEEK_EDITORS = {
    [STUDENT]: [SUPER_ADMIN],
    [UNIT_ADMIN]: [SUPER_ADMIN],
    [TEACHER]: [SUPER_ADMIN, UNIT_ADMIN],
    [PARENT]: [SUPER_ADMIN],
}

const useErrorNotification = error => {
    const intl = useIntl()
    useEffect(() => {
        if (error) {
            notification.error({
                message: intl.formatMessage({ id: 'notification.error_message' }),
                description: error.message,
            })
        }
        // Notify once per error, not when the locale object changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])
}

/** One profile (own or peeked): GetUser, children for parents, and the role's update mutation. */
const RoleProfile = ({ role, peekUserId, peekUserRole, parentId, accessUpdate }) => {
    const intl = useIntl()
    const { View, mutation, updateProp } = PROFILE_BY_ROLE[role]
    const peek = Boolean(peekUserId)

    const user = useQuery(profileGQL.GET_USER, {
        variables: peek ? { peekUserId, peekUserRole } : undefined,
    })
    useErrorNotification(user.error)

    const children = useQuery(studentQuerysGQL.GET_STUDENTS_BY_PARENT_ID, {
        variables: { parentId },
        skip: role !== PARENT || !parentId,
    })
    useErrorNotification(children.error)

    const [update] = useMutation(mutation, {
        // Own profile: reload it so the header and form show the saved values.
        refetchQueries: peek ? [] : [{ query: profileGQL.GET_USER }],
        awaitRefetchQueries: !peek,
        onCompleted: () => notification.success({
            description: intl.formatMessage({ id: 'notification.update_profile_success' }),
        }),
        onError: error => notification.error({
            message: intl.formatMessage({ id: 'notification.error_message' }),
            description: error?.message,
        }),
    })

    const data = { ...user.data, loading: user.loading, error: user.error }
    return (
        <View
            data={data}
            GetUser={data}
            GetStudents={{ ...children.data, loading: children.loading }}
            {...{ [updateProp]: update }}
            accessUpdate={accessUpdate}
            peekUserId={peekUserId}
            peekUserRole={peekUserRole}
        />
    )
}

const ProfileContainer = ({
    userId,
    userRole,
}) => {
    const intl = useIntl()
    const location = useLocation()
    const peekUserId = location?.state?.userId
    const peekUserRole = location?.state?.userRole

    if (peekUserId) {
        // A user looks at another user's profile.
        if (PEEK_EDITORS[peekUserRole]) {
            return (
                <RoleProfile
                    key={`${peekUserRole}-${peekUserId}`}
                    role={peekUserRole}
                    peekUserId={peekUserId}
                    peekUserRole={peekUserRole}
                    parentId={peekUserId}
                    accessUpdate={!checkAccess(userRole, PEEK_EDITORS[peekUserRole])}
                />
            )
        }
        return (
            <Alert type='info' showIcon
message={intl.formatMessage({ id: 'profile.select_user' })} />
        )
    }

    if (PROFILE_BY_ROLE[userRole]) {
        return (
            <RoleProfile
                key={userRole}
                role={userRole}
                parentId={userId}
            />
        )
    }
    return (
        <Alert
            type='warning'
            showIcon
            message={intl.formatMessage({ id: 'profile.unavailable' })}
        />
    )
}

export default ProfileContainer

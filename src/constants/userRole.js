export const STUDENT = 0
export const TEACHER = 1
export const PARENT = 2
export const FREE_LISTENER = 3
export const UNIT_ADMIN = 4
export const SUPER_ADMIN = 5

export const USER_ROLE_MESSAGE_IDS = {
    0: 'user_role.student',
    1: 'user_role.teacher',
    2: 'user_role.parent',
    3: 'user_role.free_listener',
    4: 'user_role.unit_admin',
    5: 'user_role.super_admin',
}

/** @deprecated Use USER_ROLE_MESSAGE_IDS with intl */
export const userRole = {
    0: 'ученик',
    1: 'учитель',
    2: 'родитель',
    3: 'свободный слушатель',
    4: 'unit admin',
    5: 'super admin',
}

export const userRoleAPI = {
    0: 'student',
    1: 'teacher',
    2: 'parent',
    3: 'freeListener',
    4: 'unitAdmin',
    5: 'superAdmin',
}
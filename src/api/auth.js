import instance from './instance'

export const authAPI = {
    signUp(user) {
        const {
            email,
            password,
            nickname,
            fullName,
            phoneNumber = user.phone_number,
            honorCode = user.honor_code,
            marketingEmailsOptIn = user.marketing_emails_opt_in,
            lastname,
            firstname,
            middlename,
            role,
        } = user
        return instance.post('auth/sign-up',
            {
                email,
                password,
                role,
                nickname,
                fullName,
                phone_number: phoneNumber,
                honor_code: honorCode,
                marketing_emails_opt_in: marketingEmailsOptIn,
                lastname,
                firstname,
                middlename,
            },
            {
                withCredentials: true,
            })
    },

    signIn(email, password, role, kickOtherSessions = false) {
        return instance.post('auth/sign-in',
            {
                email: email,
                password: password,
                role: role,
                kickOtherSessions: Boolean(kickOtherSessions),
            },
            {
                withCredentials: true,
            })
    },

    signOut() {
        return instance.post('auth/sign-out', {}, {
            withCredentials: true,
        })
    },

    refresh() {
        return instance.get('auth/refresh', {
            withCredentials: true,
        })
    },

    checkAuth(token) {
        let timezone = 'UTC'
        try {
            timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
        } catch (_) {
            timezone = 'UTC'
        }
        const headers = {
            'X-User-Timezone': timezone,
        }
        if (token) {
            headers.Authorization = `Bearer ${token}`
        }
        return instance.get('auth/check-auth', {
            withCredentials: true,
            headers,
        })
    },

    getLoginStreak(userId) {
        const params = userId ? { userId } : undefined
        return instance.get('auth/login-streak', {
            withCredentials: true,
            headers: authHeaders(),
            params,
        })
    },

    incrementLoginStreak() {
        return instance.post('auth/login-streak/increment', {}, {
            withCredentials: true,
            headers: authHeaders(),
        })
    },

    listSessions() {
        return instance.get('auth/sessions', {
            withCredentials: true,
            headers: authHeaders(),
        })
    },

    revokeSession(sessionId) {
        return instance.delete(`auth/sessions/${sessionId}`, {
            withCredentials: true,
            headers: authHeaders(),
        })
    },
}

function authHeaders() {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

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

    signIn(email, password, role) {
        return instance.post('auth/sign-in',
            {
                email: email,
                password: password,
                role: role,
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
        return instance.get('auth/check-auth', {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
    },
}

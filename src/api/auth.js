import instance from './instance'

export const authAPI = {
    signUp(user) {
        const { email, password, nickname, lastname, firstname, middlename, role } = user
        return instance.post('auth/sign-up',
            {
                email: email,
                password: password,
                role: role.value,
                nickname: nickname,
                lastname: lastname,
                firstname: firstname,
                middlename: middlename,
            })
    },

    signIn(email, password, role) {
        return instance.post('auth/sign-in',
            {
                email: email,
                password: password,
                role: role.value,
            },
        )
    },

    signOut() {
        return instance.post('auth/sign-out')
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
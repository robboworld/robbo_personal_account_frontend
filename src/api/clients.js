import instance from './instance'

export const clientsAPI = {
    getClients(token) {
        return instance.get('users/parents',
            {
                // withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            },
        )
    },

    addParent(token, parent) {
        const { email, password, nickname, firstname, lastname, middlename } = parent
        return instance.post('users/parent',
            {
                email: email,
                password: password,
                nickname: nickname,
                firstname: firstname,
                lastname: lastname,
                middlename: middlename,
            },
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    deleteParent(token, parentId) {
        return instance.delete(`users/parent/${parentId}`,
            {

            })
    },
}
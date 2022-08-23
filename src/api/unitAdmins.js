import instance from './instance'

export const unitAdminsAPI = {
    getUnitAdmins(token) {
        return instance.get('users/unitAdmins',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            },
        )
    },

    getUnitAdminsByRobboUnitId(token, robboUnitId) {
        return instance.get(`users/unitAdmins/${robboUnitId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
    },

    searchUnitAdminsByEmail(token, email) {
        return instance.get(`users/unitAdmin/search/${email}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    setNewUnitAdminForRobboUnit(token, unitAdminId, robboUnitId) {
        return instance.post(`users/unitAdmin/setRelation`,
            {
                unitAdminId,
                robboUnitId,
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    deleteUnitAdmin(token, unitAdminId) {
        return instance.delete(`users/unitAdmin/${unitAdminId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    createUnitAdmin(token, unitAdmin) {
        const { email, password, nickname, firstname, lastname, middlename } = unitAdmin
        return instance.post('users/unitAdmin',
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
}
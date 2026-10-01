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
                email,
                password,
                nickname,
                firstname,
                lastname,
                middlename,
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

    createChildren(token, child, parentId) {
        const { email, password, nickname, firstname, lastname, middlename } = child
        return instance.post('users/student',
            {
                student: {
                    userHttp: {
                        email,
                        password,
                        nickname,
                        firstname,
                        lastname,
                        middlename,
                    },
                    // robboUnitId: 'null',
                    // robboGroupId: 'null',
                },
                parentId,

            },
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    deleteChild(token, childId) {
        return instance.delete(`users/student/${childId}`,
            {

            })
    },

    getCildrenByParentId(token, parentId) {
        return instance.get(`users/students/${parentId}`,
            {
                // withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            },
        )
    },

    searchStudent(token, searchInput) {
        return instance.get(`users/student/search/${searchInput}`,
            {
                // withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            },
        )
    },

    createRelation(token, parentId, childId) {
        return instance.post(`users/relation`,
            {
                parentId,
                childId,
            },
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },
}
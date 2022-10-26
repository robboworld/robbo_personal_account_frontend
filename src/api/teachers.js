import instance from './instance'

export const teachersAPI = {
    getTeachers(token) {
        return instance.get('users/teachers/',
            {
                // withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    deleteTeacher(token, teacherId) {
        return instance.delete(`users/teacher/${teacherId}`,
            {
                // withCredentials: true,
                //  headers: {
                //     'Authorization': `Bearer ${token}`,
                // },
            })
    },

    createTeacher(token, teacher) {
        const { email, password, nickname, firstname, lastname, middlename } = teacher
        return instance.post('users/teacher',
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

    setTeacherForRobboGroup(token, teacherId, robboGroupId) {
        return instance.post(`/robboUnits/${0}/robboGroup/setTeacher`,
            {
                teacherId,
                robboGroupId,
            },
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            },
        )
    },

    deleteTeacherForRobboGroup(token, teacherId, robboGroupId) {
        return instance.delete(`/robboUnits/${0}/robboGroup/deleteTeacher`,
            {
                teacherId,
                robboGroupId,
            },
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            },
        )
    },
}
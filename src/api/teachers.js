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
}
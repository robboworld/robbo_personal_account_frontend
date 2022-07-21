import instance from './instance'

export const teachersAPI = {
    getTeachers(token) {
        return instance.get('teachers/',
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },
}
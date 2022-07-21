import instance from './instance'

export const profileAPI = {
    getProfileById(token) {
        return instance.get('users/',
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },
    deleteAccount(token) {
        return instance.delete('users/',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },
}
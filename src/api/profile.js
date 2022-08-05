import instance from './instance'

import { userRoleAPI } from '@/constants'

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
    updateProfile(token, profile) {
        return instance.put(`users/${userRoleAPI[profile.role]}`,
            {
                // [userRoleAPI[profile.role]]: profile
                ...profile,
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },
}
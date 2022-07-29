import instance from './instance'

export const clientsAPI = {
    getClientPageById(token, id) {
        return instance.get(`client/${id}`,
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

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
}
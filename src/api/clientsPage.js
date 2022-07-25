import instance from './instance'

export const clientsPageAPI = {
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
        return instance.get('client/getAll',
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            },
        )
    },
}
import instance from './instance'

export const robboUnitsAPI = {
    getRobboUnits(token) {
        return instance.get('robboUnits/',
            {
                // withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    getRobboUnitById(token, robboUnitId) {
        return instance.get(`robboUnit/${robboUnitId}`,
            {
                // withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    deleteRobboUnit(token, robboUnitId) {
        return instance.delete(`robboUnit/${robboUnitId}`,
            {
                // withCredentials: true,
                //  headers: {
                //     'Authorization': `Bearer ${token}`,
                // },
            })
    },

    createRobboUnit(token, robboUnit) {
        const { name, city } = robboUnit
        return instance.post('robboUnit',
            {
                name,
                city,
            },
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },
    updateRobboUnit(token, robboUnit) {
        return instance.put(`robboUnit`,
            {
                ...robboUnit,
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },
}
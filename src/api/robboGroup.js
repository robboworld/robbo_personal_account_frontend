import instance from './instance'

export const robboGroupAPI = {
    getRobboGroupById(robboUnitId, robboGroupId) {
        return instance.get(`robboUnits/${robboUnitId}/robboGroup/${robboGroupId}`)
    },

    getRobboGroupsByRobboUnitId(robboUnitId) {
        return instance.get(`robboUnits/${robboUnitId}/robboGroup/`)
    },

    deleteRobboGroup(robboUnitId, robboGroupId) {
        return instance.delete(`robboUnits/${robboUnitId}/robboGroup/${robboGroupId}`)
    },

    createRobboGroup(robboUnitId, robboGroup) {
        return instance.post(`robboUnits/${robboUnitId}/robboGroup/`,
            {
                robboUnitId,
            })
    },
}
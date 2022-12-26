import { createAction } from "redux-actions"

import {
    CREATE_ROBBO_UNIT,
    CREATE_ROBBO_UNIT_FAILED,
    CREATE_ROBBO_UNIT_SUCCESS,
    DELETE_ROBBO_UNIT,
    DELETE_ROBBO_UNIT_FAILED,
    DELETE_ROBBO_UNIT_SUCCESS,
    GET_ALL_ROBBO_UNITS,
    GET_ALL_ROBBO_UNITS_FAILED,
    GET_ALL_ROBBO_UNITS_SUCCESS,
    GET_ROBBO_UNITS_BY_UNIT_ADMIN_ID_FAILED,
    GET_ROBBO_UNITS_BY_UNIT_ADMIN_ID_REQUEST,
    GET_ROBBO_UNITS_BY_UNIT_ADMIN_ID_SUCCESS,
    GET_ROBBO_UNIT_BY_ID,
    GET_ROBBO_UNIT_BY_ID_FAILED,
    GET_ROBBO_UNIT_BY_ID_SUCCESS,
    UPDATE_ROBBO_UNIT, UPDATE_ROBBO_UNIT_FAILED,
    UPDATE_ROBBO_UNIT_SUCCESS,
    CLEAR_ROBBO_UNITS_PAGE,
    CLEAR_ROBBO_UNIT_PAGE,
} from "@/constants"

export const getRobboUnitsRequest = createAction(GET_ALL_ROBBO_UNITS, (page, pageSize) => ({ page, pageSize }))
export const getRobboUnitsSuccess = createAction(GET_ALL_ROBBO_UNITS_SUCCESS, response => ({ response }))
export const getRobboUnitsFailed = createAction(GET_ALL_ROBBO_UNITS_FAILED, err => ({ err }))

export const createRobboUnitRequest = createAction(CREATE_ROBBO_UNIT, robboUnit => ({ robboUnit }))
export const createRobboUnitSuccess = createAction(CREATE_ROBBO_UNIT_SUCCESS, response => ({ response }))
export const createRobboUnitFailed = createAction(CREATE_ROBBO_UNIT_FAILED, err => ({ err }))

export const deleteRobboUnitRequest = createAction(DELETE_ROBBO_UNIT, (robboUnitId, robboUnitIndex) => ({ robboUnitId, robboUnitIndex }))
export const deleteRobboUnitSuccess = createAction(DELETE_ROBBO_UNIT_SUCCESS, (response, robboUnitIndex) => ({ response, robboUnitIndex }))
export const deleteRobboUnitFailed = createAction(DELETE_ROBBO_UNIT_FAILED, err => ({ err }))

export const updateRobboUnitRequest = createAction(UPDATE_ROBBO_UNIT, robboUnit => ({ robboUnit }))
export const updateRobboUnitSuccess = createAction(UPDATE_ROBBO_UNIT_SUCCESS, response => ({ response }))
export const updateRobboUnitFailed = createAction(UPDATE_ROBBO_UNIT_FAILED, err => ({ err }))

export const getRobboUnitByIdRequest = createAction(GET_ROBBO_UNIT_BY_ID, robboUnitId => ({ robboUnitId }))
export const getRobboUnitByIdSuccess = createAction(GET_ROBBO_UNIT_BY_ID_SUCCESS, response => ({ response }))
export const getRobboUnitByIdFailed = createAction(GET_ROBBO_UNIT_BY_ID_FAILED, err => ({ err }))

export const getRobboUnitsByUnitAdminIdRequest = createAction(GET_ROBBO_UNITS_BY_UNIT_ADMIN_ID_REQUEST, (page, pageSize) => ({ page, pageSize }))
export const getRobboUnitsByUnitAdminIdSuccess = createAction(GET_ROBBO_UNITS_BY_UNIT_ADMIN_ID_SUCCESS, response => ({ response }))
export const getRobboUnitsByUnitAdminIdFailed = createAction(GET_ROBBO_UNITS_BY_UNIT_ADMIN_ID_FAILED, err => ({ err }))

export const clearRobboUnitsPage = createAction(CLEAR_ROBBO_UNITS_PAGE)
export const clearRobboUnitPage = createAction(CLEAR_ROBBO_UNIT_PAGE)
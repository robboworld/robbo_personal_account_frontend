import { createAction } from "redux-actions"

import {
    GET_ALL_PROJECT_PAGES, GET_ALL_PROJECT_PAGES_FAILED, GET_ALL_PROJECT_PAGES_SUCCESS,
    GET_PROJECT_PAGE_BY_ID, GET_PROJECT_PAGE_BY_ID_FAILED, GET_PROJECT_PAGE_BY_ID_SUCCESS,
    UPDATE_PROJECT_PAGE, UPDATE_PROJECT_PAGE_FAILED, UPDATE_PROJECT_PAGE_SUCCESS,
    CREATE_PROJECT_PAGE, CREATE_PROJECT_PAGE_FAILED, CREATE_PROJECT_PAGE_SUCCESS, DELETE_PROJECT_PAGE, DELETE_PROJECT_PAGE_SUCCESS, DELETE_PROJECT_PAGE_FAILED,
} from "@/constants"

export const getAllProjectPages = createAction(GET_ALL_PROJECT_PAGES, (token) => {
    return {
        token
    }
})

export const getAllProjectPagesSuccess = createAction(GET_ALL_PROJECT_PAGES_SUCCESS, () => {
    return {

    }
})

export const getAllProjectPagesFailed = createAction(GET_ALL_PROJECT_PAGES_FAILED, () => {
    return {

    }
})


export const getProjectPageById = createAction(GET_PROJECT_PAGE_BY_ID, () => {
    return {

    }
})

export const getProjectPageByIdSuccess = createAction(GET_PROJECT_PAGE_BY_ID_SUCCESS, () => {
    return {

    }
})

export const getProjectPageByIdFailed = createAction(GET_PROJECT_PAGE_BY_ID_FAILED, () => {
    return {

    }
})

export const createProjectPage = createAction(CREATE_PROJECT_PAGE, (token) => {
    return {
        token
    }
})

export const createProjectPageSuccess = createAction(CREATE_PROJECT_PAGE_SUCCESS, (response) => {
    return {
        response
    }
})

export const createProjectPageFailed = createAction(CREATE_PROJECT_PAGE_FAILED, () => {
    return {

    }
})


export const updateProjectPage = createAction(UPDATE_PROJECT_PAGE, () => {
    return {

    }
})

export const updateProjectPageSuccess = createAction(UPDATE_PROJECT_PAGE_SUCCESS, (response) => {
    return {
        response
    }
})

export const updateProjectPageFailed = createAction(UPDATE_PROJECT_PAGE_FAILED, () => {
    return {

    }
})

export const deleteProjectPage = createAction(DELETE_PROJECT_PAGE, (token, projectPageId) => {
    return {
        token,
        projectPageId
    }
})

export const deleteProjectPageSuccess = createAction(DELETE_PROJECT_PAGE_SUCCESS, (response) => {
    return {
        response
    }
})

export const deleteProjectPageFailed = createAction(DELETE_PROJECT_PAGE_FAILED, () => {
    return {

    }
})
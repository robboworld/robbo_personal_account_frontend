import { createAction } from 'redux-actions'

import {
    GET_ALL_PROJECT_PAGES,
    GET_ALL_PROJECT_PAGES_FAILED,
    GET_ALL_PROJECT_PAGES_SUCCESS,
    GET_PROJECT_PAGE_BY_ID,
    GET_PROJECT_PAGE_BY_ID_FAILED,
    GET_PROJECT_PAGE_BY_ID_SUCCESS,
    UPDATE_PROJECT_PAGE,
    UPDATE_PROJECT_PAGE_FAILED,
    UPDATE_PROJECT_PAGE_SUCCESS,
    CREATE_PROJECT_PAGE,
    CREATE_PROJECT_PAGE_FAILED,
    CREATE_PROJECT_PAGE_SUCCESS,
    DELETE_PROJECT_PAGE,
    DELETE_PROJECT_PAGE_SUCCESS,
    DELETE_PROJECT_PAGE_FAILED,
    ONSHARED_PROJECT,
    CLEAR_PROJECT_PAGE_STATE,
    CLEAR_MY_PROJECTS_STATE,
    GET_PROJECT_PAGE_BY_ACCESS_TOKEN,
    GET_PROJECT_PAGE_BY_ACCESS_TOKEN_SUCCESS,
    GET_PROJECT_PAGE_BY_ACCESS_TOKEN_FAILED,
} from '@/constants'


export const getAllProjectPages = createAction(GET_ALL_PROJECT_PAGES, token => {
    return {
        token,
    }
})

export const getAllProjectPagesSuccess = createAction(GET_ALL_PROJECT_PAGES_SUCCESS, response => {
    return {
        response,
    }
})

export const getAllProjectPagesFailed = createAction(GET_ALL_PROJECT_PAGES_FAILED, err => {
    return {
        err,
    }
})


export const getProjectPageById = createAction(GET_PROJECT_PAGE_BY_ID, (token, id) => {
    return {
        token,
        id,
    }
})

export const getProjectPageByIdSuccess = createAction(GET_PROJECT_PAGE_BY_ID_SUCCESS, response => {
    return {
        response,
    }
})

export const getProjectPageByIdFailed = createAction(GET_PROJECT_PAGE_BY_ID_FAILED, err => {
    return {
        err,
    }
})

export const createProjectPage = createAction(CREATE_PROJECT_PAGE, token => {
    return {
        token,
    }
})

export const createProjectPageSuccess = createAction(CREATE_PROJECT_PAGE_SUCCESS, response => {
    return {
        response,
    }
})

export const createProjectPageFailed = createAction(CREATE_PROJECT_PAGE_FAILED, err => {
    return {
        err,
    }
})


export const updateProjectPage = createAction(UPDATE_PROJECT_PAGE, (token, projectPage) => {
    return {
        token,
        projectPage,
    }
})

export const updateProjectPageSuccess = createAction(UPDATE_PROJECT_PAGE_SUCCESS, response => {
    return {
        response,
    }
})

export const updateProjectPageFailed = createAction(UPDATE_PROJECT_PAGE_FAILED, err => {
    return {
        err,
    }
})

export const deleteProjectPage = createAction(DELETE_PROJECT_PAGE, (token, projectPageId, projectPageIndex) => {
    return {
        token,
        projectPageId,
        projectPageIndex,
    }
})

export const deleteProjectPageSuccess = createAction(DELETE_PROJECT_PAGE_SUCCESS, projectPageIndex => {
    return {
        projectPageIndex,
    }
})

export const deleteProjectPageFailed = createAction(DELETE_PROJECT_PAGE_FAILED, err => {
    return {
        err,
    }
})

export const onSharedProject = createAction(ONSHARED_PROJECT, isShared => {
    return {
        isShared,
    }
})

export const getProjectPagesByAccessToken = createAction(GET_PROJECT_PAGE_BY_ACCESS_TOKEN)

export const getProjectPageByAccessTokenSuccess = createAction(GET_PROJECT_PAGE_BY_ACCESS_TOKEN_SUCCESS, response => {
    return {
        response,
    }
})

export const getProjectPageByAccessTokenFailed = createAction(GET_PROJECT_PAGE_BY_ACCESS_TOKEN_FAILED, err => {
    return {
        err,
    }
})

export const clearProjectPageState = createAction(CLEAR_PROJECT_PAGE_STATE)
export const clearMyProjectsState = createAction(CLEAR_MY_PROJECTS_STATE)
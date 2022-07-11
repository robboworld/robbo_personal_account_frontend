import { createAction } from "redux-actions"

import {
    GET_ALL_PROJECT_PAGES, GET_ALL_PROJECT_PAGES_FAILED, GET_ALL_PROJECT_PAGES_SUCCESS,
    GET_PROJECT_PAGE_BY_ID, GET_PROJECT_PAGE_BY_ID_FAILED, GET_PROJECT_PAGE_BY_ID_SUCCESS,
    UPDATE_PROJECT_PAGE, UPDATE_PROJECT_PAGE_FAILED, UPDATE_PROJECT_PAGE_SUCCESS,
    CREATE_PROJECT_PAGE, CREATE_PROJECT_PAGE_FAILED, CREATE_PROJECT_PAGE_SUCCESS,
    DELETE_PROJECT_PAGE, DELETE_PROJECT_PAGE_SUCCESS, DELETE_PROJECT_PAGE_FAILED,
    ONCHANGE_PROJECT_PAGE_TITLE, ONCHANGE_PROJECT_PAGE_INSTRUCTION, ONCHANGE_PROJECT_PAGE_NOTES,
    ONSHARED_PROJECT,
    CLEAR_PROJECT_PAGE_STATE, CLEAR_MY_PROJECTS_STATE,
} from "@/constants"

export const getAllProjectPages = createAction(GET_ALL_PROJECT_PAGES, token => {
    return {
        token,
    }
})

export const getAllProjectPagesSuccess = createAction(GET_ALL_PROJECT_PAGES_SUCCESS, (response) => {
    return {
        response
    }
})

export const getAllProjectPagesFailed = createAction(GET_ALL_PROJECT_PAGES_FAILED, (err) => {
    return {
        err
    }
})


export const getProjectPageById = createAction(GET_PROJECT_PAGE_BY_ID, (token, id) => {
    return {
        token,
        id
    }
})

export const getProjectPageByIdSuccess = createAction(GET_PROJECT_PAGE_BY_ID_SUCCESS, (response) => {
    return {
        response
    }
})

export const getProjectPageByIdFailed = createAction(GET_PROJECT_PAGE_BY_ID_FAILED, (err) => {
    return {
        err
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

export const createProjectPageFailed = createAction(CREATE_PROJECT_PAGE_FAILED, () => {
    return {

    }
})


export const updateProjectPage = createAction(UPDATE_PROJECT_PAGE, (token, projectPage) => {
    return {
        token,
        projectPage
    }
})

export const updateProjectPageSuccess = createAction(UPDATE_PROJECT_PAGE_SUCCESS, response => {
    return {
        response,
    }
})

export const updateProjectPageFailed = createAction(UPDATE_PROJECT_PAGE_FAILED, (err) => {
    return {
        err
    }
})

export const deleteProjectPage = createAction(DELETE_PROJECT_PAGE, (token, projectPageId, projectPageIndex) => {
    return {
        token,
        projectPageId,
        projectPageIndex
    }
})

export const deleteProjectPageSuccess = createAction(DELETE_PROJECT_PAGE_SUCCESS, projectPageIndex => {
    return {
        projectPageIndex,
    }
})

export const deleteProjectPageFailed = createAction(DELETE_PROJECT_PAGE_FAILED, () => {
    return {

    }
})

export const onChangeProjectPageTitle = createAction(ONCHANGE_PROJECT_PAGE_TITLE, (title) => {
    return {
        title
    }
})

export const onChangeProjectPageInstruction = createAction(ONCHANGE_PROJECT_PAGE_INSTRUCTION, (instruction) => {
    return {
        instruction
    }
})

export const onChangeProjectPageNotes = createAction(ONCHANGE_PROJECT_PAGE_NOTES, (notes) => {
    return {
        notes
    }
})

export const onSharedProject = createAction(ONSHARED_PROJECT, (isShared) => {
    return {
        isShared
    }
})

export const clearProjectPageState = createAction(CLEAR_PROJECT_PAGE_STATE)
export const clearMyProjectsState = createAction(CLEAR_MY_PROJECTS_STATE)
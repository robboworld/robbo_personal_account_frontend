import * as axios from "axios";

import instance from "./instance";

export const projectPageAPI = {
    createProjectPage() {
        return instance.post('projectPage/', {
            projectPage: {}
        })
    },

    deleteProjectPage() {
        return instance.delete('projectPage/')
    },

    updateProjectPage() {
        return instance.update('projectPage/', {
            projectPage: {}
        })
    },

    getProjectPageById() {
        return instance.get(`projectPage/${id}`)
    },

    getAllProjectPages() {
        return instance.get('projectPage/')
    }
}
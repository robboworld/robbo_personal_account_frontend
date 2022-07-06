import * as axios from "axios"

import instance from "./instance"

export const coursePageAPI = {
    getCoursePageById(token) {
        return instance.get(`coursePage/${id}`,
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    getAllCoursePages(token) {
        return instance.get('coursePage/',
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            },
        )
    },
}
import * as axios from "axios"

import instance from "./instance"

export const coursePageAPI = {
    getCoursePageById(token, id) {
        return instance.get(`course/getCourseContent/${id}`,
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    getAllCoursePages(token) {
        return instance.get('course/getCoursesByUser',
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            },
        )
    },
}
import instance from './instance'

export const projectPageAPI = {
    createProjectPage(token) {
        return instance.post('projectPage/',
            {
                projectPage: {},
            },
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    deleteProjectPage(token, projectPageId) {
        return instance.delete(`projectPage/${projectPageId}`,
            {
                // withCredentials: true,
                // headers: {
                //     'Authorization': `Bearer ${token}`,
                // },
            })
    },

    updateProjectPage(token, projectPage) {
        return instance.put('projectPage/',
            {
                projectPage: projectPage,
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    getProjectPageById(token, id) {
        return instance.get(`projectPage/${id}`,
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    getAllProjectPages(token) {
        return instance.get('projectPage/',
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            },
        )
    },
}
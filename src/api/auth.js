import * as axios from "axios";

import instance from "./instance";

export const authAPI = {
    // me(token) {
    //   return instance.get('api/profile/me', {
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //     }
    //   });
    // },

    signUp(email, password) {
        return instance.post('auth/sign-up', {
            email: email,
            password: password,
        })
    },

    signIn(email, password) {
        return instance.post('auth/sign-in',
            {
                email: email,
                password: password,
            },
        );
    },

    signOut() {
        return instance.post('auth/sign-out');
    },

    refresh() {
        return instance.get('auth/refresh', { withCredentials: true })
    },
}
import * as axios from "axios";

//Настройка конфигурации экземпляра axios
const instance = axios.create({
    baseURL: 'http://0.0.0.0:8000/',
    headers: {
        'Access-Control-Allow-Headers': 'x-requested-with, Content-Type, origin, authorization, accept, x-access-token',
    }
});

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

    // logout() {
    //     return instance.delete('auth/sign-out');
    // }
}
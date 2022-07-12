import { useEffect } from 'react'

import { useActions } from './useActions'

export function useIsAuth() {
    const { checkAuthRequest } = useActions()
    useEffect(() => {
        if (localStorage.getItem('token')) {
            checkAuthRequest(localStorage.getItem('token'))
        }
    }, [])
}
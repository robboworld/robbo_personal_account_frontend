import { useEffect } from 'react'

import { useActions } from './useActions'

export function useIsAuth() {
    const { checkAuthRequest } = useActions()
    useEffect(() => {
        const accessToken = localStorage.getItem('token')
        if (accessToken) {
            checkAuthRequest(accessToken)
        }
    }, [])
}
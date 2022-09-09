import { useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'

import { useActions } from './useActions'

import { getLoginState } from '@/reducers/login'

export function useUserIdentity() {
    const { checkAuthRequest } = useActions()
    useLayoutEffect(() => {
        const accessToken = localStorage.getItem('token')
        async function checkAuthRequestAsync(accessToken) {
            await checkAuthRequest(accessToken)
        }
        if (accessToken) checkAuthRequestAsync(accessToken)
    }, [checkAuthRequest])
    return useSelector(({ login }) => getLoginState(login))
}
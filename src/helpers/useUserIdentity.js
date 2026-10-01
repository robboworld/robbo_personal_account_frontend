import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useActions } from './useActions'

import { getAccessToken } from './accessTokenMemory'

import { getLoginState } from '@/reducers/login'
import { checkAuthRequest } from '@/actions'

/** Loads auth identity + login streak (check-auth → RecordVisit). */
export function useUserIdentity() {
    const actions = useActions({ checkAuthRequest }, [])
    useEffect(() => {
        const accessToken = getAccessToken()
        actions.checkAuthRequest(accessToken || null)
    }, [actions])
    return useSelector(({ login }) => getLoginState(login))
}
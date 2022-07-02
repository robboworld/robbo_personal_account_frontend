import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useHistory } from "react-router-dom"


import { checkAuthRequest } from '@/actions'
import { getIsAuth } from '@/reducers/login'

export function useIsAuth() {
    const dispatch = useDispatch()
    const history = useHistory()
    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(checkAuthRequest())
        }
    }, [])

    const isAuth = useSelector(state => getIsAuth(state.login))
    if (!isAuth) {
        // return <Redirect to={"/login"} />;
        history.push(`/login`)
    }
}
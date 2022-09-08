import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import {
    MainContainer,
    WelcomeText,
    SignIn,
    SignOut,
} from './components'

import { PageLayout } from '@/layouts'
import { useActions } from '@/helpers/useActions'
import { getLoginState } from '@/reducers/login'
import { useIsAuth } from '@/helpers'
import Loader from '@/components/Loader'
import SignUpForm from '@/components/SignUpForm'
import SignInForm from '@/components/SignInForm'
import Flex from '@/components/Flex'

export default () => {
    useIsAuth()

    useEffect(() => {
        return () => {
            clearLoginState()
        }
    }, [])

    const [signIn, setSignIn] = useState(false)
    const { clearLoginState, signInRequest, signUpRequest } = useActions()

    const { loading, isAuth } = useSelector(({ login }) => getLoginState(login))

    if (isAuth) {
        return <Redirect to='/' />
    }

    return (
        <PageLayout>
            <Flex
                direction='column' align='center'
                width='100%' height='100%'
            >
                <Flex direction='column' align='center'>
                    {loading ? (
                        <Loader />
                    ) : (
                        signIn ? (
                            <MainContainer>
                                <Flex width='100%' justify='space-between'>
                                    <SignIn
                                        signIn={signIn} onClick={() => setSignIn(false)}
                                        data-cy='sign-in'
                                    >
                                        <h4>Войти</h4>
                                    </SignIn>
                                    <SignOut
                                        signIn={signIn} onClick={() => setSignIn(true)}
                                        data-cy='sign-up'
                                    >
                                        <h4>Регистрация</h4>
                                    </SignOut>
                                </Flex>
                                <WelcomeText>Добро пожаловать!</WelcomeText>
                                <SignUpForm
                                    buttonOption={{
                                        content: 'Регистрация',
                                        padding: '10px',
                                    }}
                                    needSelectRole
                                    margin='0 0 10px 0'
                                    handleSubmit={newUser => signUpRequest(newUser)}
                                />
                            </MainContainer>
                        ) : (
                            <MainContainer>
                                <Flex width='100%' justify='space-between'>
                                    <SignIn onClick={() => setSignIn(false)}><h4>Войти</h4></SignIn>
                                    <SignOut onClick={() => setSignIn(true)}><h4>Регистрация</h4></SignOut>
                                </Flex>
                                <WelcomeText>Добро пожаловать!</WelcomeText>
                                <SignInForm
                                    buttonOption={{
                                        content: 'Войти',
                                        padding: '10px',
                                    }}
                                    needSelectRole
                                    margin='0 0 10px 0'
                                    handleSubmit={newUser => signInRequest(newUser)}
                                />
                            </MainContainer>
                        )
                    )
                    }
                </Flex>
            </Flex>
        </PageLayout >
    )
}
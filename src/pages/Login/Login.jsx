import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import {
    MainContainer,
    WelcomeText,
    Text,
    SelectContainer,
    SignIn,
    SignOut,
} from './components'

import { PageLayout } from '@/layouts'
import { Select, Button } from '@/components/UI'
import { useActions } from '@/helpers/useActions'
import { getLoginState } from '@/reducers/login'
import { useIsAuth } from '@/helpers'
import {
    FREE_LISTENER, PARENT, STUDENT,
    SUPER_ADMIN, TEACHER, UNIT_ADMIN, userRole,
} from '@/constants'
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

    const {
        signInRequest, signUpRequest,
        signInRoleOnChange, signUpRoleOnChange, clearLoginState,
    } = useActions()

    const {
        signInRole, loading,
        signUpRole, isAuth,
        user,
    } = useSelector(state => getLoginState(state.login))

    const { email, password } = user

    const roles = [
        { value: STUDENT, label: userRole[STUDENT] },
        { value: TEACHER, label: userRole[TEACHER] },
        { value: PARENT, label: userRole[PARENT] },
        { value: FREE_LISTENER, label: userRole[FREE_LISTENER] },
        { value: UNIT_ADMIN, label: userRole[UNIT_ADMIN] },
        { value: SUPER_ADMIN, label: userRole[SUPER_ADMIN] },
    ]

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
                                    <SignIn signIn={signIn} onClick={() => setSignIn(false)}><h4>Войти</h4></SignIn>
                                    <SignOut signIn={signIn} onClick={() => setSignIn(true)}><h4>Регистрация</h4></SignOut>
                                </Flex>
                                <WelcomeText>Добро пожаловать!</WelcomeText>
                                <SignUpForm />
                                <Text>Выберите роль</Text>
                                <Select
                                    options={roles.slice(0, -2)}
                                    onChange={role => signUpRoleOnChange(role)}
                                    value={signUpRole}
                                    width='70%'
                                />
                                <Flex
                                    justify='center' align='center'
                                    width='100%' margin='1rem 0 2rem 0'
                                >
                                    <Button
                                        content='Регистрация'
                                        handleSubmit={() => { signUpRequest(user, signUpRole.value) }}
                                        padding='10px'
                                    />
                                </Flex>
                            </MainContainer>
                        ) : (
                            <MainContainer>
                                <Flex width='100%' justify='space-between'>
                                    <SignIn onClick={() => setSignIn(false)}><h4>Войти</h4></SignIn>
                                    <SignOut onClick={() => setSignIn(true)}><h4>Регистрация</h4></SignOut>
                                </Flex>
                                <WelcomeText>Добро пожаловать!</WelcomeText>
                                <SignInForm />

                                <Text>Выберите роль</Text>
                                <Select
                                    options={roles}
                                    onChange={role => signInRoleOnChange(role)}
                                    value={signInRole}
                                    width='70%'
                                />

                                <Flex
                                    justify='center' align='center'
                                    width='100%' margin='1rem 0 2rem 0'
                                >
                                    <Button
                                        content='Войти'
                                        handleSubmit={() => { signInRequest(email, password, signInRole.value) }}
                                        padding='10px'
                                    />
                                </Flex>
                            </MainContainer>
                        )
                    )
                    }
                </Flex>
            </Flex>
        </PageLayout >
    )
}
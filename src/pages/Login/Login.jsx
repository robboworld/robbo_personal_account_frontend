import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import {
    Card,
    MainContainer,
    WelcomeText,
    Text,
    InputContainer,
    SelectContainer,
    ButtonContainer,
    HorizontalRule,
    LoginForm,
    SwitchInOut,
    SignIn,
    SignOut,
} from './components'

import { PageLayout } from '@/layouts'
import Input from '@/components/UI/Input'
import Button from '@/components/UI/Button'
import CustomSelect from '@/components/UI/Select/Select'
import { useActions } from '@/helpers/useActions'
import { getLoginState } from '@/reducers/login'
import { useIsAuth } from '@/helpers'

export default () => {
    useIsAuth()
    const [signIn, setSignIn] = useState(false)
    const switchIn = () => setSignIn(false)
    const switchUp = () => setSignIn(true)

    const { emailOnChange, passwordOnChange, signInRequest, signUpRequest, roleOnChange } = useActions()
    const { email, password, roles, role, isAuth } = useSelector(state => getLoginState(state.login))

    const emailHandle = email => {
        emailOnChange(email)
    }
    const passwordHandle = password => {
        passwordOnChange(password)
    }

    const onSelectChange = value => {
        roleOnChange(value)
    }

    if (isAuth) {
        return <Redirect to='/' />
    }

    return (
        <PageLayout>
            <Card>
                <LoginForm>
                    {signIn
                        ? (
                            <MainContainer>
                                <SwitchInOut>
                                    <SignIn signIn={signIn} onClick={switchIn}><h4>Войти</h4></SignIn>
                                    <SignOut signIn={signIn} onClick={switchUp}><h4>Регистрация</h4></SignOut>
                                </SwitchInOut>
                                <WelcomeText>Добро пожаловать!</WelcomeText>
                                <InputContainer>
                                    <Input type='text' placeholder='Email'
                                        value={email} handleInput={emailHandle} />
                                    <Input type='password' placeholder='Password'
                                        value={password} handleInput={passwordHandle} />
                                </InputContainer>
                                <SelectContainer>
                                    <Text>Выберите роль</Text>
                                    <CustomSelect
                                        options={roles}
                                        onChange={onSelectChange}
                                        value={role}
                                    />
                                </SelectContainer>
                                <ButtonContainer>
                                    <Button
                                        content='Регистрация'
                                        handleSubmit={() => { signUpRequest(email, password, role.value) }}
                                        padding='10px'
                                    />
                                </ButtonContainer>
                                <HorizontalRule />
                            </MainContainer>
                        )
                        : (
                            <MainContainer>
                                <SwitchInOut>
                                    <SignIn onClick={switchIn}><h4>Войти</h4></SignIn>
                                    <SignOut onClick={switchUp}><h4>Регистрация</h4></SignOut>
                                </SwitchInOut>
                                <WelcomeText>Добро пожаловать!</WelcomeText>
                                <InputContainer>
                                    <Input type='text' placeholder='Email'
                                        value={email} handleInput={emailHandle} />
                                    <Input type='password' placeholder='Password'
                                        value={password} handleInput={passwordHandle} />
                                </InputContainer>
                                <ButtonContainer>
                                    <Button
                                        content='Войти'
                                        handleSubmit={() => { signInRequest(email, password) }}
                                        padding='10px'
                                    />
                                </ButtonContainer>
                                <HorizontalRule />
                            </MainContainer>
                        )
                    }
                </LoginForm>
            </Card>
        </PageLayout >
    )
}
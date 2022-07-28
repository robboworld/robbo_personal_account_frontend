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
import { FREE_LISTENER, PARENT, STUDENT, SUPER_ADMIN, TEACHER, UNIT_ADMIN, userRole } from '@/constants'

export default () => {
    useIsAuth()
    const [signIn, setSignIn] = useState(false)
    const switchIn = () => setSignIn(false)
    const switchUp = () => setSignIn(true)

    const {
        emailOnChange, passwordOnChange, signInRequest,
        signUpRequest, nicknameOnChange,
        lastnameOnChange, firstnameOnChange, middlenameOnChange,
        signInRoleOnChange, signUpRoleOnChange,
    } = useActions()

    const {
        email, password, signInRole,
        signUpRole, isAuth, nickname,
        lastname, firstname, middlename,
    } = useSelector(state => getLoginState(state.login))

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
                                        value={email} handleInput={email => emailOnChange(email)}
                                        margin='0 0 10px 0'
                                    />
                                    <Input type='password' placeholder='Password'
                                        value={password} handleInput={password => passwordOnChange(password)}
                                        margin='0 0 10px 0'
                                    />
                                    <Input type='text' placeholder='Никнейм'
                                        value={nickname} handleInput={nickname => nicknameOnChange(nickname)}
                                        margin='0 0 10px 0'
                                    />
                                    <Input type='text' placeholder='Фамилия'
                                        value={lastname} handleInput={lastname => lastnameOnChange(lastname)}
                                        margin='0 0 10px 0'
                                    />
                                    <Input type='text' placeholder='Имя'
                                        value={firstname} handleInput={firstname => firstnameOnChange(firstname)}
                                        margin='0 0 10px 0'
                                    />
                                    <Input type='text' placeholder='Отчество'
                                        value={middlename} handleInput={middlename => middlenameOnChange(middlename)}
                                        margin='0 0 10px 0'
                                    />
                                </InputContainer>
                                <SelectContainer>
                                    <Text>Выберите роль</Text>
                                    <CustomSelect
                                        options={roles.slice(0, -2)}
                                        onChange={role => signUpRoleOnChange(role)}
                                        value={signUpRole}
                                    />
                                </SelectContainer>
                                <ButtonContainer>
                                    <Button
                                        content='Регистрация'
                                        handleSubmit={() => { signUpRequest(email, password, signUpRole.value) }}
                                        padding='10px'
                                    />
                                </ButtonContainer>
                                {/* <HorizontalRule /> */}
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
                                        value={email} handleInput={email => emailOnChange(email)}
                                        margin='0 0 10px 0'
                                    />
                                    <Input type='password' placeholder='Password'
                                        value={password} handleInput={password => passwordOnChange(password)}
                                        margin='0 0 10px 0'
                                    />
                                </InputContainer>
                                <SelectContainer>
                                    <Text>Выберите роль</Text>
                                    <CustomSelect
                                        options={roles}
                                        onChange={role => signInRoleOnChange(role)}
                                        value={signInRole}
                                    />
                                </SelectContainer>
                                <ButtonContainer>
                                    <Button
                                        content='Войти'
                                        handleSubmit={() => { signInRequest(email, password, signInRole.value) }}
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
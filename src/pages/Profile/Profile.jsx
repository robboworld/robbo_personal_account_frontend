import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { Headind, StyledSpan, AvatarWrapper, AboutMe } from './components'
import DigitalTail from './DigitalTail'

import { PageLayout, Card } from '@/layouts'
import SideBar from '@/components/SideBar'
import { useIsAuth } from '@/helpers'
import { getProfile } from '@/reducers/profile'
import Loader from '@/components/Loader'
import Flex from '@/components/Flex'
import { Button, Input, Textarea } from '@/components/UI'
import { useActions } from '@/helpers/useActions'
import { getIsAuth } from '@/reducers/login'

export default () => {
    useIsAuth()
    const isAuth = useSelector(state => getIsAuth(state.login))

    if (!isAuth) {
        return <Redirect to='/login' />
    }

    const { profileEmailOnChange,
        deleteProfile,
        profileFirstnameOnChange,
        profileLastnameOnChange,
        profileMiddlenameOnChange,
        profileNicknameOnChange,
    } = useActions()

    const [emailEditMode, setEmailEditMode] = useState(false)
    const [nicknameEditMode, setNicknameEditMode] = useState(false)
    const [lastnameEditMode, setLastnameEditMode] = useState(false)
    const [firstnameEditMode, setFirstnameEditMode] = useState(false)
    const [middlenameEditMode, setMiddlenameEditMode] = useState(false)
    const [aboutMeEditMode, setAbouMeEditMode] = useState(false)

    useEffect(() => {
        // getProfileById(token, projectPageId)
        return () => {
            // clearProfileState()
        }
    }, [])

    const {
        email,
        joinedAt,
        loading,
        role,
        firstname,
        lastname,
        middlename,
        nickname,
        aboutMe,
    } = useSelector(state => getProfile(state.profile))

    return (
        <PageLayout>
            <Card>
                <Headind>Profile</Headind>
                <SideBar />
                {
                    loading
                        ? <Loader />
                        : (
                            <Flex direction='column'>


                                <Flex margin='0.5rem'>
                                    <AvatarWrapper />
                                    <Flex
                                        direction='row'
                                        align='flex-start'
                                        margin='0.5rem'
                                        width='100%'
                                    >
                                        <Flex
                                            width='30%'
                                            direction='column'
                                            align='flex-start'
                                            margin='0 20px 0 0'
                                            style={{ 'borderRight': 'solid' }}
                                        >
                                            <StyledSpan size='1rem' height='2.8rem'>Email</StyledSpan>
                                            <StyledSpan size='1rem' height='2.8rem'>Фамилия</StyledSpan>
                                            <StyledSpan size='1rem' height='2.8rem'>Имя</StyledSpan>
                                            <StyledSpan size='1rem' height='2.8rem'>Отчество</StyledSpan>
                                            <StyledSpan size='1rem' height='2.8rem'>Никнейм</StyledSpan>
                                            <StyledSpan size='1rem' height='2.8rem'>Аккаунт создан</StyledSpan>
                                        </Flex>

                                        <Flex
                                            width='60%'
                                            direction='column'
                                        >
                                            <Flex
                                                width='100%'
                                                margin='0 0 10px 0'
                                                justify='space-between'
                                                align='center'
                                            >
                                                {
                                                    emailEditMode
                                                        ? (
                                                            <Flex
                                                                width='100%'
                                                                justify='space-between'
                                                                align='center'
                                                            >
                                                                <Input
                                                                    height='2rem'
                                                                    fontSize='1rem'
                                                                    width='100%'
                                                                    padding='0.5rem'
                                                                    value={email}
                                                                    handleInput={email => { profileEmailOnChange(email) }}
                                                                />
                                                                <Button
                                                                    content='Готово'
                                                                    height='2rem'
                                                                    padding='10px'
                                                                    background='green'
                                                                    margin='0 0 0 10px'
                                                                    handleSubmit={() => { setEmailEditMode(false) }}
                                                                />
                                                            </Flex>
                                                        )
                                                        : (
                                                            <Flex width='100%' justify='space-around'>
                                                                <StyledSpan
                                                                    size='1rem'
                                                                    width='100%'
                                                                >
                                                                    {email}
                                                                </StyledSpan>
                                                                <Button
                                                                    height='2rem'
                                                                    content='Изменить'
                                                                    background='grey'
                                                                    padding='0.5rem'
                                                                    margin='0 0 0 3.5rem'
                                                                    handleSubmit={() => { setEmailEditMode(true) }}
                                                                />
                                                            </Flex>
                                                        )
                                                }

                                            </Flex>

                                            <Flex
                                                width='100%'
                                                justify='space-between'
                                                align='center'
                                                margin='0 0 10px 0'
                                            >
                                                {
                                                    lastnameEditMode
                                                        ? (
                                                            <Flex
                                                                width='100%'
                                                                justify='space-between'
                                                                align='center'
                                                            >
                                                                <Input
                                                                    height='2rem'
                                                                    fontSize='1rem'
                                                                    width='100%'
                                                                    padding='0.5rem'
                                                                    value={lastname}
                                                                    handleInput={lastname => { profileLastnameOnChange(lastname) }}
                                                                />
                                                                <Button
                                                                    content='Готово'
                                                                    height='2rem'
                                                                    padding='10px'
                                                                    background='green'
                                                                    margin='0 0 0 3.5rem'
                                                                    handleSubmit={() => { setLastnameEditMode(false) }}
                                                                />
                                                            </Flex>
                                                        )
                                                        : (
                                                            <Flex
                                                                width='100%'
                                                                justify='space-around'
                                                                align='center'
                                                            >
                                                                <StyledSpan size='1rem' width='100%'>{lastname}</StyledSpan>
                                                                <Button
                                                                    height='2rem'
                                                                    content='Изменить'
                                                                    background='grey'
                                                                    padding='0.5rem'
                                                                    margin='0 0 0 3.5rem'
                                                                    handleSubmit={() => { setLastnameEditMode(true) }}
                                                                />
                                                            </Flex>
                                                        )

                                                }
                                            </Flex>

                                            <Flex
                                                width='100%'
                                                justify='space-between'
                                                margin='0 0 10px 0'
                                                align='center'
                                            >
                                                {
                                                    firstnameEditMode
                                                        ? (
                                                            <Flex
                                                                width='100%'
                                                                justify='space-between'
                                                                align='center'
                                                            >
                                                                <Input
                                                                    height='2rem'
                                                                    fontSize='1rem'
                                                                    width='100%'
                                                                    padding='0.5rem'
                                                                    value={firstname}
                                                                    handleInput={firstname => { profileFirstnameOnChange(firstname) }}
                                                                />
                                                                <Button
                                                                    content='Готово'
                                                                    height='2rem'
                                                                    padding='10px'
                                                                    background='green'
                                                                    margin='0 0 0 10px'
                                                                    handleSubmit={() => { setFirstnameEditMode(false) }}
                                                                />
                                                            </Flex>
                                                        )
                                                        : (
                                                            <Flex
                                                                width='100%'
                                                                justify='space-around'
                                                                align='center'
                                                            >
                                                                <StyledSpan size='1rem' width='100%'>{firstname}</StyledSpan>
                                                                <Button
                                                                    height='2rem'
                                                                    content='Изменить'
                                                                    background='grey'
                                                                    padding='0.5rem'
                                                                    margin='0 0 0 3.5rem'
                                                                    handleSubmit={() => { setFirstnameEditMode(true) }}
                                                                />
                                                            </Flex>
                                                        )

                                                }
                                            </Flex>

                                            <Flex
                                                width='100%'
                                                justify='space-between'
                                                margin='0 0 10px 0'
                                                align='center'
                                            >
                                                {
                                                    middlenameEditMode
                                                        ? (
                                                            <Flex
                                                                width='100%'
                                                                justify='space-between'
                                                                align='center'
                                                            >
                                                                <Input
                                                                    height='2rem'
                                                                    fontSize='1rem'
                                                                    width='100%'
                                                                    padding='0.5rem'
                                                                    value={middlename}
                                                                    handleInput={middlename => { profileMiddlenameOnChange(middlename) }}
                                                                />
                                                                <Button
                                                                    content='Готово'
                                                                    height='2rem'
                                                                    padding='10px'
                                                                    background='green'
                                                                    margin='0 0 0 10px'
                                                                    handleSubmit={() => { setMiddlenameEditMode(false) }}
                                                                />
                                                            </Flex>
                                                        )
                                                        : (
                                                            <Flex
                                                                width='100%'
                                                                justify='space-around'
                                                                align='center'
                                                            >
                                                                <StyledSpan size='1rem' width='100%'>{middlename}</StyledSpan>
                                                                <Button
                                                                    height='2rem'
                                                                    content='Изменить'
                                                                    background='grey'
                                                                    padding='0.5rem'
                                                                    margin='0 0 0 3.5rem'
                                                                    handleSubmit={() => { setMiddlenameEditMode(true) }}
                                                                />
                                                            </Flex>
                                                        )

                                                }
                                            </Flex>


                                            <Flex
                                                width='100%'
                                                justify='space-between'
                                                margin='0 0 10px 0'
                                                align='center'
                                            >
                                                {
                                                    nicknameEditMode
                                                        ? (
                                                            <Flex
                                                                width='100%'
                                                                justify='space-between'
                                                                align='center'
                                                            >
                                                                <Input
                                                                    height='2rem'
                                                                    fontSize='1rem'
                                                                    width='100%'
                                                                    padding='0.5rem'
                                                                    value={nickname}
                                                                    handleInput={nickname => { profileNicknameOnChange(nickname) }}
                                                                />
                                                                <Button
                                                                    content='Готово'
                                                                    height='2rem'
                                                                    padding='10px'
                                                                    background='green'
                                                                    margin='0 0 0 10px'
                                                                    handleSubmit={() => { setNicknameEditMode(false) }}
                                                                />
                                                            </Flex>
                                                        )
                                                        : (
                                                            <Flex
                                                                width='100%'
                                                                justify='space-around'
                                                                align='center'
                                                            >
                                                                <StyledSpan size='1rem' width='100%'>{nickname}</StyledSpan>
                                                                <Button
                                                                    height='2rem'
                                                                    content='Изменить'
                                                                    background='grey'
                                                                    padding='0.5rem'
                                                                    margin='0 0 0 3.5rem'
                                                                    handleSubmit={() => { setNicknameEditMode(true) }}
                                                                />
                                                            </Flex>
                                                        )

                                                }
                                            </Flex>

                                            <Flex
                                                width='100%'
                                                justify='space-between'
                                                align='center'
                                                height='3.2rem'
                                            >
                                                <StyledSpan
                                                    size='1rem'

                                                >
                                                    {joinedAt}
                                                </StyledSpan>
                                            </Flex>

                                            <Flex
                                                width='100%'
                                                justify='space-between'
                                                align='center'
                                                height='3.2rem'
                                            >
                                                <StyledSpan
                                                    size='1rem'

                                                >
                                                    {role}
                                                </StyledSpan>
                                            </Flex>

                                        </Flex>
                                    </Flex>
                                </Flex>
                                <Flex
                                    width='100%'
                                    align='flex-start'
                                >
                                    <DigitalTail />
                                    <Flex direction='column' width='100%'
                                        height='100%' align='center'>
                                        <h4>Обо мне</h4>
                                        {
                                            aboutMeEditMode
                                                ? (
                                                    <Textarea
                                                        // onBlur={() => { onBlurHandler('instruction') }}
                                                        handleInput={aboutMe => { }}
                                                        value={aboutMe}
                                                        width='100%'
                                                        height='15vh'
                                                        padding='2rem'
                                                        placeholder=''
                                                        fontSize='1vw'
                                                        margin='1rem 0'
                                                    />)
                                                : (
                                                    <AboutMe onClick={() => { setAbouMeEditMode(true) }}>
                                                        {aboutMe}
                                                    </AboutMe>
                                                )
                                        }

                                    </Flex>
                                </Flex>

                                <Flex
                                    width='100%'
                                    justify='center'>
                                    <Button
                                        width='10%'
                                        content='Удалить аккаунт'
                                        padding='10px'
                                        background='grey'
                                        handleSubmit={() => { deleteProfile() }}
                                    />
                                </Flex>

                            </Flex>
                        )
                }
            </Card >
        </PageLayout >
    )
}
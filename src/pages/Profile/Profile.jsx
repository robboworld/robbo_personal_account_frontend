import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Email, Headind, StyledSpan, AvatarWrapper } from './components'
import DigitalTail from './DigitalTail'

import { PageLayout, Card } from '@/layouts'
import SideBar from '@/components/SideBar'
import { useIsAuth } from '@/helpers'
import { getProfile } from '@/reducers/profile'
import Loader from '@/components/Loader'
import Flex from '@/components/Flex'
import { Button, Input } from '@/components/UI'
import { useActions } from '@/helpers/useActions'


export default () => {
    useIsAuth()

    const { profileEmailOnChange, deleteProfile } = useActions()

    const [emailEditMode, setEmailEditMode] = useState(false)

    useEffect(() => {
        // getProfileById(token, projectPageId)
        return () => {
            // clearProfileState()
        }
    }, [])

    const onBlurHandler = element => {
        switch (element) {
            case 'email':
                setEmailEditMode(false)
            // updateProjectPage(token, projectPage)
            // return
        }
    }

    const {
        email,
        joinedAt,
        loading,
        role,
    } = useSelector(state => getProfile(state.profile))



    const onChangeEmailHandler = email => {
        profileEmailOnChange(email)
    }

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
                                            <StyledSpan size='2rem' margin='0 10px 20px 0'>Email</StyledSpan>
                                            <StyledSpan size='2rem' margin='0 10px 20px 0'>Аккаунт создан</StyledSpan>
                                            <StyledSpan size='2rem' margin='0 10px 20px 0'>{role}</StyledSpan>
                                        </Flex>

                                        <Flex
                                            width='60%'
                                            direction='column'
                                        >
                                            <Flex
                                                width='100%'
                                                justify='space-between'
                                                margin='0 0 10px 0'
                                            >
                                                {
                                                    emailEditMode
                                                        ? (
                                                            <Input
                                                                onBlur={() => { onBlurHandler('email') }}
                                                                height='2rem'
                                                                fontSize='2rem'
                                                                width='100%'
                                                                padding='1.5rem'
                                                                value={email}
                                                                handleInput={onChangeEmailHandler}
                                                            />
                                                        )
                                                        : (
                                                            <Email>
                                                                <span>{email}</span>
                                                            </Email>
                                                        )
                                                }
                                                <Button
                                                    content='Изменить'
                                                    background='grey'
                                                    padding='0.5rem'
                                                    margin='0 0.5rem'
                                                    handleSubmit={() => { setEmailEditMode(true) }}
                                                />
                                            </Flex>

                                            <StyledSpan size='2rem' margin='0 10px 10px 0'>{joinedAt}</StyledSpan>

                                        </Flex>

                                        {/* <Flex align='center'>
                                        <StyledSpan size='2rem' margin='0 10px 0 0'>Пароль</StyledSpan>
                                        <Button
                                            content='Изменить'
                                            background='grey'
                                            padding='0.5rem'
                                            margin='0 0.5rem'
                                        />
                                    </Flex> */}
                                    </Flex>
                                </Flex>
                                <Flex
                                    width='100%'
                                >
                                    <DigitalTail />
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
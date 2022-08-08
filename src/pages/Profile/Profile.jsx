import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { Headind, AvatarWrapper, AboutMe } from './components'
import DigitalTail from './DigitalTail'

import { PageLayout, Card } from '@/layouts'
import SideBar from '@/components/SideBar'
import { useIsAuth } from '@/helpers'
import Loader from '@/components/Loader'
import Flex from '@/components/Flex'
import { Button, Textarea } from '@/components/UI'
import { useActions } from '@/helpers/useActions'
import { getIsAuth } from '@/reducers/login'
import { getProfileState } from '@/reducers/profile'
import ProfileCard from '@/components/ProfileCard/ProfileCard'

export default () => {
    useIsAuth()
    const isAuth = useSelector(state => getIsAuth(state.login))
    const token = localStorage.getItem('token')
    const { getProfileById } = useActions()

    if (!isAuth) {
        return <Redirect to='/login' />
    }

    const {
        deleteProfile,
        clearProfileState,
        updateProfile,
    } = useActions()


    const [aboutMeEditMode, setAbouMeEditMode] = useState(false)

    useEffect(() => {
        getProfileById(token)
        return () => {
            clearProfileState()
        }
    }, [])

    const { loading, profile } = useSelector(({ profile }) => getProfileState(profile))

    const {
        aboutMe,
    } = profile

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
                                <Flex margin='0.5rem' justify='flex-end'>
                                    <ProfileCard updateHandle={updateProfile} profile={profile} />
                                </Flex>
                                <Flex
                                    width='100%'
                                    align='flex-start'
                                >
                                    <DigitalTail />
                                    {/* <Flex direction='column' width='100%'
                                        height='100%' align='center'
                                        margin='0 10px 0 0'>
                                        <h4>Цифровой след</h4>
                                        <AboutMe onClick={() => { setAbouMeEditMode(true) }}>
                                            {aboutMe}
                                        </AboutMe>
                                    </Flex> */}
                                    <Flex direction='column' width='100%'
                                        height='100%' align='center'>
                                        <h4>Обо мне</h4>
                                        {
                                            aboutMeEditMode
                                                ? (
                                                    <Textarea
                                                        onBlur={() => { setAbouMeEditMode(true) }}
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
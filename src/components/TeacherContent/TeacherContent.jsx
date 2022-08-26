import React from 'react'

import { Title, SubTitle } from './components'

import Flex from '@/components/Flex'
import Button from '@/components/UI/Button'
import ProfileCard from '@/components/ProfileCard'
import { useActions } from '@/helpers/useActions'

export default ({ teacher }) => {

    const { updateProfile } = useActions()

    return (
        <Flex direction='column' width='100%'>
            <Flex padding='0 1rem' direction='column'
            >
                <Flex direction='column'
                    align='center'>
                    <Title>Карточка педагога</Title>
                    <ProfileCard updateHandle={updateProfile} profile={teacher} />
                    <Button
                        content='Назначить на курс'
                        background='darkgreen'
                        padding='0.5rem'
                        width='20%'
                    />
                </Flex>
                <SubTitle>Курсы</SubTitle >
            </Flex>
        </Flex>
    )
}
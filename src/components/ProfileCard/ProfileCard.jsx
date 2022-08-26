import React from "react"

import ProfileForm from './ProfileForm'

import Flex from '@/components/Flex'
import { StyledSpan } from '@/components/UI'

export default ({
    updateHandle,
    profile,
}) => {
    return (
        <Flex margin='0.5rem' width='100%'>
            {/* <AvatarWrapper /> */}
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
                    <StyledSpan size='1rem' height='2.8rem'
                        content='Email' />
                    <StyledSpan size='1rem' height='2.8rem'
                        content='Фамилия'
                    />
                    <StyledSpan size='1rem' height='2.8rem'
                        content='Имя'
                    />
                    <StyledSpan size='1rem' height='2.8rem'
                        content='Отчество'
                    />
                    <StyledSpan size='1rem' height='2.8rem'
                        content='Никнейм'
                    />
                    <StyledSpan size='1rem' height='2.8rem'
                        content='Аккаунт создан'
                    />
                </Flex>

                <ProfileForm updateHandle={updateHandle} profile={profile} />

            </Flex>
        </Flex>
    )
}
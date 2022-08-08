import React from 'react'

import { Title, SubTitle } from './components'

import Flex from '@/components/Flex'
import ProfileCard from '@/components/ProfileCard'
// import Button from '@/components/UI/Button'

export default ({ unitAdmin }) => {
    return (
        <Flex direction='column' width='100%'>
            <Flex padding='0 1rem' direction='column'
            >
                <Flex direction='column'
                    align='center'>
                    <Title>{`${unitAdmin.lastname} ${unitAdmin.firstname} ${unitAdmin.middlename}`}</Title>
                    <ProfileCard profile={unitAdmin} />
                    {/* <Button
                        content='Назначить на курс'
                        background='darkgreen'
                        padding='0.5rem'
                        width='20%'
                    /> */}
                </Flex>
                <SubTitle>Курсы</SubTitle >
            </Flex>
        </Flex>
    )
}
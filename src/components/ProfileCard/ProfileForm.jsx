import React from "react"

import EmailInput from "./EmailInput"
import LastnameInput from "./LastnameInput"
import FirstnameInput from "./FirstnameInput"
import NicknameInput from "./NicknameInput"
import MiddlenamInput from "./MiddlenamInput"

import Flex from '@/components/Flex'
import { StyledSpan } from '@/components/UI'
import { userRole } from '@/constants'


export default ({
    updateHandle,
    profile,
}) => {
    const token = localStorage.getItem('token')

    return (
        <Flex
            width='60%'
            direction='column'
        >
            <EmailInput
                profile={profile}
                updateHandle={updateHandle}
                token={token}
            />

            <LastnameInput
                profile={profile}
                updateHandle={updateHandle}
                token={token}
            />

            <FirstnameInput
                profile={profile}
                updateHandle={updateHandle}
                token={token}
            />

            <MiddlenamInput
                profile={profile}
                updateHandle={updateHandle}
                token={token}
            />

            <NicknameInput
                profile={profile}
                updateHandle={updateHandle}
                token={token}
            />

            <Flex
                width='100%'
                justify='space-between'
                align='center'
                height='3.2rem'
            >
                <StyledSpan
                    size='1rem'
                    content={profile?.createdAt}
                />
            </Flex>

            <Flex
                width='100%'
                justify='space-between'
                align='center'
                height='3.2rem'
            >
                <StyledSpan
                    size='1rem'
                    content={userRole[profile?.role]}
                />
            </Flex>

        </Flex>
    )
}
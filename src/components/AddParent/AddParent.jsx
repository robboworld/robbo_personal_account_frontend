import React, { memo } from 'react'
import { useSelector } from 'react-redux'

import { Text } from './components'

import Flex from '@/components/Flex'
import SignUpForm from '@/components/SignUpForm'
import { Button } from '@/components/UI'
import { useActions } from '@/helpers/useActions'
import { getNewParent } from '@/reducers/clients'

export default memo(() => {
    const {
        addNewParentEmailOnChange, addNewParentPasswordOnChange,
        addNewParentFirstnameOnChange, addNewParentLastnameOnChange,
        addNewParentNicknameOnChange, addNewParentMiddlenameOnChange,
    } = useActions()

    const newParent = useSelector(({ clients }) => getNewParent(clients))

    return (
        <Flex
            direction='column' width='100%'
            align='center'
        >
            <Text>Добавление родителя</Text>
            <SignUpForm
                margin='0 0 10px 0'
                emailOnChange={addNewParentEmailOnChange} passwordOnChange={addNewParentPasswordOnChange}
                nicknameOnChange={addNewParentNicknameOnChange} lastnameOnChange={addNewParentLastnameOnChange}
                firstnameOnChange={addNewParentFirstnameOnChange} middlenameOnChange={addNewParentMiddlenameOnChange}
            />
            <Flex
                justify='center' align='center'
                width='100%' margin='1rem 0 2rem 0'
            >
                <Button
                    background='green'
                    content='Добавить'
                    handleSubmit={() => { }}
                    padding='10px'
                />
            </Flex>
        </Flex>
    )
})
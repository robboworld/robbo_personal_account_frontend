import React from 'react'
import { useSelector } from 'react-redux'

import { ListParents, WelcomeText } from './components'

import ParentItem from './ParentItem'

import { getParents } from '@/reducers/clients'

import { PageLayout, Card } from '@/layouts'
import SideBar from '@/components/SideBar'
import Flex from '@/components/Flex'
import Button from '@/components/UI/Button'

export default () => {

    const parents = useSelector(state => getParents(state.clients))

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <WelcomeText>Клиенты</WelcomeText>
                <Flex direction='row' justify='flex-end'
                    align='flex-start'>
                    {/* <Button
                        content='Добавить клиента'
                        background='darkgreen'
                        margin='0 0.3rem 0 0 ' padding='0.5rem'
                    /> */}
                    <Button
                        content='Добавить родителя'
                        background='darkgreen'
                        padding='0.5rem'
                    />
                </Flex>
                <ListParents>
                    {
                        parents?.map((parent, index) => {
                            return (
                                <ParentItem
                                    parent={parent}
                                    key={index}
                                />
                            )
                        })
                    }
                </ListParents>
            </Card>
        </PageLayout>
    )
}

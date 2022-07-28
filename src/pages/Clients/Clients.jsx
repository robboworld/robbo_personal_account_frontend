import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { ListParents, WelcomeText } from './components'

import { getClientsState, getParents } from '@/reducers/clients'

import { PageLayout, Card } from '@/layouts'
import SideBar from '@/components/SideBar'
import Flex from '@/components/Flex'
import Button from '@/components/UI/Button'
import ListItem from '@/components/ListItem'
import ParentPage from '@/components/ParentContent'
import { ModalWindow } from '@/components/UI'
import { useActions } from '@/helpers/useActions'
import Loader from '@/components/Loader'


export default () => {
    const {
        getClients,
    } = useActions()

    const token = localStorage.getItem('token')

    useEffect(() => {
        getClients(token)
    }, [])
    const { parents, loading } = useSelector(({ clients }) => getClientsState(clients))

    return (
        <PageLayout>
            <Card>
                <SideBar />
                {
                    loading ? <Loader />
                        : (
                            <Flex width='100%' height='100%'
                                direction='column'
                            >
                                <WelcomeText>Клиенты</WelcomeText>
                                <Flex direction='row' justify='flex-end'
                                    align='flex-start'>
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
                                                <ListItem
                                                    label={`${parent.lastname} ${parent.firstname} ${parent.middlename}`}
                                                    key={index}
                                                    render={(open, setOpen) => (
                                                        <ModalWindow
                                                            open={open} setOpen={setOpen}
                                                            width='65%' height='80%'
                                                            content={() => (
                                                                <ParentPage client={parent} open={open}
                                                                    setOpen={setOpen}
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                />
                                            )
                                        })
                                    }
                                </ListParents>
                            </Flex>
                        )
                }

            </Card>
        </PageLayout>
    )
}

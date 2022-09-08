import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { ListParents, WelcomeText } from './components'

import { getClientsState } from '@/reducers/clients'
import { PageLayout, Card } from '@/layouts'
import SideBar from '@/components/SideBar'
import Flex from '@/components/Flex'
import ListItem from '@/components/ListItem'
import { ModalWindow, Button } from '@/components/UI'
import { useActions } from '@/helpers/useActions'
import Loader from '@/components/Loader'
import ParentContent from '@/components/ParentContent'
import AddParent from '@/components/AddParent/AddParent'
import { useIsAuth } from '@/helpers'
import { getLoginState, getIsAuth } from '@/reducers/login'

export default () => {
    useIsAuth()
    const isAuth = useSelector(({ login }) => getIsAuth(login))
    if (!isAuth) {
        return <Redirect to='/login' />
    }
    const { getClients, deleteParentRequest } = useActions()

    useEffect(() => {
        getClients(token)
        return () => {
            // clearstate
        }
    }, [])

    const token = localStorage.getItem('token')
    const { userRole } = useSelector(({ login }) => getLoginState(login))
    const { parents, clientsLoading } = useSelector(({ clients }) => getClientsState(clients))
    const [openAddClients, setOpenAddClients] = useState(false)

    if (userRole !== 5) {
        return <Redirect to='/home' />
    }

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <Flex width='100%' height='100%'
                    direction='column'
                >
                    <WelcomeText>Клиенты</WelcomeText>
                    <ModalWindow
                        open={openAddClients} setOpen={setOpenAddClients}
                        width='35%' height='60%'
                        content={() => (
                            <AddParent />
                        )}
                    />
                    <Flex
                        direction='row' justify='flex-end'
                        align='flex-start'>
                        <Button
                            content='Добавить родителя'
                            background='darkgreen'
                            padding='0.5rem'
                            handleSubmit={() => setOpenAddClients(true)}
                        />
                    </Flex>
                    <ListParents>
                        {
                            clientsLoading ? <Loader />
                                : (
                                    parents?.map((parent, index) => {
                                        return (
                                            <ListItem
                                                itemIndex={index}
                                                handleDelete={parentIndex => deleteParentRequest(token, parent.userHttp.id, parentIndex)}
                                                label={`${parent.userHttp.lastname} ${parent.userHttp.firstname} ${parent.userHttp.middlename}`}
                                                key={index}
                                                render={(open, setOpen) => (
                                                    <ModalWindow
                                                        open={open} setOpen={setOpen}
                                                        width='65%' height='80%'
                                                        content={() => (
                                                            <ParentContent
                                                                client={parent} open={open}
                                                                setOpen={setOpen}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        )
                                    })
                                )}
                    </ListParents>
                </Flex>
            </Card>
        </PageLayout>
    )
}

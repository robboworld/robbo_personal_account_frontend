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
import { checkAccess, useUserIdentity } from '@/helpers'
import { HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, SUPER_ADMIN } from '@/constants'

export default () => {
    const { userRole, isAuth, loading } = useUserIdentity()
    if (!loading && !checkAccess(userRole, [SUPER_ADMIN])) {
        console.log(loading, userRole)
        return <Redirect to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loading) {
        return <Redirect to={LOGIN_PAGE_ROUTE} />
    }

    const { getClients, deleteParentRequest } = useActions()
    const token = localStorage.getItem('token')

    useEffect(() => {
        getClients(token)
        return () => {
            // clearstate
        }
    }, [])

    const { parents, clientsLoading } = useSelector(({ clients }) => getClientsState(clients))
    const [openAddClients, setOpenAddClients] = useState(false)

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
                                                label={`
                                                            ${parent.userHttp.lastname}
                                                            ${parent.userHttp.firstname}
                                                            ${parent.userHttp.middlename}
                                                            `}
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

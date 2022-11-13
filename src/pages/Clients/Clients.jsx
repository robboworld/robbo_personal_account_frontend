import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Modal } from 'antd'

import { ListParents, WelcomeText } from './components'

import { getClientsState } from '@/reducers/clients'
import PageLayout from '@/components/PageLayout'
import Flex from '@/components/Flex'
import ListItem from '@/components/ListItem'
import { Button, DragResize } from '@/components/UI'
import { useActions } from '@/helpers/useActions'
import Loader from '@/components/Loader'
import ParentContent from '@/components/ParentContent'
import AddParent from '@/components/AddParent/AddParent'
import { checkAccess, useUserIdentity } from '@/helpers'
import { HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, SUPER_ADMIN } from '@/constants'

export default () => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()
    const { getClients, deleteParentRequest } = useActions()
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!loginLoading && checkAccess(userRole, [SUPER_ADMIN]))
            getClients(token)
        return () => {
            // clearstate
        }
    }, [loginLoading])

    const { parents, clientsLoading } = useSelector(({ clients }) => getClientsState(clients))
    const [openAddClients, setOpenAddClients] = useState(false)

    if (!loginLoading && !checkAccess(userRole, [SUPER_ADMIN])) {
        return <Redirect to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Redirect to={LOGIN_PAGE_ROUTE} />
    }

    return (
        <PageLayout>
            {
                loginLoading ? <Loader />
                    : (

                        <Flex width='100%' height='100%'
                            direction='column'
                        >
                            <WelcomeText>Клиенты</WelcomeText>

                            <Modal
                                title='Заполните данные клиента'
                                centered
                                open={openAddClients}
                                onCancel={() => setOpenAddClients(false)}
                                footer={[]}
                            >
                                <AddParent />
                            </Modal>
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
                                                            <DragResize
                                                                open={open} setOpen={setOpen}
                                                                content={() => (
                                                                    <ParentContent clientId={parent.userHttp.id} />
                                                                )}
                                                            />
                                                        )}
                                                    />
                                                )
                                            })
                                        )}
                            </ListParents>
                        </Flex>
                    )
            }
        </PageLayout>
    )
}

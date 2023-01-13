import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useSearchParams } from 'react-router-dom'
import { Modal, Button, Pagination } from 'antd'

import { ListParents, WelcomeText } from './components'

import PageLayout from '@/components/PageLayout'
import Flex from '@/components/Flex'
import ListItem from '@/components/ListItem'
import Loader from '@/components/Loader'
import ParentContent from '@/components/ParentContent'
import AddParent from '@/components/AddParent/AddParent'
import { DragResize } from '@/components/UI'
import { useActions } from '@/helpers/useActions'
import { getClientsState } from '@/reducers/clients'
import { checkAccess, useUserIdentity } from '@/helpers'
import {
    HOME_PAGE_ROUTE,
    LOGIN_PAGE_ROUTE,
    SUPER_ADMIN,
} from '@/constants'
import {
    getClientsRequest,
    deleteParentRequest,
    clearClientsState,
} from '@/actions'


export default () => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()
    const actions = useActions({ getClientsRequest, deleteParentRequest, clearClientsState }, [])
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') || '1'

    useEffect(() => {
        if (!loginLoading && checkAccess(userRole, [SUPER_ADMIN]))
            actions.getClientsRequest(currentPage, "10")
        return () => actions.clearClientsState()
    }, [loginLoading, currentPage])

    const { parents, countRows, clientsLoading } = useSelector(({ clients }) => getClientsState(clients))
    const [openAddClients, setOpenAddClients] = useState(false)

    if (!loginLoading && !checkAccess(userRole, [SUPER_ADMIN])) {
        return <Navigate to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Navigate to={LOGIN_PAGE_ROUTE} />
    }

    return (
        <PageLayout>
            {
                loginLoading ? <Loader />
                    : (
                        <Flex width='100%' height='95%'
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
                                <Button type='primary' onClick={() => setOpenAddClients(true)}>
                                    Добавить родителя
                                </Button>
                            </Flex>
                            <ListParents>
                                {
                                    clientsLoading ? <Loader />
                                        : (
                                            parents?.map((parent, index) => {
                                                return (
                                                    <ListItem
                                                        itemIndex={index}
                                                        handleDelete={
                                                            parentIndex => actions.deleteParentRequest(parent.userHttp.id, parentIndex)
                                                        }
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
                            <Pagination
                                defaultCurrent={1} defaultPageSize={10}
                                total={countRows} current={+currentPage}
                                onChange={(page, pageSize) => {
                                    setSearchParams({ page })
                                }}
                            />
                        </Flex>
                    )
            }
        </PageLayout>
    )
}

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { WelcomeText } from './components'

import SideBar from "@/components/SideBar"
import { Card, PageLayout } from "@/layouts"
import Flex from '@/components/Flex'
import { useUserIdentity, checkAccess } from '@/helpers'
import { getTeachersState } from '@/reducers/teachers'
import { useActions } from '@/helpers/useActions'
import { Button, ModalWindow } from '@/components/UI'
import ListItem from '@/components/ListItem'
import TeacherContent from '@/components/TeacherContent'
import AddTeacher from '@/components/AddTeacher'
import Loader from '@/components/Loader'
import { SUPER_ADMIN, HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE } from '@/constants'


export default () => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()


    const token = localStorage.getItem('token')
    const { getTeachers, deleteTeacher } = useActions()
    const { teachers, loading } = useSelector(({ teachers }) => getTeachersState(teachers))

    useEffect(() => {
        if (!loginLoading && checkAccess(userRole, [SUPER_ADMIN]))
            getTeachers(token)
        return () => {
            // clearTeachersState
        }
    }, [loginLoading])

    const [openAddTeacher, setOpenAddTeacher] = useState(false)

    if (!loginLoading && !checkAccess(userRole, [SUPER_ADMIN])) {
        return <Redirect to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Redirect to={LOGIN_PAGE_ROUTE} />
    }
    return (
        <PageLayout>
            <Card>
                <SideBar />
                <WelcomeText>Педагоги</WelcomeText>
                <ModalWindow
                    open={openAddTeacher} setOpen={setOpenAddTeacher}
                    width='35%' height='60%'
                    content={() => (
                        <AddTeacher />
                    )}
                />
                <Flex direction='row' justify='flex-end'
                    align='flex-start'>
                    <Button
                        background='green'
                        content='Добавить педагога'
                        padding='0.5rem'
                        handleSubmit={() => setOpenAddTeacher(true)}
                    />
                </Flex>
                {
                    loading ? <Loader />
                        : (
                            <Flex
                                widht='100%' direction='column'
                                justify=' center'
                            >
                                <Flex direction='column'>
                                    {
                                        teachers?.map((teacher, index) => {
                                            return (
                                                <ListItem
                                                    itemIndex={index}
                                                    key={index}
                                                    label={`
                                                        ${teacher.userHttp.lastname}
                                                        ${teacher.userHttp.firstname} 
                                                        ${teacher.userHttp.middlename}
                                                    `}
                                                    handleDelete={teacherIndex => deleteTeacher(token, teacher.userHttp.id, teacherIndex)}
                                                    render={(open, setOpen) => (
                                                        <ModalWindow
                                                            open={open} setOpen={setOpen}
                                                            width='65%' height='80%'
                                                            content={() => (
                                                                <TeacherContent teacher={teacher.userHttp} />
                                                            )}
                                                        />
                                                    )}
                                                />
                                            )
                                        })
                                    }
                                </Flex>
                            </Flex>
                        )
                }
            </Card>
        </PageLayout >

    )
}
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { WelcomeText } from './components'

import SideBar from "@/components/SideBar"
import { Card, PageLayout } from "@/layouts"
import Flex from '@/components/Flex'
import { useIsAuth } from '@/helpers'
import { getTeachersState } from '@/reducers/teachers'
import { useActions } from '@/helpers/useActions'
import { Button, ModalWindow } from '@/components/UI'
import ListItem from '@/components/ListItem'
import TeacherContent from '@/components/TeacherContent'
import AddTeacher from '@/components/AddTeacher'
import Loader from '@/components/Loader'


export default () => {
    useIsAuth()
    // const isAuth = useSelector()
    // if (!isAuth)

    const token = localStorage.getItem('token')
    const { getTeachers } = useActions()
    const { teachers, loading } = useSelector(({ teachers }) => getTeachersState(teachers))

    useEffect(() => {
        getTeachers(token)
        return () => {
            // clearTeachersState
        }
    }, [])

    const [openAddTeacher, setOpenAddTeacher] = useState(false)

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
                        handleSubmit={() => { setOpenAddTeacher(true) }}
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
                                                    key={index}
                                                    label={`${teacher.userHttp.lastname} ${teacher.userHttp.firstname} ${teacher.userHttp.middlename}`}
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
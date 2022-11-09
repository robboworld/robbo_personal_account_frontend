import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { MdGroup } from 'react-icons/md'
import { FaBook } from 'react-icons/fa'
import { Modal } from 'antd'

import { WelcomeText } from './components'

import PageLayout from '@/components/PageLayout'
import Flex from '@/components/Flex'
import { useUserIdentity, checkAccess } from '@/helpers'
import { getTeachersState } from '@/reducers/teachers'
import { useActions } from '@/helpers/useActions'
import { Button, DragResize } from '@/components/UI'
import ListItem from '@/components/ListItem'
import TeacherContent from '@/components/TeacherContent'
import AddTeacher from '@/components/AddTeacher'
import Loader from '@/components/Loader'
import { SUPER_ADMIN, HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE } from '@/constants'
import RobboGroupsList from '@/components/RobboGroupsList'


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
            <WelcomeText>Педагоги</WelcomeText>
            <Modal
                title='Заполните данные педагога'
                open={openAddTeacher}
                footer={[]}
                onCancel={() => setOpenAddTeacher(false)}
            >
                <AddTeacher />
            </Modal>


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
                                                    <DragResize
                                                        open={open} setOpen={setOpen}
                                                        content={() => (
                                                            // refactor
                                                            <TeacherContent teacher={teacher.userHttp} />
                                                        )}
                                                    />
                                                )}
                                            // refactor remove?
                                            // additionalIcons={[
                                            //     {
                                            //         iconLabel: 'Robbo groups',
                                            //         icon: <MdGroup />,
                                            //         renderContent: (open, setOpen) => (
                                            //             <DragResize
                                            //                 open={open}
                                            //                 setOpen={setOpen}
                                            //                 width='100%' height='100%'
                                            //                 content={() => (
                                            //                     <RobboGroupsList teacherId={teacher.userHttp.id} />
                                            //                 )}
                                            //             />
                                            //         ),
                                            //     },
                                            //     {
                                            //         iconLabel: 'Курсы',
                                            //         icon: <FaBook />,
                                            //         renderContent: () => { },
                                            //     },
                                            // ]}
                                            />
                                        )
                                    })
                                }
                            </Flex>
                        </Flex>
                    )
            }
        </PageLayout >

    )
}
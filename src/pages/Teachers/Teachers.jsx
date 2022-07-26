import React from 'react'
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
import ParentPage from '@/pages/ParentPage'


export default () => {
    useIsAuth()
    // const isAuth = useSelector()
    // if (!isAuth)

    const { teachers } = useSelector(state => getTeachersState(state.teachers))

    // const { } = useActions()

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <WelcomeText>Педагоги</WelcomeText>
                <Flex
                    padding='10px 0'
                    justify='flex-end'
                >

                    <Button
                        background='green'
                        content='Добавить педагога'
                        padding='10px'
                    />
                </Flex>
                <Flex
                    widht='100%'
                    direction='column' j
                    justify=' center'>
                    <Flex direction='column'>
                        {
                            teachers.map((teacher, index) => {
                                return (
                                    <ListItem
                                        key={index} label={teacher.firstname}
                                        render={(open, setOpen) => (
                                            <ModalWindow
                                                open={open} setOpen={setOpen}
                                                width='35%' height='30%'
                                                title={`${teacher.lastname} ${teacher.firstname} ${teacher.middlename}`}
                                                content={() => (
                                                    <div>Content</div>
                                                )}
                                                footer={() => { }}
                                            />
                                        )}
                                    />
                                )
                            })
                        }
                    </Flex>

                </Flex>
            </Card>
        </PageLayout >

    )
}
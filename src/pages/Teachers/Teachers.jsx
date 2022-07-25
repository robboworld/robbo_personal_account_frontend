import React from 'react'
import { useSelector } from 'react-redux'

import SideBar from "@/components/SideBar"
import { Card, PageLayout } from "@/layouts"
import Flex from '@/components/Flex'
import { useIsAuth } from '@/helpers'
import { getTeachersState } from '@/reducers/teachers'
import { useActions } from '@/helpers/useActions'
import { Button } from '@/components/UI'
import ListItem from '@/components/ListItem'


export default () => {
    useIsAuth()
    // const isAuth = useSelector()
    // if (!isAuth)

    const { teachers } = useSelector(state => getTeachersState(state.teachers))

    // const { } = useActions()

    return (
        <PageLayout>
            <Card>
                <Flex
                    widht='100%'
                    justify='center'
                >
                    <h3>Педагоги</h3>
                </Flex>

                <SideBar />
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
                    <h3>Список педагогов</h3>
                    <Flex direction='column'>
                        {
                            teachers.map((teacher, index) => {
                                return (
                                    <ListItem key={index} label={teacher.firstname} />
                                )
                            })
                        }
                    </Flex>

                </Flex>
            </Card>
        </PageLayout >

    )
}
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { Title, SubTitle } from './components'

import Flex from '@/components/Flex'
import ListItem from '@/components/ListItem'
import { Button, SearchInput } from '@/components/UI'
import ProfileCard from '@/components/ProfileCard'
import { useActions } from '@/helpers/useActions'
import { getRobboGroupsState } from '@/reducers/robboGroups'


export default ({ teacher }) => {

    const token = localStorage.getItem('token')
    const {
        updateProfile, searchRobboGroupsByTitleRequest,
        setTeacherForRobboGroupRequest,
    } = useActions()
    const [openSearchSection, setOpenSearchSection] = useState(false)
    const { searchResult, loading } = useSelector(({ robboGroups }) => getRobboGroupsState(robboGroups))

    return (
        <Flex direction='column' width='100%'>
            <Flex padding='0 1rem' direction='column'
            >
                <Flex direction='column' align='center'>
                    <Title>Карточка педагога</Title>
                    <ProfileCard updateHandle={updateProfile} profile={teacher} />
                    <Flex width='100%' justify='flex-end'>
                        <Button
                            content='Назначить на курс'
                            background='darkgreen'
                            padding='0.5rem'
                            margin='0 0.5rem 0 0'
                            width='20%'
                        />
                        <Button
                            content='Назначить группу'
                            background='darkgreen'
                            padding='0.5rem'
                            width='20%'
                            handleSubmit={() => setOpenSearchSection(!openSearchSection)}
                        />
                    </Flex>
                </Flex>
                {openSearchSection &&
                    <Flex
                        width='100%' margin='1rem 0 0 0'
                        direction='column'
                    >
                        <SearchInput
                            searchHandle={input => { searchRobboGroupsByTitleRequest(token, input) }}
                            placeholder='Введите название'
                        />
                        <Flex direction='column'>
                            {
                                searchResult ? (
                                    searchResult?.map((robboGroup, index) => {
                                        return (
                                            <ListItem
                                                itemIndex={index}
                                                label={robboGroup.name}
                                                key={index}
                                                render={() => { }}
                                                handleClick={() => setTeacherForRobboGroupRequest(token, teacher.id, robboGroup.id)}
                                                handleDelete={false}
                                            />
                                        )
                                    })
                                ) : "Ничего не найдено"}
                        </Flex>
                    </Flex>
                }
                <SubTitle>Курсы</SubTitle >
            </Flex>
        </Flex>
    )
}
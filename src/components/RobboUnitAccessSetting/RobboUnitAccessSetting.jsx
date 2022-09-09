import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import styled from "styled-components"

import Flex from "@/components/Flex"
import { Button, StyledSpan, SearchInput } from "@/components/UI"
import { useActions } from "@/helpers/useActions"
import ListItem from "@/components/ListItem"

import { getUnitAdminsState } from "@/reducers/unitAdmins"
import Loader from "@/components/Loader"
import { getRobboUnitState } from "@/reducers/robboUnit"

export default () => {
    const token = localStorage.getItem('token')
    const {
        getUnitAdminsByRobboUnitIdRequest,
        searchUnitAdminsByEmailRequest,
        setNewUnitAdminForRobboUnitRequest,
        deleteUnitAdminForRobboUnitRequest,
    } = useActions()

    const [openSearchSection, setOpenSearchSection] = useState(false)
    const { unitAdmins, searchResult, loading } = useSelector(({ unitAdmins }) => getUnitAdminsState(unitAdmins))
    const { robboUnit } = useSelector(({ robboUnit }) => getRobboUnitState(robboUnit))

    useEffect(() => {
        getUnitAdminsByRobboUnitIdRequest(token, robboUnit.id)
        return () => {
            // clear robboGroup {}
        }
    }, [getUnitAdminsByRobboUnitIdRequest, robboUnit.id, token])

    return (
        <Flex width='100%' direction='column'>
            <Flex
                width='100%' direction='column'
                justify='flex-start' align='center'
            >
                <Title>Настройка доступа</Title>
                <Flex width='100%' justify='flex-end'>
                    <Button
                        content='Назначить нового Unit Админа'
                        padding='10px'
                        margin='0.5rem'
                        width='30%'
                        height='80%'
                        handleSubmit={() => {
                            setOpenSearchSection(!openSearchSection)
                        }}
                    />
                </Flex>
                {openSearchSection &&
                    <Flex
                        width='100%' margin='1rem 0 0 0'
                        direction='column'
                    >
                        <SearchInput
                            searchHandle={input => { searchUnitAdminsByEmailRequest(token, input) }}
                        />
                        <Flex direction='column'>
                            {loading ? <Loader />
                                : (

                                    searchResult ? (
                                        searchResult?.map(({ userHttp }, index) => {
                                            return (
                                                <ListItem
                                                    itemIndex={index}
                                                    label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                                    key={index}
                                                    render={() => { }}
                                                    handleClick={() => setNewUnitAdminForRobboUnitRequest(token, userHttp.id, robboUnit.id)}
                                                // handleDelete={childIndex => deleteChildRequest(token, userHttp.id, childIndex)}
                                                />
                                            )
                                        })
                                    ) : "Ничего не найдено"

                                )}

                        </Flex>
                    </Flex>
                }
            </Flex>
            <StyledSpan content='Unit Админы' margin='0.5rem' />
            <Flex direction='column'>
                {loading ? <Loader />
                    : (

                        unitAdmins ? (
                            unitAdmins?.map(({ userHttp }, index) => {
                                return (
                                    <ListItem
                                        itemIndex={index}
                                        label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                        key={index}
                                        render={() => { }}
                                        // handleClick={() => setNewUnitAdminForRobboUnitRequest(token, userHttp.id, robboUnit.id)}
                                        handleDelete={childIndex => deleteUnitAdminForRobboUnitRequest(token, userHttp.id, robboUnit.id)}
                                    />
                                )
                            })
                        ) : "Ничего не найдено"

                    )}

            </Flex>
        </Flex>

    )
}

export const Title = styled.h1`
    display: flex;
    align-items: center;
    justify-content: center
    width: 100%;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
`
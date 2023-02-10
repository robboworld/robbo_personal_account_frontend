import React, { useState } from "react"
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { Button, Space, Input, List } from "antd"
import { useQuery } from "@apollo/client"

import ListItem from "@/components/ListItem"
import Loader from "@/components/Loader"
import { useActions } from "@/helpers/useActions"
import {
    unitAdminQuerysGQL,
    unitAdminQuerysGraphQL,
} from "@/graphQL/query"
import {
    setNewUnitAdminForRobboUnitRequest,
    deleteUnitAdminForRobboUnitRequest,
} from '@/actions'
import { PROFILE_PAGE_ROUTE, UNIT_ADMIN } from "@/constants"

const { Search } = Input

export default ({ robboUnitId }) => {
    const intl = useIntl()
    const [searchItems, setSearchResult] = useState([])
    const navigate = useNavigate()
    const actions = useActions({
        setNewUnitAdminForRobboUnitRequest,
        deleteUnitAdminForRobboUnitRequest,
    }, [])

    const [openSearchSection, setOpenSearchSection] = useState(false)

    const SearchUnitAdmins = async value => {
        const result = await unitAdminQuerysGraphQL.SearchUnitAdminByEmail(value, robboUnitId)
        setSearchResult(result.data.SearchUnitAdminsByEmail.unitAdmins)
    }

    const getUnitAdminsByRobboUnitIdResult = useQuery(unitAdminQuerysGQL.GET_UNIT_ADMINS_BY_ROBBO_UNIT_ID, {
        variables: { robboUnitId },
        notifyOnNetworkStatusChange: true,
    })

    const openProfileUnitAdmin = userId => {
        navigate(PROFILE_PAGE_ROUTE, {
            state: {
                userId,
                userRole: UNIT_ADMIN,
            },
        })
    }

    return (
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            <FormattedMessage id='robbo_unit_access.title' />
            <List
                loading={getUnitAdminsByRobboUnitIdResult?.loading}
                bordered
                dataSource={getUnitAdminsByRobboUnitIdResult.data?.GetUnitAdminsByRobboUnitId?.unitAdmins}
                renderItem={({ userHttp }, index) => (
                    <ListItem
                        itemIndex={index}
                        key={index}
                        label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                        render={() => { }}
                        handleClick={() => openProfileUnitAdmin(userHttp.id)}
                        handleDelete={childIndex => actions.deleteUnitAdminForRobboUnitRequest(userHttp.id, robboUnitId)}
                    />
                )}
            />
            <Button type='primary' onClick={() => setOpenSearchSection(!openSearchSection)}>
                <FormattedMessage id='robbo_unit_access.add_access' />
            </Button>
            {
                openSearchSection &&
                <React.Fragment>
                    <Search
                        placeholder={intl.formatMessage({ id: 'robbo_group_card.student_search_placeholder' })}
                        onSearch={SearchUnitAdmins}
                        enterButton />
                    <List
                        bordered
                        dataSource={searchItems}
                        renderItem={({ userHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                render={() => { }}
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                handleClick={() => actions.setNewUnitAdminForRobboUnitRequest(userHttp.id, robboUnitId)}
                            />
                        )}
                    />
                </React.Fragment>
            }
        </Space>
    )
}
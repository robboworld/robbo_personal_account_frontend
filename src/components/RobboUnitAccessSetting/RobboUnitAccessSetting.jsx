import React, { useState } from "react"
import { compose } from 'redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { Button, Space, Input, List, notification } from "antd"
import { graphql } from '@apollo/client/react/hoc'

import ListItem from "@/components/ListItem"
import { useActions } from "@/helpers/useActions"
import {
    unitAdminQuerysGQL,
} from "@/graphQL/query"
import {
    setNewUnitAdminForRobboUnitRequest,
    deleteUnitAdminForRobboUnitRequest,
} from '@/actions'
import { PROFILE_PAGE_ROUTE, UNIT_ADMIN } from "@/constants"

const { Search } = Input

const RobboUnitAccessSetting = ({
    intl,
    robboUnitId,
    GetUnitAdmins,
    SearchUnitAdmins,
    SearchUnitAdminsResults,
}) => {
    const navigate = useNavigate()
    const actions = useActions({
        setNewUnitAdminForRobboUnitRequest,
        deleteUnitAdminForRobboUnitRequest,
    }, [])

    const [openSearchSection, setOpenSearchSection] = useState(false)

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
                loading={GetUnitAdmins?.loading}
                bordered
                dataSource={GetUnitAdmins?.GetUnitAdminsByRobboUnitId?.unitAdmins}
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
                        dataSource={SearchUnitAdminsResults?.SearchUnitAdminsByEmail?.unitAdmins}
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

const RobboUnitAccessSettingContainer = ({
    robboUnitId,
}) => {
    const intl = useIntl()
    const [email, setEmail] = useState('')
    const SearchUnitAdmins = value => {
        setEmail(value)
    }

    return (
        <WithGraphQLComponent
            intl={intl}
            robboUnitId={robboUnitId}
            email={email}
            SearchUnitAdmins={SearchUnitAdmins}
        />
    )
}

const WithGraphQLComponent = compose(
    graphql(
        unitAdminQuerysGQL.GET_UNIT_ADMINS_BY_ROBBO_UNIT_ID,
        {
            options: props => {
                return {
                    variables: {
                        robboUnitId: props.robboUnitId,
                    },
                    onError: error => {
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
            name: 'GetUnitAdmins',
        },
    ),
    graphql(
        unitAdminQuerysGQL.SEARCH_UNIT_ADMINS_BY_EMAIL,
        {
            options: props => {
                return {
                    variables: {
                        email: props.email,
                        page: "1",
                        pageSize: "5",
                    },
                    onError: error => {
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
            name: 'SearchUnitAdminsResults',
        },
    ),
)(RobboUnitAccessSetting)

export default RobboUnitAccessSettingContainer
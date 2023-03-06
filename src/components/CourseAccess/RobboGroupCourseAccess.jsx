import React, { useState } from 'react'
import { compose } from 'redux'
import { Row, Button, Col, List, Input, notification } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'
import { graphql } from '@apollo/client/react/hoc'

import ListItem from "@/components/ListItem"
import { robboGroupQuerysGQL } from '@/graphQL'
import { createCourseAccessRelationRobboGroupRequest } from '@/actions'
import { useActions } from '@/helpers'

const { Search } = Input

const RobboGroupCourseAccess = ({
    intl,
    name,
    courseId,
    SearchRobboGroups,
    SearchRobboGroupsResult,
}) => {
    const [openSearchSection, setOpenSearchSection] = useState(false)
    const actions = useActions({ createCourseAccessRelationRobboGroupRequest }, [])

    return (
        <Row gutter={[0, 8]}>
            <Col span={24}>
                <Button
                    type='primary'
                    onClick={() => setOpenSearchSection(!openSearchSection)}
                >
                    <FormattedMessage id='robbo_group_course_access.add' />
                </Button>
            </Col>
            <Col span={24}>
                {
                    openSearchSection &&
                    <Row gutter={[0, 8]}>
                        <Col span={24}>
                            <Search
                                placeholder={intl.formatMessage({ id: 'robbo_group_course_access.search_placeholder' })}
                                onSearch={SearchRobboGroups}
                                enterButton />
                        </Col>
                        <Col span={24}>
                            <List
                                bordered
                                dataSource={SearchRobboGroupsResult?.SearchGroupsByName?.robboGroups}
                                renderItem={(robboGroup, index) => (
                                    <ListItem
                                        itemIndex={index}
                                        key={index}
                                        render={() => { }}
                                        label={`${robboGroup.name}`}
                                        handleClick={() => actions.createCourseAccessRelationRobboGroupRequest(courseId, robboGroup.id)}
                                    />
                                )}
                            />
                        </Col>
                    </Row>
                }
            </Col>
        </Row>
    )
}

const RobboGroupCourseAccessContainer = ({
    courseId,
}) => {
    const intl = useIntl()
    const [name, setName] = useState('')
    const SearchRobboGroups = value => {
        setName(value)
    }

    return (
        <WithGraphQLComponent
            intl={intl}
            courseId={courseId}
            name={name}
            SearchRobboGroups={SearchRobboGroups}
        />
    )
}

const WithGraphQLComponent = compose(
    graphql(
        robboGroupQuerysGQL.SEARCH_GROUPS_BY_NAME,
        {
            options: props => {
                return {
                    variables: {
                        name: props.name,
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
            name: 'SearchRobboGroupsResult',
        },
    ),
)(RobboGroupCourseAccess)

export default RobboGroupCourseAccessContainer
import React, { useState } from 'react'
import { compose } from 'redux'
import { graphql } from '@apollo/client/react/hoc'
import { FormattedMessage, useIntl } from 'react-intl'
import { Row, Button, Col, List, Input, notification } from 'antd'

import ListItem from "@/components/ListItem"
import { robboUnitQuerysGQL } from '@/graphQL'
import { createCourseAccessRelationRobboUnitRequest } from '@/actions'
import { useActions } from '@/helpers'

const { Search } = Input

const RobboUnitCourseAccess = ({
    intl,
    courseId,
    SearchRobboUnits,
    SearchRobboUnitsResult,
}) => {
    const [openSearchSection, setOpenSearchSection] = useState(false)
    const actions = useActions({ createCourseAccessRelationRobboUnitRequest }, [])

    return (
        <Row gutter={[0, 8]}>
            <Col span={24}>
                <Button
                    type='primary'
                    onClick={() => setOpenSearchSection(!openSearchSection)}
                >
                    <FormattedMessage id='robbo_unit_course_access.add' />
                </Button>
            </Col>
            <Col span={24}>
                {
                    openSearchSection &&
                    <Row gutter={[0, 8]}>
                        <Col span={24}>
                            <Search
                                placeholder={intl.formatMessage({ id: 'robbo_unit_course_access.search_placeholder' })}
                                onSearch={SearchRobboUnits}
                                enterButton />
                        </Col>
                        <Col span={24}>
                            <List
                                bordered
                                dataSource={SearchRobboUnitsResult?.SearchRobboUnitsByName?.robboUnits}
                                renderItem={(robboUnit, index) => (
                                    <ListItem
                                        itemIndex={index}
                                        key={index}
                                        render={() => { }}
                                        label={`${robboUnit.name} ${robboUnit.city}`}
                                        handleClick={() => actions.createCourseAccessRelationRobboUnitRequest(courseId, robboUnit.id)}
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

const RobboUnitCourseAccessContainer = ({
    courseId,
}) => {
    const intl = useIntl()
    const [name, setName] = useState('')
    const SearchRobboUnits = value => {
        setName(value)
    }

    return (
        <WithGraphQLComponent
            intl={intl}
            courseId={courseId}
            name={name}
            SearchRobboGroups={SearchRobboUnits}
        />
    )
}

const WithGraphQLComponent = compose(
    graphql(
        robboUnitQuerysGQL.SEARCH_ROBBO_UNITS_BY_NAME,
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
            name: 'SearchRobboUnitsResult',
        },
    ),
)(RobboUnitCourseAccess)

export default RobboUnitCourseAccessContainer
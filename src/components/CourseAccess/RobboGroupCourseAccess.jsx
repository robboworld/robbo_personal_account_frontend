import React, { useState } from 'react'
import { Row, Button, Col, List, Input } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import ListItem from "@/components/ListItem"
import { robboGroupsQuerysGraphQL } from '@/graphQL'
import { createCourseAccessRelationRobboGroupRequest } from '@/actions'
import { useActions } from '@/helpers'

const { Search } = Input

const RobboGroupCourseAccess = ({ courseId }) => {
    const intl = useIntl()
    const [openSearchSection, setOpenSearchSection] = useState(false)
    const [searchItems, setSearchResult] = useState([])
    const actions = useActions({ createCourseAccessRelationRobboGroupRequest }, [])

    const SearchRobboGroups = async value => {
        const result = await robboGroupsQuerysGraphQL.SearchRobboGroupsByName(value)
        setSearchResult(result.data.SearchGroupsByName.robboGroups)
    }

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
                                dataSource={searchItems}
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

export default RobboGroupCourseAccess
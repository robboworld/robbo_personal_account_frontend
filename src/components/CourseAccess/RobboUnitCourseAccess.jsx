import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Row, Button, Col, List, Input } from 'antd'

import ListItem from "@/components/ListItem"
import { robboUnitQuerysGraphQL } from '@/graphQL'
import { createCourseAccessRelationRobboUnitRequest } from '@/actions'
import { useActions } from '@/helpers'

const { Search } = Input

const RobboUnitCourseAccess = ({ courseId }) => {

    const intl = useIntl()
    const [openSearchSection, setOpenSearchSection] = useState(false)
    const [searchItems, setSearchResult] = useState([])
    const actions = useActions({ createCourseAccessRelationRobboUnitRequest }, [])

    const SearchRobboUnits = async value => {
        const result = await robboUnitQuerysGraphQL.SearchRobboUnitsByName(value)
        setSearchResult(result.data.SearchRobboUnitsByName.robboUnits)
    }

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
                                dataSource={searchItems}
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

export default RobboUnitCourseAccess
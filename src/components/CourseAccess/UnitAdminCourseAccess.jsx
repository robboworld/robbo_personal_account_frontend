import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Row, Button, Col, List, Input } from 'antd'

import ListItem from "@/components/ListItem"
import { unitAdminQuerysGraphQL } from '@/graphQL'
import { createCourseAccessRelationUnitAdminRequest } from '@/actions'
import { useActions } from '@/helpers'

const { Search } = Input

const UnitAdminCourseAccess = ({ courseId }) => {
    const intl = useIntl()
    const [openSearchSection, setOpenSearchSection] = useState(false)
    const [searchItems, setSearchResult] = useState([])
    const actions = useActions({ createCourseAccessRelationUnitAdminRequest }, [])

    const SearchUnitAdmins = async value => {
        const result = await unitAdminQuerysGraphQL.SearchUnitAdminByEmail(value, "")
        setSearchResult(result.data.SearchUnitAdminsByEmail.unitAdmins)
    }

    return (
        <Row gutter={[0, 8]}>
            <Col span={24}>
                <Button
                    type='primary'
                    onClick={() => setOpenSearchSection(!openSearchSection)}
                >
                    <FormattedMessage id='unit_admin_course_access.add' />
                </Button>
            </Col>
            <Col span={24}>
                {
                    openSearchSection &&
                    <Row gutter={[0, 8]}>
                        <Col span={24}>
                            <Search
                                placeholder={intl.formatMessage({ id: 'unit_admin_course_access.search_placeholder' })}
                                onSearch={SearchUnitAdmins}
                                enterButton />
                        </Col>
                        <Col span={24}>
                            <List
                                bordered
                                dataSource={searchItems}
                                renderItem={({ userHttp }, index) => (
                                    <ListItem
                                        itemIndex={index}
                                        key={index}
                                        render={() => { }}
                                        label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                        handleClick={() => actions.createCourseAccessRelationUnitAdminRequest(courseId, userHttp.id)}
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

export default UnitAdminCourseAccess
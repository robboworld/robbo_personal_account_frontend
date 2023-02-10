import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Row, Button, Col, List, Input } from 'antd'

import ListItem from "@/components/ListItem"
import { teacherQuerysGraphQL } from '@/graphQL'
import { createCourseAccessRelationTeacherRequest } from '@/actions'
import { useActions } from '@/helpers'

const { Search } = Input

const TeacherCourseAccess = ({ courseId }) => {
    const intl = useIntl()
    const [openSearchSection, setOpenSearchSection] = useState(false)
    const [searchItems, setSearchResult] = useState([])
    const actions = useActions({ createCourseAccessRelationTeacherRequest }, [])

    const SearchTeachers = async value => {
        const result = await teacherQuerysGraphQL.SearchTeachersByEmail(value)
        setSearchResult(result.data.SearchTeachersByEmail.teachers)
    }

    return (
        <Row gutter={[0, 8]}>
            <Col span={24}>
                <Button
                    type='primary'
                    onClick={() => setOpenSearchSection(!openSearchSection)}
                >
                    <FormattedMessage id='techer_course_access.add' />
                </Button>
            </Col>
            <Col span={24}>
                {
                    openSearchSection &&
                    <Row gutter={[0, 8]}>
                        <Col span={24}>
                            <Search
                                placeholder={intl.formatMessage({ id: 'techer_course_access.search_placeholder' })}
                                onSearch={SearchTeachers}
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
                                        handleClick={() => actions.createCourseAccessRelationTeacherRequest(courseId, userHttp.id)}
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

export default TeacherCourseAccess
import React, { useState } from 'react'
import { compose } from 'redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Row, Button, Col, List, Input, notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'

import ListItem from "@/components/ListItem"
import { teacherQuerysGQL } from '@/graphQL'
import { createCourseAccessRelationTeacherRequest } from '@/actions'
import { useActions } from '@/helpers'

const { Search } = Input

const TeacherCourseAccess = ({
    intl,
    courseId,
    SearchTeachers,
    SearchTeachersResults,
}) => {
    const [openSearchSection, setOpenSearchSection] = useState(false)
    // const [searchItems, setSearchResult] = useState([])
    const actions = useActions({ createCourseAccessRelationTeacherRequest }, [])

    // const SearchTeachers = async value => {
    //     const result = await teacherQuerysGraphQL.SearchTeachersByEmail(value)
    //     setSearchResult(result.data.SearchTeachersByEmail.teachers)
    // }

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
                                dataSource={SearchTeachersResults?.SearchTeachersByEmail?.teachers}
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

const TeacherCourseAccessContainer = ({
    courseId,
}) => {
    const intl = useIntl()
    const [email, setEmail] = useState('')
    const SearchTeachers = value => {
        setEmail(value)
    }

    return (
        <WithGraphQLComponent
            intl={intl}
            courseId={courseId}
            email={email}
            SearchTeachers={SearchTeachers}
        />
    )
}

const WithGraphQLComponent = compose(
    graphql(
        teacherQuerysGQL.SEARCH_TEACHERS_BY_EMAIL,
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
            name: 'SearchTeachersResults',
        },
    ),
)(TeacherCourseAccess)

export default TeacherCourseAccessContainer
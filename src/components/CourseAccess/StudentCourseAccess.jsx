import React, { useState } from 'react'
import { compose } from 'redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Row, Button, Col, List, Input, notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'

import ListItem from "@/components/ListItem"
import { studentQuerysGQL } from '@/graphQL'
import { createCourseAccessRelationStudentRequest } from '@/actions'
import { useActions } from '@/helpers'

const { Search } = Input

const StudentCourseAccess = ({
    intl,
    courseId,
    SearchStudents,
    SearchStudentsResults,
}) => {
    const [openSearchSection, setOpenSearchSection] = useState(false)
    const actions = useActions({ createCourseAccessRelationStudentRequest }, [])

    return (
        <Row gutter={[0, 8]}>
            <Col span={24}>
                <Button
                    type='primary'
                    onClick={() => setOpenSearchSection(!openSearchSection)}
                >
                    <FormattedMessage id='student_course_access.add' />
                </Button>
            </Col>
            <Col span={24}>
                {
                    openSearchSection &&
                    <Row gutter={[0, 8]}>
                        <Col span={24}>
                            <Search
                                placeholder={intl.formatMessage({ id: 'student_course_access.search_placeholder' })}
                                onSearch={SearchStudents}
                                enterButton />
                        </Col>
                        <Col span={24}>
                            <List
                                bordered
                                dataSource={SearchStudentsResults?.SearchStudentsByEmail?.students}
                                renderItem={({ userHttp }, index) => (
                                    <ListItem
                                        itemIndex={index}
                                        key={index}
                                        render={() => { }}
                                        label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                        handleClick={() => actions.createCourseAccessRelationStudentRequest(courseId, userHttp.id)}
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

const StudentCourseAccessContainer = ({
    courseId,
}) => {
    const intl = useIntl()
    const [email, setEmail] = useState('')
    const SearchStudents = value => {
        setEmail(value)
    }

    return (
        <WithGraphQLComponent
            intl={intl}
            courseId={courseId}
            email={email}
            SearchStudents={SearchStudents}
        />
    )
}

const WithGraphQLComponent = compose(
    graphql(
        studentQuerysGQL.SEARCH_STUDENTS_BY_EMAIL,
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
            name: 'SearchStudentsResults',
        },
    ),
)(StudentCourseAccess)

export default StudentCourseAccessContainer
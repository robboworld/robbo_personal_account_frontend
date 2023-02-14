import React, { useState } from 'react'
import { compose } from 'redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Row, Button, Col, List, Input, notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'

import ListItem from "@/components/ListItem"
import { unitAdminQuerysGQL } from '@/graphQL'
import { createCourseAccessRelationUnitAdminRequest } from '@/actions'
import { useActions } from '@/helpers'

const { Search } = Input

const UnitAdminCourseAccess = ({
    intl,
    courseId,
    SearchUnitAdmins,
    SearchUnitAdminsResults,
}) => {
    const [openSearchSection, setOpenSearchSection] = useState(false)
    // const [searchItems, setSearchResult] = useState([])
    const actions = useActions({ createCourseAccessRelationUnitAdminRequest }, [])

    // const SearchUnitAdmins = async value => {
    //     const result = await unitAdminQuerysGraphQL.SearchUnitAdminByEmail(value, "")
    //     setSearchResult(result.data.SearchUnitAdminsByEmail.unitAdmins)
    // }

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
                                dataSource={SearchUnitAdminsResults?.SearchUnitAdminsByEmail?.unitAdmins}
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

const UnitAdminCourseAccessContainer = ({
    courseId,
}) => {
    const intl = useIntl()
    const [email, setEmail] = useState('')
    const SearchUnitAdmins = value => {
        setEmail(value)
    }

    return (
        <WithGraphQLComponent
            intl={intl}
            courseId={courseId}
            email={email}
            SearchUnitAdmins={SearchUnitAdmins}
        />
    )
}

const WithGraphQLComponent = compose(
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
)(UnitAdminCourseAccess)


export default UnitAdminCourseAccessContainer
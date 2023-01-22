import React, { useState } from 'react'
import { Row, Button, Col, List, Input } from 'antd'

import ListItem from "@/components/ListItem"
import { studentQuerysGraphQL } from '@/graphQL'
import { createCourseAccessRelationStudentRequest } from '@/actions'
import { useActions } from '@/helpers'

const { Search } = Input

const StudentCourseAccess = ({ courseId }) => {
    const [openSearchSection, setOpenSearchSection] = useState(false)
    const [searchItems, setSearchResult] = useState([])
    const actions = useActions({ createCourseAccessRelationStudentRequest }, [])

    const SearchStudents = async value => {
        const result = await studentQuerysGraphQL.SearchStudentsByEmail(value, "")
        setSearchResult(result.data.SearchStudentsByEmail.students)
    }

    return (
        <Row gutter={[0, 8]}>
            <Col span={24}>
                <Button
                    type='primary'
                    onClick={() => setOpenSearchSection(!openSearchSection)}
                >
                    Добавить ученика
                </Button>
            </Col>
            <Col span={24}>
                {
                    openSearchSection &&
                    <Row gutter={[0, 8]}>
                        <Col span={24}>
                            <Search placeholder='Введите email' onSearch={SearchStudents}
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

export default StudentCourseAccess
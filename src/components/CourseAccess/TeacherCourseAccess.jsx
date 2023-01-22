import React, { useState } from 'react'
import { Row, Button, Col, List, Input } from 'antd'

import ListItem from "@/components/ListItem"
import { teacherQuerysGraphQL } from '@/graphQL'
import { createCourseAccessRelationTeacherRequest } from '@/actions'
import { useActions } from '@/helpers'

const { Search } = Input

const TeacherCourseAccess = ({ courseId }) => {
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
                    Добавить педагога
                </Button>
            </Col>
            <Col span={24}>
                {
                    openSearchSection &&
                    <Row gutter={[0, 8]}>
                        <Col span={24}>
                            <Search placeholder='Введите email' onSearch={SearchTeachers}
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
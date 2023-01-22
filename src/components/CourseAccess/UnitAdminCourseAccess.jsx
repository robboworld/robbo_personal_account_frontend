import React, { useState } from 'react'
import { Row, Button, Col, List, Input } from 'antd'

import ListItem from "@/components/ListItem"
import { unitAdminQuerysGraphQL } from '@/graphQL'
import { createCourseAccessRelationUnitAdminRequest } from '@/actions'
import { useActions } from '@/helpers'

const { Search } = Input

const UnitAdminCourseAccess = ({ courseId }) => {
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
                    Добавить Unit Админа
                </Button>
            </Col>
            <Col span={24}>
                {
                    openSearchSection &&
                    <Row gutter={[0, 8]}>
                        <Col span={24}>
                            <Search placeholder='Введите email' onSearch={SearchUnitAdmins}
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
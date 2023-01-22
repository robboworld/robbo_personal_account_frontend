import React, { useEffect } from "react"
import { Col, Row } from "antd"
import { useSelector } from "react-redux"

import { useActions } from "@/helpers/useActions"
import Loader from "@/components/Loader"
import {
    getCoursePagesByUserRequest,
    clearAllCoursePagesState,
} from '@/actions'
import { getCoursePagesState } from "@/reducers/myCourses"
import ListItem from "@/components/ListItem"


const TeacherCourses = () => {
    const actions = useActions({
        getCoursePagesByUserRequest,
        clearAllCoursePagesState,
    })
    useEffect(() => {
        actions.getCoursePagesByUserRequest()
        return () => {
            actions.clearAllCoursePagesState()
        }
    }, [])
    const { coursePages, loading } = useSelector(({ myCourses }) => getCoursePagesState(myCourses))
    return (
        <Row>
            <Col span={24} >
                {
                    loading
                        ? <Loader />
                        : coursePages?.map((coursePage, index) => {
                            return (
                                <ListItem
                                    itemIndex={index}
                                    label={`${coursePage.name}`}
                                    key={index}
                                    render={() => { }}
                                />
                            )
                        })
                }
            </Col>
        </Row>
    )
}

export default TeacherCourses
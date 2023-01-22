import React, { memo } from "react"
import { PropTypes } from 'prop-types'
import { Col } from "antd"

import RobboGroupForm from "@/components/RobboGroupForm"
import { useActions } from "@/helpers/useActions"
import { createRobboGroupRequest } from '@/actions'


const AddStudentGroup = memo(({ robboUnitId }) => {
    const actions = useActions({ createRobboGroupRequest }, [])
    return (
        <Col span={24}>
            <RobboGroupForm
                margin='0 0 10px 0'
                handleSubmit={robboGroup => actions.createRobboGroupRequest(String(robboUnitId), robboGroup)}
                buttonOption={{
                    content: 'Добавить',
                    padding: '10px',
                }}
            />
        </Col>
    )
})

AddStudentGroup.propTypes = {
    robboUnitId: PropTypes.string,
}

export default AddStudentGroup
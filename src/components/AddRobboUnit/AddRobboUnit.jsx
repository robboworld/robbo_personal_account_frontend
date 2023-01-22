import React, { memo } from 'react'
import { Col } from 'antd'

import RobboUnitForm from '@/components/RobboUnitForm'
import { useActions } from '@/helpers/useActions'
import { createRobboUnitRequest } from '@/actions'

const AddRobboUnit = memo(() => {
    const actions = useActions({ createRobboUnitRequest }, [])
    return (
        <Col span={24}>
            <RobboUnitForm
                margin='0 0 10px 0'
                handleSubmit={robboUnit => actions.createRobboUnitRequest(robboUnit)}
                buttonOption={{
                    content: 'Добавить',
                    padding: '10px',
                }}
            />
        </Col>
    )
})

export default AddRobboUnit
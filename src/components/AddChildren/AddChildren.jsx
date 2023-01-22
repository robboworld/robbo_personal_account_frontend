import React, { memo } from 'react'
import { Col } from 'antd'

import SignUpForm from '@/components/SignUpForm'
import { useActions } from '@/helpers'
import { createChildrenRequest } from '@/actions'

const AddChild = memo(({ parentId, robboGroupId, robboUnitId }) => {
    const actions = useActions({ createChildrenRequest }, [])
    return (
        <Col span={24}>
            <SignUpForm
                margin='0 0 10px 0'
                handleSubmit={child => actions.createChildrenRequest(child, parentId.toString())}
                buttonOption={{
                    content: 'Создать',
                    padding: '10px',
                }}
                robboGroupId={robboGroupId}
                robboUnitId={robboUnitId}
            />
        </Col >
    )
})

export default AddChild
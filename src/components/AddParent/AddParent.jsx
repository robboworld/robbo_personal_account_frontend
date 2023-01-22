import React, { memo } from 'react'
import { Col } from 'antd'

import SignUpForm from '@/components/SignUpForm'
import { useActions } from '@/helpers/useActions'
import { createParentRequest } from '@/actions'

const AddPrent = memo(() => {
    const actions = useActions({ createParentRequest }, [])
    return (
        <Col span={24}>
            <SignUpForm
                margin='0'
                handleSubmit={parent => actions.createParentRequest(parent)}
                buttonOption={{
                    content: 'Добавить',
                    padding: '10px',
                }}
            />
        </Col>
    )
})

export default AddPrent
import React, { memo } from 'react'
import { Col } from 'antd'

import SignUpForm from '@/components/SignUpForm'
import { useActions } from '@/helpers/useActions'
import { createUnitAdmin } from '@/actions'


const AddUnitAdmin = memo(() => {
    const actions = useActions({ createUnitAdmin }, [])

    return (
        <Col span={24}>
            <SignUpForm
                margin='0 0 10px 0'
                handleSubmit={unitAdmin => actions.createUnitAdmin(unitAdmin)}
                buttonOption={{
                    content: 'Добавить',
                    padding: '10px',
                }}
            />

        </Col>
    )
})

export default AddUnitAdmin
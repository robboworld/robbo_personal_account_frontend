import React, { memo } from 'react'
import { Col } from 'antd'

import SignUpForm from '@/components/SignUpForm'
import { useActions } from '@/helpers/useActions'
import { createTeacher } from '@/actions'


const AddTeacher = memo(() => {
    const actions = useActions({ createTeacher }, [])
    return (
        <Col span={24}
        >
            <SignUpForm
                margin='0 0 10px 0'
                handleSubmit={teacher => actions.createTeacher(teacher)}
                buttonOption={{
                    content: 'Добавить',
                    padding: '10px',
                }}
            />
        </Col>
    )
})

export default AddTeacher
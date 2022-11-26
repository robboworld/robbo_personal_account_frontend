import React from "react"
import { Button, Form, Input } from 'antd'

import { useActions } from "@/helpers"

export default ({ robboGroupCard }) => {
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    }
    const [form] = Form.useForm()
    const token = localStorage.getItem('token')
    const { updateRobboGroup } = useActions()
    return (
        <Form
            name='normal_robbo_group_card'
            className='robbo-group-form'
            {...layout}
            form={form}
            initialValues={{
                name: robboGroupCard.name,
            }}
            onFinish={({ name }) => {
                // updateRobboGroup(token, { ...robboGroupCard, name })
            }}
        >
            <Form.Item
                name='name' label='Название'
            >
                <Input placeholder={robboGroupCard.name} size='large' />
            </Form.Item>
            <Form.Item >
                <Button
                    type='primary' htmlType='submit'
                    className='login-form-button'
                >
                    Сохранить
                </Button>
            </Form.Item>
        </Form>

    )
}
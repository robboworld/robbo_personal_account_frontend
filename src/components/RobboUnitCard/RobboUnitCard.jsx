import React from "react"
import { Button, Form, Input } from 'antd'

import { useActions } from "@/helpers"

export default ({ robboUnit }) => {
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
    const { updateRobboUnit } = useActions()
    return (
        <Form
            name='normal_robbo_unit_card'
            className='robbo-unit-form'
            {...layout}
            form={form}
            initialValues={{
                name: robboUnit.name,
                city: robboUnit.city,
            }}
            onFinish={({ name, city }) => {
                // updateRobboUnit(token, { name, city })
            }}
        >
            <Form.Item
                name='name' label='Название'
            >
                <Input placeholder={robboUnit.name} size='large' />
            </Form.Item>
            <Form.Item
                name='city' label='Город'
            >
                <Input placeholder={robboUnit.city} size='large' />
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
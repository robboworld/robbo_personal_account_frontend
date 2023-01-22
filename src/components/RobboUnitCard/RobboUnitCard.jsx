import React from "react"
import { useQuery } from "@apollo/client"
import { Button, Form, Input } from 'antd'

import Loader from "@/components/Loader"
import { useActions } from "@/helpers"
import { robboUnitQuerysGQL } from "@/graphQL"
import { updateRobboUnitRequest } from '@/actions'

export default ({ robboUnitId }) => {
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    }
    const [form] = Form.useForm()
    const token = localStorage.getItem('token')
    const actions = useActions({ updateRobboUnitRequest }, [])

    const { data, loading } = useQuery(robboUnitQuerysGQL.GET_ROBBO_UNIT_BY_ID, {
        variables: { id: robboUnitId },
        notifyOnNetworkStatusChange: true,
    })

    return (
        loading ? <Loader />
            : (
                <Form
                    name='normal_robbo_unit_card'
                    className='robbo-unit-form'
                    {...layout}
                    form={form}
                    initialValues={{
                        name: data.GetRobboUnitById.name,
                        city: data.GetRobboUnitById.city,
                    }}
                    onFinish={({ name, city }) => {
                        actions.updateRobboUnitRequest({ id: data.GetRobboUnitById.id, name, city })
                    }}
                >
                    <Form.Item
                        name='name' label='Название'
                    >
                        <Input placeholder={data.GetRobboUnitById.name} size='large' />
                    </Form.Item>
                    <Form.Item
                        name='city' label='Город'
                    >
                        <Input placeholder={data.GetRobboUnitById.city} size='large' />
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
    )
}
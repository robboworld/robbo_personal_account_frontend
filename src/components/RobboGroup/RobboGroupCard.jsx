import React from "react"
import { useQuery } from "@apollo/client"
import { Button, Form, Input } from 'antd'

import { useActions } from "@/helpers"
import { robboGroupGQL } from "@/graphQL"
import Loader from "@/components/Loader"

export default ({ robboGroupId }) => {
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

    const { data, loading } = useQuery(robboGroupGQL.GET_ROBBO_GROUP_BY_ID, {
        variables: { id: robboGroupId },
        notifyOnNetworkStatusChange: true,
    })

    return (
        loading ? <Loader />
            : <Form
                name='normal_robbo_group_card'
                className='robbo-group-form'
                labelWrap
                {...layout}
                form={form}
                initialValues={{
                    name: data.GetRobboGroupById.name,
                }}
                onFinish={({ name }) => {
                    updateRobboGroup(token, { ...data.GetRobboGroupById, name })
                }}
            >
                <Form.Item
                    name='name' label='Название'
                >
                    <Input placeholder={data.GetRobboGroupById.name} size='large' />
                </Form.Item>
                <Form.Item label='Последнее изменение'>
                    {
                        data.GetRobboGroupById.lastModified
                    }
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
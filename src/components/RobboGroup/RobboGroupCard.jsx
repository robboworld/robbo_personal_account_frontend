import React from "react"
import { useQuery, useMutation } from "@apollo/client"
import { Button, Form, Input } from 'antd'
import { PropTypes } from 'prop-types'

import { robboGroupQuerysGQL, robboGroupMutationsGQL } from "@/graphQL"
import Loader from "@/components/Loader"

const RobboGroupCard = ({ robboGroupId, disableСhanges }) => {
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    }
    const [form] = Form.useForm()

    const { data, loading } = useQuery(robboGroupQuerysGQL.GET_ROBBO_GROUP_BY_ID, {
        variables: { id: robboGroupId },
        notifyOnNetworkStatusChange: true,
    })

    const [updateRobboGroup, updateMutation] = useMutation(
        robboGroupMutationsGQL.UPDATE_ROBBO_GROUP,
        {
            refetchQueries: [
                {
                    query: robboGroupQuerysGQL.GET_ROBBO_GROUP_BY_ID,
                    variables: { id: robboGroupId },
                },
            ],
        },
    )

    return (
        loading ? <Loader />
            : (
                <Form
                    name='normal_robbo_group_card'
                    className='robbo-group-form'
                    labelWrap
                    disabled={disableСhanges}
                    {...layout}
                    form={form}
                    initialValues={{
                        name: data.GetRobboGroupById.name,
                    }}
                    onFinish={({ name }) => {
                        updateRobboGroup({
                            variables: {
                                input: { id: data.GetRobboGroupById.id, robboUnitId: data.GetRobboGroupById.robboUnitId, name: name },
                            },
                        })
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
    )
}


RobboGroupCard.propTypes = {
    robboGroupId: PropTypes.string.isRequired,
    disableСhanges: PropTypes.bool,
}

export default RobboGroupCard
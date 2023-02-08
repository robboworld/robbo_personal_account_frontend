import React, { memo } from 'react'
import { graphql } from '@apollo/client/react/hoc'
import { Col, notification } from 'antd'

import SignUpForm from '@/components/SignUpForm'
import { parentMutationsGQL } from '@/graphQL'

const AddParent = memo(({
    CreateParent,
}) => {
    return (
        <Col span={24}>
            <SignUpForm handleSubmit={CreateParent} />
        </Col>
    )
})

const AddParentContainer = () => {
    const WithGraphQL = graphql(
        parentMutationsGQL.CREATE_PARENT,
        {
            name: 'CreateParent',
            options: {
                onCompleted: () => {
                    notification.success({ description: 'Клиент успешно добавлен!' })
                },
                onError: error => {
                    notification.error({ message: 'Ошибка', description: error?.message })
                },
            },
        },
    )(AddParent)
    return <WithGraphQL />
}

export default AddParentContainer
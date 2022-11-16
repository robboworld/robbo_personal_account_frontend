import React, { useState } from "react"

import { Tabs } from 'antd'

import Flex from "@/components/Flex"
import Loader from "@/components/Loader"
import ProfileCard from "@/components/ProfileCard"

import { usersQueryGraphQL } from '@/graphQL'

export default ({ childrenId }) => {

    const [childrenState, setChildrenState] = useState({
        loading: true,
        data: null,
        error: null,
    })

    usersQueryGraphQL.getStudentById({ studentId: childrenId })
        .then(result => setChildrenState({ loading: result.loading, data: result.data }))


    return (

        <Flex direction='column' width='100%'>

            <Flex padding='0 1rem' direction='column'>
                <Flex direction='column' align='center'
                    width='100%'
                >
                    Карточка ребенка
                    <Tabs
                        defaultActiveKey='1'
                        items={[
                            {
                                label: 'Профиль',
                                key: '1',
                                children: childrenState.loading ? <Loader /> : <ProfileCard profile={childrenState.data.GetStudentById?.userHttp} />,
                            },
                        ]}
                    />
                </Flex>
            </Flex>
        </Flex >
    )
} 
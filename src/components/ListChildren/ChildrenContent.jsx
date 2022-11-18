import React, { useState } from "react"
import { useQuery } from "@apollo/client"
import { Tabs } from 'antd'

import Flex from "@/components/Flex"
import Loader from "@/components/Loader"
import ProfileCard from "@/components/ProfileCard"

import { userGQL } from '@/graphQL'


export default ({ childrenId }) => {

    const { loading, error, data } = useQuery(userGQL.GET_STUDENT_BY_ID, {
        variables: { studentId: childrenId },
        notifyOnNetworkStatusChange: true,
    })

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
                                children: loading ? <Loader /> : <ProfileCard profile={data.GetStudentById?.userHttp} />,
                            },
                        ]}
                    />
                </Flex>
            </Flex>
        </Flex >
    )
} 
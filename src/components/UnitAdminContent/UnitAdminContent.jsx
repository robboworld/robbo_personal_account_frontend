import React from 'react'
import { Button, Tabs } from "antd"
import { useQuery } from '@apollo/client'

import Flex from '@/components/Flex'
import ProfileCard from '@/components/ProfileCard'
import { useActions } from '@/helpers/useActions'
import { userGQL } from '@/graphQL'
import Loader from '@/components/Loader'

export default ({ unitAdminId }) => {

    const { updateProfile } = useActions()

    const { data, loading } = useQuery(userGQL.GET_UNIT_ADMIN_BY_ID, {
        variables: { unitAdminId },
        notifyOnNetworkStatusChange: true,
    })

    return (
        <Flex direction='column' width='100%'>
            <Flex padding='0 1rem' direction='column'
            >
                <Tabs
                    defaultActiveKey='1'
                    items={[
                        {
                            label: 'Карточка',
                            key: '1',
                            children: loading ? <Loader /> : <ProfileCard profile={data.GetUnitAdminById.userHttp} updateHandle={updateProfile} />,
                        },
                        {
                            label: 'Units',
                            key: '2',
                            children: 'Назначенные юниты у админа',
                        },
                    ]}
                />
            </Flex>
        </Flex>
    )
}
import React from 'react'
import { Tabs } from "antd"
import { useQuery } from '@apollo/client'

import UnitsOfAdmin from './UnitsOfAdmin'

import Loader from '@/components/Loader'
import Flex from '@/components/Flex'
import ProfileCard from '@/components/ProfileCard'
import { useActions } from '@/helpers/useActions'
import { unitAdminQuerysGQL } from '@/graphQL'
import { updateProfile } from '@/actions'

export default ({ unitAdminId }) => {

    const actions = useActions({ updateProfile }, [])

    const { data, loading } = useQuery(unitAdminQuerysGQL.GET_UNIT_ADMIN_BY_ID, {
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
                            children: loading
                                ? <Loader />
                                : <ProfileCard profile={data.GetUnitAdminById.userHttp} updateHandle={actions.updateProfile} />,
                        },
                        {
                            label: 'Units',
                            key: '2',
                            children: <UnitsOfAdmin unitAdminId={unitAdminId} />,
                        },
                    ]}
                />
            </Flex>
        </Flex>
    )
}
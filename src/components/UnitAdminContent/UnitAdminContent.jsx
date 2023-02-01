import React from 'react'
import { Skeleton, Tabs } from "antd"

import UnitsOfAdmin from './UnitsOfAdmin'

import ProfileCard from '@/components/ProfileCard'

const UnitAdminContent = ({
    unitAdminId,
    data: {
        GetUnitAdminById,
        loading,
    },
    UpdateUnitAdmin,
}) => {
    return (

        <Tabs
            defaultActiveKey='1'
            title='Карточка Юнит Админ'
            items={[
                {
                    label: 'Карточка',
                    key: '1',
                    children: loading ? <Skeleton active loading={loading} />
                        : <ProfileCard updateHandle={UpdateUnitAdmin} profile={GetUnitAdminById?.userHttp} />,
                },
                {
                    label: 'Units',
                    key: '2',
                    children: <UnitsOfAdmin unitAdminId={unitAdminId} />,
                },
            ]}
        />

    )
}

export default UnitAdminContent
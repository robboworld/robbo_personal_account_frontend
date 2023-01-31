import React from "react"
import { Skeleton, Tabs } from 'antd'

import ChildrenTabContainer from "./ChildrenTabContainer"

import ProfileCard from "@/components/ProfileCard"
import { updateProfile } from '@/actions'
import { useActions } from "@/helpers/useActions"


const ParentContent = ({
    parentId,
    data: {
        GetParentById,
        loading,
    },
}) => {
    const actions = useActions({ updateProfile }, [])

    return (
        <Tabs
            title='Карточка родителя'
            defaultActiveKey='1'
            items={[
                {
                    label: 'Профиль',
                    key: '1',
                    children: loading ? <Skeleton active loading={loading} />
                        : <ProfileCard updateHandle={actions.updateProfile} profile={GetParentById?.userHttp} />,

                },
                {
                    label: 'Дети',
                    key: '2',
                    children: <ChildrenTabContainer parentId={parentId} />,
                },
            ]}
        />
    )
}

export default ParentContent
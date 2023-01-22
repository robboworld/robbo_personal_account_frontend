import React from "react"
import { Tabs } from 'antd'

import ChildrenTab from "./ChildrenTab"

import Flex from "@/components/Flex"
import Loader from "@/components/Loader"
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

        <Flex direction='column' width='100%'>
            <Flex padding='0 1rem' direction='column'>
                <Flex direction='column' align='center'
                    width='100%'
                >
                    Карточка родителя
                    <Tabs
                        defaultActiveKey='1'
                        items={[
                            {
                                label: 'Профиль',
                                key: '1',
                                children: loading
                                    ? <Loader />
                                    : <ProfileCard updateHandle={actions.updateProfile} profile={GetParentById?.userHttp} />,
                            },
                            {
                                label: 'Дети',
                                key: '2',
                                children: <ChildrenTab clientId={parentId} />,
                            },
                        ]}
                    />
                </Flex>
            </Flex>
        </Flex >
    )
}

export default ParentContent
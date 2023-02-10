import React from 'react'
import { Skeleton, Tabs } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import ChildrenTabContainer from "./ChildrenTabContainer"

import ProfileCard from "@/components/ProfileCard"

const ParentContent = ({
    parentId,
    data: {
        GetParentById,
        loading,
    },
    UpdateParent,
}) => {
    const intl = useIntl()
    return (
        <Tabs
            title={intl.formatMessage({ id: 'parent_content.title' })}
            defaultActiveKey='1'
            items={[
                {
                    label: <FormattedMessage id='parent_content.profile' />,
                    key: '1',
                    children: loading ? <Skeleton active loading={loading} />
                        : <ProfileCard updateHandle={UpdateParent} profile={GetParentById?.userHttp} />,
                },
                {
                    label: <FormattedMessage id='parent_content.children' />,
                    key: '2',
                    children: <ChildrenTabContainer parentId={parentId} />,
                },
            ]}
        />
    )
}

export default ParentContent
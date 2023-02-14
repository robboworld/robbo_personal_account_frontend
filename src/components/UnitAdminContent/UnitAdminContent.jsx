import React from 'react'
import { Skeleton, Tabs } from "antd"
import { FormattedMessage, useIntl } from 'react-intl'

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
    const intl = useIntl()
    return (
        <Tabs
            defaultActiveKey='1'
            title={intl.formatMessage({ id: 'unit_admin_content.title' })}
            items={[
                {
                    label: <FormattedMessage id='unit_admin_content.profile' />,
                    key: '1',
                    children: loading ? <Skeleton active loading={loading} />
                        : <ProfileCard updateHandle={UpdateUnitAdmin} profile={GetUnitAdminById?.userHttp} />,
                },
                {
                    label: <FormattedMessage id='unit_admin_content.robbo_units_item' />,
                    key: '2',
                    children: <UnitsOfAdmin unitAdminId={unitAdminId} />,
                },
            ]}
        />

    )
}

export default UnitAdminContent
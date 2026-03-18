import React, { useEffect, useState } from 'react'
import { Select, Spin } from 'antd'
import { useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'

import AddRobboGroup from './AddRobboGroup'

import { getRobboUnitsState } from '@/reducers/robboUnits'

const AddRobboGroupWithUnitSelect = ({ robboUnitId: initialRobboUnitId }) => {
    const intl = useIntl()
    const [selectedRobboUnitId, setSelectedRobboUnitId] = useState(initialRobboUnitId || null)
    const { robboUnits, loading } = useSelector(({ robboUnits }) => getRobboUnitsState(robboUnits))

    useEffect(() => {
        setSelectedRobboUnitId(initialRobboUnitId || null)
    }, [initialRobboUnitId])

    if (!initialRobboUnitId) {
        if (loading) {
            return <Spin />
        }

        if (!robboUnits || robboUnits.length === 0) {
            return <div><FormattedMessage id='robbo_groups.no_units_available' /></div>
        }

        return (
            <div style={{ marginBottom: 16 }}>
                <label>
                    <FormattedMessage id='robbo_groups.select_unit' />:
                </label>
                <Select
                    style={{ width: '100%', marginTop: 8 }}
                    placeholder={intl.formatMessage({ id: 'robbo_groups.select_unit_placeholder' })}
                    value={selectedRobboUnitId}
                    onChange={setSelectedRobboUnitId}
                    loading={loading}
                >
                    {robboUnits.map(unit => (
                        <Select.Option key={unit.id} value={unit.id}>
                            {unit.name}
                        </Select.Option>
                    ))}
                </Select>

                {selectedRobboUnitId && (
                    <div style={{ marginTop: 16 }}>
                        <AddRobboGroup robboUnitId={selectedRobboUnitId} />
                    </div>
                )}
            </div>
        )
    }

    return <AddRobboGroup robboUnitId={initialRobboUnitId} />
}

export default AddRobboGroupWithUnitSelect

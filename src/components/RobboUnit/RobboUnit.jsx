import React, { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import { Button, Tabs } from "antd"

import { useActions } from "@/helpers/useActions"
import RobboUnitCard from "@/components/RobboUnitCard"
import Flex from '@/components/Flex'
import { getRobboUnitState } from "@/reducers/robboUnit"
import Loader from "@/components/Loader"
import RobboUnitAccessSetting from "@/components/RobboUnitAccessSetting"


export default ({ robboUnitId }) => {

    const token = localStorage.getItem('token')
    const history = useHistory()
    const { getRobboUnitById } = useActions()
    const { robboUnit, loading } = useSelector(({ robboUnit }) => getRobboUnitState(robboUnit))

    useEffect(() => {
        getRobboUnitById(token, robboUnitId)
        return () => {
            // clear robboUnit {}
        }
    }, [])

    return (
        <Flex width='100%'>
            {
                loading ? <Loader />
                    : (
                        <Flex
                            direction='column' width='100%'
                            padding='0.5rem'
                        >
                            Robbo Unit
                            <Tabs
                                defaultActiveKey='1'
                                items={[
                                    {
                                        label: 'Карточка',
                                        key: '1',
                                        children: loading ? <Loader /> : <RobboUnitCard robboUnit={robboUnit} />,
                                    },
                                    {
                                        label: 'Группы',
                                        key: '2',
                                        children: <Button onClick={() => history.push(`/robboUnits/${robboUnit.id}/groups`)}>Группы</Button>,
                                    },
                                    {
                                        label: 'Доступ',
                                        key: '3',
                                        children: <RobboUnitAccessSetting robboUnitId={robboUnitId} />,
                                    },
                                ]}
                            />
                        </Flex>

                    )
            }
        </Flex >
    )
}
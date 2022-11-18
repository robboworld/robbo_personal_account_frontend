import React from 'react'
import { useSelector } from 'react-redux'
import { Menu } from 'antd'
import { useHistory } from 'react-router-dom'

import {
    SidebarDataSuperAdmin,
    SidebarDataStudent,
    SidebarDataParent,
    SidebarDataTeacher,
    SidebarDataUnitAdmin,
    SidebarDataFreeListener,
} from './SideBarData.jsx'

import { useActions } from '@/helpers/useActions'
import { getLoginState } from '@/reducers/login'


export default () => {
    const history = useHistory()
    const { signOutRequest } = useActions()
    const { userRole } = useSelector(({ login }) => getLoginState(login))

    let SideBarData = []
    switch (userRole) {
        case 0: {
            SideBarData = SidebarDataStudent
            break
        }
        case 1: {
            SideBarData = SidebarDataTeacher
            break
        }
        case 2: {
            SideBarData = SidebarDataParent
            break
        }
        case 3: {
            SideBarData = SidebarDataFreeListener
            break
        }
        case 4: {
            SideBarData = SidebarDataUnitAdmin
            break
        }
        case 5: {
            SideBarData = SidebarDataSuperAdmin
            break
        }
    }

    const onMenuClick = ({ item, key, keyPath, selectedKeys, domEvent }) => {
        if (item.props.pathname === '/login') {
            signOutRequest()
            history.push(item.props.pathname)
        }
        else {
            history.push(item.props.pathname)
        }

    }

    return (
        <Menu
            theme='light'
            mode='inline'
            onClick={onMenuClick}
            items={SideBarData}
        />
    )
}
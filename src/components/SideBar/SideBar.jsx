import React from 'react'
import { useSelector } from 'react-redux'
import { Menu } from 'antd'
import { useNavigate } from 'react-router-dom'

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
import { signOutRequest } from '@/actions'
import { LOGIN_PAGE_ROUTE } from '@/constants'

export default () => {
    const history = useNavigate()
    const actions = useActions({ signOutRequest }, [])
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
        if (item.props.pathname === LOGIN_PAGE_ROUTE) {
            actions.signOutRequest()
            history(item.props.pathname)
        }
        else {
            history(item.props.pathname)
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
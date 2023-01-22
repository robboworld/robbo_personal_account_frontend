import React from 'react'
import { Menu } from 'antd'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

import {
    SidebarDataSuperAdmin,
    SidebarDataStudent,
    SidebarDataParent,
    SidebarDataTeacher,
    SidebarDataUnitAdmin,
    SidebarDataFreeListener,
} from './SideBarData.jsx'

import { authMutationsGQL, graphQLClient } from '@/graphQL/index.js'
import { useActions, parseJwt } from '@/helpers'
import { signOutRequest } from '@/actions'
import { LOGIN_PAGE_ROUTE } from '@/constants'

export default ({ selectedNavBarKey = '1' }) => {
    const navigate = useNavigate()
    const actions = useActions({ signOutRequest }, [])
    const token = localStorage.getItem('token')
    const { Role } = parseJwt(token)
    let SideBarData = []
    switch (Role) {
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

    const [loginOut, loginOutMutation] = useMutation(authMutationsGQL.SING_OUT, {
        onCompleted: ({ SingIn }) => {
            graphQLClient.resetStore()
            localStorage.removeItem('token')
            navigate('/login')
        },
    })

    const onMenuClick = ({ item, key }) => {
        if (item.props.pathname === LOGIN_PAGE_ROUTE) {
            // actions.signOutRequest()
            loginOut()
        }
        else {
            navigate(item.props.pathname, { state: { selectedNavBarKey: key } })
        }

    }
    return (
        <Menu
            theme='light'
            mode='inline'
            selectedKeys={[selectedNavBarKey]}
            onClick={onMenuClick}
            items={SideBarData}
        />
    )
}
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import * as FaIcons from 'react-icons/fa'

import {
    SideBar,
    Navbar,
    MenuIconOpen,
    MenuIconClose,
    SidebarMenu,
} from './components'

import {
    SidebarDataSuperAdmin,
    SidebarDataStudent,
    SidebarDataParent,
    SidebarDataTeacher,
    SidebarDataUnitAdmin,
    SidebarDataFreeListener,

} from './SideBarData.jsx'
import MenuItem from './MenuItem'

import { useActions } from '@/helpers/useActions'
import { getUserRole } from '@/reducers/login'

export default () => {
    const [close, setClose] = useState(false)
    const showSidebar = () => setClose(!close)
    const { signOutRequest } = useActions()
    const userRole = useSelector(state => getUserRole(state.login))

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

    const signOutHandler = path => {
        if (path === '/login') {
            signOutRequest()
        }
    }

    return (
        <SideBar>
            <Navbar>
                <MenuIconOpen to='#' onClick={showSidebar}>
                    <FaIcons.FaBars />
                </MenuIconOpen>
            </Navbar>

            <SidebarMenu close={close}>
                <MenuIconClose to='#' onClick={showSidebar}>
                    <FaIcons.FaTimes />
                </MenuIconClose>

                {SideBarData.map((item, index) => {
                    return (
                        <MenuItem
                            key={index}
                            item={item}
                            index={index}
                            signOutHandler={signOutHandler} />
                    )
                })}
            </SidebarMenu>
        </SideBar>
    )
}
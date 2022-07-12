import React, { useState } from 'react'
import * as FaIcons from 'react-icons/fa'

import {
    SideBar,
    Navbar,
    MenuIconOpen,
    MenuIconClose,
    SidebarMenu,
} from './components'

import { SidebarData } from './SideBarData.jsx'
import MenuItem from './MenuItem'

import { useActions } from '@/helpers/useActions'

export default () => {
    const [close, setClose] = useState(false)
    const showSidebar = () => setClose(!close)
    const { signOutRequest } = useActions()

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

                {SidebarData.map((item, index) => {
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
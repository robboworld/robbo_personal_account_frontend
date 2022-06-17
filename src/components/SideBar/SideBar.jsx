import React, { useState } from "react"
import { useDispatch } from "react-redux"
import * as FaIcons from "react-icons/fa"

import {
    SideBar,
    Navbar,
    MenuIconOpen,
    MenuIconClose,
    SidebarMenu,
    // MenuItems,
    MenuItemLinks
} from "./components"

import { signOutRequest } from "@/actions"
import { SidebarData } from "./SideBarData"
import MenuItem from './MenuItem'

export default ({ }) => {
    const [close, setClose] = useState(false)
    const showSidebar = () => setClose(!close)
    const dispatch = useDispatch();

    const signOutHandler = (path) => {
        if (path === '/login') {
            dispatch(signOutRequest())
            return <Redirect to="/login" />
        }
    }

    return (
        <SideBar>
            <Navbar>
                <MenuIconOpen to="#" onClick={showSidebar}>
                    <FaIcons.FaBars />
                </MenuIconOpen>
            </Navbar>

            <SidebarMenu close={close}>
                <MenuIconClose to="#" onClick={showSidebar}>
                    <FaIcons.FaTimes />
                </MenuIconClose>

                {SidebarData.map((item, index) => {
                    return (
                        <MenuItem
                            key={index}
                            item={item}
                            index={index}
                            signOutHandler={signOutHandler}>
                        </MenuItem>
                    )
                })}
            </SidebarMenu>
        </SideBar>
    )
}
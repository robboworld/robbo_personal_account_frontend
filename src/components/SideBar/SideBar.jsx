import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as FaIcons from "react-icons/fa"
import { Redirect } from "react-router-dom"

import {
    SideBar,
    Navbar,
    MenuIconOpen,
    MenuIconClose,
    SidebarMenu,
    // MenuItems,
    MenuItemLinks,
} from "./components"

import { signOutRequest } from "@/actions"
import { SidebarData } from "./SideBarData"
import MenuItem from './MenuItem'
import { getIsAuth } from "@/reducers/login"

export default ({ }) => {
    const [close, setClose] = useState(false)
    const showSidebar = () => setClose(!close)
    const dispatch = useDispatch()
    const isAuth = useSelector(state => getIsAuth(state.login))
    const signOutHandler = path => {
        if (path === '/login') {
            dispatch(signOutRequest())
            console.log(isAuth)
            // return <Redirect to="/login" />
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
                            signOutHandler={signOutHandler} />
                    )
                })}
            </SidebarMenu>
        </SideBar>
    )
}
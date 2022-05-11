import React, { useState } from "react"
import * as FaIcons from "react-icons/fa"

import {
    SideBar,
    Navbar,
    MenuIconOpen,
    MenuIconClose,
    SidebarMenu,
    MenuItems,
    MenuItemLinks
} from "./components"

import { SidebarData } from "./SideBarData"

export default ({ }) => {
    const [close, setClose] = useState(false)
    const showSidebar = () => setClose(!close)
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
                        <MenuItems key={index}>
                            <MenuItemLinks to={item.path}>
                                {item.icon}
                                <span style={{ marginLeft: '16px' }}>{item.title}</span>
                            </MenuItemLinks>
                        </MenuItems>
                    )
                })}
            </SidebarMenu>
        </SideBar>
    )
}
import React from 'react'

import { MenuItems, MenuItemLinks } from './components'

export default ({ signOutHandler, index, item }) => {
    return (
        <MenuItems key={index}>
            <MenuItemLinks to={item.path} onClick={() => { signOutHandler(item.path) }}>
                {item.icon}
                <span style={{ marginLeft: '16px' }}>{item.title}</span>
            </MenuItemLinks>
        </MenuItems>
    )
}
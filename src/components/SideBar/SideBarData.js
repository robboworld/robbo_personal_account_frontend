import React from "react"
import * as FaIcons from "react-icons/fa"

export const SidebarData = [
    {
        title: 'Профиль',
        path: '/profile',
        icon: <FaIcons.FaUserAlt />
    },
    {
        title: 'Мои проекты',
        path: '/projects',
        icon: <FaIcons.FaInfo />
    },
    {
        title: 'Платежи',
        path: '/payments',
        icon: <FaIcons.FaCreditCard />
    },
    {
        title: 'Программа',
        path: '/program',
        icon: <FaIcons.FaTasks />
    },
    {
        title: 'Мои курсы',
        path: '/courses',
        icon: <FaIcons.FaBook />
    },
    {
        title: 'Информер',
        path: '/informer',
        icon: <FaIcons.FaInfo />
    },
    {
        title: 'Выйти',
        path: '/login',
        icon: <FaIcons.FaSignOutAlt />
    }
]
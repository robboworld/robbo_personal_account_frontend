import React from 'react'
import * as FaIcons from 'react-icons/fa'

import {
  LOGIN_PAGE_ROUTE,
  MY_PROJECTS_ROUTE,
  MY_COURSES_ROUTE,
} from '@/constants'

export const SidebarData = [
  {
    title: 'Профиль',
    path: '/profile',
    icon: <FaIcons.FaUserAlt />,
  },
  {
    title: 'Мои проекты',
    path: MY_PROJECTS_ROUTE,
    icon: <FaIcons.FaProjectDiagram />,
  },
  // {
  //     title: 'На MVP',
  //     path: PROJECT_MVP_PAGE_ROUTE,
  //     icon: <FaIcons.FaDev />
  // },
  {
    title: 'Платежи',
    path: '/payments',
    icon: <FaIcons.FaCreditCard />,
  },
  {
    title: 'Программа',
    path: '/program',
    icon: <FaIcons.FaTasks />,
  },
  {
    title: 'Мои курсы',
    path: MY_COURSES_ROUTE,
    icon: <FaIcons.FaBook />,
  },
  {
    title: 'Информер',
    path: '/informer',
    icon: <FaIcons.FaInfo />,
  },
  {
    title: 'Выйти',
    path: LOGIN_PAGE_ROUTE,
    icon: <FaIcons.FaSignOutAlt />,
  },
]

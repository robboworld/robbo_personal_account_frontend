import React from 'react'
import * as FaIcons from 'react-icons/fa'

import {
  LOGIN_PAGE_ROUTE,
  MY_PROJECTS_ROUTE,
  MY_COURSES_ROUTE,
  TEACHERS_PAGE_ROUTE,
  CLIENTS_ROUTE,
} from '@/constants'

export const SidebarDataStudent = [
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

export const SidebarDataParent = [
  {
    title: 'Профиль',
    path: '/profile',
    icon: <FaIcons.FaUserAlt />,
  },
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

export const SidebarDataSuperAdmin = [
  {
    title: 'Профиль',
    path: '/profile',
    icon: <FaIcons.FaUserAlt />,
  },
  {
    title: 'Аналитика',
    path: '/',
    icon: <FaIcons.FaUserAlt />,
  },
  {
    title: 'Уроки',
    path: '/',
    icon: <FaIcons.FaCreditCard />,
  },
  {
    title: 'Задачи',
    path: '/',
    icon: <FaIcons.FaTasks />,
  },
  {
    title: 'Клиенты',
    path: CLIENTS_ROUTE,
    icon: <FaIcons.FaBook />,
  },
  {
    title: 'Группы (Robbo Units)',
    path: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    title: 'Курсы',
    path: MY_COURSES_ROUTE,
    icon: <FaIcons.FaBook />,
  },
  {
    title: 'Unit Админы',
    path: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    title: 'Педагоги',
    path: TEACHERS_PAGE_ROUTE,
    icon: <FaIcons.FaInfo />,
  },
  {
    title: 'Свободные слушатели',
    path: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    title: 'Финансы',
    path: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    title: 'Лиды',
    path: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    title: 'Звонки',
    path: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    title: 'Доступ в CRM',
    path: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    title: 'Абонементы',
    path: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    title: 'Информер',
    path: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    title: 'Выйти',
    path: LOGIN_PAGE_ROUTE,
    icon: <FaIcons.FaSignOutAlt />,
  },
]

export const SidebarDataTeacher = [
  {
    title: 'Профиль',
    path: '/profile',
    icon: <FaIcons.FaUserAlt />,
  },
  {
    title: 'Обучение',
    path: '/program',
    icon: <FaIcons.FaTasks />,
  },
  {
    title: 'Родители',
    path: '/program',
    icon: <FaIcons.FaTasks />,
  },
  {
    title: 'Финансы',
    path: '/program',
    icon: <FaIcons.FaTasks />,
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

export const SidebarDataFreeListener = [
  {
    title: 'Профиль',
    path: '/profile',
    icon: <FaIcons.FaUserAlt />,
  },
  {
    title: 'Платежи',
    path: '/program',
    icon: <FaIcons.FaTasks />,
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

export const SidebarDataUnitAdmin = [
  {
    title: 'Профиль',
    path: '/profile',
    icon: <FaIcons.FaUserAlt />,
  },
  {
    title: 'Группы (Robbo Units)',
    path: '/program',
    icon: <FaIcons.FaTasks />,
  },
  {
    title: 'Курсы',
    path: MY_COURSES_ROUTE,
    icon: <FaIcons.FaBook />,
  },
  {
    title: 'Педагоги',
    path: '/program',
    icon: <FaIcons.FaTasks />,
  },
  {
    title: 'Клиенты',
    path: '/program',
    icon: <FaIcons.FaTasks />,
  },
  {
    title: 'Ученики',
    path: '/program',
    icon: <FaIcons.FaTasks />,
  },
  {
    title: 'Финансы',
    path: '/payments',
    icon: <FaIcons.FaCreditCard />,
  },
  {
    title: 'Задачи',
    path: '/informer',
    icon: <FaIcons.FaInfo />,
  },
  {
    title: 'Выйти',
    path: LOGIN_PAGE_ROUTE,
    icon: <FaIcons.FaSignOutAlt />,
  },
]
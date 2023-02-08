import React from 'react'
import { FormattedMessage } from 'react-intl'
import * as FaIcons from 'react-icons/fa'

import {
  UserOutlined,
  BookOutlined,
  CreditCardOutlined,
  RobotOutlined,
  TeamOutlined,
  LogoutOutlined,
  ProjectOutlined,
  LineChartOutlined,
} from '@ant-design/icons'

import {
  LOGIN_PAGE_ROUTE,
  MY_PROJECTS_ROUTE,
  MY_COURSES_ROUTE,
  TEACHERS_PAGE_ROUTE,
  CLIENTS_ROUTE,
  UNIT_ADMINS_ROUTE,
  ROBBO_UNITS_ROUTE,
  STUDY_PAGE_ROUTE,
  PROFILE_PAGE_ROUTE,
  ROBBO_GROUPS_ROUTE,
} from '@/constants'

export const SidebarDataStudent = [
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  {
    key: '2',
    label: <FormattedMessage id='sidebar_data.my_projects' />,
    pathname: MY_PROJECTS_ROUTE,
    icon: <ProjectOutlined />,
  },
  {
    key: '3',
    label: 'Платежи',
    pathname: '/payments',
    icon: <CreditCardOutlined />,
  },
  {
    key: '4',
    label: <FormattedMessage id='sidebar_data.programm' />,
    pathname: '/program',
    icon: <FaIcons.FaTasks />,
  },
  {
    key: '5',
    label: <FormattedMessage id='sidebar_data.my_courses' />,
    pathname: MY_COURSES_ROUTE,
    icon: <BookOutlined />,
  },
  {
    key: '6',
    label: 'Информер',
    pathname: '/informer',
    icon: <FaIcons.FaInfo />,
  },
  {
    key: '7',
    label: <FormattedMessage id='sidebar_data.logout' />,
    pathname: LOGIN_PAGE_ROUTE,
    icon: <LogoutOutlined />,
  },
]

export const SidebarDataParent = [
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  {
    key: '2',
    label: 'Платежи',
    pathname: '/payments',
    icon: <CreditCardOutlined />,
  },
  {
    key: '3',
    label: <FormattedMessage id='sidebar_data.programm' />,
    pathname: '/program',
    icon: <FaIcons.FaTasks />,
  },
  {
    key: '4',
    label: <FormattedMessage id='sidebar_data.my_courses' />,
    pathname: MY_COURSES_ROUTE,
    icon: <BookOutlined />,
  },
  {
    key: '5',
    label: 'Информер',
    pathname: '/informer',
    icon: <FaIcons.FaInfo />,
  },
  {
    key: '6',
    label: <FormattedMessage id='sidebar_data.logout' />,
    pathname: LOGIN_PAGE_ROUTE,
    icon: <LogoutOutlined />,
  },
]

export const SidebarDataSuperAdmin = [
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  {
    key: '2',
    label: 'Аналитика',
    pathname: '/',
    icon: <LineChartOutlined />,
  },
  {
    key: '3',
    label: 'Уроки',
    pathname: '/',
    icon: <CreditCardOutlined />,
  },
  {
    key: '4',
    label: 'Задачи',
    pathname: '/',
    icon: <FaIcons.FaTasks />,
  },
  {
    key: '5',
    label: <FormattedMessage id='sidebar_data.clients' />,
    pathname: CLIENTS_ROUTE,
    icon: <TeamOutlined />,
  },
  {
    key: '6',
    label: <FormattedMessage id='sidebar_data.robbo_units' />,
    pathname: ROBBO_UNITS_ROUTE,
    icon: <RobotOutlined />,
  }, {
    key: '7',
    label: <FormattedMessage id='sidebar_data.robbo_groups' />,
    pathname: ROBBO_GROUPS_ROUTE,
    icon: <RobotOutlined />,
  },
  {
    key: '8',
    label: <FormattedMessage id='sidebar_data.my_courses' />,
    pathname: MY_COURSES_ROUTE,
    icon: <BookOutlined />,
  },
  {
    key: '9',
    label: <FormattedMessage id='sidebar_data.unit_admins' />,
    pathname: UNIT_ADMINS_ROUTE,
    icon: <FaIcons.FaInfo />,
  },
  {
    key: '10',
    label: <FormattedMessage id='sidebar_data.teachers' />,
    pathname: TEACHERS_PAGE_ROUTE,
    icon: <FaIcons.FaInfo />,
  },
  {
    key: '11',
    label: 'Свободные слушатели',
    pathname: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    key: '12',
    label: 'Финансы',
    pathname: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    key: '13',
    label: 'Лиды',
    pathname: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    key: '14',
    label: 'Звонки',
    pathname: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    key: '15',
    label: 'Доступ в CRM',
    pathname: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    key: '16',
    label: 'Абонементы',
    pathname: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    key: '17',
    label: 'Информер',
    pathname: '/',
    icon: <FaIcons.FaInfo />,
  },
  {
    key: '18',
    label: <FormattedMessage id='sidebar_data.logout' />,
    pathname: LOGIN_PAGE_ROUTE,
    icon: <LogoutOutlined />,
  },
]

export const SidebarDataTeacher = [
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  {
    key: '2',
    label: <FormattedMessage id='sidebar_data.study' />,
    pathname: STUDY_PAGE_ROUTE,
    icon: <FaIcons.FaTasks />,
  },
  {
    key: '3',
    label: 'Родители',
    pathname: '/program',
    icon: <FaIcons.FaTasks />,
  },
  {
    key: '4',
    label: 'Финансы',
    pathname: '/program',
    icon: <FaIcons.FaTasks />,
  },
  {
    key: '5',
    label: 'Информер',
    pathname: '/informer',
    icon: <FaIcons.FaInfo />,
  },
  {
    key: '6',
    label: <FormattedMessage id='sidebar_data.logout' />,
    pathname: LOGIN_PAGE_ROUTE,
    icon: <LogoutOutlined />,
  },
]

export const SidebarDataFreeListener = [
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  {
    key: '2',
    label: 'Платежи',
    pathname: '/program',
    icon: <FaIcons.FaTasks />,
  },
  {
    key: '3',
    label: <FormattedMessage id='sidebar_data.programm' />,
    pathname: '/program',
    icon: <FaIcons.FaTasks />,
  },
  {
    key: '4',
    label: <FormattedMessage id='sidebar_data.my_courses' />,
    pathname: MY_COURSES_ROUTE,
    icon: <BookOutlined />,
  },
  {
    key: '5',
    label: 'Информер',
    pathname: '/informer',
    icon: <FaIcons.FaInfo />,
  },
  {
    key: '6',
    label: <FormattedMessage id='sidebar_data.logout' />,
    pathname: LOGIN_PAGE_ROUTE,
    icon: <LogoutOutlined />,
  },
]

export const SidebarDataUnitAdmin = [
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  {
    key: '2',
    label: <FormattedMessage id='sidebar_data.robbo_units' />,
    pathname: ROBBO_UNITS_ROUTE,
    icon: <RobotOutlined />,
  },
  {
    key: '3',
    label: <FormattedMessage id='sidebar_data.my_courses' />,
    pathname: MY_COURSES_ROUTE,
    icon: <BookOutlined />,
  },
  {
    key: '4',
    label: <FormattedMessage id='sidebar_data.teachers' />,
    pathname: TEACHERS_PAGE_ROUTE,
    icon: <FaIcons.FaTasks />,
  },
  {
    key: '5',
    label: <FormattedMessage id='sidebar_data.clients' />,
    pathname: '/program',
    icon: <FaIcons.FaTasks />,
  },
  {
    key: '6',
    label: <FormattedMessage id='sidebar_data.robbo_groups' />,
    pathname: ROBBO_GROUPS_ROUTE,
    icon: <RobotOutlined />,
  },
  {
    key: '7',
    label: 'Ученики',
    pathname: '/program',
    icon: <FaIcons.FaTasks />,
  },
  {
    key: '8',
    label: 'Финансы',
    pathname: '/payments',
    icon: <CreditCardOutlined />,
  },
  {
    key: '9',
    label: 'Задачи',
    pathname: '/informer',
    icon: <FaIcons.FaInfo />,
  },
  {
    key: '10',
    label: <FormattedMessage id='sidebar_data.logout' />,
    pathname: LOGIN_PAGE_ROUTE,
    icon: <LogoutOutlined />,
  },
]
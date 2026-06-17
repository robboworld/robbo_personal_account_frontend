import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  HomeOutlined,
  UserOutlined,
  ProjectOutlined,
  BookOutlined,
  CreditCardOutlined,
  TeamOutlined,
  LogoutOutlined,
  NotificationOutlined,
  SafetyCertificateOutlined,
  ReadOutlined,
  InfoCircleOutlined,
  BankOutlined,
  GroupOutlined,
} from '@ant-design/icons'

import {
  HOME_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  TEACHERS_PAGE_ROUTE,
  CLIENTS_ROUTE,
  UNIT_ADMINS_ROUTE,
  ROBBO_UNITS_ROUTE,
  PROFILE_PAGE_ROUTE,
  MY_PROJECTS_ROUTE,
  ROBBO_GROUPS_ROUTE,
  SEND_NOTIFICATION_ROUTE,
} from '@/constants'

export const SidebarDataStudent = [
  {
    key: 'home',
    label: <FormattedMessage id='sidebar_data.home' />,
    pathname: HOME_PAGE_ROUTE,
    icon: <HomeOutlined />,
  },
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
  // {
  //   key: '3',
  //   label: 'Платежи',
  //   pathname: '/payments',
  //   icon: <CreditCardOutlined />,
  // },
  // {
  //   key: '4',
  //   label: <FormattedMessage id='sidebar_data.programm' />,
  //   pathname: '/program',
  //   icon: <FaIcons.FaTasks />,
  // },
  {
    key: '5',
    label: <FormattedMessage id='sidebar_data.lms' />,
    pathname: '#lms',
    external: 'lms',
    icon: <BookOutlined />,
  },
  // {
  //   key: '6',
  //   label: 'Информер',
  //   pathname: '/informer',
  //   icon: <FaIcons.FaInfo />,
  // },
  {
    key: '7',
    label: <FormattedMessage id='sidebar_data.logout' />,
    pathname: LOGIN_PAGE_ROUTE,
    icon: <LogoutOutlined />,
  },
]

export const SidebarDataParent = [
  {
    key: 'home',
    label: <FormattedMessage id='sidebar_data.home' />,
    pathname: HOME_PAGE_ROUTE,
    icon: <HomeOutlined />,
  },
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  // {
  //   key: '2',
  //   label: 'Платежи',
  //   pathname: '/payments',
  //   icon: <CreditCardOutlined />,
  // },
  // {
  //   key: '3',
  //   label: <FormattedMessage id='sidebar_data.programm' />,
  //   pathname: '/program',
  //   icon: <FaIcons.FaTasks />,
  // },
  {
    key: '4',
    label: <FormattedMessage id='sidebar_data.lms' />,
    pathname: '#lms',
    external: 'lms',
    icon: <BookOutlined />,
  },
  // {
  //   key: '5',
  //   label: 'Информер',
  //   pathname: '/informer',
  //   icon: <FaIcons.FaInfo />,
  // },
  {
    key: '6',
    label: <FormattedMessage id='sidebar_data.logout' />,
    pathname: LOGIN_PAGE_ROUTE,
    icon: <LogoutOutlined />,
  },
]

export const SidebarDataSuperAdmin = [
  {
    key: 'home',
    label: <FormattedMessage id='sidebar_data.home' />,
    pathname: HOME_PAGE_ROUTE,
    icon: <HomeOutlined />,
  },
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  // {
  //   key: '2',
  //   label: 'Аналитика',
  //   pathname: '/',
  //   icon: <LineChartOutlined />,
  // },
  // {
  //   key: '3',
  //   label: 'Уроки',
  //   pathname: '/',
  //   icon: <CreditCardOutlined />,
  // },
  // {
  //   key: '4',
  //   label: 'Задачи',
  //   pathname: '/',
  //   icon: <FaIcons.FaTasks />,
  // },
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
    icon: <BankOutlined />,
  }, {
    key: '7',
    label: <FormattedMessage id='sidebar_data.robbo_groups' />,
    pathname: ROBBO_GROUPS_ROUTE,
    icon: <GroupOutlined />,
  },
  {
    key: '8',
    label: <FormattedMessage id='sidebar_data.lms' />,
    pathname: '#lms',
    external: 'lms',
    icon: <BookOutlined />,
  },
  {
    key: '9',
    label: <FormattedMessage id='sidebar_data.unit_admins' />,
    pathname: UNIT_ADMINS_ROUTE,
    icon: <SafetyCertificateOutlined />,
  },
  {
    key: '10',
    label: <FormattedMessage id='sidebar_data.teachers' />,
    pathname: TEACHERS_PAGE_ROUTE,
    icon: <TeamOutlined />,
  },
  {
    key: 'send_notification',
    label: <FormattedMessage id='sidebar_data.send_notification' />,
    pathname: SEND_NOTIFICATION_ROUTE,
    icon: <NotificationOutlined />,
  },
  // {
  //   key: '11',
  //   label: 'Свободные слушатели',
  //   pathname: '/',
  //   icon: <FaIcons.FaInfo />,
  // },
  // {
  //   key: '12',
  //   label: 'Финансы',
  //   pathname: '/',
  //   icon: <FaIcons.FaInfo />,
  // },
  // {
  //   key: '13',
  //   label: 'Лиды',
  //   pathname: '/',
  //   icon: <FaIcons.FaInfo />,
  // },
  // {
  //   key: '14',
  //   label: 'Звонки',
  //   pathname: '/',
  //   icon: <FaIcons.FaInfo />,
  // },
  // {
  //   key: '15',
  //   label: 'Доступ в CRM',
  //   pathname: '/',
  //   icon: <FaIcons.FaInfo />,
  // },
  // {
  //   key: '16',
  //   label: 'Абонементы',
  //   pathname: '/',
  //   icon: <FaIcons.FaInfo />,
  // },
  // {
  //   key: '17',
  //   label: 'Информер',
  //   pathname: '/',
  //   icon: <FaIcons.FaInfo />,
  // },
  {
    key: '18',
    label: <FormattedMessage id='sidebar_data.logout' />,
    pathname: LOGIN_PAGE_ROUTE,
    icon: <LogoutOutlined />,
  },
]

export const SidebarDataTeacher = [
  {
    key: 'home',
    label: <FormattedMessage id='sidebar_data.home' />,
    pathname: HOME_PAGE_ROUTE,
    icon: <HomeOutlined />,
  },
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  {
    key: '2',
    label: <FormattedMessage id='sidebar_data.lms' />,
    pathname: '#lms',
    external: 'lms',
    icon: <BookOutlined />,
  },
  // {
  //   key: '3',
  //   label: 'Родители',
  //   pathname: '/program',
  //   icon: <FaIcons.FaTasks />,
  // },
  // {
  //   key: '4',
  //   label: 'Финансы',
  //   pathname: '/program',
  //   icon: <FaIcons.FaTasks />,
  // },
  // {
  //   key: '5',
  //   label: 'Информер',
  //   pathname: '/informer',
  //   icon: <FaIcons.FaInfo />,
  // },
  {
    key: '6',
    label: <FormattedMessage id='sidebar_data.logout' />,
    pathname: LOGIN_PAGE_ROUTE,
    icon: <LogoutOutlined />,
  },
]

export const SidebarDataFreeListener = [
  {
    key: 'home',
    label: <FormattedMessage id='sidebar_data.home' />,
    pathname: HOME_PAGE_ROUTE,
    icon: <HomeOutlined />,
  },
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  {
    key: '2',
    label: <FormattedMessage id='sidebar_data.payments' />,
    pathname: '/program',
    icon: <CreditCardOutlined />,
  },
  {
    key: '3',
    label: <FormattedMessage id='sidebar_data.programm' />,
    pathname: '/program',
    icon: <ReadOutlined />,
  },
  {
    key: '4',
    label: <FormattedMessage id='sidebar_data.lms' />,
    pathname: '#lms',
    external: 'lms',
    icon: <BookOutlined />,
  },
  {
    key: '5',
    label: <FormattedMessage id='sidebar_data.informer' />,
    pathname: '/informer',
    icon: <InfoCircleOutlined />,
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
    key: 'home',
    label: <FormattedMessage id='sidebar_data.home' />,
    pathname: HOME_PAGE_ROUTE,
    icon: <HomeOutlined />,
  },
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
    icon: <BankOutlined />,
  },
  {
    key: '3',
    label: <FormattedMessage id='sidebar_data.lms' />,
    pathname: '#lms',
    external: 'lms',
    icon: <BookOutlined />,
  },
  {
    key: '4',
    label: <FormattedMessage id='sidebar_data.teachers' />,
    pathname: TEACHERS_PAGE_ROUTE,
    icon: <TeamOutlined />,
  },
  // {
  //   key: '5',
  //   label: <FormattedMessage id='sidebar_data.clients' />,
  //   pathname: '/program',
  //   icon: <FaIcons.FaTasks />,
  // },
  {
    key: '6',
    label: <FormattedMessage id='sidebar_data.robbo_groups' />,
    pathname: ROBBO_GROUPS_ROUTE,
    icon: <GroupOutlined />,
  },
  {
    key: 'send_notification',
    label: <FormattedMessage id='sidebar_data.send_notification' />,
    pathname: SEND_NOTIFICATION_ROUTE,
    icon: <NotificationOutlined />,
  },
  // {
  //   key: '7',
  //   label: 'Ученики',
  //   pathname: '/program',
  //   icon: <FaIcons.FaTasks />,
  // },
  // {
  //   key: '8',
  //   label: 'Финансы',
  //   pathname: '/payments',
  //   icon: <CreditCardOutlined />,
  // },
  // {
  //   key: '9',
  //   label: 'Задачи',
  //   pathname: '/informer',
  //   icon: <FaIcons.FaInfo />,
  // },
  {
    key: '10',
    label: <FormattedMessage id='sidebar_data.logout' />,
    pathname: LOGIN_PAGE_ROUTE,
    icon: <LogoutOutlined />,
  },
]
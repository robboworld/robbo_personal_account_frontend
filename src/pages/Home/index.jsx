import React, { useMemo } from 'react'
import { Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRightOutlined,
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  BankOutlined,
  GroupOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons'

import PageLayout from '@/components/PageLayout'
import {
  ActionCta,
  ActionDescription,
  ActionGrid,
  ActionIcon,
  ActionTile,
  ActionTitle,
  Eyebrow,
  HeroInner,
  HeroLead,
  HeroPanel,
  HeroTitle,
  PageContent,
  Panel,
  SectionHeader,
  SectionHint,
  SectionTitle,
  StepIndex,
  StepItem,
  StepsList,
  StepText,
  Stagger,
  staggerContainer,
  staggerItem,
} from '@/components/AccountShell'
import { parseJwt, openLms, getSelectedNavBarKeyFromPath } from '@/helpers'
import {
  PROFILE_PAGE_ROUTE,
  TEACHERS_PAGE_ROUTE,
  ROBBO_UNITS_ROUTE,
  ROBBO_GROUPS_ROUTE,
  UNIT_ADMINS_ROUTE,
  CLIENTS_ROUTE,
  userRole,
  UNIT_ADMIN,
  SUPER_ADMIN,
} from '@/constants'

const ACTION_ICONS = {
  profile: UserOutlined,
  lms: BookOutlined,
  teachers: TeamOutlined,
  units: BankOutlined,
  groups: GroupOutlined,
  unitAdmins: SafetyCertificateOutlined,
  clients: CustomerServiceOutlined,
}

const Home = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const parsedToken = useMemo(() => {
    if (!token) {
      return null
    }

    try {
      return parseJwt(token)
    } catch (error) {
      return null
    }
  }, [token])

  const role = parsedToken?.Role
  const roleTitle = userRole[role] || 'пользователь'
  const firstName = parsedToken?.FirstName || parsedToken?.Firstname || parsedToken?.Name || ''

  const quickActions = [
    {
      key: 'profile',
      title: 'Профиль',
      description: 'Проверьте и обновите персональные данные.',
      path: PROFILE_PAGE_ROUTE,
      iconKey: 'profile',
      featured: true,
      accent: 'rose',
    },
    {
      key: 'lms',
      title: 'LMS',
      description: 'Перейдите в LMS без повторного логина.',
      external: 'lms',
      iconKey: 'lms',
      wide: true,
      accent: 'green',
    },
    {
      key: 'teachers',
      title: 'Преподаватели',
      description: 'Управляйте списком преподавателей.',
      path: TEACHERS_PAGE_ROUTE,
      roles: [UNIT_ADMIN, SUPER_ADMIN],
      iconKey: 'teachers',
    },
    {
      key: 'units',
      title: 'Юниты',
      description: 'Перейдите к списку Robbo Unit и их настройкам.',
      path: ROBBO_UNITS_ROUTE,
      roles: [UNIT_ADMIN, SUPER_ADMIN],
      iconKey: 'units',
    },
    {
      key: 'groups',
      title: 'Группы',
      description: 'Работа со студенческими группами юнитов.',
      path: ROBBO_GROUPS_ROUTE,
      roles: [UNIT_ADMIN, SUPER_ADMIN],
      iconKey: 'groups',
    },
    {
      key: 'unitAdmins',
      title: 'Админы юнитов',
      description: 'Назначайте и редактируйте администраторов юнитов.',
      path: UNIT_ADMINS_ROUTE,
      roles: [SUPER_ADMIN],
      iconKey: 'unitAdmins',
    },
    {
      key: 'clients',
      title: 'Клиенты',
      description: 'Управляйте клиентами системы.',
      path: CLIENTS_ROUTE,
      roles: [SUPER_ADMIN],
      iconKey: 'clients',
    },
  ].filter(({ roles }) => !roles || roles.includes(role))

  const handleAction = action => {
    if (action.external === 'lms') {
      openLms()
      return
    }

    navigate(action.path, {
      state: {
        selectedNavBarKey: getSelectedNavBarKeyFromPath(role, action.path) ?? '1',
      },
    })
  }

  const nextSteps = [
    'Проверьте профиль и актуальность контактных данных.',
    'Откройте LMS или проекты и продолжите работу с места остановки.',
    'Для административных ролей доступны разделы управления пользователями и юнитами.',
  ]

  return (
    <PageLayout>
      <PageContent>
        <Stagger variants={staggerContainer} initial='hidden'
animate='show'>
          <HeroPanel variants={staggerItem}>
            <HeroInner>
              <Eyebrow>Личный кабинет</Eyebrow>
              <HeroTitle>
                {`Добро пожаловать${firstName ? `, ${firstName}` : ''}`}
              </HeroTitle>
              <HeroLead>
                {`Роль в системе: ${roleTitle}. Здесь собраны основные действия для быстрого старта после входа.`}
              </HeroLead>
            </HeroInner>
          </HeroPanel>

          <motion.div variants={staggerItem}>
            <Panel>
              <SectionHeader>
                <SectionTitle>Быстрые действия</SectionTitle>
                <SectionHint>Выберите раздел — переход в один клик</SectionHint>
              </SectionHeader>

              {quickActions.length ? (
                <ActionGrid>
                  {quickActions.map(action => {
                    const Icon = ACTION_ICONS[action.iconKey] || ArrowRightOutlined
                    return (
                      <ActionTile
                        key={action.key}
                        $featured={action.featured}
                        $wide={action.wide}
                        onClick={() => handleAction(action)}
                        whileTap={{ scale: 0.99 }}
                      >
                        <ActionIcon $accent={action.accent}>
                          <Icon />
                        </ActionIcon>
                        <ActionTitle>{action.title}</ActionTitle>
                        <ActionDescription>{action.description}</ActionDescription>
                        <ActionCta>
                          Перейти
                          <ArrowRightOutlined style={{ fontSize: 12 }} />
                        </ActionCta>
                      </ActionTile>
                    )
                  })}
                </ActionGrid>
              ) : (
                <Empty description='Для вашей роли пока нет быстрых действий' />
              )}
            </Panel>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Panel>
              <SectionHeader>
                <SectionTitle>Что делать дальше</SectionTitle>
                <SectionHint>Короткий маршрут после входа</SectionHint>
              </SectionHeader>
              <StepsList>
                {nextSteps.map((text, index) => (
                  <StepItem key={text}>
                    <StepIndex>{index + 1}</StepIndex>
                    <StepText>{text}</StepText>
                  </StepItem>
                ))}
              </StepsList>
            </Panel>
          </motion.div>
        </Stagger>
      </PageContent>
    </PageLayout>
  )
}

export default Home

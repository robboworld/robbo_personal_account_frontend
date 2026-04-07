import React, { useMemo } from 'react'
import { Button, Card, Col, Empty, Row, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import PageLayout from '@/components/PageLayout'
import { parseJwt } from '@/helpers'
import {
  CLIENTS_ROUTE,
  MY_COURSES_ROUTE,
  MY_PROJECTS_ROUTE,
  PROFILE_PAGE_ROUTE,
  ROBBO_GROUPS_ROUTE,
  ROBBO_UNITS_ROUTE,
  STUDY_PAGE_ROUTE,
  TEACHERS_PAGE_ROUTE,
  UNIT_ADMINS_ROUTE,
  userRole,
  UNIT_ADMIN,
  SUPER_ADMIN,
  TEACHER,
  STUDENT,
  PARENT,
} from '@/constants'

const { Title, Paragraph, Text } = Typography

const getSelectedNavBarKey = (role, path) => {
  const keyByRoleAndPath = {
    [STUDENT]: {
      [PROFILE_PAGE_ROUTE]: '1',
      [MY_PROJECTS_ROUTE]: '2',
      [MY_COURSES_ROUTE]: '5',
    },
    [PARENT]: {
      [PROFILE_PAGE_ROUTE]: '1',
      [MY_COURSES_ROUTE]: '4',
    },
    [TEACHER]: {
      [PROFILE_PAGE_ROUTE]: '1',
      [STUDY_PAGE_ROUTE]: '2',
    },
    [UNIT_ADMIN]: {
      [PROFILE_PAGE_ROUTE]: '1',
      [ROBBO_UNITS_ROUTE]: '2',
      [MY_COURSES_ROUTE]: '3',
      [TEACHERS_PAGE_ROUTE]: '4',
      [ROBBO_GROUPS_ROUTE]: '6',
    },
    [SUPER_ADMIN]: {
      [PROFILE_PAGE_ROUTE]: '1',
      [CLIENTS_ROUTE]: '5',
      [ROBBO_UNITS_ROUTE]: '6',
      [ROBBO_GROUPS_ROUTE]: '7',
      [MY_COURSES_ROUTE]: '8',
      [UNIT_ADMINS_ROUTE]: '9',
      [TEACHERS_PAGE_ROUTE]: '10',
    },
  }

  return keyByRoleAndPath[role]?.[path] || '1'
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
    { title: 'Профиль', description: 'Проверьте и обновите персональные данные.', path: PROFILE_PAGE_ROUTE },
    { title: 'Мои курсы', description: 'Продолжите обучение и следите за прогрессом.', path: MY_COURSES_ROUTE },
    { title: 'Мои проекты', description: 'Откройте проекты и продолжите работу.', path: MY_PROJECTS_ROUTE },
    { title: 'Занятия', description: 'Перейдите к расписанию и текущим задачам.', path: STUDY_PAGE_ROUTE, roles: [TEACHER] },
    { title: 'Преподаватели', description: 'Управляйте списком преподавателей.', path: TEACHERS_PAGE_ROUTE, roles: [UNIT_ADMIN, SUPER_ADMIN] },
    { title: 'Юниты', description: 'Перейдите к списку Robbo Unit и их настройкам.', path: ROBBO_UNITS_ROUTE, roles: [UNIT_ADMIN, SUPER_ADMIN] },
    { title: 'Группы', description: 'Работа со студенческими группами юнитов.', path: ROBBO_GROUPS_ROUTE, roles: [UNIT_ADMIN, SUPER_ADMIN] },
    { title: 'Админы юнитов', description: 'Назначайте и редактируйте администраторов юнитов.', path: UNIT_ADMINS_ROUTE, roles: [SUPER_ADMIN] },
    { title: 'Клиенты', description: 'Управляйте клиентами системы.', path: CLIENTS_ROUTE, roles: [SUPER_ADMIN] },
  ].filter(({ roles }) => !roles || roles.includes(role))

  return (
    <PageLayout>
      <Space direction='vertical' size={24}
style={{ width: '100%', padding: '24px 8px' }}>
        <Card>
          <Title level={2} style={{ marginBottom: 8 }}>
            {`Добро пожаловать${firstName ? `, ${firstName}` : ''}!`}
          </Title>
          <Paragraph style={{ marginBottom: 0 }}>
            {`Роль в системе: ${roleTitle}. Здесь собраны основные действия для быстрого старта после входа.`}
          </Paragraph>
        </Card>

        <Card title='Быстрые действия'>
          {quickActions.length ? (
            <Row gutter={[16, 16]}>
              {quickActions.map(action => (
                <Col xs={24} md={12}
xl={8} key={action.path}>
                  <Card size='small' title={action.title}>
                    <Paragraph>{action.description}</Paragraph>
                    <Button
                      type='primary'
                      onClick={() => navigate(action.path, { state: { selectedNavBarKey: getSelectedNavBarKey(role, action.path) } })}
                    >
                      Перейти
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description='Для вашей роли пока нет быстрых действий' />
          )}
        </Card>

        <Card title='Что делать дальше'>
          <Space direction='vertical' size={4}>
            <Text>1. Проверьте профиль и актуальность контактных данных.</Text>
            <Text>2. Откройте курсы или проекты и продолжите работу с места остановки.</Text>
            <Text>3. Для административных ролей доступны разделы управления пользователями и юнитами.</Text>
          </Space>
        </Card>
      </Space>
    </PageLayout>
  )
}

export default Home

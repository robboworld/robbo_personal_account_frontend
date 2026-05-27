import React, { useMemo } from 'react'
import { Button, Card, Col, Empty, Row, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import PageLayout from '@/components/PageLayout'
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
  TEACHER,
  PARENT,
  FREE_LISTENER,
} from '@/constants'

const { Title, Paragraph, Text } = Typography

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
    { title: 'LMS', description: 'Перейдите в LMS без повторного логина.', external: 'lms' },
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
xl={8} key={action.path || action.external}>
                  <Card size='small' title={action.title}>
                    <Paragraph>{action.description}</Paragraph>
                    <Button
                      type='primary'
                      onClick={() => {
                        if (action.external === 'lms') {
                          openLms()
                          return
                        }

                        navigate(action.path, {
                          state: {
                            selectedNavBarKey: getSelectedNavBarKeyFromPath(role, action.path) ?? '1',
                          },
                        })
                      }}
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
            <Text>2. Откройте LMS или проекты и продолжите работу с места остановки.</Text>
            <Text>3. Для административных ролей доступны разделы управления пользователями и юнитами.</Text>
          </Space>
        </Card>
      </Space>
    </PageLayout>
  )
}

export default Home

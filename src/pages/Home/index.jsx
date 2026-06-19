import React, { useMemo } from 'react'
import { Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { motion } from 'framer-motion'
import {
  ArrowRightOutlined,
  ProjectOutlined,
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  BankOutlined,
  GroupOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons'

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
  MY_PROJECTS_ROUTE,
  PUBLIC_PROJECTS_ROUTE,
  TEACHERS_PAGE_ROUTE,
  ROBBO_UNITS_ROUTE,
  ROBBO_GROUPS_ROUTE,
  UNIT_ADMINS_ROUTE,
  CLIENTS_ROUTE,
  USER_ROLE_MESSAGE_IDS,
  UNIT_ADMIN,
  SUPER_ADMIN,
  STUDENT,
} from '@/constants'

const ACTION_ICONS = {
  profile: UserOutlined,
  lms: BookOutlined,
  projects: ProjectOutlined,
  publicProjects: GlobalOutlined,
  teachers: TeamOutlined,
  units: BankOutlined,
  groups: GroupOutlined,
  unitAdmins: SafetyCertificateOutlined,
  clients: CustomerServiceOutlined,
}

const QUICK_ACTION_DEFS = [
  {
    key: 'profile',
    titleId: 'home.action.profile.title',
    descriptionId: 'home.action.profile.description',
    path: PROFILE_PAGE_ROUTE,
    iconKey: 'profile',
    featured: true,
    accent: 'rose',
    gridSpan: 4,
  },
  {
    key: 'projects',
    titleId: 'home.action.projects.title',
    descriptionId: 'home.action.projects.description',
    path: MY_PROJECTS_ROUTE,
    roles: [STUDENT],
    iconKey: 'projects',
    accent: 'green',
    gridSpan: 4,
  },
  {
    key: 'publicProjects',
    titleId: 'home.action.public_projects.title',
    descriptionId: 'home.action.public_projects.description',
    path: PUBLIC_PROJECTS_ROUTE,
    iconKey: 'publicProjects',
    accent: 'green',
    gridSpan: 4,
  },
  {
    key: 'lms',
    titleId: 'home.action.lms.title',
    descriptionId: 'home.action.lms.description',
    external: 'lms',
    iconKey: 'lms',
    wide: true,
    accent: 'green',
    gridSpan: 4,
  },
  {
    key: 'teachers',
    titleId: 'home.action.teachers.title',
    descriptionId: 'home.action.teachers.description',
    path: TEACHERS_PAGE_ROUTE,
    roles: [UNIT_ADMIN, SUPER_ADMIN],
    iconKey: 'teachers',
  },
  {
    key: 'units',
    titleId: 'home.action.units.title',
    descriptionId: 'home.action.units.description',
    path: ROBBO_UNITS_ROUTE,
    roles: [UNIT_ADMIN, SUPER_ADMIN],
    iconKey: 'units',
  },
  {
    key: 'groups',
    titleId: 'home.action.groups.title',
    descriptionId: 'home.action.groups.description',
    path: ROBBO_GROUPS_ROUTE,
    roles: [UNIT_ADMIN, SUPER_ADMIN],
    iconKey: 'groups',
  },
  {
    key: 'unitAdmins',
    titleId: 'home.action.unit_admins.title',
    descriptionId: 'home.action.unit_admins.description',
    path: UNIT_ADMINS_ROUTE,
    roles: [SUPER_ADMIN],
    iconKey: 'unitAdmins',
  },
  {
    key: 'clients',
    titleId: 'home.action.clients.title',
    descriptionId: 'home.action.clients.description',
    path: CLIENTS_ROUTE,
    roles: [SUPER_ADMIN],
    iconKey: 'clients',
  },
]

const NEXT_STEP_IDS = ['home.next_step_1', 'home.next_step_2', 'home.next_step_3']

const Home = () => {
  const navigate = useNavigate()
  const intl = useIntl()
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
  const roleTitle = intl.formatMessage({
    id: USER_ROLE_MESSAGE_IDS[role] || 'user_role.fallback',
  })
  const firstName = parsedToken?.FirstName || parsedToken?.Firstname || parsedToken?.Name || ''

  const quickActions = QUICK_ACTION_DEFS.filter(
    ({ roles }) => !roles || roles.includes(role),
  )

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

  return (
      <PageContent>
        <Stagger variants={staggerContainer} initial='hidden'
animate='show'>
          <HeroPanel variants={staggerItem}>
            <HeroInner>
              <Eyebrow>
                <FormattedMessage id='home.eyebrow' />
              </Eyebrow>
              <HeroTitle>
                {firstName
                  ? intl.formatMessage(
                    { id: 'home.welcome_with_name' },
                    { firstName },
                  )
                  : intl.formatMessage({ id: 'home.welcome' })}
              </HeroTitle>
              <HeroLead>
                {intl.formatMessage(
                  { id: 'home.role_line' },
                  { role: roleTitle },
                )}
              </HeroLead>
            </HeroInner>
          </HeroPanel>

          <motion.div variants={staggerItem}>
            <Panel>
              <SectionHeader>
                <SectionTitle>
                  <FormattedMessage id='home.quick_actions' />
                </SectionTitle>
                <SectionHint>
                  <FormattedMessage id='home.quick_actions_hint' />
                </SectionHint>
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
                        $gridSpan={action.gridSpan}
                        onClick={() => handleAction(action)}
                        whileTap={{ scale: 0.99 }}
                      >
                        <ActionIcon $accent={action.accent}>
                          <Icon />
                        </ActionIcon>
                        <ActionTitle>
                          <FormattedMessage id={action.titleId} />
                        </ActionTitle>
                        <ActionDescription>
                          <FormattedMessage id={action.descriptionId} />
                        </ActionDescription>
                        <ActionCta>
                          <FormattedMessage id='home.go_to' />
                          <ArrowRightOutlined style={{ fontSize: 12 }} />
                        </ActionCta>
                      </ActionTile>
                    )
                  })}
                </ActionGrid>
              ) : (
                <Empty description={intl.formatMessage({ id: 'home.no_actions' })} />
              )}
            </Panel>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Panel>
              <SectionHeader>
                <SectionTitle>
                  <FormattedMessage id='home.next_steps' />
                </SectionTitle>
                <SectionHint>
                  <FormattedMessage id='home.next_steps_hint' />
                </SectionHint>
              </SectionHeader>
              <StepsList>
                {NEXT_STEP_IDS.map((stepId, index) => (
                  <StepItem key={stepId}>
                    <StepIndex>{index + 1}</StepIndex>
                    <StepText>
                      <FormattedMessage id={stepId} />
                    </StepText>
                  </StepItem>
                ))}
              </StepsList>
            </Panel>
          </motion.div>
        </Stagger>
      </PageContent>
  )
}

export default Home

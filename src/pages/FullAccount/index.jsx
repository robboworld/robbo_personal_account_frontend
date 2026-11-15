import React from 'react'
import { Alert } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'
import { motion } from 'framer-motion'
import { Navigate } from 'react-router-dom'
import styled from 'styled-components'
import { LockOutlined, UnlockOutlined } from '@ant-design/icons'

import {
  HeroInner,
  HeroLead,
  HeroPanel,
  HeroTitle,
  PageContent,
  Panel,
  SectionHeader,
  SectionTitle,
  Stagger,
  StepIndex,
  StepItem,
  StepsList,
  StepText,
  staggerContainer,
  staggerItem,
  surface,
} from '@/components/AccountShell'
import { FULL_ACCOUNT_UNLOCKS, KidBadge } from '@/components/FullAccount'
import QrCode from '@/components/QrCode'
import { HOME_PAGE_ROUTE, REGISTER_PAGE_ROUTE } from '@/constants'
import { useIsKidAccount } from '@/helpers/kidAccount'
import theme from '@/theme'

// What a full account adds, for a child of the class sign-in and their parents
// (architecture/ADR_CLASS_KID_LOGIN.md). A kid account cannot become a full one yet: the parent
// registers a new account on their email, and the class account keeps working at lessons.

const { colors } = theme

const UnlockGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12.5rem, 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
`

const UnlockTile = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1rem 1rem 1.1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid ${surface.line};
`

const UnlockIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.8rem;
  font-size: 1.35rem;
  color: ${colors.accentGreen};
  background: rgba(0, 175, 65, 0.1);
`

const UnlockLock = styled.span`
  position: absolute;
  top: 0.85rem;
  right: 0.9rem;
  color: #b07800;
`

const UnlockTitle = styled.span`
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${colors.secondary};
`

const UnlockText = styled.span`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${surface.muted};
`

const ParentsIntro = styled.p`
  margin: 0 0 1.25rem;
  max-width: 42rem;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${surface.muted};
`

const ParentsLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1.5rem 2rem;
`

const ParentsCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1 1 20rem;
  min-width: 0;
`

const QrFigure = styled.figure`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  padding: 0.75rem;
  border-radius: 1rem;
  background: #fff;
  border: 1px solid ${surface.line};
`

const QrCaption = styled.figcaption`
  max-width: 11rem;
  font-size: 0.8125rem;
  text-align: center;
  color: ${surface.muted};
  overflow-wrap: anywhere;
`

const Address = styled.strong`
  white-space: nowrap;
  color: ${colors.secondary};
`

const PARENT_STEP_IDS = [
  'full_account.parents_step_1',
  'full_account.parents_step_2',
  'full_account.parents_step_3',
]

const registerLink = () => {
  const { origin, host } = window.location
  return { url: `${origin}${REGISTER_PAGE_ROUTE}`, address: `${host}${REGISTER_PAGE_ROUTE}` }
}

const FullAccountPage = () => {
  const intl = useIntl()
  const isKid = useIsKidAccount()

  // A full account already has everything this page talks about.
  if (!isKid) {
    return <Navigate to={HOME_PAGE_ROUTE} replace />
  }

  const { url, address } = registerLink()

  return (
    <PageContent>
      <Stagger variants={staggerContainer} initial='hidden' animate='show'>
        <HeroPanel variants={staggerItem}>
          <HeroInner>
            <KidBadge>
              <LockOutlined />
              <FormattedMessage id='full_account.badge' />
            </KidBadge>
            <HeroTitle>
              <FormattedMessage id='full_account.title' />
            </HeroTitle>
            <HeroLead>
              <FormattedMessage id='full_account.lead' />
            </HeroLead>
          </HeroInner>
        </HeroPanel>

        <motion.div variants={staggerItem}>
          <Panel>
            <SectionHeader>
              <SectionTitle>
                <FormattedMessage id='full_account.unlocks_title' />
              </SectionTitle>
            </SectionHeader>
            <UnlockGrid>
              {FULL_ACCOUNT_UNLOCKS.map(({ key, Icon }) => (
                <UnlockTile key={key}>
                  <UnlockLock aria-hidden>
                    <UnlockOutlined />
                  </UnlockLock>
                  <UnlockIcon aria-hidden>
                    <Icon />
                  </UnlockIcon>
                  <UnlockTitle>
                    <FormattedMessage id={`full_account.unlock.${key}.title`} />
                  </UnlockTitle>
                  <UnlockText>
                    <FormattedMessage id={`full_account.unlock.${key}.text`} />
                  </UnlockText>
                </UnlockTile>
              ))}
            </UnlockGrid>
          </Panel>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Panel data-testid='full-account-parents'>
            <SectionHeader>
              <SectionTitle>
                <FormattedMessage id='full_account.parents_title' />
              </SectionTitle>
            </SectionHeader>
            <ParentsIntro>
              <FormattedMessage id='full_account.parents_intro' />
            </ParentsIntro>
            <ParentsLayout>
              <ParentsCopy>
                <StepsList>
                  {PARENT_STEP_IDS.map((stepId, index) => (
                    <StepItem key={stepId}>
                      <StepIndex>{index + 1}</StepIndex>
                      <StepText>
                        <FormattedMessage
                          id={stepId}
                          values={{ address: <Address>{address}</Address> }}
                        />
                      </StepText>
                    </StepItem>
                  ))}
                </StepsList>
                <Alert
                  type='info'
                  showIcon
                  title={intl.formatMessage({ id: 'full_account.parents_projects' })}
                />
              </ParentsCopy>
              <QrFigure>
                <QrCode
                  text={url}
                  size={176}
                  title={intl.formatMessage({ id: 'full_account.qr_label' })}
                />
                <QrCaption>{address}</QrCaption>
              </QrFigure>
            </ParentsLayout>
          </Panel>
        </motion.div>
      </Stagger>
    </PageContent>
  )
}

export default FullAccountPage

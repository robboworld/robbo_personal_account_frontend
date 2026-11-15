import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styled, { css } from 'styled-components'
import {
  ArrowRightOutlined,
  BookOutlined,
  HomeOutlined,
  KeyOutlined,
  LockOutlined,
  TeamOutlined,
  UnlockOutlined,
} from '@ant-design/icons'

import { Panel, staggerItem, surface } from '@/components/AccountShell'
import { FULL_ACCOUNT_ROUTE } from '@/constants'
import theme from '@/theme'

// A child of the class sign-in (architecture/ADR_CLASS_KID_LOGIN.md) sees what a full account
// adds and that a parent makes it. Few words and icons: many of them cannot read yet.

const { colors } = theme

/** What a full account opens: the locked sections of a kid account, and signing in from home. */
export const FULL_ACCOUNT_UNLOCKS = [
  { key: 'courses', Icon: BookOutlined },
  { key: 'classes', Icon: TeamOutlined },
  { key: 'tariffs', Icon: KeyOutlined },
  { key: 'home', Icon: HomeOutlined },
]

export const KidBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  align-self: flex-start;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #8a5a00;
  background: #fff4d6;
  border: 1px solid #f5d98a;
`

const BannerPanel = styled(Panel)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.25rem;
  background: linear-gradient(135deg, #fff8e6 0%, #fff 60%);
  border-color: #f5d98a;
`

const BannerIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  font-size: 1.75rem;
  color: #b07800;
  background: #ffe9a8;
  flex-shrink: 0;
`

const BannerCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1 1 16rem;
  min-width: 0;
`

const BannerTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.secondary};
`

const BannerText = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: ${surface.muted};
`

const UnlockChips = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.35rem 0 0;
  padding: 0;
  list-style: none;
`

const UnlockChip = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  color: ${colors.secondary};
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid ${surface.line};

  .anticon {
    color: #b07800;
  }
`

/** Home and profile of a kid account: what is closed and who opens it. */
export const FullAccountBanner = () => {
  const navigate = useNavigate()
  return (
    <motion.div variants={staggerItem}>
      <BannerPanel data-testid='full-account-banner'>
        <BannerIcon aria-hidden>
          <LockOutlined />
        </BannerIcon>
        <BannerCopy>
          <BannerTitle>
            <FormattedMessage id='full_account.banner_title' />
          </BannerTitle>
          <BannerText>
            <FormattedMessage id='full_account.banner_text' />
          </BannerText>
          <UnlockChips>
            {FULL_ACCOUNT_UNLOCKS.slice(0, 3).map(({ key, Icon }) => (
              <UnlockChip key={key}>
                <LockOutlined />
                <Icon />
                <FormattedMessage id={`full_account.unlock.${key}.title`} />
              </UnlockChip>
            ))}
          </UnlockChips>
        </BannerCopy>
        <Button
          type='primary'
          size='large'
          icon={<UnlockOutlined />}
          onClick={() => navigate(FULL_ACCOUNT_ROUTE)}>
          <FormattedMessage id='full_account.banner_cta' />
        </Button>
      </BannerPanel>
    </motion.div>
  )
}

const LockedLine = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.5rem;
  margin: 0 0 1.5rem;
  font-size: 0.9375rem;
  color: ${surface.muted};

  .anticon {
    color: #b07800;
  }
`

/** One closed feature in a page of a kid account, with the way to open it. */
export const FullAccountLockedLine = ({ messageId }) => {
  const navigate = useNavigate()
  return (
    <LockedLine data-testid='full-account-locked'>
      <LockOutlined />
      <FormattedMessage id={messageId} />
      <Button type='link' size='small' onClick={() => navigate(FULL_ACCOUNT_ROUTE)}>
        <FormattedMessage id='full_account.banner_cta' />
        <ArrowRightOutlined />
      </Button>
    </LockedLine>
  )
}

FullAccountLockedLine.propTypes = {
  messageId: PropTypes.string.isRequired,
}

const SidebarCtaButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.6rem 0.7rem;
  border-radius: 0.85rem;
  border: 1px solid #f5d98a;
  background: linear-gradient(135deg, #fff4d6 0%, #fffaf0 100%);
  color: ${colors.secondary};
  text-align: left;
  cursor: pointer;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    box-shadow: 0 8px 20px -12px rgba(176, 120, 0, 0.55);
  }

  &:focus-visible {
    outline: 2px solid ${colors.accentGreen};
    outline-offset: 2px;
  }

  ${({ $collapsed }) =>
    $collapsed &&
    css`
      justify-content: center;
      padding: 0.55rem 0;
    `}
`

const SidebarCtaIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.6rem;
  font-size: 1rem;
  color: #b07800;
  background: #ffe9a8;
  flex-shrink: 0;
`

const SidebarCtaCopy = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.25;
`

const SidebarCtaTitle = styled.span`
  font-size: 0.75rem;
  color: ${surface.muted};
`

const SidebarCtaAction = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: #8a5a00;
`

/** Above the user in the sidebar of a kid account: every page shows the way to a full one. */
export const FullAccountSidebarCta = ({ collapsed = false, onClick }) => {
  const intl = useIntl()
  const label = intl.formatMessage({ id: 'full_account.sidebar_cta' })
  return (
    <SidebarCtaButton
      type='button'
      $collapsed={collapsed}
      onClick={onClick}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      data-testid='full-account-sidebar-cta'>
      <SidebarCtaIcon aria-hidden>
        <UnlockOutlined />
      </SidebarCtaIcon>
      {!collapsed && (
        <SidebarCtaCopy>
          <SidebarCtaTitle>
            <FormattedMessage id='full_account.badge' />
          </SidebarCtaTitle>
          <SidebarCtaAction>{label}</SidebarCtaAction>
        </SidebarCtaCopy>
      )}
    </SidebarCtaButton>
  )
}

FullAccountSidebarCta.propTypes = {
  collapsed: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

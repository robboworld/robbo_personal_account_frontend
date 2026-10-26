import React, { useEffect, useState } from 'react'
import { Button, Space } from 'antd'
import { FormattedMessage } from 'react-intl'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import { Panel, SectionHeader, SectionHint, SectionTitle, staggerItem } from '@/components/AccountShell'
import { getFeatureInterest } from '@/api/licensing'
import { MY_LICENSES_ROUTE } from '@/constants'
import { dismissInterestInvite, isInterestInviteDismissed } from '@/helpers/featureInterest'

// Invitation to the paid-edition survey: shown until the account answers or the user
// closes it with "Not now" (remembered in this browser).
const InterestInvite = () => {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isInterestInviteDismissed()) return undefined
    let cancelled = false
    getFeatureInterest()
      .then(answer => {
        if (!cancelled && !answer) setVisible(true)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (!visible) return null

  const onLater = () => {
    dismissInterestInvite()
    setVisible(false)
  }

  return (
    <motion.div variants={staggerItem} initial='hidden' animate='show'>
      <Panel>
        <SectionHeader>
          <SectionTitle>
            <FormattedMessage id='interest.invite_title' />
          </SectionTitle>
          <SectionHint>
            <FormattedMessage id='interest.invite_text' />
          </SectionHint>
        </SectionHeader>
        <Space wrap>
          <Button
            type='primary'
            size='large'
            onClick={() => navigate(`${MY_LICENSES_ROUTE}?from=home#interest`)}>
            <FormattedMessage id='interest.invite_answer' />
          </Button>
          <Button size='large' onClick={onLater}>
            <FormattedMessage id='interest.invite_later' />
          </Button>
        </Space>
      </Panel>
    </motion.div>
  )
}

export default InterestInvite

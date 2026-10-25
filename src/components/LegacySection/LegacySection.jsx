import React from 'react'
import { Button, Result } from 'antd'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import Loader from '@/components/Loader'
import { HOME_PAGE_ROUTE } from '@/constants'
import { useLegacyAdminState } from '@/helpers/legacyAdminSection'

/** Pages that need the legacy Postgres: with it off, say so instead of firing failing requests. */
const LegacySection = ({ children }) => {
  const intl = useIntl()
  const navigate = useNavigate()
  const enabled = useLegacyAdminState()

  if (enabled === null) {
    return <Loader />
  }
  if (enabled) {
    return children
  }
  return (
    <Result
      status='info'
      title={intl.formatMessage({ id: 'legacy_section.title' })}
      subTitle={intl.formatMessage({ id: 'legacy_section.subtitle' })}
      extra={
        <Button type='primary' onClick={() => navigate(HOME_PAGE_ROUTE)}>
          {intl.formatMessage({ id: 'legacy_section.home' })}
        </Button>
      }
    />
  )
}

export default LegacySection

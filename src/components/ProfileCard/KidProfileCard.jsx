import React from 'react'
import { PropTypes } from 'prop-types'
import { Alert, Empty, Form } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import { formatProfileDateTime } from './ProfileCard'

import { FormGrid, FormSection, FormSectionLegend } from '@/components/AccountShell'

// A teacher-made kid account holds no data about the child beyond the name the teacher typed
// (architecture/ADR_CLASS_KID_LOGIN.md): no field here takes input, and the API refuses a change
// from a kid session (auth.IsKidAccountSession).
const KidProfileCard = ({ profile }) => {
  const intl = useIntl()

  if (!profile) {
    return <Empty description={<FormattedMessage id='profile.loading' />} />
  }

  return (
    <div data-testid='kid-profile'>
      <Form layout='vertical' component='div' requiredMark={false}>
        <FormSection>
          <FormSectionLegend>
            <FormattedMessage id='profile.section.account' />
          </FormSectionLegend>
          <FormGrid>
            <Form.Item label={<FormattedMessage id='profile_card.full_name' />}>
              <span className='profile-static-value'>{profile.fullName || '–'}</span>
            </Form.Item>
            <Form.Item label={<FormattedMessage id='profile_card.created_at' />}>
              <span className='profile-static-value'>
                {formatProfileDateTime(profile.createdAt, intl.locale)}
              </span>
            </Form.Item>
          </FormGrid>
        </FormSection>
      </Form>
      <Alert
        type='info'
        showIcon
        title={intl.formatMessage({ id: 'full_account.profile_locked' })}
      />
    </div>
  )
}

KidProfileCard.propTypes = {
  profile: PropTypes.shape({
    fullName: PropTypes.string,
    createdAt: PropTypes.string,
  }),
}

export default KidProfileCard

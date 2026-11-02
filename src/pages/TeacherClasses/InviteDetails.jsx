import React from 'react'
import { Button, Typography, message } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from 'react-intl'

const { Paragraph, Text, Title } = Typography

/** Copies with a confirmation; when the clipboard is refused, shows the text to copy by hand. */
export async function copyText(text, intl) {
  try {
    await navigator.clipboard.writeText(text)
    message.success(intl.formatMessage({ id: 'teacher_class.copied' }))
  } catch {
    message.info(intl.formatMessage({ id: 'teacher_class.copy_manually' }, { text }))
  }
}

/**
 * Join link on the domain the page is open on, so it follows a domain change; the backend's
 * joinUrl (built from frontend.publicUrl) is only a fallback.
 */
export function joinLink(klass) {
  if (klass.inviteSlug && typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/join/${encodeURIComponent(klass.inviteSlug)}`
  }
  return klass.joinUrl || ''
}

/** Invite code and link of a class. */
const InviteDetails = ({ klass }) => {
  const intl = useIntl()
  const link = joinLink(klass)
  return (
    <React.Fragment>
      <div>
        <Text type='secondary'>
          <FormattedMessage id='teacher_class.code' />
        </Text>
        <Title level={2} style={{ margin: '8px 0', letterSpacing: 4 }}>
          {klass.inviteCode}
        </Title>
        <Button icon={<CopyOutlined />} onClick={() => copyText(klass.inviteCode, intl)}>
          <FormattedMessage id='teacher_class.copy_code' />
        </Button>
      </div>
      {link ? (
        <div>
          <Text type='secondary'>
            <FormattedMessage id='teacher_class.link' />
          </Text>
          <Paragraph
            copyable={{ text: link }}
            style={{ marginBottom: 8, wordBreak: 'break-all' }}>
            {link}
          </Paragraph>
        </div>
      ) : null}
    </React.Fragment>
  )
}

export default InviteDetails

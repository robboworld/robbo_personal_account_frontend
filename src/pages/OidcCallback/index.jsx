import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Space, Typography } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import PageLayoutLogin from '@/components/PageLayoutLogin'
import { HOME_PAGE_ROUTE, LMS_URL } from '@/constants'
import {
  buildOidcStartUrl,
  clearPkceFromSession,
  exchangeCodeForTokens,
  fetchUserInfo,
  readPkceFromSession,
  reportSsoError,
  reportSsoSuccess,
  saveLmsIdentityLink,
  validateIdTokenClaims,
} from '@/helpers'

const { Paragraph, Text, Title } = Typography

const OIDC_REASON_IDS = {
  access_denied: 'oidc_callback.reason.access_denied',
  invalid_state: 'oidc_callback.reason.invalid_state',
  invalid_nonce: 'oidc_callback.reason.invalid_nonce',
  expired_code: 'oidc_callback.reason.expired_code',
  network_error: 'oidc_callback.reason.network_error',
  invalid_issuer: 'oidc_callback.reason.invalid_issuer',
  invalid_audience: 'oidc_callback.reason.invalid_audience',
  token_expired: 'oidc_callback.reason.token_expired',
  missing_sub: 'oidc_callback.reason.missing_sub',
}

const buildLoginAgainUrl = () =>
  buildOidcStartUrl(HOME_PAGE_ROUTE, 'login')

const OidcCallback = () => {
  const intl = useIntl()
  const [status, setStatus] = useState('loading')
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')

  const search = useMemo(() => new URLSearchParams(window.location.search), [])
  const authCode = search.get('code')
  const state = search.get('state')
  const authError = search.get('error')
  const authErrorDescription = search.get('error_description') || ''

  const reasonMessage = useMemo(() => {
    const reasonId = OIDC_REASON_IDS[reason] || 'oidc_callback.reason.fallback'
    return intl.formatMessage({ id: reasonId })
  }, [intl, reason])

  useEffect(() => {
    const run = async () => {
      if (authError) {
        setStatus('error')
        setReason(authError)
        setDetails(authErrorDescription)
        reportSsoError({ reason: authError, details: authErrorDescription })
        return
      }

      if (!authCode || !state) {
        setStatus('error')
        setReason('network_error')
        setDetails(intl.formatMessage({ id: 'oidc_callback.missing_code_state' }))
        reportSsoError({ reason: 'network_error', details: 'missing_code_or_state' })
        return
      }

      const { state: expectedState, nonce: expectedNonce, codeVerifier } = readPkceFromSession()
      if (!expectedState || state !== expectedState) {
        setStatus('error')
        setReason('invalid_state')
        reportSsoError({ reason: 'invalid_state' })
        clearPkceFromSession()
        return
      }

      try {
        const tokenSet = await exchangeCodeForTokens({ code: authCode, codeVerifier })
        const claimValidation = validateIdTokenClaims({ idToken: tokenSet.id_token, expectedNonce })

        if (!claimValidation.valid) {
          const [firstReason] = claimValidation.reasons
          setStatus('error')
          setReason(firstReason)
          setDetails(claimValidation.reasons.join(', '))
          reportSsoError({ reason: firstReason, details: claimValidation.reasons.join(', ') })
          clearPkceFromSession()
          return
        }

        const userInfo = await fetchUserInfo(tokenSet.access_token)
        const profile = claimValidation.payload
        const linkedUser = saveLmsIdentityLink({
          sub: profile.sub,
          email: userInfo?.email || profile.email || '',
          name: userInfo?.name || profile.name || '',
        })
        reportSsoSuccess({ sub: linkedUser.external_sub })
        clearPkceFromSession()
        setStatus('success')

        window.location.replace(HOME_PAGE_ROUTE)
      } catch (error) {
        const message = String(error?.message || '')
        const normalizedReason = message.includes('token_exchange_failed:400') ? 'expired_code' : 'network_error'
        setStatus('error')
        setReason(normalizedReason)
        setDetails(message)
        reportSsoError({ reason: normalizedReason, details: message })
        clearPkceFromSession()
      }
    }

    run()
  }, [authCode, authError, authErrorDescription, intl, state])

  if (status === 'loading') {
    return (
      <PageLayoutLogin title='SSO'>
        <Card>
          <Title level={4}>
            <FormattedMessage id='oidc_callback.loading_title' />
          </Title>
          <Paragraph>
            <FormattedMessage id='oidc_callback.loading_body' />
          </Paragraph>
        </Card>
      </PageLayoutLogin>
    )
  }

  return (
    <PageLayoutLogin title='SSO'>
      <Card>
        <Space direction='vertical' size={12}>
          <Alert
            message={<FormattedMessage id='oidc_callback.error_title' />}
            description={reasonMessage}
            type='error'
            showIcon
          />
          {!!details && <Text type='secondary'>{details}</Text>}
          <Space wrap>
            <Button type='primary' href={buildLoginAgainUrl()}>
              <FormattedMessage id='oidc_callback.retry_login' />
            </Button>
            <Button href={LMS_URL}>
              <FormattedMessage id='oidc_callback.open_lms' />
            </Button>
            <Button href={HOME_PAGE_ROUTE}>
              <FormattedMessage id='oidc_callback.back_home' />
            </Button>
          </Space>
        </Space>
      </Card>
    </PageLayoutLogin>
  )
}

export default OidcCallback

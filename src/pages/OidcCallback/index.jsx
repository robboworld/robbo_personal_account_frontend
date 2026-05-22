import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Space, Typography } from 'antd'

import PageLayoutLogin from '@/components/PageLayoutLogin'
import { HOME_PAGE_ROUTE, LMS_URL } from '@/constants'
import config from '@/config'
import {
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

const toReasonMessage = reason => {
  const reasonMap = {
    access_denied: 'Провайдер отклонил авторизацию.',
    invalid_state: 'Не совпадает state. Попробуйте вход заново.',
    invalid_nonce: 'Не совпадает nonce. Повторите вход.',
    expired_code: 'Код авторизации истек.',
    network_error: 'Не удалось завершить обмен токена.',
    invalid_issuer: 'Issuer не совпадает с ожидаемым.',
    invalid_audience: 'Audience токена не совпадает с client_id.',
    token_expired: 'Срок действия id_token истек.',
    missing_sub: 'В id_token отсутствует обязательный claim sub.',
  }

  return reasonMap[reason] || 'Ошибка OAuth/OIDC авторизации.'
}

const backendBase = () => {
  const url = config.backendURL && config.backendURL[0]
  return url ? url.replace(/\/$/, '') : 'http://localhost:8080'
}

const buildLoginAgainUrl = () => {
  const startUrl = new URL(`${backendBase()}/auth/oidc/start`)
  startUrl.searchParams.set('prompt', 'login')
  startUrl.searchParams.set('return_to', HOME_PAGE_ROUTE)
  return startUrl.toString()
}

const OidcCallback = () => {
  const [status, setStatus] = useState('loading')
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')

  const search = useMemo(() => new URLSearchParams(window.location.search), [])
  const authCode = search.get('code')
  const state = search.get('state')
  const authError = search.get('error')
  const authErrorDescription = search.get('error_description') || ''

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
        setDetails('Callback не содержит code/state.')
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
  }, [authCode, authError, authErrorDescription, state])

  if (status === 'loading') {
    return (
      <PageLayoutLogin title='SSO'>
        <Card>
          <Title level={4}>Завершаем вход через LMS...</Title>
          <Paragraph>Пожалуйста, подождите. Проверяем токен и создаем сессию.</Paragraph>
        </Card>
      </PageLayoutLogin>
    )
  }

  return (
    <PageLayoutLogin title='SSO'>
      <Card>
        <Space direction='vertical' size={12}>
          <Alert message='Не удалось завершить SSO' description={toReasonMessage(reason)}
type='error' showIcon />
          {!!details && <Text type='secondary'>{details}</Text>}
          <Space wrap>
            <Button type='primary' href={buildLoginAgainUrl()}>
              Войти снова
            </Button>
            <Button href={LMS_URL}>Открыть LMS</Button>
            <Button href={HOME_PAGE_ROUTE}>Вернуться в ЛК</Button>
          </Space>
        </Space>
      </Card>
    </PageLayoutLogin>
  )
}

export default OidcCallback

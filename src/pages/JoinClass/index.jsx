import React, { useEffect, useState } from 'react'
import { Button, Card, Input, Result, Space, Typography, message, Spin } from 'antd'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import * as api from '@/api/teacherClass'
import { LOGIN_PAGE_ROUTE, REGISTER_PAGE_ROUTE, STUDENT_CLASSES_ROUTE, HOME_PAGE_ROUTE } from '@/constants'
import { parseJwt } from '@/helpers'

const { Title, Paragraph, Text } = Typography

const JoinClassPage = () => {
  const { slug } = useParams()
  const [search] = useSearchParams()
  const codeFromQuery = search.get('code') || ''
  const navigate = useNavigate()
  const [preview, setPreview] = useState(null)
  const [manualCode, setManualCode] = useState(codeFromQuery)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState(null)

  const token = localStorage.getItem('token')
  const claims = token ? parseJwt(token) : null
  const isLoggedIn = !!(claims?.Id || claims?.id || claims?.sub)

  const key = slug || manualCode || codeFromQuery

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!key) {
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const { data } = slug
          ? await api.previewJoinBySlug(slug)
          : await api.previewJoin(key)
        if (!cancelled) setPreview(data)
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.error || 'Class not found')
          setPreview(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [slug, key])

  const doJoin = async () => {
    if (!isLoggedIn) {
      const join = slug || manualCode || codeFromQuery
      navigate(`${REGISTER_PAGE_ROUTE}?join=${encodeURIComponent(join)}`)
      return
    }
    setJoining(true)
    try {
      await api.joinClass(slug ? { slug } : { code: manualCode || codeFromQuery })
      message.success('Welcome to the class!')
      navigate(STUDENT_CLASSES_ROUTE)
    } catch (e) {
      message.error(e?.response?.data?.error || 'Join failed')
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <Spin size='large' />
      </div>
    )
  }

  if (!slug && !preview) {
    return (
      <div style={{ maxWidth: 480, margin: '10vh auto', padding: 24 }}>
        <Card>
          <Title level={3}>
            <FormattedMessage id='join_class.enter_code' defaultMessage='Enter class code' />
          </Title>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              size='large'
              value={manualCode}
              onChange={e => setManualCode(e.target.value.toUpperCase())}
              placeholder='7K2M-9Q'
            />
            <Button
              size='large'
              type='primary'
              onClick={() => navigate(`/join?code=${encodeURIComponent(manualCode.trim())}`)}
            >
              Continue
            </Button>
          </Space.Compact>
          <Paragraph style={{ marginTop: 16 }}>
            <Link to={HOME_PAGE_ROUTE}>Home</Link>
          </Paragraph>
        </Card>
      </div>
    )
  }

  if (error || !preview) {
    return (
      <Result
        status='404'
        title={<FormattedMessage id='join_class.not_found' defaultMessage='Invite not found' />}
        subTitle={error}
        extra={<Button type='primary' onClick={() => navigate('/join')}>Try another code</Button>}
      />
    )
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      background: 'linear-gradient(160deg, #f7f4ef 0%, #e8f0f4 55%, #f0ebe3 100%)',
    }}
    >
      <Card style={{ width: '100%', maxWidth: 440, borderRadius: 16 }} styles={{ body: { padding: 32 } }}>
        <Text type='secondary'>
          <FormattedMessage id='join_class.eyebrow' defaultMessage='Join class' />
        </Text>
        <Title level={2} style={{ marginTop: 8 }}>{preview.displayName}</Title>
        {preview.ownerName && (
          <Paragraph type='secondary'>
            <FormattedMessage id='join_class.teacher' defaultMessage='Teacher' />: {preview.ownerName}
          </Paragraph>
        )}
        <Paragraph type='secondary' style={{ fontSize: 12 }}>{preview.edxCourseId}</Paragraph>
        <Space direction='vertical' style={{ width: '100%', marginTop: 24 }}
size='middle'>
          <Button type='primary' size='large'
block loading={joining}
onClick={doJoin}>
            {isLoggedIn
              ? <FormattedMessage id='join_class.join' defaultMessage='Join class' />
              : <FormattedMessage id='join_class.register_join' defaultMessage='Sign up and join' />}
          </Button>
          {!isLoggedIn && (
            <Button size='large' block
onClick={() => {
              const join = slug || manualCode || codeFromQuery
              navigate(`${LOGIN_PAGE_ROUTE}?join=${encodeURIComponent(join)}`)
            }}
            >
              <FormattedMessage id='join_class.login_join' defaultMessage='Log in and join' />
            </Button>
          )}
        </Space>
      </Card>
    </div>
  )
}

export default JoinClassPage

import React, { useCallback, useEffect, useState } from 'react'
import { Button, Result, Spin, Typography } from 'antd'
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'

import * as api from '@/api/kidLogin'
import { KID_PICTURE_COUNT, KidAvatar, KidPicture, kidPictureKey } from '@/components/KidPictures'
import { LOGIN_PAGE_ROUTE, STUDENT_CLASSES_ROUTE } from '@/constants'
import { clearKidSession, rememberKidSession } from '@/helpers/kidSession'

const { Title, Text } = Typography

// Class sign-in for young students (architecture/ADR_CLASS_KID_LOGIN.md): tap yourself, then
// your five pictures in order (a picture may repeat). Few words and big targets: many of them cannot read yet.

const CLOSED_POLL_MS = 15000
// models.KidSecretLength on the server.
const SECRET_LENGTH = 5

const page = {
  minHeight: '100vh',
  padding: '24px 16px 48px',
  background: '#f5f9ff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

const tile = selected => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  padding: 10,
  minHeight: 120,
  borderRadius: 16,
  border: `3px solid ${selected ? '#1677ff' : '#e0e7f1'}`,
  background: '#fff',
  cursor: 'pointer',
  font: 'inherit',
})

/** After sign-in: the child's classes, with a full load so the session is read afresh. */
export const finishKidSignIn = data => {
  rememberKidSession({
    userId: data.userId,
    name: data.name,
    avatar: data.avatar,
    classPage: data.classPage,
  })
  window.location.assign(STUDENT_CLASSES_ROUTE)
}

const errorCode = e => e?.response?.data?.error || ''

const TeacherLink = () => (
  <Button
    type='link'
    style={{ marginTop: 32 }}
    onClick={() => {
      clearKidSession()
      window.location.assign(LOGIN_PAGE_ROUTE)
    }}>
    <FormattedMessage id='class_login.usual_login' />
  </Button>
)

const PicturePad = ({ kid, slug, onBack }) => {
  const intl = useIntl()
  const [picked, setPicked] = useState([])
  const [state, setState] = useState('idle') // idle | sending | wrong | locked | closed | busy
  const [sending, setSending] = useState(false)

  const submit = useCallback(
    async pictures => {
      setSending(true)
      try {
        const { data } = await api.loginWithPictures(slug, kid.userId, pictures)
        finishKidSignIn(data)
      } catch (e) {
        const code = errorCode(e)
        if (code === 'kid_locked') setState('locked')
        else if (code === 'kid_login_closed') setState('closed')
        else if (e?.response?.status === 429) setState('busy')
        else setState('wrong')
        setPicked([])
        setSending(false)
      }
    },
    [slug, kid.userId],
  )

  const pick = index => {
    if (sending || state === 'locked' || state === 'closed') return
    const next = [...picked, index]
    setState('idle')
    setPicked(next)
    if (next.length === SECRET_LENGTH) submit(next)
  }

  if (state === 'locked' || state === 'closed') {
    return (
      <Result
        status='warning'
        icon={<KidAvatar index={kid.avatar} size={96} />}
        title={intl.formatMessage({ id: `class_login.${state}` })}
        extra={
          <Button size='large' icon={<ArrowLeftOutlined />} onClick={onBack}>
            <FormattedMessage id='class_login.back' />
          </Button>
        }
      />
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: 520, textAlign: 'center' }}>
      <Button
        size='large'
        icon={<ArrowLeftOutlined />}
        onClick={onBack}
        aria-label={intl.formatMessage({ id: 'class_login.back' })}
        style={{ float: 'left' }}
      />
      <KidAvatar index={kid.avatar} size={88} />
      <Title level={3} style={{ marginTop: 4 }}>
        {kid.name}
      </Title>
      <Text style={{ fontSize: 20 }}>
        <FormattedMessage id='class_login.tap_pictures' />
      </Text>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
          margin: '16px 0',
        }}
        aria-live='polite'>
        {Array.from({ length: SECRET_LENGTH }, (_, i) => (
          <div
            key={i}
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              border: '3px dashed #9ab',
              display: 'grid',
              placeItems: 'center',
              background: '#fff',
            }}>
            {picked[i] !== undefined ? <KidPicture index={picked[i]} size={38} /> : null}
          </div>
        ))}
        <Button
          size='large'
          icon={<DeleteOutlined />}
          disabled={!picked.length || sending}
          onClick={() => setPicked(picked.slice(0, -1))}
          aria-label={intl.formatMessage({ id: 'class_login.undo' })}
        />
      </div>

      {state === 'wrong' ? (
        <Text type='danger' style={{ fontSize: 20, display: 'block', marginBottom: 12 }}>
          <FormattedMessage id='class_login.wrong' />
        </Text>
      ) : null}
      {state === 'busy' ? (
        <Text type='warning' style={{ fontSize: 18, display: 'block', marginBottom: 12 }}>
          <FormattedMessage id='class_login.busy' />
        </Text>
      ) : null}

      <Spin spinning={sending}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {Array.from({ length: KID_PICTURE_COUNT }, (_, i) => (
            <button
              key={i}
              type='button'
              style={tile(false)}
              onClick={() => pick(i)}
              aria-label={intl.formatMessage({ id: `kid_picture.${kidPictureKey(i)}` })}>
              <KidPicture index={i} size={72} />
            </button>
          ))}
        </div>
      </Spin>
    </div>
  )
}

const ClassLoginPage = () => {
  const { slug } = useParams()
  const intl = useIntl()
  const [data, setData] = useState(null)
  const [missing, setMissing] = useState(false)
  const [kid, setKid] = useState(null)

  const load = useCallback(async () => {
    try {
      const res = await api.getClassLoginPage(slug)
      setData(res.data)
      setMissing(false)
    } catch (e) {
      if (e?.response?.status === 404) setMissing(true)
    }
  }, [slug])

  useEffect(() => {
    load()
  }, [load])

  // While the lesson is closed the page waits for the teacher by itself.
  useEffect(() => {
    if (!data || data.open || kid) return undefined
    const timer = window.setInterval(load, CLOSED_POLL_MS)
    return () => window.clearInterval(timer)
  }, [data, kid, load])

  useEffect(() => {
    document.title = data?.className || intl.formatMessage({ id: 'class_login.title' })
  }, [data, intl])

  if (missing) {
    return (
      <div style={page}>
        <Result status='404' title={intl.formatMessage({ id: 'class_login.not_found' })} />
        <TeacherLink />
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ ...page, justifyContent: 'center' }}>
        <Spin size='large' />
      </div>
    )
  }

  return (
    <div style={page}>
      <Title level={2} style={{ textAlign: 'center' }}>
        {data.className}
      </Title>

      {kid ? (
        <PicturePad
          kid={kid}
          slug={slug}
          onBack={() => {
            setKid(null)
            load()
          }}
        />
      ) : null}

      {!kid && !data.open ? (
        <Result status='info' title={intl.formatMessage({ id: 'class_login.wait_teacher' })} />
      ) : null}

      {!kid && data.open ? (
        <React.Fragment>
          <Text style={{ fontSize: 22, marginBottom: 16 }}>
            <FormattedMessage id='class_login.find_yourself' />
          </Text>
          <div
            style={{
              width: '100%',
              maxWidth: 960,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 12,
            }}>
            {data.kids.map(k => (
              <button key={k.userId} type='button' style={tile(false)} onClick={() => setKid(k)}>
                <KidAvatar index={k.avatar} size={72} />
                <span style={{ fontSize: 18, fontWeight: 600, wordBreak: 'break-word' }}>
                  {k.name}
                </span>
              </button>
            ))}
          </div>
          {data.kids.length === 0 ? (
            <Text type='secondary' style={{ fontSize: 18 }}>
              <FormattedMessage id='class_login.no_kids' />
            </Text>
          ) : null}
        </React.Fragment>
      ) : null}

      <TeacherLink />
    </div>
  )
}

export default ClassLoginPage

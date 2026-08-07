import React, { useEffect, useState } from 'react'
import { PropTypes } from 'prop-types'
import { Alert, Button, Skeleton, message } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import {
  MetaChip,
  ProfileFormCard,
  ProfileHero,
  ProfileHeroCopy,
  ProfileMeta,
  ProfileShell,
  ProfileSubtitle,
  ProfileTitle,
  staggerContainer,
  staggerItem,
} from '@/components/AccountShell'
import UserAvatar from '@/components/UserAvatar/UserAvatar'
import LoginStreakBadge from '@/components/LoginStreakBadge/LoginStreakBadge'
import UserBanPanel from '@/components/UserBanPanel'
import { setLoginStreak } from '@/actions/auth'
import { authAPI } from '@/api'
import { getLoginStreak } from '@/reducers/login'

const SubtitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
`

const ProfilePageBody = ({
  profile,
  loading,
  error,
  accessUpdate,
  peekUserId,
  peekUserRole,
  streak,
  onIncrementStreak,
  incrementBusy,
  children,
}) => (
  <React.Fragment>
    <ProfileHero variants={staggerItem}>
      <UserAvatar
        avatarId={profile?.avatarId}
        displayName={profile?.fullName || profile?.nickname || profile?.email || ''}
        variant='hero'
      />
      <ProfileHeroCopy>
        <ProfileTitle>
          <FormattedMessage id='profile.title' />
        </ProfileTitle>
        <SubtitleRow>
          <ProfileSubtitle>
            {profile?.fullName || profile?.nickname || profile?.email || (
              <FormattedMessage id='profile.loading' />
            )}
          </ProfileSubtitle>
          {profile ? (
            <LoginStreakBadge
              current={streak?.current}
              longest={streak?.longest}
            />
          ) : null}
          {profile && !accessUpdate && !peekUserId && onIncrementStreak ? (
            <Button
              size='small'
              type='dashed'
              loading={incrementBusy}
              onClick={onIncrementStreak}
            >
              <FormattedMessage id='streak.increment_test' />
            </Button>
          ) : null}
        </SubtitleRow>
        {profile && accessUpdate && (
          <ProfileMeta>
            <MetaChip>
              <FormattedMessage id='profile.read_only' />
            </MetaChip>
          </ProfileMeta>
        )}
      </ProfileHeroCopy>
    </ProfileHero>

    {error && (
      <motion.div variants={staggerItem} style={{ marginBottom: 16 }}>
        <Alert
          type='error'
          showIcon
          message={error.message || String(error)}
        />
      </motion.div>
    )}

    <ProfileFormCard variants={staggerItem}>
      <Skeleton active loading={loading}
paragraph={{ rows: 8 }}>
        {children}
        {peekUserId ? (
          <UserBanPanel lmsUserId={peekUserId} peekUserRole={peekUserRole} />
        ) : null}
      </Skeleton>
    </ProfileFormCard>
  </React.Fragment>
)

const ProfilePageShell = ({
  profile,
  loading,
  error,
  accessUpdate,
  peekUserId,
  peekUserRole,
  embedded = false,
  children,
}) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const ownStreak = useSelector(({ login }) => getLoginStreak(login))
  const [peekStreak, setPeekStreak] = useState({ current: 0, longest: 0 })
  const [incrementBusy, setIncrementBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (peekUserId) {
      authAPI.getLoginStreak(peekUserId)
        .then(res => {
          if (cancelled) {
            return
          }
          const data = res?.data || {}
          setPeekStreak({
            current: Number(data.current) || 0,
            longest: Number(data.longest) || 0,
          })
        })
        .catch(() => {
          if (!cancelled) {
            setPeekStreak({ current: 0, longest: 0 })
          }
        })
      return () => {
        cancelled = true
      }
    }
    authAPI.getLoginStreak()
      .then(res => {
        if (cancelled) {
          return
        }
        const data = res?.data || {}
        dispatch(setLoginStreak({
          current: Number(data.current) || 0,
          longest: Number(data.longest) || 0,
        }))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [peekUserId, dispatch])

  const streak = peekUserId ? peekStreak : ownStreak

  const onIncrementStreak = async () => {
    setIncrementBusy(true)
    try {
      const res = await authAPI.incrementLoginStreak()
      const data = res?.data || {}
      dispatch(setLoginStreak({
        current: Number(data.current) || 0,
        longest: Number(data.longest) || 0,
      }))
    } catch (e) {
      message.error(e?.message || intl.formatMessage({ id: 'streak.increment_error' }))
    } finally {
      setIncrementBusy(false)
    }
  }

  const body = (
    <motion.div variants={staggerContainer} initial='hidden'
animate='show'>
      <ProfilePageBody
        profile={profile}
        loading={loading}
        error={error}
        accessUpdate={accessUpdate}
        peekUserId={peekUserId}
        peekUserRole={peekUserRole}
        streak={streak}
        onIncrementStreak={onIncrementStreak}
        incrementBusy={incrementBusy}
      >
        {children}
      </ProfilePageBody>
    </motion.div>
  )

  if (embedded) {
    return body
  }

  return <ProfileShell>{body}</ProfileShell>
}

ProfilePageShell.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    nickname: PropTypes.string,
    fullName: PropTypes.string,
    avatarId: PropTypes.string,
  }),
  loading: PropTypes.bool,
  error: PropTypes.object,
  accessUpdate: PropTypes.bool,
  peekUserId: PropTypes.string,
  peekUserRole: PropTypes.number,
  embedded: PropTypes.bool,
  children: PropTypes.node,
}

export default ProfilePageShell

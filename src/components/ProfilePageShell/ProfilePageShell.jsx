import React from 'react'
import { PropTypes } from 'prop-types'
import { Alert, Skeleton } from 'antd'
import { FormattedMessage } from 'react-intl'
import { motion } from 'framer-motion'

import {
  AvatarMark,
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

const getInitials = (profile, fallback = '?') => {
  const source = (profile?.fullName || profile?.nickname || profile?.email || '').trim()
  if (!source) {
    return fallback
  }
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

const ProfilePageBody = ({
  profile,
  loading,
  error,
  accessUpdate,
  children,
}) => (
  <React.Fragment>
    <ProfileHero variants={staggerItem}>
      <AvatarMark aria-hidden>{getInitials(profile)}</AvatarMark>
      <ProfileHeroCopy>
        <ProfileTitle>
          <FormattedMessage id='profile.title' />
        </ProfileTitle>
        <ProfileSubtitle>
          {profile?.fullName || profile?.nickname || profile?.email || (
            <FormattedMessage id='profile.loading' />
          )}
        </ProfileSubtitle>
        {profile && (
          <ProfileMeta>
            {profile.nickname && <MetaChip>@{profile.nickname}</MetaChip>}
            {profile.email && <MetaChip>{profile.email}</MetaChip>}
            {accessUpdate && (
              <MetaChip>
                <FormattedMessage id='profile.read_only' />
              </MetaChip>
            )}
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
      </Skeleton>
    </ProfileFormCard>
  </React.Fragment>
)

const ProfilePageShell = ({
  profile,
  loading,
  error,
  accessUpdate,
  embedded = false,
  children,
}) => {
  const body = (
    <motion.div variants={staggerContainer} initial='hidden'
animate='show'>
      <ProfilePageBody
        profile={profile}
        loading={loading}
        error={error}
        accessUpdate={accessUpdate}
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
  }),
  loading: PropTypes.bool,
  error: PropTypes.object,
  accessUpdate: PropTypes.bool,
  embedded: PropTypes.bool,
  children: PropTypes.node,
}

export default ProfilePageShell

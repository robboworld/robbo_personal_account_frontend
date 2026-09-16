import React from 'react'
import { PropTypes } from 'prop-types'
import { Alert, Skeleton } from 'antd'
import { FormattedMessage } from 'react-intl'
import { motion } from 'framer-motion'

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
import UserBanPanel from '@/components/UserBanPanel'

const ProfilePageBody = ({
  profile,
  loading,
  error,
  accessUpdate,
  peekUserId,
  peekUserRole,
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
        <ProfileSubtitle>
          {profile?.fullName || profile?.nickname || profile?.email || (
            <FormattedMessage id='profile.loading' />
          )}
        </ProfileSubtitle>
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
      <Skeleton active loading={loading} paragraph={{ rows: 8 }}>
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
  const body = (
    <motion.div variants={staggerContainer} initial='hidden' animate='show'>
      <ProfilePageBody
        profile={profile}
        loading={loading}
        error={error}
        accessUpdate={accessUpdate}
        peekUserId={peekUserId}
        peekUserRole={peekUserRole}
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

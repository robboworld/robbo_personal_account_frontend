import React from 'react'

import { getProfileFromQuery } from './profileQuery'

import ProfilePageShell from '@/components/ProfilePageShell'
import ProfileCard from '@/components/ProfileCard'

const UnitAdminProfile = ({
  data,
  UpdateUnitAdmin,
  accessUpdate,
  peekUserId,
  peekUserRole,
}) => {
  const { profile, loading, error } = getProfileFromQuery(data)

  return (
    <ProfilePageShell
      profile={profile}
      loading={loading}
      error={error}
      accessUpdate={accessUpdate}
      peekUserId={peekUserId}
      peekUserRole={peekUserRole}
    >
      <ProfileCard
        profile={profile}
        updateHandle={UpdateUnitAdmin}
        accessUpdate={accessUpdate}
      />
    </ProfilePageShell>
  )
}

export default UnitAdminProfile

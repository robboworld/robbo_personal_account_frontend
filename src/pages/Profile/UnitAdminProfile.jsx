import React from 'react'

import { getProfileFromQuery } from './profileQuery'

import ProfilePageShell from '@/components/ProfilePageShell'
import ProfileCard from '@/components/ProfileCard'

const UnitAdminProfile = ({
  data,
  UpdateUnitAdmin,
  accessUpdate,
}) => {
  const { profile, loading, error } = getProfileFromQuery(data)

  return (
    <ProfilePageShell
      profile={profile}
      loading={loading}
      error={error}
      accessUpdate={accessUpdate}
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

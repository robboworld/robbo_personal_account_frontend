import React from 'react'

import { getProfileFromQuery } from './profileQuery'

import ProfilePageShell from '@/components/ProfilePageShell'
import ProfileCard from '@/components/ProfileCard'

const SuperAdminProfile = ({
  data,
  UpdateSuperAdmin,
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
        updateHandle={UpdateSuperAdmin}
        accessUpdate={accessUpdate}
      />
    </ProfilePageShell>
  )
}

export default SuperAdminProfile

import React from 'react'

import { getProfileFromQuery } from './profileQuery'

import ProfilePageShell from '@/components/ProfilePageShell'
import ProfileCard from '@/components/ProfileCard'

const TeacherProfile = ({
  data,
  UpdateTeacher,
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
        updateHandle={UpdateTeacher}
        accessUpdate={accessUpdate}
      />
    </ProfilePageShell>
  )
}

export default TeacherProfile

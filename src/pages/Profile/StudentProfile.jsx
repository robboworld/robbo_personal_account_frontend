import React from 'react'

import { getProfileFromQuery } from './profileQuery'

import { FullAccountBanner } from '@/components/FullAccount'
import ProfilePageShell from '@/components/ProfilePageShell'
import ProfileCard from '@/components/ProfileCard'
import KidProfileCard from '@/components/ProfileCard/KidProfileCard'
import { useIsKidAccount } from '@/helpers/kidAccount'

const StudentProfile = ({ data, UpdateStudent, accessUpdate, peekUserId, peekUserRole }) => {
  const { profile, loading, error } = getProfileFromQuery(data)
  // Own profile of a teacher-made kid account: read only, nothing about the child is asked for.
  // An admin peeking at a kid account still gets the usual form.
  const ownKidAccount = useIsKidAccount() && !peekUserId

  return (
    <ProfilePageShell
      profile={profile}
      loading={loading}
      error={error}
      accessUpdate={accessUpdate || ownKidAccount}
      peekUserId={peekUserId}
      peekUserRole={peekUserRole}
      notice={ownKidAccount ? <FullAccountBanner /> : null}>
      {ownKidAccount ? (
        <KidProfileCard profile={profile} />
      ) : (
        <ProfileCard profile={profile} updateHandle={UpdateStudent} accessUpdate={accessUpdate} />
      )}
    </ProfilePageShell>
  )
}

export default StudentProfile

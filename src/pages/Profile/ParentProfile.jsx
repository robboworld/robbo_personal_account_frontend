import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { List } from 'antd'
import { motion } from 'framer-motion'

import { getProfileFromQuery } from './profileQuery'

import ProfilePageShell from '@/components/ProfilePageShell'
import ProfileCard from '@/components/ProfileCard'
import {
  ChildrenListHeader,
  ChildrenPanel,
  PageContent,
  ParentLayout,
  staggerContainer,
  staggerItem,
} from '@/components/AccountShell'
import { PROFILE_PAGE_ROUTE } from '@/constants'
import ListItem from '@/components/ListItem'
import { formatUserDisplayName } from '@/helpers'

const ParentProfile = ({
  data,
  GetUser,
  GetStudents,
  UpdateParent,
  accessUpdate,
}) => {
  const navigate = useNavigate()
  const intl = useIntl()
  const { profile, loading: profileLoading } = getProfileFromQuery(data ?? GetUser)

  const openProfileStudent = userId => {
    navigate(PROFILE_PAGE_ROUTE, {
      state: {
        userId,
        userRole: 0,
      },
    })
  }

  return (
      <PageContent>
        <ParentLayout
          as={motion.div}
          variants={staggerContainer}
          initial='hidden'
          animate='show'
        >
          <motion.div variants={staggerItem}>
            <ProfilePageShell
              profile={profile}
              loading={profileLoading}
              accessUpdate={accessUpdate}
              embedded
            >
              <ProfileCard
                profile={profile}
                updateHandle={UpdateParent}
                accessUpdate={accessUpdate}
              />
            </ProfilePageShell>
          </motion.div>

          <ChildrenPanel as={motion.section} variants={staggerItem}>
            <ChildrenListHeader>
              <FormattedMessage id='parent_profile.header_children_list' />
            </ChildrenListHeader>
            <List
              loading={GetStudents?.loading}
              dataSource={GetStudents?.GetStudentsByParentId?.students ?? []}
              locale={{ emptyText: intl.formatMessage({ id: 'parent_profile.children_empty' }) }}
              renderItem={({ userHttp }) => (
                <ListItem
                  key={userHttp.email}
                  handleClick={() => openProfileStudent(userHttp.id)}
                  render={() => { }}
                  label={formatUserDisplayName(userHttp)}
                />
              )}
            />
          </ChildrenPanel>
        </ParentLayout>
      </PageContent>
  )
}

export default ParentProfile

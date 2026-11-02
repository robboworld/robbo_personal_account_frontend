import React from 'react'
import { Drawer } from 'antd'
import { useIntl } from 'react-intl'

import AdminUserContent from './AdminUserContent'

/** Drawer with one user's content; open while userId is set. user = { username, fullName }. */
const AdminUserContentDrawer = ({ userId, user, onClose, onDeleted }) => {
  const intl = useIntl()
  const title = user?.username
    ? intl.formatMessage(
        { id: 'user_content.drawer_title' },
        { name: user.fullName ? `${user.username} · ${user.fullName}` : user.username },
      )
    : intl.formatMessage({ id: 'user_content.drawer_title_id' }, { id: userId })

  return (
    <Drawer
      open={Boolean(userId)}
      title={title}
      size='min(760px, 100vw)'
      onClose={onClose}
      destroyOnHidden>
      {userId ? <AdminUserContent userId={String(userId)} onDeleted={onDeleted} /> : null}
    </Drawer>
  )
}

export default AdminUserContentDrawer

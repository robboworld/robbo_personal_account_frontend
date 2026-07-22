import React, { useState, memo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Modal, Button, List } from 'antd'
import { motion } from 'framer-motion'

import { ClientsListShell, ClientsToolbar } from './styles'

import ListItem from '@/components/ListItem'
import ParentContentContainer from '@/components/ParentContent'
import AddParent from '@/components/AddParent'
import { DragResize } from '@/components/UI'
import { useActions } from '@/helpers/useActions'
import { deleteParentRequest } from '@/actions'
import { formatUserDisplayName } from '@/helpers'
import {
  GlassPanel,
  HeroInner,
  HeroLead,
  HeroPanel,
  HeroTitle,
  PageContent,
  SectionTitle,
  Stagger,
  staggerContainer,
  staggerItem,
} from '@/components/AccountShell'

const Clients = memo(({
  data: {
    GetAllParents,
    loading,
  },
  pageSize,
  currentPage,
  onChangePage,
}) => {
  const intl = useIntl()
  const actions = useActions({ deleteParentRequest }, [])
  const [openAddClients, setOpenAddClients] = useState(false)

  return (
    <PageContent>
      <Stagger variants={staggerContainer} initial='hidden'
animate='show'>
        <HeroPanel variants={staggerItem}>
          <HeroInner>
            <HeroTitle>
              <FormattedMessage id='clients.title' />
            </HeroTitle>
            <HeroLead>
              {intl.formatMessage({ id: 'clients.add_parent_title' })}
            </HeroLead>
          </HeroInner>
        </HeroPanel>

        <motion.div variants={staggerItem}>
          <GlassPanel>
            <ClientsToolbar>
              <SectionTitle>
                <FormattedMessage id='clients.title' />
              </SectionTitle>
              <Button type='primary' onClick={() => setOpenAddClients(true)}>
                <FormattedMessage id='clients.add_parent_button' />
              </Button>
            </ClientsToolbar>

            <ClientsListShell>
              <List
                className='clientsList'
                loading={loading}
                size='large'
                dataSource={GetAllParents?.parents}
                pagination={{
                  onChange: onChangePage,
                  total: GetAllParents?.countRows,
                  current: +currentPage,
                  defaultCurrent: 1,
                  defaultPageSize: pageSize,
                  responsive: true,
                }}
                itemLayout='vertical'
                renderItem={({ userHttp }, index) => (
                  <ListItem
                    itemIndex={index}
                    handleDelete={
                      parentIndex => actions.deleteParentRequest(userHttp.id, parentIndex)
                    }
                    label={formatUserDisplayName(userHttp)}
                    key={index}
                    render={(open, setOpen) => (
                      <DragResize
                        open={open} setOpen={setOpen}
                        content={() => (
                          <ParentContentContainer parentId={userHttp.id} />
                        )}
                      />
                    )}
                  />
                )}
              />
            </ClientsListShell>
          </GlassPanel>
        </motion.div>
      </Stagger>

      <Modal
        title={<FormattedMessage id='clients.add_parent_title' />}
        centered
        open={openAddClients}
        onCancel={() => setOpenAddClients(false)}
        footer={[]}
      >
        <AddParent />
      </Modal>
    </PageContent>
  )
})

export default Clients

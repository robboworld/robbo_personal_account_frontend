import React, { useState } from 'react'
import { Form, Input, Button, Tabs, Select, DatePicker, message } from 'antd'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'

import { adminSendPersonalNotification, adminCreateAnnouncement } from '@/api/notifications'
import { SUPER_ADMIN } from '@/constants'
import { useAuthRole } from '@/helpers'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'
import LmsUsernameSelect from '@/components/LmsUsernameSelect'
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

const { TextArea } = Input

const SendNotification = () => {
  const intl = useIntl()
  const [personalForm] = Form.useForm()
  const [announceForm] = Form.useForm()
  const [loadingP, setLoadingP] = useState(false)
  const [loadingA, setLoadingA] = useState(false)
  const isSuper = useAuthRole() === SUPER_ADMIN
  const required = { required: true, message: intl.formatMessage({ id: 'form.required' }) }
  const severityOptions = ['INFO', 'WARNING', 'CRITICAL'].map(value => ({
    value,
    label: intl.formatMessage({ id: `send_notification.severity_${value.toLowerCase()}` }),
  }))

  const onPersonal = async values => {
    setLoadingP(true)
    try {
      await adminSendPersonalNotification({
        recipientUsername: values.recipientUsername.trim(),
        title: values.title.trim(),
        body: values.body.trim(),
        kind: values.kind?.trim() || 'admin_message',
        severity: values.severity || 'INFO',
        actionUrl: values.actionUrl?.trim() || undefined,
      })
      message.success(intl.formatMessage({ id: 'send_notification.personal_ok' }))
      personalForm.resetFields()
    } catch (e) {
      message.error(apiErrorMessage(e, intl))
    } finally {
      setLoadingP(false)
    }
  }

  const onAnnouncement = async values => {
    setLoadingA(true)
    try {
      // The feed shows only {"all":true} announcements; role targeting is not implemented.
      await adminCreateAnnouncement({
        title: values.title.trim(),
        body: values.body.trim(),
        audienceJson: '{"all":true}',
        expiresAt: values.expiresAt ? values.expiresAt.toISOString() : undefined,
      })
      message.success(intl.formatMessage({ id: 'send_notification.announcement_ok' }))
      announceForm.resetFields()
    } catch (e) {
      message.error(apiErrorMessage(e, intl))
    } finally {
      setLoadingA(false)
    }
  }

  const personalFormBody = (
    <React.Fragment>
      <SectionTitle style={{ marginBottom: '1rem' }}>
        {intl.formatMessage({ id: 'send_notification.personal_title' })}
      </SectionTitle>
      <Form form={personalForm} layout='vertical'
onFinish={onPersonal}>
        <Form.Item
          name='recipientUsername'
          label={intl.formatMessage({ id: 'send_notification.recipient_username' })}
          rules={[required]}
        >
          <LmsUsernameSelect />
        </Form.Item>
        <Form.Item
          name='title'
          label={intl.formatMessage({ id: 'send_notification.field_title' })}
          rules={[required]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='body'
          label={intl.formatMessage({ id: 'send_notification.field_body' })}
          rules={[required]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name='kind' label={intl.formatMessage({ id: 'send_notification.field_kind' })}>
          <Input placeholder='admin_message' />
        </Form.Item>
        <Form.Item
          name='severity'
          label={intl.formatMessage({ id: 'send_notification.field_severity' })}
          initialValue='INFO'
        >
          <Select options={severityOptions} />
        </Form.Item>
        <Form.Item
          name='actionUrl'
          label={intl.formatMessage({ id: 'send_notification.field_action_url' })}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'
loading={loadingP}>
            {intl.formatMessage({ id: 'send_notification.submit_personal' })}
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  )

  const announcementFormBody = (
    <React.Fragment>
      <SectionTitle style={{ marginBottom: '1rem' }}>
        {intl.formatMessage({ id: 'send_notification.announcement_title' })}
      </SectionTitle>
      <Form form={announceForm} layout='vertical'
onFinish={onAnnouncement}>
        <Form.Item
          name='title'
          label={intl.formatMessage({ id: 'send_notification.field_title' })}
          rules={[required]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='body'
          label={intl.formatMessage({ id: 'send_notification.field_body' })}
          rules={[required]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <p style={{ marginTop: 0 }}>
          {intl.formatMessage({ id: 'send_notification.audience_all' })}
        </p>
        <Form.Item name='expiresAt' label={intl.formatMessage({ id: 'send_notification.expires_at' })}>
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            format='DD.MM.YYYY HH:mm'
            disabledDate={current => current && current.isBefore(dayjs().startOf('day'))}
          />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'
loading={loadingA}>
            {intl.formatMessage({ id: 'send_notification.submit_announcement' })}
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  )

  return (
    <PageContent>
      <Stagger variants={staggerContainer} initial='hidden'
animate='show'>
        <HeroPanel variants={staggerItem}>
          <HeroInner>
            <HeroTitle>
              {intl.formatMessage({ id: 'sidebar_data.send_notification' })}
            </HeroTitle>
            <HeroLead>
              {intl.formatMessage({ id: 'send_notification.lead' })}
            </HeroLead>
          </HeroInner>
        </HeroPanel>

        <motion.div variants={staggerItem}>
          <GlassPanel>
            {isSuper ? (
              <Tabs
                items={[
                  {
                    key: 'personal',
                    label: intl.formatMessage({ id: 'send_notification.tab_personal' }),
                    children: personalFormBody,
                  },
                  {
                    key: 'announcement',
                    label: intl.formatMessage({ id: 'send_notification.tab_announcement' }),
                    children: announcementFormBody,
                  },
                ]}
              />
            ) : (
              personalFormBody
            )}
          </GlassPanel>
        </motion.div>
      </Stagger>
    </PageContent>
  )
}

export default SendNotification

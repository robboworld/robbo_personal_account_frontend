import React, { useState } from 'react'
import { Button, DatePicker, Form, Input, InputNumber, Typography, message } from 'antd'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'

import { ResultBlock } from './styles'

import {
  GlassPanel,
  HeroInner,
  HeroLead,
  HeroPanel,
  HeroTitle,
  PageContent,
  Stagger,
  staggerContainer,
  staggerItem,
} from '@/components/AccountShell'
import { issueLicense } from '@/api/licensing'
import LmsUsernameSelect from '@/components/LmsUsernameSelect'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'
import { formatDateTime } from '@/helpers/formatDateTime'

const { Text } = Typography

const IssueLicensePage = () => {
  const intl = useIntl()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [issued, setIssued] = useState(null)

  const onFinish = async values => {
    setLoading(true)
    setIssued(null)
    try {
      const payload = {
        lmsUsername: String(values.lmsUsername).trim(),
        seatLimit: Number(values.seatLimit) || 1,
        note: values.note?.trim() || '',
        capabilities: ['premium.auto_update'],
      }
      if (values.expiresAt) {
        // End of the chosen day, so "until 31.12" includes the 31st.
        payload.expiresAt = values.expiresAt.endOf('day').toISOString()
      }
      const lic = await issueLicense(payload)
      setIssued(lic)
      message.success(intl.formatMessage({ id: 'licensing.issue_ok' }))
      form.resetFields(['note'])
    } catch (e) {
      message.error(apiErrorMessage(e, intl, 'notification.error_message'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContent>
      <Stagger variants={staggerContainer} initial='hidden' animate='show'>
        <HeroPanel variants={staggerItem}>
          <HeroInner>
            <HeroTitle>{intl.formatMessage({ id: 'licensing.issue_title' })}</HeroTitle>
            <HeroLead>{intl.formatMessage({ id: 'licensing.issue_hint' })}</HeroLead>
          </HeroInner>
        </HeroPanel>

        <motion.div variants={staggerItem}>
          <GlassPanel>
            <Form
              form={form}
              layout='vertical'
              onFinish={onFinish}
              initialValues={{ seatLimit: 2 }}>
              <Form.Item
                name='lmsUsername'
                label={intl.formatMessage({ id: 'licensing.lms_username' })}
                rules={[{ required: true, message: intl.formatMessage({ id: 'form.required' }) }]}>
                <LmsUsernameSelect />
              </Form.Item>
              <Form.Item
                name='seatLimit'
                label={intl.formatMessage({ id: 'licensing.seat_limit' })}
                rules={[{ required: true, message: intl.formatMessage({ id: 'form.required' }) }]}>
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name='expiresAt'
                label={intl.formatMessage({ id: 'licensing.expires_at' })}
                extra={intl.formatMessage({ id: 'licensing.expires_at_hint' })}>
                <DatePicker
                  format='DD.MM.YYYY'
                  style={{ width: '100%' }}
                  disabledDate={current => current && current.isBefore(dayjs().startOf('day'))}
                />
              </Form.Item>
              <Form.Item name='note' label={intl.formatMessage({ id: 'licensing.note' })}>
                <Input.TextArea rows={2} />
              </Form.Item>
              <Button type='primary' htmlType='submit' loading={loading}>
                {intl.formatMessage({ id: 'licensing.issue_submit' })}
              </Button>
            </Form>

            {issued ? (
              <ResultBlock>
                <h3>{intl.formatMessage({ id: 'licensing.issued_result' })}</h3>
                <p>
                  <Text strong>{intl.formatMessage({ id: 'licensing.license_key' })}: </Text>
                  <Text code copyable>
                    {issued.licenseKey}
                  </Text>
                </p>
                <p>
                  <Text strong>{intl.formatMessage({ id: 'licensing.id_label' })}: </Text>
                  <Text code>{issued.id}</Text>
                </p>
                <p>
                  <Text strong>{intl.formatMessage({ id: 'licensing.expires_at' })}: </Text>
                  {issued.expiresAt ? formatDateTime(issued.expiresAt, intl.locale) : '–'}
                </p>
              </ResultBlock>
            ) : null}
          </GlassPanel>
        </motion.div>
      </Stagger>
    </PageContent>
  )
}

export default IssueLicensePage

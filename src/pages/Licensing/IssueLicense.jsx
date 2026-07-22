import React, { useState } from 'react'
import { Button, Form, Input, InputNumber, Typography, message } from 'antd'
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
      if (values.expiresAt?.trim()) {
        const d = new Date(values.expiresAt.trim())
        if (Number.isNaN(d.getTime())) {
          throw new Error(intl.formatMessage({ id: 'licensing.bad_expires' }))
        }
        payload.expiresAt = d.toISOString()
      }
      const lic = await issueLicense(payload)
      setIssued(lic)
      message.success(intl.formatMessage({ id: 'licensing.issue_ok' }))
      form.resetFields(['note'])
    } catch (e) {
      message.error(e?.response?.data?.error || e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContent>
      <Stagger variants={staggerContainer} initial='hidden'
animate='show'>
        <HeroPanel variants={staggerItem}>
          <HeroInner>
            <HeroTitle>
              {intl.formatMessage({ id: 'licensing.issue_title' })}
            </HeroTitle>
            <HeroLead>
              {intl.formatMessage({ id: 'licensing.issue_hint' })}
            </HeroLead>
          </HeroInner>
        </HeroPanel>

        <motion.div variants={staggerItem}>
          <GlassPanel>
            <Form
              form={form}
              layout='vertical'
              onFinish={onFinish}
              initialValues={{ seatLimit: 2 }}
            >
              <Form.Item
                name='lmsUsername'
                label={intl.formatMessage({ id: 'licensing.lms_username' })}
                rules={[{ required: true }]}
              >
                <LmsUsernameSelect />
              </Form.Item>
              <Form.Item
                name='seatLimit'
                label={intl.formatMessage({ id: 'licensing.seat_limit' })}
                rules={[{ required: true }]}
              >
                <InputNumber min={1} max={100}
style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name='expiresAt' label={intl.formatMessage({ id: 'licensing.expires_at' })}>
                <Input placeholder='2027-12-31T23:59:59Z' />
              </Form.Item>
              <Form.Item name='note' label={intl.formatMessage({ id: 'licensing.note' })}>
                <Input.TextArea rows={2} />
              </Form.Item>
              <Button type='primary' htmlType='submit'
loading={loading}>
                {intl.formatMessage({ id: 'licensing.issue_submit' })}
              </Button>
            </Form>

            {issued ? (
              <ResultBlock>
                <h3>{intl.formatMessage({ id: 'licensing.issued_result' })}</h3>
                <p>
                  <Text strong>{intl.formatMessage({ id: 'licensing.license_key' })}: </Text>
                  <Text code copyable>{issued.licenseKey}</Text>
                </p>
                <p>
                  <Text strong>ID: </Text>
                  <Text code>{issued.id}</Text>
                </p>
                <p>
                  <Text strong>{intl.formatMessage({ id: 'licensing.expires_at' })}: </Text>
                  {issued.expiresAt}
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

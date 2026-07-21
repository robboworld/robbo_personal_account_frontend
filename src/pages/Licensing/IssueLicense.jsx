import React, { useState } from 'react'
import { Button, Card, Form, Input, InputNumber, Typography, message } from 'antd'
import { useIntl } from 'react-intl'

import { issueLicense } from '@/api/licensing'

const { Title, Paragraph, Text } = Typography

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
        lmsUserId: String(values.lmsUserId).trim(),
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
    <div style={{ maxWidth: 720, margin: '24px auto', padding: '0 16px' }}>
      <Title level={3}>{intl.formatMessage({ id: 'licensing.issue_title' })}</Title>
      <Paragraph type='secondary'>{intl.formatMessage({ id: 'licensing.issue_hint' })}</Paragraph>
      <Card>
        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          initialValues={{ seatLimit: 2 }}
        >
          <Form.Item
            name='lmsUserId'
            label={intl.formatMessage({ id: 'licensing.lms_user_id' })}
            rules={[{ required: true }]}
          >
            <Input placeholder='123' />
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
      </Card>
      {issued ? (
        <Card style={{ marginTop: 16 }}>
          <Title level={5}>{intl.formatMessage({ id: 'licensing.issued_result' })}</Title>
          <Paragraph>
            <Text strong>{intl.formatMessage({ id: 'licensing.license_key' })}: </Text>
            <Text code copyable>{issued.licenseKey}</Text>
          </Paragraph>
          <Paragraph>
            <Text strong>ID: </Text>
            <Text code>{issued.id}</Text>
          </Paragraph>
          <Paragraph>
            <Text strong>{intl.formatMessage({ id: 'licensing.expires_at' })}: </Text>
            {issued.expiresAt}
          </Paragraph>
        </Card>
      ) : null}
    </div>
  )
}

export default IssueLicensePage

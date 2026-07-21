import React, { useEffect, useState } from 'react'
import { Button, Card, Form, Input, Select, Typography, message } from 'antd'
import { useIntl } from 'react-intl'
import { useSearchParams } from 'react-router-dom'

import { confirmDeviceLink, listMyLicenses } from '@/api/licensing'

const { Title, Paragraph } = Typography

const DeviceLinkPage = () => {
  const intl = useIntl()
  const [params] = useSearchParams()
  const [form] = Form.useForm()
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const code = params.get('code')
    if (code) {
      form.setFieldsValue({ userCode: code })
    }
    listMyLicenses()
      .then(setLicenses)
      .catch(() => setLicenses([]))
  }, [params, form])

  const onFinish = async values => {
    setLoading(true)
    try {
      await confirmDeviceLink({
        userCode: values.userCode.trim().toUpperCase(),
        licenseId: values.licenseId || '',
      })
      message.success(intl.formatMessage({ id: 'licensing.device_link_ok' }))
    } catch (e) {
      message.error(e?.response?.data?.error || e?.response?.data?.errorCode || e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: '24px auto', padding: '0 16px' }}>
      <Title level={3}>{intl.formatMessage({ id: 'licensing.device_link_title' })}</Title>
      <Paragraph type='secondary'>{intl.formatMessage({ id: 'licensing.device_link_hint' })}</Paragraph>
      <Card>
        <Form form={form} layout='vertical'
onFinish={onFinish}>
          <Form.Item
            name='userCode'
            label={intl.formatMessage({ id: 'licensing.user_code' })}
            rules={[{ required: true }]}
          >
            <Input placeholder='ABCD-EFGH' style={{ textTransform: 'uppercase' }} />
          </Form.Item>
          {licenses.length > 1 ? (
            <Form.Item name='licenseId' label={intl.formatMessage({ id: 'licensing.choose_license' })}>
              <Select
                allowClear
                options={licenses.map(l => ({
                  value: l.id,
                  label: `${l.licenseKey} (${l.status})`,
                }))}
              />
            </Form.Item>
          ) : null}
          <Button type='primary' htmlType='submit'
loading={loading} disabled={licenses.length === 0}>
            {intl.formatMessage({ id: 'licensing.device_link_confirm' })}
          </Button>
        </Form>
        {licenses.length === 0 ? (
          <Paragraph type='warning' style={{ marginTop: 16 }}>
            {intl.formatMessage({ id: 'licensing.device_link_no_license' })}
          </Paragraph>
        ) : null}
      </Card>
    </div>
  )
}

export default DeviceLinkPage

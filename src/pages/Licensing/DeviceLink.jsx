import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Select, Typography, message } from 'antd'
import { useIntl } from 'react-intl'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

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
import { confirmDeviceLink, listMyLicenses } from '@/api/licensing'

const { Paragraph } = Typography

const formatLicenseStatus = (intl, status) => {
  const statusIds = {
    active: 'licensing.status_active',
    expired: 'licensing.status_expired',
    revoked: 'licensing.status_revoked',
  }
  const id = statusIds[String(status || '').toLowerCase()]
  return id ? intl.formatMessage({ id }) : (status || '')
}

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
      message.error(
        e?.response?.data?.error ||
        e?.response?.data?.errorCode ||
        e.message ||
        intl.formatMessage({ id: 'notification.error_message' }),
      )
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
              {intl.formatMessage({ id: 'licensing.device_link_title' })}
            </HeroTitle>
            <HeroLead>
              {intl.formatMessage({ id: 'licensing.device_link_hint' })}
            </HeroLead>
          </HeroInner>
        </HeroPanel>

        <motion.div variants={staggerItem}>
          <GlassPanel>
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
                      label: `${l.licenseKey} (${formatLicenseStatus(intl, l.status)})`,
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
          </GlassPanel>
        </motion.div>
      </Stagger>
    </PageContent>
  )
}

export default DeviceLinkPage

import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Input, Radio, Select, Spin, Typography, message } from 'antd'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'

import { GlassPanel, SectionHeader, SectionHint, SectionTitle } from '@/components/AccountShell'
import { getFeatureInterest, saveFeatureInterest } from '@/api/licensing'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'
import {
  INTEREST_FEATURES,
  INTEREST_OTHER_MAX,
  INTEREST_ROLES,
  interestSource,
} from '@/helpers/featureInterest'

const { Text } = Typography

// Paid editions are not on sale while tariffs are not approved: instead of a catalog the page
// asks which feature the user needs first and keeps the answer in the ЛК.
const FeatureInterestPanel = () => {
  const intl = useIntl()
  const location = useLocation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)
  const feature = Form.useWatch('feature', form)

  useEffect(() => {
    let cancelled = false
    getFeatureInterest()
      .then(answer => {
        if (cancelled || !answer) return
        form.setFieldsValue({
          role: answer.role,
          feature: answer.feature,
          other: answer.other,
          notify: answer.notify,
        })
        setSavedAt(answer.updatedAt || null)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [form])

  useEffect(() => {
    if (loading || window.location.hash !== '#interest') return
    const el = document.getElementById('interest')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [loading])

  const onFinish = async values => {
    setSaving(true)
    try {
      await saveFeatureInterest({
        role: values.role,
        feature: values.feature,
        other: values.feature === 'other' ? (values.other || '').trim() : '',
        notify: Boolean(values.notify),
        source: interestSource(location.search),
      })
      setSavedAt(new Date().toISOString())
      message.success(intl.formatMessage({ id: 'interest.saved' }))
    } catch (e) {
      message.error(apiErrorMessage(e, intl))
    } finally {
      setSaving(false)
    }
  }

  const t = id => intl.formatMessage({ id })

  return (
    <GlassPanel id='interest'>
      <SectionHeader>
        <SectionTitle>{t('interest.title')}</SectionTitle>
        <SectionHint>{t('interest.hint')}</SectionHint>
      </SectionHeader>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
          <Spin />
        </div>
      ) : (
        <Form
          form={form}
          layout='vertical'
          requiredMark={false}
          onFinish={onFinish}
          initialValues={{ notify: true }}
          style={{ maxWidth: 640 }}>
          <Form.Item
            name='role'
            label={t('interest.role_label')}
            rules={[{ required: true, message: t('interest.role_required') }]}>
            <Select
              size='large'
              placeholder={t('interest.role_placeholder')}
              options={INTEREST_ROLES.map(role => ({
                value: role,
                label: t(`interest.role.${role}`),
              }))}
            />
          </Form.Item>
          <Form.Item
            name='feature'
            label={t('interest.feature_label')}
            rules={[{ required: true, message: t('interest.feature_required') }]}>
            <Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {INTEREST_FEATURES.map(item => (
                <Radio key={item} value={item}>
                  {t(`interest.feature.${item}`)}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          {feature === 'other' ? (
            <Form.Item
              name='other'
              label={t('interest.other_label')}
              rules={[{ required: true, whitespace: true, message: t('interest.other_required') }]}>
              <Input.TextArea maxLength={INTEREST_OTHER_MAX} showCount autoSize={{ minRows: 2 }} />
            </Form.Item>
          ) : null}
          <Form.Item name='notify' valuePropName='checked'>
            <Checkbox>{t('interest.notify')}</Checkbox>
          </Form.Item>
          <Button type='primary' htmlType='submit' size='large' loading={saving}>
            {t(savedAt ? 'interest.update' : 'interest.submit')}
          </Button>
          {savedAt ? (
            <Text type='secondary' style={{ display: 'block', marginTop: 12 }}>
              {t('interest.thanks')}
            </Text>
          ) : null}
        </Form>
      )}
    </GlassPanel>
  )
}

export default FeatureInterestPanel

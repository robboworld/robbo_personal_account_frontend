import React, { useState } from 'react'
import { Card, Form, Input, Button, Tabs, Typography, message } from 'antd'
import { useIntl } from 'react-intl'

import { adminSendPersonalNotification, adminCreateAnnouncement } from '@/api/notifications'
import { SUPER_ADMIN } from '@/constants'
import { parseJwt } from '@/helpers'

const { TextArea } = Input
const { Title } = Typography

const SendNotification = () => {
    const intl = useIntl()
    const [personalForm] = Form.useForm()
    const [announceForm] = Form.useForm()
    const [loadingP, setLoadingP] = useState(false)
    const [loadingA, setLoadingA] = useState(false)
    const token = localStorage.getItem('token')
    const payload = token ? parseJwt(token) : {}
    const roleNum = Number(payload.Role)
    const isSuper = roleNum === SUPER_ADMIN

    const onPersonal = async values => {
        setLoadingP(true)
        try {
            await adminSendPersonalNotification({
                recipientUserId: values.recipientUserId.trim(),
                title: values.title.trim(),
                body: values.body.trim(),
                kind: values.kind?.trim() || 'admin_message',
                severity: values.severity || 'INFO',
                actionUrl: values.actionUrl?.trim() || undefined,
            })
            message.success(intl.formatMessage({ id: 'send_notification.personal_ok' }))
            personalForm.resetFields()
        } catch (e) {
            message.error(e.message)
        } finally {
            setLoadingP(false)
        }
    }

    const onAnnouncement = async values => {
        setLoadingA(true)
        try {
            const audienceJson = values.audienceJson?.trim() || '{"all":true}'
            JSON.parse(audienceJson)
            await adminCreateAnnouncement({
                title: values.title.trim(),
                body: values.body.trim(),
                audienceJson,
                expiresAt: values.expiresAt?.trim() || undefined,
            })
            message.success(intl.formatMessage({ id: 'send_notification.announcement_ok' }))
            announceForm.resetFields()
        } catch (e) {
            message.error(e.message || intl.formatMessage({ id: 'send_notification.invalid_json' }))
        } finally {
            setLoadingA(false)
        }
    }

    const personalTab = (
        <Card>
            <Title level={4}>{intl.formatMessage({ id: 'send_notification.personal_title' })}</Title>
            <Form form={personalForm} layout='vertical'
onFinish={onPersonal}>
                <Form.Item name='recipientUserId' label={intl.formatMessage({ id: 'send_notification.recipient_id' })}
rules={[ { required: true } ]}>
                    <Input placeholder='123' />
                </Form.Item>
                <Form.Item name='title' label={intl.formatMessage({ id: 'send_notification.field_title' })}
rules={[ { required: true } ]}>
                    <Input />
                </Form.Item>
                <Form.Item name='body' label={intl.formatMessage({ id: 'send_notification.field_body' })}
rules={[ { required: true } ]}>
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item name='kind' label={intl.formatMessage({ id: 'send_notification.field_kind' })}>
                    <Input placeholder='admin_message' />
                </Form.Item>
                <Form.Item name='severity' label={intl.formatMessage({ id: 'send_notification.field_severity' })}
initialValue='INFO'>
                    <Input placeholder='INFO' />
                </Form.Item>
                <Form.Item name='actionUrl' label={intl.formatMessage({ id: 'send_notification.field_action_url' })}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit'
loading={loadingP}>
                        {intl.formatMessage({ id: 'send_notification.submit_personal' })}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )

    const announcementTab = (
        <Card>
            <Title level={4}>{intl.formatMessage({ id: 'send_notification.announcement_title' })}</Title>
            <Form form={announceForm} layout='vertical'
onFinish={onAnnouncement}>
                <Form.Item name='title' label={intl.formatMessage({ id: 'send_notification.field_title' })}
rules={[ { required: true } ]}>
                    <Input />
                </Form.Item>
                <Form.Item name='body' label={intl.formatMessage({ id: 'send_notification.field_body' })}
rules={[ { required: true } ]}>
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    name='audienceJson'
                    label={intl.formatMessage({ id: 'send_notification.audience_json' })}
                    initialValue='{"all":true}'
                    rules={[ { required: true } ]}
                >
                    <TextArea rows={3} placeholder='{"all":true}' />
                </Form.Item>
                <Form.Item name='expiresAt' label={intl.formatMessage({ id: 'send_notification.expires_at' })}>
                    <Input placeholder='2026-12-31T23:59:59Z' />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit'
loading={loadingA}>
                        {intl.formatMessage({ id: 'send_notification.submit_announcement' })}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )

    if (!isSuper) {
        return personalTab
    }

    return (
        <Tabs
            items={[
                { key: 'personal', label: intl.formatMessage({ id: 'send_notification.tab_personal' }), children: personalTab },
                { key: 'announcement', label: intl.formatMessage({ id: 'send_notification.tab_announcement' }), children: announcementTab },
            ]}
        />
    )
}

export default SendNotification

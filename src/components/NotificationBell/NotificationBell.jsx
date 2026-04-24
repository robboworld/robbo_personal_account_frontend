import React, { useCallback, useEffect, useState } from 'react'
import { Badge, Button, List, Popover, Space, Typography, message } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { useIntl } from 'react-intl'

import {
    fetchNotificationFeed,
    fetchUnreadNotificationCount,
    markPersonalNotificationRead,
    markAnnouncementRead,
    markAllNotificationsRead,
} from '@/api/notifications'

const { Text } = Typography

const NotificationBell = () => {
    const intl = useIntl()
    const [open, setOpen] = useState(false)
    const [count, setCount] = useState(0)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)

    const refreshCount = useCallback(async () => {
        try {
            const { count: c } = await fetchUnreadNotificationCount()
            setCount(typeof c === 'number' ? c : 0)
        } catch {
            /* ignore when logged out or network */
        }
    }, [])

    const loadFeed = useCallback(async () => {
        setLoading(true)
        try {
            const data = await fetchNotificationFeed(40)
            setItems(data.items || [])
        } catch (e) {
            message.error(e.message || intl.formatMessage({ id: 'notifications.load_error' }))
        } finally {
            setLoading(false)
        }
    }, [intl])

    useEffect(() => {
        refreshCount()
        const t = setInterval(refreshCount, 60000)
        const onFocus = () => refreshCount()
        window.addEventListener('focus', onFocus)
        return () => {
            clearInterval(t)
            window.removeEventListener('focus', onFocus)
        }
    }, [refreshCount])

    useEffect(() => {
        if (open) {
            loadFeed()
            refreshCount()
        }
    }, [open, loadFeed, refreshCount])

    const onOpenChange = next => {
        setOpen(next)
    }

    const handleMarkRead = async row => {
        try {
            if (row.feedKind === 'personal') {
                await markPersonalNotificationRead(row.id)
            } else {
                await markAnnouncementRead(row.id)
            }
            await loadFeed()
            await refreshCount()
        } catch (e) {
            message.error(e.message)
        }
    }

    const handleMarkAll = async () => {
        try {
            await markAllNotificationsRead()
            await loadFeed()
            await refreshCount()
            message.success(intl.formatMessage({ id: 'notifications.mark_all_ok' }))
        } catch (e) {
            message.error(e.message)
        }
    }

    const overlay = (
        <div style={{ width: 360, maxHeight: 420, overflow: 'auto', background: '#fff', padding: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <Space style={{ marginBottom: 8, width: '100%', justifyContent: 'space-between' }}>
                <Text strong>{intl.formatMessage({ id: 'notifications.title' })}</Text>
                <Button size='small' type='link'
onClick={handleMarkAll}>
                    {intl.formatMessage({ id: 'notifications.mark_all' })}
                </Button>
            </Space>
            <List
                loading={loading}
                locale={{ emptyText: intl.formatMessage({ id: 'notifications.empty' }) }}
                dataSource={items}
                renderItem={row => {
                    const canMark = row.feedKind === 'announcement' || !row.readAt
                    return (
                    <List.Item
                        actions={canMark ? [
                            <Button type='link' size='small'
key='read' onClick={() => handleMarkRead(row)}>
                                {intl.formatMessage({ id: 'notifications.mark_read' })}
                            </Button>,
                        ] : []}
                    >
                        <List.Item.Meta
                            title={
                                <Space direction='vertical' size={0}>
                                    <Text strong={!row.readAt && row.feedKind === 'personal'}>{row.title}</Text>
                                    <Text type='secondary' style={{ fontSize: 12 }}>
                                        {row.feedKind === 'announcement'
                                            ? intl.formatMessage({ id: 'notifications.kind_announcement' })
                                            : row.source === 'lms'
                                                ? intl.formatMessage({ id: 'notifications.kind_lms' })
                                                : intl.formatMessage({ id: 'notifications.kind_admin' })}
                                    </Text>
                                </Space>
                            }
                            description={<Text style={{ whiteSpace: 'pre-wrap' }}>{row.body}</Text>}
                        />
                    </List.Item>
                    )
                }}
            />
        </div>
    )

    return (
        <Popover
            content={overlay}
            trigger='click'
            open={open}
            onOpenChange={onOpenChange}
            placement='bottomRight'
        >
            <span
                role='button'
                tabIndex={0}
                aria-label={intl.formatMessage({ id: 'notifications.title' })}
                style={{
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 8px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.22)',
                    lineHeight: 1,
                }}
                onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setOpen(o => !o)
                    }
                }}
            >
                <Badge count={count > 0 ? count : undefined} size='small'
overflowCount={99}>
                    <BellOutlined style={{ fontSize: 22, color: '#fff' }} />
                </Badge>
            </span>
        </Popover>
    )
}

export default NotificationBell

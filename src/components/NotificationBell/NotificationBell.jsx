import React, { useCallback, useEffect, useState } from 'react'
import { Badge, Button, List, Modal, Space, Typography, message } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import {
    fetchNotificationFeed,
    fetchUnreadNotificationCount,
    markPersonalNotificationRead,
    markAnnouncementRead,
    markAllNotificationsRead,
} from '@/api/notifications'
import theme from '@/theme'

const { Text } = Typography

const IconTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0.65rem;
  background: rgba(0, 175, 65, 0.1);
  color: ${theme.colors.secondary};
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.22s cubic-bezier(0.32, 0.72, 0, 1),
    color 0.22s ease,
    transform 0.18s ease;

  &:hover {
    background: rgba(0, 175, 65, 0.18);
    color: ${theme.colors.accentGreen};
  }

  &:active {
    transform: scale(0.96);
  }

  .anticon {
    font-size: 1.05rem;
    color: inherit;
  }

  .ant-badge {
    color: inherit;
    line-height: 1;
  }

  .ant-badge .anticon {
    color: inherit;
  }
`

const FeedPanel = styled.div`
  max-height: min(60vh, 420px);
  overflow: auto;
  margin: -0.25rem -0.5rem 0;
  padding: 0 0.5rem;
`

const NotificationBell = ({ variant = 'default' }) => {
    const intl = useIntl()
    const isSidebar = variant === 'sidebar'
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

    const feed = (
        <FeedPanel>
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
        </FeedPanel>
    )

    const trigger = (
        <IconTrigger
            type='button'
            aria-label={intl.formatMessage({ id: 'notifications.title' })}
            onClick={() => setOpen(true)}
            style={isSidebar ? undefined : {
                background: 'rgba(255,255,255,0.22)',
                color: '#fff',
            }}
        >
            <Badge count={count > 0 ? count : undefined} size='small'
overflowCount={99}>
                <BellOutlined
                  style={{
                    fontSize: 17,
                    color: isSidebar ? theme.colors.secondary : '#fff',
                  }}
                />
            </Badge>
        </IconTrigger>
    )

    if (isSidebar) {
        return (
            <React.Fragment>
                {trigger}
                <Modal
                    title={intl.formatMessage({ id: 'notifications.title' })}
                    open={open}
                    onCancel={() => setOpen(false)}
                    footer={null}
                    centered
                    destroyOnClose
                    width={440}
                    maskClosable
                    styles={{
                        mask: { background: 'rgba(24, 28, 32, 0.55)' },
                    }}
                >
                    {feed}
                </Modal>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            {trigger}
            <Modal
                title={intl.formatMessage({ id: 'notifications.title' })}
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                centered
                destroyOnClose
                width={440}
                maskClosable
            >
                {feed}
            </Modal>
        </React.Fragment>
    )
}

export default NotificationBell

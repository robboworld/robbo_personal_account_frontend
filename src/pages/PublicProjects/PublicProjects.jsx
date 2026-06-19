import React, { useEffect, useState } from 'react'
import { Button, List, Spin, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import { projectPageAPI } from '@/api/projectPage'
import { HOME_PAGE_ROUTE } from '@/constants'

const { Text } = Typography

export default function PublicProjects() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [projects, setProjects] = useState([])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            setLoading(false)
            return
        }
        projectPageAPI.getPublicProjectPages(token)
            .then(res => {
                setProjects(res.data?.projectPages || [])
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <React.Fragment>
            <Button
                type='default'
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(HOME_PAGE_ROUTE)}
                style={{ marginBottom: '1rem' }}
            >
                <FormattedMessage id='project_page.back_to_home' />
            </Button>
            <Typography.Title level={3}>
                <FormattedMessage id='project_page.public_catalog_title' />
            </Typography.Title>
            {loading ? <Spin />
                : (
                    <List
                        itemLayout='horizontal'
                        dataSource={projects}
                        locale={{ emptyText: <FormattedMessage id='project_page.public_catalog_empty' /> }}
                        renderItem={item => (
                            <List.Item
                                actions={[
                                    <Button
                                        key='open'
                                        type='link'
                                        onClick={() => navigate(`/projects/${item.projectPageId}`)}
                                    >
                                        <FormattedMessage id='project_page.open_project' />
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    title={item.title}
                                    description={(
                                        <Text type='secondary'>
                                            <FormattedMessage
                                                id='project_page.author_label'
                                                values={{ name: item.authorName || item.authorUserId }}
                                            />
                                        </Text>
                                    )}
                                />
                            </List.Item>
                        )}
                    />
                )}
        </React.Fragment>
    )
}

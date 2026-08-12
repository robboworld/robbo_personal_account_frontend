import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Empty, List, Typography, message, Input, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import { PageContent, Panel, SectionHeader, SectionTitle } from '@/components/AccountShell'
import * as api from '@/api/teacherClass'
import { JOIN_CLASS_CODE_ROUTE, MY_PROJECTS_ROUTE } from '@/constants'

const { Paragraph, Text } = Typography

const StudentClassesPage = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.listStudentClasses()
      setItems(data.items || [])
    } catch (e) {
      message.error(e?.response?.data?.error || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const join = async () => {
    try {
      await api.joinClass({ code: code.trim() })
      message.success('Joined!')
      setCode('')
      load()
    } catch (e) {
      message.error(e?.response?.data?.error || 'Join failed')
    }
  }

  return (
    <PageContent>
      <Panel>
        <SectionHeader>
          <SectionTitle>
            <FormattedMessage id='student_class.title' defaultMessage='My classes' />
          </SectionTitle>
          <Button onClick={() => navigate(JOIN_CLASS_CODE_ROUTE)}>
            <FormattedMessage id='student_class.join_link' defaultMessage='Join with link' />
          </Button>
        </SectionHeader>
        <Space.Compact style={{ width: '100%', maxWidth: 420, marginBottom: 24 }}>
          <Input
            placeholder='Class code'
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
          />
          <Button type='primary' onClick={join}>Join</Button>
        </Space.Compact>
        {!loading && items.length === 0 && (
          <Empty description={<FormattedMessage id='student_class.empty' defaultMessage='You are not in any class yet' />} />
        )}
        <List
          loading={loading}
          grid={{ gutter: 16, xs: 1, sm: 2 }}
          dataSource={items}
          renderItem={item => (
            <List.Item>
              <Card title={item.displayName}>
                <Paragraph type='secondary' style={{ fontSize: 12 }}>{item.edxCourseId}</Paragraph>
                {item.ownerName && <Text type='secondary'>Teacher: {item.ownerName}</Text>}
                <div style={{ marginTop: 12 }}>
                  <Button type='link' onClick={() => navigate(MY_PROJECTS_ROUTE)}>
                    My Scratch projects
                  </Button>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Panel>
    </PageContent>
  )
}

export default StudentClassesPage

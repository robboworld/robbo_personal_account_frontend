import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Empty, List, Typography, message, Input, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'

import { PageContent, Panel, SectionHeader, SectionTitle } from '@/components/AccountShell'
import * as api from '@/api/teacherClass'
import { JOIN_CLASS_CODE_ROUTE, MY_PROJECTS_ROUTE } from '@/constants'

const { Paragraph, Text } = Typography

const StudentClassesPage = () => {
  const navigate = useNavigate()
  const intl = useIntl()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.listStudentClasses()
      setItems(data.items || [])
    } catch (e) {
      message.error(e?.response?.data?.error || intl.formatMessage({ id: 'student_class.load_error' }))
    } finally {
      setLoading(false)
    }
  }, [intl])

  useEffect(() => { load() }, [load])

  const join = async () => {
    try {
      await api.joinClass({ code: code.trim() })
      message.success(intl.formatMessage({ id: 'student_class.join_success' }))
      setCode('')
      load()
    } catch (e) {
      message.error(e?.response?.data?.error || intl.formatMessage({ id: 'student_class.join_error' }))
    }
  }

  return (
    <PageContent>
      <Panel>
        <SectionHeader>
          <SectionTitle>
            <FormattedMessage id='student_class.title' />
          </SectionTitle>
          <Button onClick={() => navigate(JOIN_CLASS_CODE_ROUTE)}>
            <FormattedMessage id='student_class.join_link' />
          </Button>
        </SectionHeader>
        <Space.Compact style={{ width: '100%', maxWidth: 420, marginBottom: 24 }}>
          <Input
            placeholder={intl.formatMessage({ id: 'student_class.code_placeholder' })}
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
          />
          <Button type='primary' onClick={join}>
            <FormattedMessage id='student_class.join_button' />
          </Button>
        </Space.Compact>
        {!loading && items.length === 0 && (
          <Empty description={<FormattedMessage id='student_class.empty' />} />
        )}
        <List
          loading={loading}
          grid={{ gutter: 16, xs: 1, sm: 2 }}
          dataSource={items}
          renderItem={item => (
            <List.Item>
              <Card title={item.displayName}>
                <Paragraph type='secondary' style={{ fontSize: 12 }}>{item.edxCourseId}</Paragraph>
                {item.ownerName && (
                  <Text type='secondary'>
                    <FormattedMessage
                      id='student_class.teacher_label'
                      values={{ name: item.ownerName }}
                    />
                  </Text>
                )}
                <div style={{ marginTop: 12 }}>
                  <Button type='link' onClick={() => navigate(MY_PROJECTS_ROUTE)}>
                    <FormattedMessage id='student_class.my_projects' />
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

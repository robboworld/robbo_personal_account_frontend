import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Input, Button, Form, Switch, Spin, Col, Row, Space, message, Typography } from 'antd'
import { ArrowLeftOutlined, CloudDownloadOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from 'react-intl'

import { downloadProjectSb3 } from '@/api/projectPage'
import PageLayout from '@/components/PageLayout'
import config from '@/config'
import { MY_PROJECTS_ROUTE } from '@/constants'
import { useActions } from '@/helpers/useActions'
import { getProjectPageState } from '@/reducers/projectPage'
import {
    getProjectPageById,
    clearProjectPageState,
    updateProjectPage,
} from '@/actions'

const { TextArea } = Input
const { Text } = Typography

export default () => {
    const intl = useIntl()
    const [downloadBusy, setDownloadBusy] = useState(false)
    const navigate = useNavigate()
    const actions = useActions({
        getProjectPageById,
        clearProjectPageState,
        updateProjectPage,
    }, [])

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    }
    const [form] = Form.useForm()
    const { projectPageId } = useParams()
    const token = localStorage.getItem('token')

    useEffect(() => {
        actions.getProjectPageById(token, projectPageId)
        return () => {
            actions.clearProjectPageState()
        }
    }, [projectPageId, token])

    const { projectPage, loading } = useSelector(({ projectPage }) => getProjectPageState(projectPage))

    useEffect(() => {
        if (loading || !projectPage?.projectPageId) return
        form.setFieldsValue({
            title: projectPage.title,
            instruction: projectPage.instruction,
            notes: projectPage.notes,
            isShared: projectPage.isShared,
        })
    }, [
        loading,
        form,
        projectPage?.projectPageId,
        projectPage?.lastModified,
        projectPage?.title,
        projectPage?.instruction,
        projectPage?.notes,
        projectPage?.isShared,
    ])

    const seeInsideHandler = () => {
        window.open(config.scratchURL + `?#${projectPageId}`)
    }

    const handleDownloadSb3 = async () => {
        if (!token || !projectPageId)
            return
        setDownloadBusy(true)
        try {
            await downloadProjectSb3(token, projectPageId, projectPage?.title)
            message.success(intl.formatMessage({ id: 'project_page.download_sb3_success' }))
        } catch (e) {
            message.error(e?.message || intl.formatMessage({ id: 'project_page.download_sb3_error' }))
        } finally {
            setDownloadBusy(false)
        }
    }

    return (
        <PageLayout>
            <Row style={{ margin: '0.5rem 0 1rem' }}>
                <Col span={24}>
                    <Button
                        type='default'
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(MY_PROJECTS_ROUTE)}
                    >
                        <FormattedMessage id='project_page.back_to_projects' />
                    </Button>
                </Col>
            </Row>
            {loading ? <Spin />
                : (
                    <Row align='start' gutter={[16, 8]}>
                        <Col xs={24} lg={18}>
                            <Form
                                name='normal_project-page'
                                className='project-page-form'
                                labelWrap
                                {...layout}
                                form={form}
                                initialValues={{
                                    title: projectPage.title,
                                    instruction: projectPage.instruction,
                                    notes: projectPage.notes,
                                    isShared: projectPage.isShared,
                                }}
                                onFinish={({ title, instruction, notes, isShared }) => {
                                    actions.updateProjectPage(token, {
                                        projectPageId,
                                        projectId: projectPage.projectId,
                                        title,
                                        instruction,
                                        notes,
                                        isShared,
                                    })
                                }}
                            >
                                <Form.Item
                                    name='title'
                                    placeholder={projectPage.title}
                                    label={<FormattedMessage id='project_page.title' />}
                                >
                                    <Input size='large' />
                                </Form.Item>
                                <Form.Item
                                    name='instruction' placeholder={projectPage.title}
                                    label={<FormattedMessage id='project_page.instruction' />}
                                >
                                    <TextArea size='large' rows={4} />
                                </Form.Item>
                                <Form.Item
                                    name='notes' placeholder={projectPage.title}
                                    label={<FormattedMessage id='project_page.description' />}
                                >
                                    <TextArea size='large' rows={4} />
                                </Form.Item>
                                <Form.Item
                                    label={<FormattedMessage id='project_page.last_change' />}
                                >
                                    {projectPage.lastModified}
                                </Form.Item>
                                {
                                    projectPage.isShared
                                        ? (
                                            <Form.Item
                                                name='isShared'
                                                label={<FormattedMessage id='project_page.close_access' />}
                                                valuePropName='checked'
                                            >
                                                <Switch />
                                            </Form.Item>
                                        )
                                        : (
                                            <Form.Item
                                                name='isShared'
                                                label={<FormattedMessage id='project_page.open_access' />}
                                                valuePropName='checked'
                                            >
                                                <Switch />
                                            </Form.Item>
                                        )
                                }
                                <Form.Item label={<FormattedMessage id='project_page.actions_group' />}>
                                    <Space
                                        wrap
                                        size='middle'
                                        align='start'
                                    >
                                        <Button
                                            type='primary'
                                            htmlType='submit'
                                            className='login-form-button'
                                        >
                                            <FormattedMessage id='project_page.save' />
                                        </Button>
                                        <Button
                                            type='primary'
                                            onClick={seeInsideHandler}
                                        >
                                            <FormattedMessage id='project_page.open_in_scratch' />
                                        </Button>
                                        <Button
                                            type='default'
                                            htmlType='button'
                                            icon={<CloudDownloadOutlined />}
                                            loading={downloadBusy}
                                            onClick={handleDownloadSb3}
                                        >
                                            <FormattedMessage id='project_page.download_sb3' />
                                        </Button>
                                    </Space>
                                    <div style={{ marginTop: 8 }}>
                                        <Text type='secondary'>
                                            <FormattedMessage id='project_page.download_sb3_hint' />
                                        </Text>
                                    </div>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                )
            }
        </PageLayout >
    )
}
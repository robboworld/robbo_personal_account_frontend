import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button, List, Row, Col, Typography } from 'antd'
import { FormattedMessage } from 'react-intl'

import ProjectPageItem from './MyProjectsItem'

import PageLayout from '@/components/PageLayout'
import { getProjectPagesState } from '@/reducers/myProjects'
import { useActions } from '@/helpers/useActions'
import {
    getProjectPagesByAccessToken,
    clearMyProjectsState,
    createProjectPage,
} from '@/actions'

const { Title } = Typography

export default () => {
    const token = localStorage.getItem('token')

    const actions = useActions({
        getProjectPagesByAccessToken,
        clearMyProjectsState,
        createProjectPage,
    }, [])
    useEffect(() => {
        actions.getProjectPagesByAccessToken()
        return () => {
            actions.clearMyProjectsState()
        }
    }, [])

    const { projectPages, newProjectId, loading } = useSelector(({ myProjects }) => getProjectPagesState(myProjects))

    return (
        <PageLayout>

            <React.Fragment>
                <Row style={{ margin: '0.5rem' }}>
                    <Col span={24}>
                        <Title>
                            <FormattedMessage id='my_projects.title' />
                        </Title>
                    </Col>
                    <Col span={24}>
                        <Button
                            type='primary' onClick={() => actions.createProjectPage(token)}>
                            <FormattedMessage id='my_projects.create_new' />
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <List
                            bordered
                            loading={loading}
                            dataSource={projectPages}
                            renderItem={(projectPage, index) => (
                                <ProjectPageItem
                                    projectPage={projectPage}
                                    projectPageIndex={index}
                                    key={index}
                                />
                            )}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        </PageLayout >
    )
}
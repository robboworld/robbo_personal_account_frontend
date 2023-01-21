import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button, List, Row, Col } from 'antd'

import ProjectPageItem from './MyProjectsItem'

import PageLayout from '@/components/PageLayout'
import { getProjectPagesState } from '@/reducers/myProjects'
import Loader from '@/components/Loader'
import { useActions } from '@/helpers/useActions'
import {
    getProjectPagesByAccessToken,
    clearMyProjectsState,
    createProjectPage,
} from '@/actions'
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
                    <Col span={24}>Мои проекты</Col>
                    <Col span={24}>
                        <Button
                            type='primary' onClick={() => actions.createProjectPage(token)}>
                            Создать новый
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {
                            loading
                                ? <Loader />
                                : <List
                                    bordered
                                    dataSource={projectPages}
                                    renderItem={(projectPage, index) => (
                                        <ProjectPageItem
                                            projectPage={projectPage}
                                            projectPageIndex={index}
                                            key={index}
                                        />
                                    )}
                                />
                        }
                    </Col>
                </Row>
            </React.Fragment>
        </PageLayout >
    )
}
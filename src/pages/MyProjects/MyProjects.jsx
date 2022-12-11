import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { redirect } from 'react-router-dom'
import { Button, List, Row, Col } from 'antd'

import ProjectPageItem from './MyProjectsItem'

import PageLayout from '@/components/PageLayout'
import { getProjectPagesState } from '@/reducers/myProjects'
import Loader from '@/components/Loader'
import config from '@/config'
import { useActions } from '@/helpers/useActions'
import { HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, STUDENT } from '@/constants'
import { checkAccess, useUserIdentity } from '@/helpers'

export default () => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()
    const token = localStorage.getItem('token')

    const {
        getProjectPagesByAccessToken, clearMyProjectsState,
        createProjectPage,
    } = useActions()
    useEffect(() => {
        if (!loginLoading && checkAccess(userRole, [STUDENT]))
            getProjectPagesByAccessToken()
        return () => {
            clearMyProjectsState()
        }
    }, [loginLoading])

    const { projectPages, newProjectId, loading } = useSelector(({ myProjects }) => getProjectPagesState(myProjects))

    if (!loginLoading && !checkAccess(userRole, [STUDENT])) {
        return redirect(HOME_PAGE_ROUTE)
    } else if (!isAuth && !loginLoading) {
        return redirect(LOGIN_PAGE_ROUTE)
    }

    if (newProjectId) {
        window.location.replace(config.scratchURL + '?#' + newProjectId)
    }

    return (
        <PageLayout>
            {
                loginLoading ? <Loader />
                    : (
                        <React.Fragment>
                            <Row style={{ margin: '0.5rem' }}>
                                <Col span={24}>Мои проекты</Col>
                                <Col span={24}>
                                    <Button
                                        type='primary' onClick={() => createProjectPage(token)}>
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
                    )
            }
        </PageLayout >
    )
}
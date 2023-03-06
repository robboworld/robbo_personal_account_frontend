import React from 'react'
import { Button, List, Row, Col, Typography } from 'antd'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import PageLayout from '@/components/PageLayout'
import ListItem from '@/components/ListItem'

const { Title } = Typography

const MyProjects = ({
    intl,
    GetProjectPages,
    DeleteProjectPage,
    CreateProjectPage,
    pageSize,
    currentPage,
    onChangePage,
}) => {
    const navigate = useNavigate()
    const toProjectPageHandler = projectPage => {
        navigate(`/projects/${projectPage.projectPageId}`)
    }

    return (
        <PageLayout>
            <Row style={{ margin: '0.5rem' }}>
                <Col span={24}>
                    <Title>
                        <FormattedMessage id='my_projects.title' />
                    </Title>
                </Col>
                <Col span={24}>
                    <Button
                        type='primary' onClick={() => CreateProjectPage()}>
                        <FormattedMessage id='my_projects.create_new' />
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <List
                        className='projectsList'
                        loading={GetProjectPages?.loading}
                        bordered
                        size='large'
                        dataSource={GetProjectPages?.GetAllProjectPagesByAccessToken?.projectPages}
                        pagination={{
                            onChange: onChangePage,
                            total: GetProjectPages?.GetAllProjectPagesByAccessToken?.countRows,
                            current: +currentPage,
                            defaultCurrent: 1,
                            defaultPageSize: pageSize,
                            responsive: true,
                        }}
                        itemLayout='vertical'
                        renderItem={(projectPage, index) => (
                            <ListItem
                                itemIndex={index}
                                handleDelete={
                                    () => DeleteProjectPage({ variables: { projectID: projectPage.projectPageId } })
                                }
                                label={`${projectPage.title}`}
                                handleClick={() => toProjectPageHandler(projectPage)}
                                key={index}
                                render={() => { }}
                            />
                        )}
                    />
                </Col>
            </Row>
        </PageLayout >
    )
}

export default MyProjects
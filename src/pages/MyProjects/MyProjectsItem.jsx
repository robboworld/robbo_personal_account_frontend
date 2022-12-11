import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Space } from 'antd'

import { ProjectPageItem, ScratchLink, LastModified, RemoveProjectPage } from './components'

import config from '@/config'
import { useActions } from '@/helpers/useActions'
import Flex from '@/components/Flex'

export default ({ projectPageIndex, projectPage }) => {

    const { deleteProjectPage } = useActions()
    const history = useNavigate()
    const token = localStorage.getItem('token')

    const toProjectPageHandler = () => {
        history(`/projects/${projectPage.projectPageId}`)
    }

    const seeInsideHandler = () => {
        window.location.replace(config.scratchURL + `?#${projectPage.projectId}`)
    }

    return (
        <ProjectPageItem>
            <Space direction='vertical'>
                <ScratchLink onClick={toProjectPageHandler}> {projectPage.title}</ScratchLink>
                <LastModified>
                    {'Последние изменение: ' + projectPage.lastModified}
                </LastModified>
                <Button type='primary' onClick={seeInsideHandler}>
                    Перейти
                </Button>
            </Space>
            <Flex width='58%' justify='flex-end'
                align='center'>
                <RemoveProjectPage onClick={() => deleteProjectPage(token, projectPage.projectPageId, projectPageIndex)}>
                    удалить
                </RemoveProjectPage>
            </Flex>
        </ProjectPageItem>
    )
}
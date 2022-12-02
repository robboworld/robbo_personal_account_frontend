import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams, Redirect } from 'react-router-dom'
import { Input, Button, Form } from 'antd'

import { UnsharedMessage } from './components'

import PageLayout from '@/components/PageLayout'
import Flex from '@/components/Flex'
import config from '@/config'
import Loader from '@/components/Loader'
import { useActions } from '@/helpers/useActions'
import { checkAccess, useUserIdentity } from '@/helpers'
import { STUDENT, HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE } from '@/constants'
import { getProjectPagesState } from '@/reducers/myProjects'

const { TextArea } = Input

export default () => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()

    const {
        getProjectPageById,
        clearProjectPageState,
        updateProjectPage,
    } = useActions()

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
        if (!loginLoading && checkAccess(userRole, [STUDENT]))
            getProjectPageById(token, projectPageId)
        return () => {
            clearProjectPageState()
        }
    }, [loginLoading])

    const { projectPage, loading } = useSelector(({ projectPage }) => getProjectPagesState(projectPage))

    const seeInsideHandler = () => {
        window.location.replace(config.scratchURL + `?#${projectPageId}`)
    }

    if (!loginLoading && !checkAccess(userRole, [STUDENT])) {
        return <Redirect to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Redirect to={LOGIN_PAGE_ROUTE} />
    }

    return (
        <PageLayout>
            {loginLoading
                ? <Loader />
                : (
                    <Flex direction='column' align='flex-start'
                        width='100%' height='100%'
                        padding='2rem'>
                        {
                            !projectPage.isShared &&
                            <UnsharedMessage>
                                <Flex align='center' width='100%'
                                    height='100%' justify='space-between' >
                                    <span>Данный проект не открыт для общего доступа</span>
                                    <Button>Открыть</Button>
                                </Flex>
                            </UnsharedMessage>
                        }
                        {
                            loading
                                ? <Loader />
                                : (
                                    <React.Fragment>
                                        <Form
                                            name='normal_projectPage'
                                            className='projectPage-form'
                                            {...layout}
                                            form={form}
                                            initialValues={{
                                                title: projectPage.title,
                                                instruction: projectPage.instruction,
                                                notes: projectPage.notes,
                                            }}
                                            onFinish={({ title, instruction, notes }) => {
                                                updateProjectPage(token, { ...projectPage, title, instruction, notes })
                                            }}
                                        >
                                            <Form.Item
                                                name='title' placeholder={projectPage.title}
                                                label='Название'
                                            >
                                                <Input size='large' />
                                            </Form.Item>
                                            <Form.Item
                                                name='instruction' placeholder={projectPage.title}
                                                label='Инструкция'
                                            >
                                                <TextArea size='large' rows={4} />
                                            </Form.Item>
                                            <Form.Item
                                                name='notes' placeholder={projectPage.title}
                                                label='Примечание'
                                            >
                                                <TextArea size='large' rows={4} />
                                            </Form.Item>
                                            <Form.Item >
                                                <Button
                                                    type='primary' htmlType='submit'
                                                    className='login-form-button'
                                                >
                                                    Сохранить
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                        <Button
                                            type='primary' onClick={seeInsideHandler}
                                        >
                                            Открыть в Robbo Scratch
                                        </Button>
                                    </React.Fragment>
                                )
                        }
                    </Flex>
                )
            }
        </PageLayout>
    )
}
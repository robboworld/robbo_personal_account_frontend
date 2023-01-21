import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Input, Button, Form } from 'antd'

import { UnsharedMessage } from './components'

import PageLayout from '@/components/PageLayout'
import Flex from '@/components/Flex'
import config from '@/config'
import Loader from '@/components/Loader'
import { useActions } from '@/helpers/useActions'
import { getProjectPageState } from '@/reducers/projectPage'
import {
    getProjectPageById,
    clearProjectPageState,
    updateProjectPage,
} from '@/actions'
const { TextArea } = Input

export default () => {
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
    }, [])

    const { projectPage, loading } = useSelector(({ projectPage }) => getProjectPageState(projectPage))

    const seeInsideHandler = () => {
        window.location.replace(config.scratchURL + `?#${projectPageId}`)
    }

    return (
        <PageLayout>
            {loading
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
                                actions.updateProjectPage(token, { ...projectPage, title, instruction, notes })
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
                    </Flex>
                )
            }
        </PageLayout>
    )
}
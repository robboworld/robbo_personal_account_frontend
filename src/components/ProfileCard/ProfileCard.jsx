import React from 'react'
import { PropTypes } from 'prop-types'
import { Button, Select, Form, Input } from 'antd'

import Flex from '@/components/Flex'
import { userRole } from '@/constants'

const ProfileCard = ({
    updateHandle,
    profile,
}) => {
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    }
    const [form] = Form.useForm()
    const token = localStorage.getItem('token')
    return (
        <Flex margin='0.5rem' width='100%'>
            <Form
                name='normal_profile'
                className='profile-form'
                onFinish={({ email, nickname, middlename, firstname, lastname }) => {
                    updateHandle(token, {
                        id: profile.id,
                        email,
                        middlename,
                        firstname,
                        lastname,
                        nickname,
                        password: profile.password,
                        createdAt: profile.createdAt,
                        role: profile.role,
                    })
                }}
                {...layout}
                form={form}
                initialValues={{
                    email: profile.email,
                    nickname: profile.nickname,
                    firstname: profile.firstname,
                    lastname: profile.lastname,
                    middlename: profile.middlename,
                }}
            >
                <Form.Item
                    name='email' label='Email'
                >
                    <Input placeholder={profile.email} size='large' />
                </Form.Item>
                <Form.Item
                    name='nickname' label='Nickname'
                >
                    <Input placeholder={profile.nickname} size='large' />
                </Form.Item>
                <Form.Item
                    name='firstname' label='Имя'
                >
                    <Input
                        placeholder={profile.firstname} size='large' />
                </Form.Item>
                <Form.Item
                    name='lastname' label='Фамилия'
                >
                    <Input placeholder={profile.lastname} size='large' />
                </Form.Item>
                <Form.Item
                    name='middlename' label='Отчество'
                >
                    <Input placeholder={profile.middlename} size='large' />
                </Form.Item>
                <Form.Item label='Роль'>
                    {
                        userRole[profile.role]
                    }
                </Form.Item>
                <Form.Item label='Создан'>
                    {
                        profile.createdAt
                    }
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
        </Flex >
    )
}

ProfileCard.propTypes = {
    profile: PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
        nickname: PropTypes.string,
        lastname: PropTypes.string,
        firstname: PropTypes.string,
        middlename: PropTypes.string,
        role: PropTypes.number,
        createdAt: PropTypes.string,
    }),
    updateHandle: PropTypes.func,
}

export default ProfileCard
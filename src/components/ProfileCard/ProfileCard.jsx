import React from 'react'
import { PropTypes } from 'prop-types'
import { Button, Form, Input } from 'antd'
import { FormattedMessage } from 'react-intl'

import { userRole } from '@/constants'

const ProfileCard = ({
    updateHandle,
    profile,
    accessUpdate,
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
    const isFormDisable = accessUpdate

    return (
        <Form
            name='normal_profile'
            className='profile-form'
            onFinish={({ email, nickname, middlename, firstname, lastname }) => {
                updateHandle(
                    {
                        variables: {
                            input: {
                                id: profile.id,
                                email,
                                middlename,
                                firstname,
                                lastname,
                                nickname,
                            },
                        },
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
            disabled={isFormDisable}
        >
            <Form.Item
                name='email' label={<FormattedMessage id='profile_card.email' />}
            >
                <Input placeholder={profile.email} size='large' />
            </Form.Item>
            <Form.Item
                name='nickname' label={<FormattedMessage id='profile_card.nickname' />}
            >
                <Input placeholder={profile.nickname} size='large' />
            </Form.Item>
            <Form.Item
                name='firstname' label={<FormattedMessage id='profile_card.firstname' />}
            >
                <Input placeholder={profile.firstname} size='large' />
            </Form.Item>
            <Form.Item
                name='lastname' label={<FormattedMessage id='profile_card.lastname' />}
            >
                <Input placeholder={profile.lastname} size='large' />
            </Form.Item>
            <Form.Item
                name='middlename' label={<FormattedMessage id='profile_card.middlename' />}
            >
                <Input placeholder={profile.middlename} size='large' />
            </Form.Item>
            <Form.Item label={<FormattedMessage id='profile_card.role' />}>
                {
                    userRole[profile.role]
                }
            </Form.Item>
            <Form.Item label={<FormattedMessage id='profile_card.created_at' />}>
                {
                    profile.createdAt
                }
            </Form.Item>
            {
                !isFormDisable &&
                <Form.Item >
                    <Button
                        type='primary' htmlType='submit'
                        className='login-form-button'
                    >
                        <FormattedMessage id='profile_card.save_button' />
                    </Button>
                </Form.Item>
            }
        </Form>
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
    accessUpdate: PropTypes.bool,
}

export default ProfileCard
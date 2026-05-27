import React, { useEffect } from 'react'
import { PropTypes } from 'prop-types'
import { Button, Empty, Form, Input } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import { userRole } from '@/constants'

const normalizeProfileField = value => (value ?? '').trim()

const profileFieldsUnchanged = (profile, { email, firstname, lastname }) => (
    normalizeProfileField(email) === normalizeProfileField(profile.email) &&
    normalizeProfileField(firstname) === normalizeProfileField(profile.firstname) &&
    normalizeProfileField(lastname) === normalizeProfileField(profile.lastname)
)

const formatProfileDateTime = (value, locale) => {
    if (!value) {
        return '—'
    }
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return value
    }
    return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date)
}

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
    const intl = useIntl()
    const [form] = Form.useForm()
    const isFormDisable = accessUpdate

    useEffect(() => {
        if (!profile) {
            return
        }
        form.setFieldsValue({
            email: profile.email,
            firstname: profile.firstname,
            lastname: profile.lastname,
        })
    }, [profile, form])

    if (!profile) {
        return (
            <Empty
                description={<FormattedMessage id='profile_card.not_loaded' defaultMessage='Профиль недоступен или ещё загружается' />}
            />
        )
    }

    return (
        <Form
            name='normal_profile'
            className='profile-form'
            onFinish={({ email, firstname, lastname }) => {
                if (profileFieldsUnchanged(profile, { email, firstname, lastname })) {
                    return
                }
                updateHandle(
                    {
                        variables: {
                            input: {
                                id: profile.id,
                                email,
                                firstname,
                                lastname,
                                nickname: profile.nickname,
                                middlename: '',
                            },
                        },
                    })
            }}
            {...layout}
            form={form}
            initialValues={{
                email: profile.email,
                firstname: profile.firstname,
                lastname: profile.lastname,
            }}
            disabled={isFormDisable}
        >
            <Form.Item
                name='email' label={<FormattedMessage id='profile_card.email' />}
            >
                <Input placeholder={profile.email} size='large' />
            </Form.Item>
            <Form.Item label={<FormattedMessage id='profile_card.username' defaultMessage='Логин' />}>
                {profile.nickname || '—'}
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
            <Form.Item label={<FormattedMessage id='profile_card.role' />}>
                {
                    userRole[profile.role]
                }
            </Form.Item>
            <Form.Item label={<FormattedMessage id='profile_card.created_at' />}>
                {formatProfileDateTime(profile.createdAt, intl.locale)}
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
        role: PropTypes.number,
        createdAt: PropTypes.string,
    }),
    updateHandle: PropTypes.func,
    accessUpdate: PropTypes.bool,
}

export default ProfileCard

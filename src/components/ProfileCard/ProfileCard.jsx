import React, { useEffect } from 'react'
import { PropTypes } from 'prop-types'
import { Button, Empty, Form, Input, Select } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import {
    COUNTRY_OPTIONS,
    EDUCATION_LEVEL_OPTIONS,
    GENDER_OPTIONS,
    SPOKEN_LANGUAGE_OPTIONS,
    YEAR_OF_BIRTH_OPTIONS,
} from '@/constants/lmsProfileOptions'

const normalizeProfileField = value => (value ?? '').trim()

const normalizeSelectValue = value => {
    if (value === undefined || value === null || value === '') {
        return ''
    }
    return String(value)
}

const normalizeYearValue = value => {
    if (value === undefined || value === null || value === '') {
        return null
    }
    const year = Number(value)
    return Number.isNaN(year) ? null : year
}

const profileFieldsUnchanged = (profile, formValues) => (
    normalizeProfileField(formValues.email) === normalizeProfileField(profile.email) &&
    normalizeProfileField(formValues.fullName) === normalizeProfileField(profile.fullName) &&
    normalizeSelectValue(formValues.levelOfEducation) === normalizeSelectValue(profile.levelOfEducation) &&
    normalizeSelectValue(formValues.country) === normalizeSelectValue(profile.country) &&
    normalizeYearValue(formValues.yearOfBirth) === normalizeYearValue(profile.yearOfBirth) &&
    normalizeSelectValue(formValues.gender) === normalizeSelectValue(profile.gender) &&
    normalizeSelectValue(formValues.language) === normalizeSelectValue(profile.language)
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

const profileToFormValues = profile => ({
    email: profile.email,
    fullName: profile.fullName,
    levelOfEducation: profile.levelOfEducation || undefined,
    country: profile.country || undefined,
    yearOfBirth: profile.yearOfBirth ?? undefined,
    gender: profile.gender || undefined,
    language: profile.language || undefined,
})

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
        form.setFieldsValue(profileToFormValues(profile))
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
            onFinish={formValues => {
                if (profileFieldsUnchanged(profile, formValues)) {
                    return
                }
                const yearOfBirth = normalizeYearValue(formValues.yearOfBirth)
                updateHandle(
                    {
                        variables: {
                            input: {
                                id: profile.id,
                                email: formValues.email,
                                fullName: formValues.fullName,
                                nickname: profile.nickname,
                                firstname: '',
                                lastname: '',
                                middlename: '',
                                levelOfEducation: formValues.levelOfEducation || null,
                                country: formValues.country || null,
                                yearOfBirth,
                                gender: formValues.gender || null,
                                language: formValues.language || '',
                            },
                        },
                    })
            }}
            {...layout}
            form={form}
            initialValues={profileToFormValues(profile)}
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
                name='fullName'
                label={<FormattedMessage id='profile_card.full_name' defaultMessage='Полное имя' />}
            >
                <Input placeholder={profile.fullName || '—'} size='large' />
            </Form.Item>
            <Form.Item
                name='levelOfEducation'
                label={<FormattedMessage id='profile_card.level_of_education' defaultMessage='Образование' />}
            >
                <Select
                    size='large'
                    allowClear
                    showSearch
                    optionFilterProp='label'
                    options={EDUCATION_LEVEL_OPTIONS.filter(o => o.value !== '')}
                    placeholder={intl.formatMessage({ id: 'profile_card.level_of_education_placeholder', defaultMessage: 'Выбрать уровень образования' })}
                />
            </Form.Item>
            <Form.Item
                name='country'
                label={<FormattedMessage id='profile_card.country' defaultMessage='Страна' />}
            >
                <Select
                    size='large'
                    allowClear
                    showSearch
                    optionFilterProp='label'
                    options={COUNTRY_OPTIONS.filter(o => o.value !== '')}
                    placeholder={intl.formatMessage({ id: 'profile_card.country_placeholder', defaultMessage: 'Выбрать страну' })}
                />
            </Form.Item>
            <Form.Item
                name='yearOfBirth'
                label={<FormattedMessage id='profile_card.year_of_birth' defaultMessage='Год рождения' />}
            >
                <Select
                    size='large'
                    allowClear
                    showSearch
                    optionFilterProp='label'
                    options={YEAR_OF_BIRTH_OPTIONS.filter(o => o.value !== '')}
                    placeholder={intl.formatMessage({ id: 'profile_card.year_of_birth_placeholder', defaultMessage: 'Выбрать год рождения' })}
                />
            </Form.Item>
            <Form.Item
                name='gender'
                label={<FormattedMessage id='profile_card.gender' defaultMessage='Пол' />}
            >
                <Select
                    size='large'
                    allowClear
                    showSearch
                    optionFilterProp='label'
                    options={GENDER_OPTIONS.filter(o => o.value !== '')}
                    placeholder={intl.formatMessage({ id: 'profile_card.gender_placeholder', defaultMessage: 'Выбрать пол' })}
                />
            </Form.Item>
            <Form.Item
                name='language'
                label={<FormattedMessage id='profile_card.language' defaultMessage='Разговорный язык' />}
            >
                <Select
                    size='large'
                    allowClear
                    showSearch
                    optionFilterProp='label'
                    options={SPOKEN_LANGUAGE_OPTIONS.filter(o => o.value !== '')}
                    placeholder={intl.formatMessage({ id: 'profile_card.language_placeholder', defaultMessage: 'Выбрать язык' })}
                />
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
        fullName: PropTypes.string,
        levelOfEducation: PropTypes.string,
        country: PropTypes.string,
        yearOfBirth: PropTypes.number,
        gender: PropTypes.string,
        language: PropTypes.string,
        createdAt: PropTypes.string,
    }),
    updateHandle: PropTypes.func,
    accessUpdate: PropTypes.bool,
}

export default ProfileCard

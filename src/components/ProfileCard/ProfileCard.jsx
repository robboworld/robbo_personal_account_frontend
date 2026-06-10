import React, { useEffect, useMemo } from 'react'
import { PropTypes } from 'prop-types'
import { Button, Empty, Form, Input, Select } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import {
  FormActions,
  FormGrid,
  FormSection,
  FormSectionLegend,
} from '@/components/AccountShell'
import { getLmsProfileOptions } from '@/helpers/lmsProfileOptions'

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

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
  layout: 'vertical',
}

const ProfileCard = ({
  updateHandle,
  profile,
  accessUpdate,
}) => {
  const intl = useIntl()
  const [form] = Form.useForm()
  const isFormDisable = accessUpdate
  const {
    countryOptions,
    yearOfBirthOptions,
    genderOptions,
    spokenLanguageOptions,
    educationLevelOptions,
  } = useMemo(() => getLmsProfileOptions(intl), [intl])

  useEffect(() => {
    if (!profile) {
      return
    }
    form.setFieldsValue(profileToFormValues(profile))
  }, [profile, form])

  if (!profile) {
    return (
      <Empty
        description={<FormattedMessage id='profile.loading' />}
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
      {...formLayout}
      form={form}
      initialValues={profileToFormValues(profile)}
      disabled={isFormDisable}
      requiredMark={false}
    >
      <FormSection>
        <FormSectionLegend>
          <FormattedMessage id='profile.section.account' />
        </FormSectionLegend>
        <FormGrid>
          <Form.Item
            name='email'
            label={<FormattedMessage id='profile_card.email' />}
          >
            <Input placeholder={profile.email} size='large' />
          </Form.Item>
          <Form.Item label={<FormattedMessage id='profile_card.username' />}>
            <Input value={profile.nickname || '—'} disabled
size='large' />
          </Form.Item>
          <Form.Item
            className='profile-form-span-full'
            name='fullName'
            label={<FormattedMessage id='profile_card.full_name' />}
          >
            <Input placeholder={profile.fullName || '—'} size='large' />
          </Form.Item>
        </FormGrid>
      </FormSection>

      <FormSection>
        <FormSectionLegend>
          <FormattedMessage id='profile.section.personal' />
        </FormSectionLegend>
        <FormGrid>
          <Form.Item
            name='country'
            label={<FormattedMessage id='profile_card.country' />}
          >
            <Select
              size='large'
              allowClear
              showSearch
              optionFilterProp='label'
              options={countryOptions.filter(o => o.value !== '')}
              placeholder={intl.formatMessage({ id: 'profile_card.country_placeholder' })}
            />
          </Form.Item>
          <Form.Item
            name='yearOfBirth'
            label={<FormattedMessage id='profile_card.year_of_birth' />}
          >
            <Select
              size='large'
              allowClear
              showSearch
              optionFilterProp='label'
              options={yearOfBirthOptions.filter(o => o.value !== '')}
              placeholder={intl.formatMessage({ id: 'profile_card.year_of_birth_placeholder' })}
            />
          </Form.Item>
          <Form.Item
            name='gender'
            label={<FormattedMessage id='profile_card.gender' />}
          >
            <Select
              size='large'
              allowClear
              showSearch
              optionFilterProp='label'
              options={genderOptions.filter(o => o.value !== '')}
              placeholder={intl.formatMessage({ id: 'profile_card.gender_placeholder' })}
            />
          </Form.Item>
          <Form.Item
            name='language'
            label={<FormattedMessage id='profile_card.language' />}
          >
            <Select
              size='large'
              allowClear
              showSearch
              optionFilterProp='label'
              options={spokenLanguageOptions.filter(o => o.value !== '')}
              placeholder={intl.formatMessage({ id: 'profile_card.language_placeholder' })}
            />
          </Form.Item>
        </FormGrid>
      </FormSection>

      <FormSection>
        <FormSectionLegend>
          <FormattedMessage id='profile.section.education' />
        </FormSectionLegend>
        <FormGrid>
          <Form.Item
            className='profile-form-span-full'
            name='levelOfEducation'
            label={<FormattedMessage id='profile_card.level_of_education' />}
          >
            <Select
              size='large'
              allowClear
              showSearch
              optionFilterProp='label'
              options={educationLevelOptions.filter(o => o.value !== '')}
              placeholder={intl.formatMessage({ id: 'profile_card.level_of_education_placeholder' })}
            />
          </Form.Item>
          <Form.Item
            className='profile-form-span-full'
            label={<FormattedMessage id='profile_card.created_at' />}
          >
            <Input
              value={formatProfileDateTime(profile.createdAt, intl.locale)}
              disabled
              size='large'
            />
          </Form.Item>
        </FormGrid>
      </FormSection>

      {!isFormDisable && (
        <FormActions>
          <Button type='primary' htmlType='submit'
className='login-form-button'>
            <FormattedMessage id='profile_card.save_button' />
          </Button>
        </FormActions>
      )}
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

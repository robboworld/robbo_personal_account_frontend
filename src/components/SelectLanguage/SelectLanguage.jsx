import React from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Col, Row, Select, Typography } from 'antd'

import { useActions } from '@/helpers'
import { changeLanguage } from '@/actions'
import { getAppState } from '@/reducers/app'

const { Title } = Typography

const SelectLanguage = () => {
    const actions = useActions({ changeLanguage }, [])
    const { language, locale } = useSelector(({ app }) => getAppState(app))
    const languages = [
        { value: 'ru', label: 'Русский' },
        { value: 'en', label: 'English' },
        { value: 'zh', label: '中文' },
    ]

    return (
        <Row align='middle'>
            <Col span={3}>
                <Title level={5}>
                    <FormattedMessage id='header.select_language' />
                </Title>
            </Col>
            <Col span={2}>
                <Select
                    style={{ width: 120 }}
                    defaultValue='ru'
                    value={language}
                    options={languages}
                    onChange={value => actions.changeLanguage(value)}
                />
            </Col>

        </Row>

    )
}

export default SelectLanguage
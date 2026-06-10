import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Col, Row, Select, Typography } from 'antd'

import { useActions } from '@/helpers'
import { changeLanguage } from '@/actions'
import { getAppState } from '@/reducers/app'

const { Title } = Typography

const SelectLanguage = () => {
    const intl = useIntl()
    const actions = useActions({ changeLanguage }, [])
    const { language } = useSelector(({ app }) => getAppState(app))
    const languages = useMemo(() => ([
        { value: 'ru', label: intl.formatMessage({ id: 'header.lang_ru' }) },
        { value: 'en', label: intl.formatMessage({ id: 'header.lang_en' }) },
        { value: 'zh', label: intl.formatMessage({ id: 'header.lang_zh' }) },
    ]), [intl])

    return (
        <Row align='middle' wrap={false}
style={{ width: 'auto', maxWidth: '100%' }}>
            <Col flex='none' style={{ marginRight: 8 }}>
                <Title level={5} style={{ margin: 0, color: '#fff', whiteSpace: 'nowrap' }}>
                    <FormattedMessage id='header.select_language' />
                </Title>
            </Col>
            <Col flex='none'>
                <Select
                    style={{ width: 120 }}
                    value={language}
                    options={languages}
                    onChange={value => actions.changeLanguage(value)}
                />
            </Col>
        </Row>
    )
}

export default SelectLanguage

import React from 'react'
import { Col, Row, Select, Typography } from 'antd'

const { Title } = Typography

const SelectLanguage = () => {
    const languages = [
        { value: 'ru', label: 'Русский' },
        { value: 'en', label: 'English' },
    ]
    return (
        <Row align='middle'>
            <Col span={2}>
                <Title level={5}>Язык</Title>
            </Col>
            <Col span={2}>
                <Select
                    style={{ width: 120 }}
                    defaultValue='ru'
                    options={languages}
                />
            </Col>

        </Row>

    )
}

export default SelectLanguage
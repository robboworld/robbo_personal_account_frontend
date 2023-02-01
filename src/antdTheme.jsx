import React from 'react'
import { ConfigProvider } from 'antd'
import { useSelector } from 'react-redux'
import { IntlProvider } from 'react-intl'
import enUS from 'antd/locale/en_US'
import ruRU from 'antd/locale/ru_RU'

import RuMessages from '@/lang/ru.json'
import EngMessages from '@/lang/en.json'


import { getAppState } from '@/reducers/app'

const defaultData = {
    borderRadius: 6,
    colorPrimary: '#00af41',
}

const AppConfigProvider = ({ children }) => {
    const { language, locale } = useSelector(({ app }) => getAppState(app))
    let configLocale, intlMessages
    switch (language) {
        case 'ru':
            configLocale = ruRU
            intlMessages = RuMessages
            break
        case 'en':
            configLocale = enUS
            intlMessages = EngMessages
            break
    }
    return (
        <IntlProvider
            defaultLocale='ru'
            messages={intlMessages}
        >
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: defaultData.colorPrimary,
                        borderRadius: defaultData.borderRadius,
                    },
                }}
                locale={configLocale}
            >
                {children}
            </ConfigProvider>
        </IntlProvider>
    )
}

export default AppConfigProvider
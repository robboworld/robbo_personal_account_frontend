import React from 'react'
import { ConfigProvider } from 'antd'
import { useSelector } from 'react-redux'
import { IntlProvider } from 'react-intl'
import enUS from 'antd/locale/en_US'
import ruRU from 'antd/locale/ru_RU'
import zhCN from 'antd/locale/zh_CN'

import RuMessages from '@/lang/ru.json'
import EngMessages from '@/lang/en.json'
import ZhMessages from '@/lang/zh.json'
import { getAppState } from '@/reducers/app'
import theme from '@/theme'

const defaultData = {
    borderRadius: 6,
    colorPrimary: theme.colors.accentGreen,
}

const AppConfigProvider = ({ children }) => {
    const { language } = useSelector(({ app }) => getAppState(app))
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
        case 'zh':
            configLocale = zhCN
            intlMessages = ZhMessages
    }
    return (
        <IntlProvider
            key={language}
            locale={language}
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
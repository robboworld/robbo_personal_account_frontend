import React from 'react'
import { ConfigProvider, message, notification } from 'antd'
import { useSelector } from 'react-redux'
import { IntlProvider } from 'react-intl'
import enUS from 'antd/locale/en_US'
import ruRU from 'antd/locale/ru_RU'

import RuMessages from '@/lang/ru.json'
import EngMessages from '@/lang/en.json'
import { getAppState } from '@/reducers/app'
import theme from '@/theme'

// Cap toast stacks so rapid clicks (e.g. avatar pick) don't pile up.
message.config({ maxCount: 3 })
notification.config({ maxCount: 3 })

const defaultData = {
    borderRadius: 6,
    colorPrimary: theme.colors.accentGreen,
}

const AppConfigProvider = ({ children }) => {
    const { language } = useSelector(({ app }) => getAppState(app))
    const english = language === 'en'
    const configLocale = english ? enUS : ruRU
    const intlMessages = english ? EngMessages : RuMessages
    return (
        <IntlProvider
            key={language}
            locale={english ? 'en' : 'ru'}
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

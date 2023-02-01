import React from 'react'
import { ConfigProvider } from 'antd'

const defaultData = {
    borderRadius: 6,
    colorPrimary: '#00af41',
}

const AntdConfigProvider = ({ children, locale }) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: defaultData.colorPrimary,
                    borderRadius: defaultData.borderRadius,
                },
            }}
            locale={locale}
        >
            {children}
        </ConfigProvider>
    )
}

export default AntdConfigProvider
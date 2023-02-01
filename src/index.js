import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
// import 'antd/dist/antd.css'

import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import enUS from 'antd/locale/en_US'
import ruRU from 'antd/locale/ru_RU'

import RuMessages from './lang/ru.json'
import EngMessages from './lang/en.json'

import ErrorBoundary from '@/pages/ErrorBoundary'
import Application from '@/app'
import { store } from '@/store'
import theme from '@/theme'
import AntdConfigProvider from '@/antdTheme'
import GlobalStyles from '@/globalStyles'
import { graphQLClient } from '@/graphQL'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <ApolloProvider client={graphQLClient}>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <IntlProvider
          defaultLocale='rus'
          messages={RuMessages}
        >
          <AntdConfigProvider locale={ruRU}>
            <BrowserRouter>
              <ErrorBoundary>
                <Application />
              </ErrorBoundary>
              <GlobalStyles />
            </BrowserRouter>
          </AntdConfigProvider>
        </IntlProvider>
      </ThemeProvider>
    </Provider>
  </ApolloProvider>,
)
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import ConfigProvider from './antdTheme'

import ErrorBoundary from '@/pages/ErrorBoundary'
import Application from '@/app'
import { store } from '@/store'
import GlobalStyles from '@/globalStyles'
import { graphQLClient } from '@/graphQL'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <ApolloProvider client={graphQLClient}>
    <Provider store={store}>
      <ConfigProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Application />
          </ErrorBoundary>
          <GlobalStyles />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </ApolloProvider>,
)
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import 'antd/dist/antd.css'

import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'

import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import ErrorBoundary from '@/pages/ErrorBoundary'
import Application from '@/app'
import { store } from '@/store'
import theme from '@/theme'
import GlobalStyles from '@/globalStyles'
import { graphQLClient } from '@/graphQL'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  // <StrictMode>
  <ApolloProvider client={graphQLClient}>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ErrorBoundary>
            <Application />
          </ErrorBoundary>
          <GlobalStyles />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </ApolloProvider>
  // </StrictMode>
  ,
)
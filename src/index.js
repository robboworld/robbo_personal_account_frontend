import React from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { StyleSheetManager } from 'styled-components'

import ConfigProvider from './antdTheme'

import ErrorBoundary from '@/pages/ErrorBoundary'
import Application from '@/app'
import { store } from '@/store'
import GlobalStyles from '@/globalStyles'
import { graphQLClient } from '@/graphQL'

const container = document.getElementById('root')
const root = createRoot(container)

// styled-components 6 stopped adding vendor prefixes; keep them for older Safari
// (-webkit-user-select, -webkit-backdrop-filter, -webkit-mask).
root.render(
  <StyleSheetManager enableVendorPrefixes>
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
    </ApolloProvider>
  </StyleSheetManager>,
)

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import React from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { ToastContainer } from 'react-toastify'
import { injectStyle } from 'react-toastify/dist/inject-style'

import ErrorBoundary from '@/pages/ErrorBoundary'
import Application from '@/App'
import { store } from '@/store'
import theme from '@/theme'
import GlobalStyles from '@/globalStyles'


if (typeof window !== 'undefined') {
  injectStyle()
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ErrorBoundary>
          <Application />
        </ErrorBoundary>
        <GlobalStyles />
      </BrowserRouter>
    </ThemeProvider>
    <ToastContainer
      position='bottom-right'
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </Provider>,
)

// ReactDOM.render(
//   <Provider store={store}>
//     <ThemeProvider theme={theme}>
//       <BrowserRouter>
//         <ErrorBoundary>
//           <Application />
//         </ErrorBoundary>
//         <GlobalStyles />
//       </BrowserRouter>
//     </ThemeProvider>
//     <ToastContainer
//       position='bottom-right'
//       autoClose={5000}
//       hideProgressBar={false}
//       newestOnTop={false}
//       closeOnClick
//       rtl={false}
//       pauseOnFocusLoss
//       draggable
//       pauseOnHover
//     />
//   </Provider>,
//   document.getElementById('root'),
// )

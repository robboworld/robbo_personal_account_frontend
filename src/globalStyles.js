import { createGlobalStyle } from 'styled-components'

import theme from './theme'
import robboGuestTokens from './theme/robboGuestTokens'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: ${theme.font};
  }

  html,
  body {
    width: 100%;
    min-height: 100dvh;
  }

  body {
    background: ${robboGuestTokens.lkPageBg};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    & > #root {
      width: 100%;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
    }
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    background: ${robboGuestTokens.lkPageBg};
    box-sizing: border-box;
  }
`

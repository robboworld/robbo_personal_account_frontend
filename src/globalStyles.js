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
    max-width: 100%;
    min-height: 100dvh;
    overflow-x: clip;
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

  /* Mobile nav drawer: kill Ant default body padding / inset */
  .lk-mobile-nav-drawer .ant-drawer-body {
    padding: 0 !important;
    margin: 0 !important;
  }

  .lk-mobile-nav-drawer .ant-drawer-content {
    padding: 0 !important;
  }
`

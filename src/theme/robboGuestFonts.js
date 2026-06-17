import { createGlobalStyle } from 'styled-components'

/** Proxima Nova — как в robbo-theme LMS. */
const RobboGuestFonts = createGlobalStyle`
  @font-face {
    font-family: 'ProximaNova';
    src: url('/static/fonts/ProximaNova-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'ProximaNova';
    src: url('/static/fonts/ProximaNova-Bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
`

export default RobboGuestFonts

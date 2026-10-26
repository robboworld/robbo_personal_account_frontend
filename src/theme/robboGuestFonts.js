import { createGlobalStyle } from 'styled-components'

/**
 * Proxima Nova — как в robbo-theme LMS: Regular (400) и Extrabold для 700/800.
 * Файлы — копии из robbo-theme/lms/static/fonts (коммерческая лицензия ROBBO).
 */
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
    src: url('/static/fonts/ProximaNova-Extrabold.woff') format('woff');
    font-weight: 700 800;
    font-style: normal;
    font-display: swap;
  }
`

export default RobboGuestFonts

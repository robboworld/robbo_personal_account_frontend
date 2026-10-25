import { css } from 'styled-components'

import robboGuestTokens from './theme/robboGuestTokens'

const font = 'sans-serif'

// Color palette: one source with the landing (robboGuestTokens). The old purple
// primary/secondary leaked into the loader, bell and catalog of a green product.
const black = '#000000'
const white = '#ffffff'
const error = '#c86464'
const primary = robboGuestTokens.green
const secondary = robboGuestTokens.coal
const secondaryLight = robboGuestTokens.bodyMuted

/** Акцентный зелёный (ЛК, редактор) */
const accentGreen = robboGuestTokens.green
const accentGreenDark = robboGuestTokens.greenDark
const accentGreenHover = '#009036'
/** Светлый зелёный для контраста на тёмном фоне (Ant dark / лэндинг night) */
const accentGreenOnDark = '#4ade80'

const boxShadows = [
  'box-shadow: 0px 4px 24px -8px rgba(0,0,0,0.75)',
]

const size = {
  xs: 550,
  small: 768,
  med: 992,
  large: 1200,
}

const above = Object.keys(size).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (min-width: ${size[label]}px) {
      ${css(...args)}
    }
  `
  return acc
}, {})

const below = Object.keys(size).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${size[label]}px) {
      ${css(...args)}
    }
  `
  return acc
}, {})

export default {
  above,
  below,
  boxShadows,
  font,
  spaces: [0, 4, 8, 16, 32, 64, 128],
  fontSizes: [12, 14, 16, 20, 24, 32, 40, 56, 72, 80],
  colors: {
    primary,
    secondary,
    secondaryLight,
    black,
    white,
    error,
    accentGreen,
    accentGreenDark,
    accentGreenHover,
    accentGreenOnDark,
  },
}

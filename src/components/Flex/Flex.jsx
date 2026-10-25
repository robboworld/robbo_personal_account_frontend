import React from 'react'

import { Flex } from './components'

// Layout props go to styled-components as transient ($) props so they never reach the DOM.
export default ({ direction, align, justify, margin, padding, width, height, ...rest }) => {
  return (
    <Flex
      $direction={direction}
      $align={align}
      $justify={justify}
      $margin={margin}
      $padding={padding}
      $width={width}
      $height={height}
      {...rest}
    />
  )
}

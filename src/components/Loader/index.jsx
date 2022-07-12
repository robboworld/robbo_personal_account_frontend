import React from 'react'

import { Loader } from './components'

import theme from '@/theme'


const LOADER_SIZE = 100

export default () => {
  return (
    <Loader
      type='Bars'
      color={theme.colors.secondary}
      height={LOADER_SIZE}
      width={LOADER_SIZE}
    />
  )
}

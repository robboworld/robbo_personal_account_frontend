import React from 'react'
import { Spin } from 'antd'

import { LoaderWrap } from './components'

export default () => {
  return (
    <LoaderWrap role='status' aria-busy='true'>
      <Spin size='large' />
    </LoaderWrap>
  )
}

import React from 'react'
import { Button } from 'antd'

const HelpButton = () => {
  return (
    <Button
      type='primary'
      href='https://support.robbo.world/'
      target='_blank'
      rel='noopener noreferrer'
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 1000,
      }}
    >
      Помощь
    </Button>
  )
}

export default HelpButton

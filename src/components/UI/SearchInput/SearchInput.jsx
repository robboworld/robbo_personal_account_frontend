import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import Flex from '@/components/Flex'
import { Input, Button } from '@/components/UI'

export default ({
  searchHandle,
  placeholder,
}) => {
  const intl = useIntl()
  const [searchInput, setSearchInput] = useState('')

  return (
    <Flex width='100%' justify='center'>
      <Input
        placeholder={placeholder}
        value={searchInput}
        handleInput={input => setSearchInput(input)}
      />
      <Button
        content={intl.formatMessage({ id: 'common.search' })}
        padding='1rem'
        margin='0 0 0 1rem'
        handleSubmit={() => searchHandle(searchInput)}
      />
    </Flex>
  )
}

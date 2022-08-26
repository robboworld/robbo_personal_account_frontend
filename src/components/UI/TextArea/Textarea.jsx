import React from 'react'

import { StyledTextarea } from './components'

export default (
    {
        handleInput, value,
        onBlur, fontSize,
        height, width,
        padding, margin,
        placeholder,
    },
) => {
    return <StyledTextarea
        onChange={e => { handleInput(e.target.value) }}
        onBlur={onBlur}
        value={value}
        height={height}
        width={width}
        padding={padding}
        margin={margin}
        fontSize={fontSize}
        placeholder={placeholder}
    />
}
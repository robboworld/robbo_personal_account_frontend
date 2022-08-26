import React from 'react'
import styled from "styled-components"

export default ({
    content,
    margin,
    padding,
    width,
    height,
    size,
}) => {
    return (
        <StyledSpan
            margin={margin}
            padding={padding}
            width={width}
            height={height}
            size={size}
        >
            {content}
        </StyledSpan>
    )
}

const StyledSpan = styled.span`
  margin: ${({ margin }) => margin || '0'};
  padding: ${({ padding }) => padding || '0'};
  width: ${({ width }) => width || 'auto'};
  height: ${({ height }) => height || 'auto'};
  font-size: ${({ size }) => size || 'auto'};
  font-weight: bold;
`
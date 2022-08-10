import React from 'react'
import styled from 'styled-components'

export default function Button(
  {
    content, handleSubmit,
    background, width,
    height, padding,
    margin,
  }) {
  return (
    <StyledButton
      onClick={() => handleSubmit()}
      background={background}
      width={width}
      height={height}
      padding={padding}
      margin={margin}
    >
      {content}
    </StyledButton>
  )
}

const StyledButton = styled.button`
  background: ${({ background }) => background || 'linear-gradient(to right, #14163c 0%, #03217b 79%)'};
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  padding: ${({ padding }) => padding || 'none'};
  margin: ${({ margin }) => margin || 'none'};
  width: ${({ width }) => width || 'auto'};
  height: ${({ height }) => height || '3rem'};
  border: none;
  color: white;
  border-radius: 2rem;
  cursor: pointer;
  
  &:hover{
    box-shadow: 0 0.5rem 0.5rem 0 rgba(31, 38, 135, 0.37);
  }
`
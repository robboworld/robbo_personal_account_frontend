import styled from 'styled-components'

export const StyledTextarea = styled.textarea`
background: rgba(255, 255, 255, 0.15);
box-shadow: 0 1px 4px 0 rgba(31, 38, 135, 0.37);
width: ${({ width }) => width || '70%'};
height: ${({ height }) => height || '3rem'};
padding: ${({ padding }) => padding || '1rem'};
margin: ${({ margin }) => margin || '0'};
border: none;
outline: none;
resize : none;
overflow : auto;
color: #3c354e;
font-size: ${({ fontSize }) => fontSize || '1rem'};
`
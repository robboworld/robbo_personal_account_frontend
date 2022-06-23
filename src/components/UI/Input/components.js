import styled from 'styled-components'

export const StyledInput = styled.input`
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 1px 4px 0 rgba(31, 38, 135, 0.37);
  border-radius: 2rem;
  width: ${({ width }) => width || '70%'};
  height: ${({ height }) => height || '3rem'};
  padding: ${({ padding }) => padding || '1rem'};
  margin: ${({ margin }) => margin || '0'};
  border: none;
  outline: none;
  color: #3c354e;
  font-size: ${({ fontSize }) => fontSize || '1rem'};
  font-weight: bold;
  &:focus {
    display: inline-block;
    backdrop-filter: blur(12rem);
    border-radius: 2rem;
  }
  &::placeholder {
    color: #b9abe099;
    font-weight: 100;
    font-size: 1rem;
  }
`;
import styled from 'styled-components'

export const Headind = styled.h3``

export const AvatarWrapper = styled.div`
width: 15vw;
height: 15vw;
background-color: red;
`

export const Email = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 3rem;
  font-size: 2rem;
  padding: 1rem;
  border: 1px dashed grey;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 1px 4px 0 rgba(31, 38, 135, 0.37);
  border-radius: 2rem;
  font-weight: bold;
`

export const StyledSpan = styled.span`
  margin: ${({ margin }) => margin || '0'};
  padding: ${({ padding }) => padding || '0'};
  width: ${({ width }) => width || 'auto'};
  height: ${({ height }) => height || 'auto'};
  font-size: ${({ size }) => size || 'auto'};
  font-weight: bold;
`

export const DigitalTail = styled.div`
  width: 40%;
  heigth: 10%;
  border: solid;
  border-radius: 10px;
  padding: 10px;  
  overflow: auto;
`
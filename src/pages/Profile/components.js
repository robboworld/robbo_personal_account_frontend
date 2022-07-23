import styled from 'styled-components'

export const Headind = styled.h3``

export const AvatarWrapper = styled.div`
width: 15vw;
height: 15vw;
background-color: red;
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
export const AboutMe = styled.div`
  min-height: 20%;
  border: 1px dashed grey;
  border-radius: 0.5rem;
  width: 100%;
  height: 15vh;
  margin: 1rem 0;
  padding: 1rem;
  overflow: auto;
  font-size: 1vw;
`
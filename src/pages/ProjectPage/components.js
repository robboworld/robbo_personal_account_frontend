import styled from 'styled-components'

export const Card = styled.div`
  width: 100%;
  height: 100%;

  background-color: ${({ theme }) => theme.colors.white};

  border-radius: 32px;

  display: flex;
  flex-direction: column;
  
  box-shadow: ${({ theme }) => theme.boxShadows[0]};

  padding: ${({ theme }) => theme.spaces[4]}px;
`

export const MainContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`

export const WelcomeText = styled.h2`
  margin: 3rem 0 2rem 0;
  color: black;
  display: flex;
  justify-content: center;
`



import styled from 'styled-components'

export const WelcomeText = styled.h2`
  margin: 3rem 0 2rem 0;
  color: black;
  display: flex;
  justify-content: center;
`

export const ListParents = styled.ul`
    height: 100%;
    overflow-y: auto;
`

export const ParentItem = styled.li`
    border-bottom: 1px lightgrey solid;
    padding: 1rem;
    list-style: none;
    display: flex;
    justify-content: flex-start
    align-items: center;
    width: 100%;
  }
`

export const Title = styled.a`
  font-size: 20px;
  text-decoration: none;
  color: black;
  cursor: pointer;
`
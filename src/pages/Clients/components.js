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
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    
`
export const Title = styled.a`
    font-size: 20px;
    text-decoration: none;
    color: black;
    width: 100%;
    cursor: pointer;
    border-bottom: 1px lightgrey solid;
    padding: 1rem 0 1rem 1rem;
    &:hover {
        color: #44A444;
        border-bottom: 1px #44A444 solid;
    }
`
export const DeleteButton = styled.button`
    font-size: 20px;
    padding: 1rem;
    background: none;
    border: none;
    border-bottom: 1px lightgrey solid;
    &:hover {
        cursor: pointer;
        color: #FF5555;
        border-bottom: 1px #FF5555 solid;
    }

`
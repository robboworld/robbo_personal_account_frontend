import styled from 'styled-components'

export const Title = styled.h1`
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1rem;
`

export const SubTitle = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 1.5rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 0 2rem 0 2rem;
`


export const ListChildrens = styled.ul`
    height: auto;
    overflow-y: auto;
    padding: 0 2rem 2rem 2rem;
`

export const ChildrenItem = styled.li`
    border-bottom: 1px lightgrey solid;
    padding: 1rem;
    list-style: none;
    display: flex;
    justify-content: flex-start
    align-items: center;
    width: 100%;
  }
`

export const Name = styled.a`
  font-size: 20px;
  text-decoration: none;
  color: black;
  cursor: pointer;
`


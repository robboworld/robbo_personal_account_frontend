import styled from 'styled-components'

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

export const ProjectPageItem = styled.li`
    border-bottom: 2px grey solid;
    padding: 1rem;
    margin: 0.5rem;
    list-style: none;
    display: flex;
    justify-content: flex-start
    align-items: center;
    width: 100%;
  }
`

export const ScratchLink = styled.a`
    font-size: 20px;
    text-decoration: none;
    color: black;
    cursor: pointer;
`

export const Avatar = styled.div`
  width: 90px;
  height: 90px;
  background-color: red;
  cursor: pointer;
`

export const LastModified = styled.span`
`
export const RemoveProjectPage = styled.div`
  cursor: pointer;
`
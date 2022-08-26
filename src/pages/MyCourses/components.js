import styled from 'styled-components'

export const WelcomeText = styled.h2`
  margin: 3rem 0 2rem 0;
  color: black;
  display: flex;
  justify-content: center;
`

export const CoursePageItem = styled.li`
    border-bottom: 1px grey solid;
    padding: 1rem;
    list-style: none;
    display: flex;
    justify-content: flex-start
    align-items: center;
    width: 100%;
  }
`

export const TitleLink = styled.a`
  font-size: 20px;
  text-decoration: none;
  color: black;
  cursor: pointer;
`

export const LittleDescription = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
          line-clamp: 2; 
  -webkit-box-orient: vertical;
  overflow-wrap: break-word;
  hyphens: auto;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Avatar = styled.img`
  width: 90px;
  height: 90px;
  background-color: green;
  object-fit: cover;
`
import styled, { keyframes } from 'styled-components'

export const StyledListItem = styled.li`
    cursor: pointer;
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
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
export const IconsWrapper = styled.div`
    display: flex;
    font-size: 20px;
    height: 57px;
    background: none;
    border: none;
    border-bottom: 1px lightgrey solid;
`

export const IconDiv = styled.div`
    height: 100%;
    width: 20px;
    display: inline-block;
    vertical-align: middle;
    padding: 1rem 0;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;
    margin-left: 1rem;
    transition: width 300ms ease-in-out 0s, background-color 300ms linear 200ms;

    &:hover,
    &:focus-visible {
        width: 10rem;
        background-color: white;
        transition: width 300ms ease-in-out 0s, background-color 100ms linear 0s;
        cursor: pointer;
        color: #44A444;
        border-bottom: 1px #44A444 solid;
    }
    
    &:focus-visible {
        outline: 1px solid white;
        outline-offset: 4px;
    }
    
    &:active {
        opacity: 0.9;
    }
    &:after {
        color: white;
        margin-left: 12px;
        animation: 600ms linear forwards;
    }
`

export const IconSVG = styled.div`
    display: inline-block;
    vertical-align: middle;
    font-size: 20px;
    aspect-ratio: 1 / 1;
    margin-right: 0.5rem;
`

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`
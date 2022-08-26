import styled from 'styled-components'

export const StyledListItem = styled.li`
    cursor: pointer;

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
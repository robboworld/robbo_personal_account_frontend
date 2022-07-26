import styled from 'styled-components'

export const Title = styled.h1`
    display: flex;
    align-items: center;
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
    width: 100%;
    overflow-y: auto;
    padding: 0 2rem 2rem 2rem;
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


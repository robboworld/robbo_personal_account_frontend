import styled from 'styled-components'
import { Modal } from '@mui/material'

export const StyledModal = styled(Modal)`
    display: flex;
    align-items: center;
    justify-content: center;
`

export const ModalCard = styled.div`
    display: flex;
    flex-direction: column;
    width: 65%;
    height: 80%;
    background-color: white;
    border-radius: 32px;
`

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

export const CloseModalButton = styled.button`
    font-size: 3rem;
    padding: 1rem;
    background: none;
    border: none;
    &:hover {
        cursor: pointer;
        color: #44A444;
    }
`

export const Name = styled.a`
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


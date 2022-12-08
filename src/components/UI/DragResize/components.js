import styled from 'styled-components'

export const ModalWindow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 999;
  background-color: #ccf1b9;
  border: solid black 1px;
  width: fit-content;
  height: fit-content;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  resize: both;
  overflow: scroll;
`

export const ModalContent = styled.div`
    padding: 1rem;
    width: 100%;
    height:  100%;
`
export const Title = styled.h1`
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1rem;
`

export const CloseModalButton = styled.button`
    font-size: 2rem;
    padding: 0 1rem;
    background: none;
    border: none;
    &:hover {
        cursor: pointer;
        color: #44A444;
    }
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
import styled from 'styled-components'

export const ModalWindow = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  z-index: 999;
  top: 50%;
  left: 50%;
`

export const ModalContent = styled.div`
display: inline-block;
vertical-align: middle;
    // flex-direction: column;
    width: ${({ width }) => width || 'auto'};
    height: ${({ height }) => height || 'auto'};
    background-color: #FAFAD2;
    overflow: auto;
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
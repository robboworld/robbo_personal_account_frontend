import styled from 'styled-components'

export const StyledModal = styled.div`
    display: ${({ show }) => (show ? 'flex' : 'none')};

    position: fixed;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
    align-items: center;
    justify-content: center;
`
export const ModalCard = styled.div`
    display: flex;
    flex-direction: column;
    width: ${({ width }) => width || 'auto'};
    height: ${({ height }) => height || 'auto'};
    background-color: white;
    border-radius: 32px;
    box-sizing: border-box;
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

export const ListChildrens = styled.ul`
    overflow-y: auto;
    padding: 0 2rem 2rem 2rem;
`
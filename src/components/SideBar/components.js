import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const MenuItemLinks = styled(Link)`
    display: flex;
    align-items: center;
    padding: 0 2rem;
    font-size: 20px;
    text-decoration: none;
    // color: #ffffff;
    &:hover {
        // background-color: #ffffff;
        color: #2F4F4F;
        width: 100%;
        height: 45px;
        text-align: center;
        border-radius: 5px;
        margin: 0 2rem;
    }
`
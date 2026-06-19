import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

import robboGuestTokens from '@/theme/robboGuestTokens'

export const HeaderNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-left: 1rem;
  min-width: 0;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 575.98px) {
    gap: 0.5rem;
    margin-left: 0.5rem;
  }
`

const headerNavButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-height: 36px;
  height: 36px;
  padding: 0 22px;
  font-family: ${robboGuestTokens.fontFamily};
  font-size: 14px;
  font-weight: 600;
  line-height: 1.15;
  border-radius: 18px;
  white-space: nowrap;
  text-decoration: none !important;
  color: #000 !important;
  background-color: #fff;
  border: 1px solid transparent;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover,
  &:focus {
    opacity: 0.94;
    color: #000 !important;
    text-decoration: none !important;
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  &[data-active='true'] {
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 575.98px) {
    min-height: 30px;
    height: 30px;
    padding: 0 14px;
    font-size: 12px;
    border-radius: 14px;
  }
`

export const HeaderNavButton = styled.a`
  ${headerNavButtonStyles}
`

export const HeaderNavLink = styled(Link)`
  ${headerNavButtonStyles}
`

export const HeaderNavAction = styled.button`
  ${headerNavButtonStyles}
`

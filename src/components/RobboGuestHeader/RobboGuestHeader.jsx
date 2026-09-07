import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import robboGuestTokens from '@/theme/robboGuestTokens'

const Topbar = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: ${robboGuestTokens.topbarBg};
`

const Main = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 16px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  min-height: ${robboGuestTokens.topbarHeight};
  padding: 6px 20px;

  @media (min-width: 992px) {
    column-gap: 24px;
    padding: 6px 28px;
  }

  @media screen and (max-width: 991px) {
    min-height: ${robboGuestTokens.topbarHeightMobile};
    padding-top: calc(6px + env(safe-area-inset-top, 0px));
  }
`

const Leading = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
`

const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  line-height: 1;
  text-decoration: none !important;
  color: #fff !important;

  &:hover,
  &:focus {
    opacity: 0.92;
    color: #fff !important;
    text-decoration: none !important;
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
    opacity: 1;
  }
`

const Wordmark = styled.span`
  color: #fff;
  font-family: ${robboGuestTokens.fontFamily};
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.1;
  text-transform: uppercase;

  @media screen and (max-width: 575.98px) {
    font-size: 22px;
  }
`

const Reg = styled.sup`
  font-size: 0.45em;
  font-weight: 700;
  margin-left: 0.06em;
  vertical-align: super;
`

const Trailing = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
`

const Actions = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 10px;
  margin: 0;
`

const TopbarBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
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
  transition: opacity 0.2s ease, transform 0.2s ease;

  &:hover,
  &:focus {
    opacity: 0.94;
    text-decoration: none !important;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  @media screen and (max-width: 575.98px) {
    min-height: 30px;
    height: 30px;
    padding: 0 14px;
    font-size: clamp(11px, 3vw, 12.5px);
    border-radius: 14px;
  }
`

const BtnSolid = styled(TopbarBtn)`
  color: ${robboGuestTokens.green} !important;
  background-color: #fff;
  border: 1px solid #fff;
`

const BtnOutline = styled(TopbarBtn)`
  color: ${robboGuestTokens.green} !important;
  background-color: #fff;
  border: 1px solid #fff !important;
`

const RobboGuestHeader = () => (
  <Topbar role='banner'>
    <Main>
      <Leading>
        <BrandLink to='/' aria-label='РОББО — на главную'>
          <Wordmark>
            РОББО
            <Reg>®</Reg>
          </Wordmark>
        </BrandLink>
      </Leading>
      <Trailing>
        <Actions>
          <BtnSolid to='/login'>Вход</BtnSolid>
          <BtnOutline to='/register'>Регистрация</BtnOutline>
        </Actions>
      </Trailing>
    </Main>
  </Topbar>
)

export default RobboGuestHeader

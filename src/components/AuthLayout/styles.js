import styled, { css } from 'styled-components'

import appTheme from '@/theme'

const accent = appTheme.colors.accentGreen
const accentDark = appTheme.colors.accentGreenHover
const text = '#383838'
const textMuted = '#707070'

export const AuthShell = styled.div`
  --authn-bg-fallback: #edf9f2;
  --authn-content-margin-right: 50px;
  --authn-content-panel-block-margin: 40px;
  --authn-bg-glow-blur: 32px;

  color: ${text};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  min-height: 100dvh;
  width: 100%;
  flex: 1;
  position: relative;
  overflow-x: hidden;
`

export const AuthMain = styled.main`
  position: relative;
  min-height: 100dvh;
  width: 100%;
`

export const AuthLayoutGrid = styled.div`
  position: relative;
  box-sizing: border-box;
  min-height: 100dvh;
  background-color: var(--authn-bg-fallback);
  background-image:
    radial-gradient(ellipse 95% 72% at 92% 8%, rgba(133, 217, 164, 0.55) 0%, rgba(184, 233, 202, 0.28) 38%, transparent 68%),
    radial-gradient(ellipse 80% 65% at 6% 92%, rgba(0, 175, 65, 0.2) 0%, rgba(184, 233, 202, 0.14) 42%, transparent 70%),
    radial-gradient(ellipse 55% 45% at 50% 38%, rgba(219, 244, 228, 0.35) 0%, transparent 72%),
    linear-gradient(152deg, #b8e9ca 0%, #dbf4e4 18%, #ecfdf5 42%, #edf9f2 68%, #fafefa 90%, #fff 100%);
  padding: max(1rem, env(safe-area-inset-top)) 1rem max(1.5rem, env(safe-area-inset-bottom));

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(var(--authn-bg-glow-blur));
  }

  &::before {
    background: radial-gradient(
      circle at 42% 42%,
      rgba(0, 175, 65, 0.38) 0%,
      rgba(74, 222, 128, 0.48) 28%,
      rgba(184, 233, 202, 0.42) 48%,
      transparent 72%
    );
    bottom: 6%;
    height: min(72vw, 360px);
    width: min(92vw, 440px);
    left: 50%;
    transform: translateX(-52%);
  }

  &::after {
    background: radial-gradient(
      circle at 48% 52%,
      rgba(52, 211, 153, 0.42) 0%,
      rgba(133, 217, 164, 0.3) 34%,
      rgba(237, 249, 242, 0.08) 58%,
      transparent 74%
    );
    filter: blur(calc(var(--authn-bg-glow-blur) - 4px));
    height: min(58vw, 280px);
    width: min(100vw, 400px);
    top: 0;
    left: 50%;
    transform: translateX(-48%);
  }

  @media (min-width: 992px) {
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    padding: 0.5rem 0;

    &::before {
      bottom: -28%;
      height: min(82vw, 600px);
      width: min(82vw, 600px);
      left: -18%;
      transform: none;
    }

    &::after {
      top: -14%;
      right: -10%;
      left: auto;
      height: min(68vw, 520px);
      width: min(68vw, 520px);
      transform: none;
    }
  }
`

export const HeroColumn = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.5rem 1rem 0.5rem;
  box-sizing: border-box;

  @media (min-width: 992px) {
    flex: 0 1 50%;
    max-width: 50%;
    min-width: 0;
    align-self: stretch;
    padding: 2rem 1.5rem;
  }
`

export const HeroLogoLink = styled.a`
  display: none;
`

export const HeroTitle = styled.h1`
  box-sizing: border-box;
  margin: 0 auto;
  max-width: 100%;
  width: fit-content;
  text-align: center;
  font-size: 1rem;
  line-height: 1.2;
  font-weight: 400;
`

export const HeroTitleLine = styled.span`
  display: block;
  color: ${accentDark};
  font-size: clamp(0.9rem, 11vw + 0.35rem, 2.75rem);
  font-weight: 400;
  line-height: 1.16;
  overflow-wrap: break-word;
  text-align: center;

  @media (min-width: 992px) {
    font-size: clamp(0.9rem, 5.75cqi + 0.45rem, 2.75rem);
  }
`

export const HeroBrandLine = styled.span`
  display: block;
  color: ${accent};
  font-size: clamp(1.05rem, 15vw + 0.35rem, 3.5rem);
  font-weight: 700;
  line-height: 1.05;
  margin-top: 0.06em;
  overflow-wrap: break-word;
  text-align: center;

  @media (min-width: 992px) {
    font-size: clamp(1.05rem, 8cqi + 0.4rem, 3.5rem);
  }
`

export const ContentColumn = styled.div`
  position: relative;
  z-index: 1;
  align-self: stretch;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (min-width: 992px) {
    flex: 1 1 0;
    flex-grow: 1;
    max-width: none;
    min-width: clamp(18rem, 40vw, 520px);
    width: auto;
    margin-top: var(--authn-content-panel-block-margin);
    margin-bottom: var(--authn-content-panel-block-margin);
    margin-right: clamp(0.875rem, 2.75vw, var(--authn-content-margin-right));
    margin-left: 0;
    box-shadow: 0 1px 3px rgba(21, 128, 61, 0.08);
    border-top-left-radius: 28px;
    border-bottom-left-radius: 28px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background: #fff;
  }
`

export const ContentPanel = styled.div`
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 1px 3px rgba(21, 128, 61, 0.08);
  padding: 1.75rem 1.75rem 2rem;

  @media (min-width: 992px) {
    border-radius: 0;
    box-shadow: none;
    background: transparent;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`

export const AuthFormWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: 464px;
  width: 100%;
  margin: 0 auto;
`

export const AuthTabs = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  width: 100%;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 1.25rem;
`

const tabLinkStyles = css`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  margin-bottom: -1px;
  color: ${textMuted};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  border: 1px solid transparent;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  transition: color 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: ${accentDark};
    text-decoration: none;
  }

  &:focus-visible {
    outline: 2px solid ${accentDark};
    outline-offset: 2px;
  }
`

export const AuthTabLink = styled.a`
  ${tabLinkStyles}

  ${({ $active }) => $active && css`
    color: ${accentDark};
    border-color: #dee2e6 #dee2e6 #fff;
    background: #fff;
  `}
`

export const MainContent = styled.div`
  min-width: 0;
  width: 100%;
`

export const AuthFormStyles = styled.div`
  .ant-form-item {
    margin-bottom: 1.25rem;
  }

  .ant-form-item-label > label {
    color: ${text};
    font-weight: 500;
  }

  .ant-input,
  .ant-input-affix-wrapper,
  .ant-input-password {
    border: 1px solid #c4c4c4;
    border-radius: 0;
    padding: 0.625rem 0.875rem;
    font-size: 1rem;
    line-height: 1.5;
    color: ${text};
    background: #fff;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      border-color: #9ca3af;
    }

    &:focus,
    &.ant-input-affix-wrapper-focused {
      border-color: ${accent};
      box-shadow: 0 0 0 0.2rem rgba(0, 126, 47, 0.35);
    }
  }

  .ant-input-affix-wrapper .ant-input {
    border: none;
    box-shadow: none;
    padding: 0;
  }

  .ant-input-affix-wrapper .ant-input:focus {
    box-shadow: none;
  }

  .ant-btn-primary {
    background: ${accent};
    border-color: ${accent};
    min-height: 2.75rem;
    min-width: 6rem;
    font-weight: 500;
    border-radius: 0;
    transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.15s ease;

    &:hover:not(:disabled) {
      background: ${accentDark};
      border-color: ${accentDark};
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
    }

    &:focus-visible {
      box-shadow: 0 0 0 0.2rem rgba(0, 126, 47, 0.45);
    }
  }

  .login-form-button,
  .register-button {
    width: 100%;
  }

  .register-button {
    min-width: 14.4rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
`

export const AuthActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 0.5rem;
`

export const AuthTextLink = styled.button`
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  color: ${text};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${accentDark};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${accentDark};
    outline-offset: 2px;
  }
`

export const AuthFooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eef2f0;
`

export const OidcBlock = styled.div`
  margin-bottom: 1.25rem;

  .ant-divider-inner-text {
    color: ${textMuted};
    font-size: 0.875rem;
  }
`

export const OidcHint = styled.p`
  margin: 0 0 0.75rem;
  color: ${textMuted};
  font-size: 0.875rem;
  line-height: 1.5;
`

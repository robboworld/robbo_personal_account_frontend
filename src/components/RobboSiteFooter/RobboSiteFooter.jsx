import React from 'react'
import styled from 'styled-components'

import theme from '@/theme'
import RobboGuestFonts from '@/theme/robboGuestFonts'

const FASIE_LOGO_URL = '/static/partners/fasie.png'
const { colors } = theme

const SiteFooter = styled.footer`
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  border-top: none;
  padding: clamp(28px, 4vw, 36px) 0;
  color: ${colors.secondary};
  font-family: 'ProximaNova', 'Proxima Nova', system-ui, -apple-system, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(0, 175, 65, 0.05) 0%,
      #00af41 35%,
      rgba(0, 175, 65, 0.55) 65%,
      rgba(0, 175, 65, 0.05) 100%
    );
    pointer-events: none;
  }

  @media screen and (max-width: 980px) {
    padding: 24px 0;
  }
`

const FooterInner = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;

  @media (min-width: 992px) {
    padding: 0 28px;
  }
`

const FooterMain = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 14px;
  justify-items: center;
  text-align: center;
  align-items: start;
  width: 100%;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    column-gap: clamp(20px, 4vw, 48px);
    justify-items: stretch;
    text-align: left;
  }

  @media screen and (max-width: 980px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

const BrandCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  text-align: center;

  @media (min-width: 1200px) {
    align-items: flex-start;
    text-align: left;
  }

  @media screen and (max-width: 980px) {
    order: 1;
  }
`

const PartnerCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  width: 100%;
  max-width: 100%;

  @media (min-width: 1200px) {
    align-items: flex-start;
    justify-content: flex-start;
  }

  @media screen and (max-width: 980px) {
    order: 2;
  }
`

const FooterCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  width: 100%;
  max-width: 100%;

  @media (min-width: 1200px) {
    align-items: flex-start;
  }

  @media screen and (max-width: 980px) {
    order: 3;
  }
`

const ContactsCol = styled(FooterCol)`
  @media screen and (max-width: 980px) {
    order: 4;
  }
`

const FooterBrand = styled.div`
  display: block;
`

const FooterLogo = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: clamp(6px, 1.2vw, 8px) clamp(18px, 2.4vw, 24px);
  box-sizing: border-box;
  background: #00af41;
  color: #fff;
  font-family: 'ProximaNova', 'Proxima Nova', Helvetica, Arial, sans-serif;
  font-size: clamp(14px, 2vw, 24px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
`

const FooterReg = styled.sup`
  position: absolute;
  top: clamp(3px, 0.7vw, 6px);
  right: clamp(4px, 0.9vw, 8px);
  font-size: clamp(7px, 0.85vw, 10px);
  font-weight: 700;
  line-height: 1;
  pointer-events: none;
`

const FooterTagline = styled.p`
  margin: 0;
  max-width: 22em;
  color: #989898;
  font-size: clamp(11px, 1.1vw, 13px);
  line-height: 1.45;
  transition: color 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`

const FooterCopyright = styled.p`
  margin: 0;
  max-width: 22em;
  font-size: clamp(11px, 1.1vw, 12px);
  line-height: 1.45;
  color: #989898;
  transition: color 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`

const PartnerLink = styled.a`
  display: inline-flex;
  align-items: center;
  border-radius: 4px;

  &:focus-visible {
    outline: 2px solid #00af41;
    outline-offset: 3px;
  }
`

const PartnerLogo = styled.img`
  display: block;
  width: auto;
  height: clamp(56px, 6.5vw, 76px);
  object-fit: contain;
  background: transparent;
  padding: 0;
  border-radius: 4px;
`

const FooterHeading = styled.h2`
  margin: 0 0 12px;
  color: ${colors.secondary};
  font-size: 13px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: color 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`

const footerLinkStyles = `
  display: block;
  margin: 0;
  padding: 0;
  color: #989898;
  font-size: clamp(11px, 1.1vw, 13px);
  line-height: 1.45;
  text-decoration: none;
  word-break: break-word;
  transition: color 0.15s ease;

  &:hover,
  &:focus {
      color: #00af41;
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid #00af41;
    outline-offset: 2px;
  }
`

const FooterLinks = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    margin: 0;
    padding: 0;
  }

  a {
    ${footerLinkStyles}
  }

  @media screen and (max-width: 980px) {
    li {
      margin: 0 0 2px;
    }

    li:last-child {
      margin-bottom: 0;
    }

    a {
      line-height: 1.3;
    }
  }
`

const ContactsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  @media (max-width: 1199.98px) {
    margin-inline: auto;
  }
`

const ContactsItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0;

  @media (min-width: 1200px) {
    justify-content: flex-start;
  }
`

const ContactsIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: #989898;
  transition: color 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`

const ContactsLink = styled.a`
  min-width: 0;
  ${footerLinkStyles}
  overflow-wrap: anywhere;
`

const MailIcon = () => (
  <svg viewBox='0 0 24 24' width='18'
height='18' focusable='false'
aria-hidden>
    <rect
      x='3'
      y='5'
      width='18'
      height='14'
      rx='2'
      stroke='currentColor'
      strokeWidth='1.8'
      fill='none'
    />
    <path
      d='M3 7l9 6 9-6'
      stroke='currentColor'
      strokeWidth='1.8'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

const GlobeIcon = () => (
  <svg viewBox='0 0 24 24' width='18'
height='18' focusable='false'
aria-hidden>
    <circle cx='12' cy='12'
r='9' stroke='currentColor'
strokeWidth='1.8' fill='none' />
    <path
      d='M3 12h18M12 3c2.5 2.8 2.5 14.2 0 18M12 3c-2.5 2.8-2.5 14.2 0 18'
      stroke='currentColor'
      strokeWidth='1.8'
      fill='none'
      strokeLinecap='round'
    />
  </svg>
)

const SupportIcon = () => (
  <svg viewBox='0 0 24 24' width='18'
height='18' focusable='false'
aria-hidden>
    <path
      d='M4 11v3a2 2 0 002 2h1v-7H6a2 2 0 00-2 2zM18 9h1a2 2 0 012 2v3a2 2 0 01-2 2h-1V9z'
      stroke='currentColor'
      strokeWidth='1.8'
      fill='none'
      strokeLinejoin='round'
    />
    <path
      d='M8 18v1a4 4 0 004 4 4 4 0 004-4v-1'
      stroke='currentColor'
      strokeWidth='1.8'
      fill='none'
      strokeLinecap='round'
    />
    <path
      d='M12 14v-1a3 3 0 013-3'
      stroke='currentColor'
      strokeWidth='1.8'
      fill='none'
      strokeLinecap='round'
    />
  </svg>
)

const RobboSiteFooter = () => (
  <React.Fragment>
    <RobboGuestFonts />
    <SiteFooter id='footer-guest' lang='ru'>
    <FooterInner>
      <FooterMain>
        <BrandCol>
          <FooterBrand>
            <FooterLogo aria-label='РОББО'>
              РОББО
              <FooterReg aria-hidden>®</FooterReg>
            </FooterLogo>
          </FooterBrand>
          <FooterTagline>Образовательная платформа РОББО</FooterTagline>
          <FooterCopyright>© ООО «РОББО ТЕХНОЛОГИИ», 2026</FooterCopyright>
        </BrandCol>

        <PartnerCol>
          <PartnerLink
            href='https://fasie.ru'
            target='_blank'
            rel='noopener noreferrer'
          >
            <PartnerLogo
              src={FASIE_LOGO_URL}
              alt='Фонд содействия инновациям'
            />
          </PartnerLink>
        </PartnerCol>

        <FooterCol as='nav' aria-label='Документы'>
          <FooterHeading>Документы</FooterHeading>
          <FooterLinks>
            <li>
              <a
                href='https://robbo.ru/wp-content/uploads/policy.pdf'
                target='_blank'
                rel='noopener noreferrer'
              >
                Политика обработки персональных данных
              </a>
            </li>
            <li>
              <a
                href='https://robbo.ru/wp-content/uploads/agree.pdf'
                target='_blank'
                rel='noopener noreferrer'
              >
                Согласие на обработку персональных данных
              </a>
            </li>
          </FooterLinks>
        </FooterCol>

        <ContactsCol>
          <FooterHeading>Контакты</FooterHeading>
          <ContactsList>
            <ContactsItem>
              <ContactsIcon>
                <MailIcon />
              </ContactsIcon>
              <ContactsLink href='mailto:info@robbo.ru' aria-label='Почта: info@robbo.ru'>
                info@robbo.ru
              </ContactsLink>
            </ContactsItem>
            <ContactsItem>
              <ContactsIcon>
                <GlobeIcon />
              </ContactsIcon>
              <ContactsLink
                href='https://robbo.ru'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Наш сайт: robbo.ru'
              >
                robbo.ru
              </ContactsLink>
            </ContactsItem>
            <ContactsItem>
              <ContactsIcon>
                <SupportIcon />
              </ContactsIcon>
              <ContactsLink
                href='https://support.robbo.world/'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Поддержка: support.robbo.world'
              >
                support.robbo.world
              </ContactsLink>
            </ContactsItem>
          </ContactsList>
        </ContactsCol>
      </FooterMain>
    </FooterInner>
    </SiteFooter>
  </React.Fragment>
)

export default RobboSiteFooter

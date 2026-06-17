import React from 'react'
import styled from 'styled-components'

const FASIE_LOGO_URL = '/static/partners/fasie.png'

const SiteFooter = styled.footer`
  --footer-bg: rgba(255, 255, 255, 0.98);
  --footer-heading: #383838;
  --footer-muted: #989898;
  --footer-accent: var(--landing-accent, #00af41);
  --footer-logo-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  --footer-partner-bg: transparent;
  --footer-partner-pad: 0;

  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
  background: var(--footer-bg);
  border-top: 3px solid var(--footer-accent);
  padding: clamp(28px, 4vw, 36px) 0;
  color: var(--footer-heading);
  font-family: 'Proxima Nova', 'ProximaNova', system-ui, -apple-system, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  transition:
    background 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    color 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  [data-theme='dark'] & {
    --footer-bg: var(--landing-surface, rgba(16, 20, 16, 0.97));
    --footer-heading: var(--landing-text, #eef5ee);
    --footer-muted: var(--landing-muted, #9cb09c);
    --footer-logo-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
    --footer-partner-bg: rgba(255, 255, 255, 0.96);
    --footer-partner-pad: 6px;
    box-shadow: inset 0 1px 0 var(--landing-inset-line, rgba(255, 255, 255, 0.07));
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
  display: inline-block;
  margin: 0;
  padding: clamp(4px, 1.2vw, 6px) clamp(14px, 2.2vw, 21px) clamp(4px, 1.2vw, 6px)
    clamp(12px, 1.8vw, 15px);
  box-sizing: border-box;
  background: var(--footer-accent);
  color: #fff;
  font-size: clamp(14px, 2vw, 24px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  text-align: center;
  box-shadow: var(--footer-logo-shadow);
`

const FooterReg = styled.sup`
  position: absolute;
  top: clamp(4px, 0.8vw, 8px);
  right: clamp(5px, 1vw, 10px);
  font-size: clamp(7px, 0.85vw, 10px);
  font-weight: 700;
  line-height: 1;
`

const FooterTagline = styled.p`
  margin: 0;
  max-width: 22em;
  color: var(--footer-muted);
  font-size: clamp(11px, 1.1vw, 13px);
  line-height: 1.45;
  transition: color 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`

const FooterCopyright = styled.p`
  margin: 0;
  max-width: 22em;
  font-size: clamp(11px, 1.1vw, 12px);
  line-height: 1.45;
  color: var(--footer-muted);
  transition: color 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`

const PartnerLink = styled.a`
  display: inline-flex;
  align-items: center;
  border-radius: 4px;

  &:focus-visible {
    outline: 2px solid var(--footer-accent);
    outline-offset: 3px;
  }
`

const PartnerLogo = styled.img`
  display: block;
  width: auto;
  height: clamp(56px, 6.5vw, 76px);
  object-fit: contain;
  background: var(--footer-partner-bg);
  padding: var(--footer-partner-pad);
  border-radius: 4px;
  transition:
    background 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    padding 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`

const FooterHeading = styled.h2`
  margin: 0 0 12px;
  color: var(--footer-heading);
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
  color: var(--footer-muted);
  font-size: clamp(11px, 1.1vw, 13px);
  line-height: 1.45;
  text-decoration: none;
  word-break: break-word;
  transition: color 0.15s ease;

  &:hover,
  &:focus {
    color: var(--footer-accent);
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid var(--footer-accent);
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
  color: var(--footer-muted);
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

const LandingFooter = () => (
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
)

export default LandingFooter

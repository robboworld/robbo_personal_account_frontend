import React, { useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { motion } from 'framer-motion'
import {
  ExportOutlined,
  WindowsOutlined,
  AppleOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import styled, { css, keyframes } from 'styled-components'

import { PageContent } from '@/components/AccountShell'
import robboGuestTokens from '@/theme/robboGuestTokens'
import theme from '@/theme'
import { getScratchEditorUrl } from '@/utils/scratchEditor'

const RELEASE_BASE = 'http://files.robbo.ru/Software/RobboScratch3.0/release'

const DOWNLOADS = [
  {
    id: 'windows',
    labelId: 'scratch_hub.os.windows',
    href: `${RELEASE_BASE}/Windows/robboScratch-3.124.1-x64.exe`,
    file: 'robboScratch-3.124.1-x64.exe',
    Icon: WindowsOutlined,
  },
  {
    id: 'mac',
    labelId: 'scratch_hub.os.mac',
    href: `${RELEASE_BASE}/Mac/Robboscratch3.64.4.app.zip`,
    file: 'Robboscratch3.64.4.app.zip',
    Icon: AppleOutlined,
  },
  {
    id: 'linux-deb',
    labelId: 'scratch_hub.os.linux_deb',
    href: `${RELEASE_BASE}/Linux/robboScratch_3.124.1_amd64.deb`,
    file: 'robboScratch_3.124.1_amd64.deb',
    Icon: DownloadOutlined,
  },
  {
    id: 'linux-rpm',
    labelId: 'scratch_hub.os.linux_rpm',
    href: `${RELEASE_BASE}/Linux/robboScratch-3.124.1-1.x86_64.rpm`,
    file: 'robboScratch-3.124.1-1.x86_64.rpm',
    Icon: DownloadOutlined,
  },
]

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const HubRoot = styled.div`
  position: relative;
  min-height: calc(100dvh - 8rem);
  padding: 1.5rem 0 2.5rem;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 50% at 12% 8%, rgba(0, 175, 65, 0.14), transparent 58%),
      radial-gradient(ellipse 55% 45% at 92% 18%, rgba(0, 122, 46, 0.08), transparent 55%),
      linear-gradient(180deg, ${robboGuestTokens.lkPageBg} 0%, #eef6ef 100%);
    pointer-events: none;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }
`

const HubInner = styled(PageContent)`
  position: relative;
  z-index: 1;
  max-width: 920px;
`

const Brand = styled(motion.h1)`
  margin: 0;
  font-family: ${robboGuestTokens.fontFamily};
  font-size: clamp(2.5rem, 6vw, 3.75rem);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 1.05;
  color: ${theme.colors.secondary};
  animation: ${fadeUp} 0.7s cubic-bezier(0.32, 0.72, 0, 1) both;
`

const Lead = styled(motion.p)`
  margin: 0.85rem 0 0;
  max-width: 36rem;
  font-size: 1.0625rem;
  line-height: 1.55;
  color: ${robboGuestTokens.bodyMuted};
  animation: ${fadeUp} 0.7s cubic-bezier(0.32, 0.72, 0, 1) 0.08s both;
`

const Split = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
  margin-top: 2.25rem;

  ${theme.above.med`
    grid-template-columns: 1fr 1.15fr;
    gap: 2rem;
    align-items: start;
  `}
`

const WebPanel = styled(motion.a)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
  min-height: 14rem;
  padding: 1.75rem 1.5rem;
  border-radius: 1.25rem;
  text-decoration: none;
  color: inherit;
  background: linear-gradient(145deg, ${robboGuestTokens.green} 0%, ${robboGuestTokens.greenDark} 100%);
  box-shadow: 0 18px 40px -24px rgba(0, 122, 46, 0.55);
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1), box-shadow 0.28s ease;
  animation: ${fadeUp} 0.7s cubic-bezier(0.32, 0.72, 0, 1) 0.14s both;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 24px 48px -22px rgba(0, 122, 46, 0.65);
    color: inherit;
  }

  &:active {
    transform: translateY(-1px) scale(0.99);
  }
`

const WebTitle = styled.span`
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #f4faf6;
`

const WebHint = styled.span`
  display: block;
  margin-top: 0.5rem;
  font-size: 0.95rem;
  line-height: 1.45;
  color: rgba(244, 250, 246, 0.85);
`

const WebCta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
  padding: 0.65rem 1.1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: #f4faf6;
  font-weight: 600;
  font-size: 0.9375rem;

  .anticon {
    font-size: 0.95rem;
  }
`

const DownloadBlock = styled(motion.section)`
  animation: ${fadeUp} 0.7s cubic-bezier(0.32, 0.72, 0, 1) 0.2s both;
`

const DownloadHeading = styled.h2`
  margin: 0 0 0.35rem;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${theme.colors.secondary};
`

const DownloadLead = styled.p`
  margin: 0 0 1rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: ${robboGuestTokens.bodyMuted};
`

const DownloadList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`

const DownloadItem = styled.a`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  text-decoration: none;
  color: inherit;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(108, 91, 123, 0.12);
  transition:
    transform 0.22s cubic-bezier(0.32, 0.72, 0, 1),
    border-color 0.22s ease,
    background 0.22s ease;

  ${({ $recommended }) => $recommended && css`
    border-color: rgba(0, 175, 65, 0.45);
    background: rgba(0, 175, 65, 0.08);
    box-shadow: 0 0 0 1px rgba(0, 175, 65, 0.12);
  `}

  &:hover {
    transform: translateX(3px);
    border-color: rgba(0, 175, 65, 0.35);
    background: #fff;
    color: inherit;
  }
`

const OsIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: rgba(0, 175, 65, 0.12);
  color: ${robboGuestTokens.greenDark};
  font-size: 1.15rem;
`

const OsCopy = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
`

const OsName = styled.span`
  font-weight: 600;
  font-size: 0.975rem;
  color: ${theme.colors.secondary};
`

const OsMeta = styled.span`
  font-size: 0.8rem;
  color: ${robboGuestTokens.grey};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const RecBadge = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${robboGuestTokens.greenDark};
  background: rgba(0, 175, 65, 0.16);
  padding: 0.28rem 0.5rem;
  border-radius: 999px;
  white-space: nowrap;
`

const detectRecommendedId = () => {
  if (typeof navigator === 'undefined') {
    return 'windows'
  }
  const ua = navigator.userAgent || ''
  const platform = navigator.platform || ''
  const hay = `${ua} ${platform}`
  if (/mac|iphone|ipad/i.test(hay)) {
    return 'mac'
  }
  if (/linux/i.test(hay) && !/android/i.test(hay)) {
    return 'linux-deb'
  }
  if (/win/i.test(hay)) {
    return 'windows'
  }
  return 'windows'
}

const ScratchHubPage = () => {
  const intl = useIntl()
  const recommendedId = useMemo(() => detectRecommendedId(), [])

  const downloads = useMemo(() => {
    const ordered = [...DOWNLOADS]
    ordered.sort((a, b) => {
      if (a.id === recommendedId) return -1
      if (b.id === recommendedId) return 1
      return 0
    })
    return ordered
  }, [recommendedId])

  return (
    <HubRoot>
      <HubInner>
        <Brand>
          Scratch.ru
        </Brand>
        <Lead>
          <FormattedMessage id='scratch_hub.lead' />
        </Lead>

        <Split>
          <WebPanel
            href={getScratchEditorUrl()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div>
              <WebTitle>
                <FormattedMessage id='scratch_hub.web_title' />
              </WebTitle>
              <WebHint>
                <FormattedMessage id='scratch_hub.web_hint' />
              </WebHint>
            </div>
            <WebCta>
              <FormattedMessage id='scratch_hub.web_cta' />
              <ExportOutlined />
            </WebCta>
          </WebPanel>

          <DownloadBlock>
            <DownloadHeading>
              <FormattedMessage id='scratch_hub.download_title' />
            </DownloadHeading>
            <DownloadLead>
              <FormattedMessage id='scratch_hub.download_lead' />
            </DownloadLead>
            <DownloadList>
              {downloads.map(item => {
                const { Icon } = item
                const recommended = item.id === recommendedId
                return (
                  <li key={item.id}>
                    <DownloadItem
                      href={item.href}
                      download
                      $recommended={recommended}
                      aria-label={intl.formatMessage({ id: item.labelId })}
                    >
                      <OsIcon>
                        <Icon />
                      </OsIcon>
                      <OsCopy>
                        <OsName>
                          <FormattedMessage id={item.labelId} />
                        </OsName>
                        <OsMeta>
                          {item.file}
                        </OsMeta>
                      </OsCopy>
                      {recommended ? (
                        <RecBadge>
                          <FormattedMessage id='scratch_hub.recommended' />
                        </RecBadge>
                      ) : (
                        <DownloadOutlined style={{ color: robboGuestTokens.greenDark, fontSize: 18 }} />
                      )}
                    </DownloadItem>
                  </li>
                )
              })}
            </DownloadList>
          </DownloadBlock>
        </Split>
      </HubInner>
    </HubRoot>
  )
}

export default ScratchHubPage

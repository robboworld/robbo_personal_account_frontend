import styled, { css } from 'styled-components'
import { Menu } from 'antd'
import { motion } from 'framer-motion'

import theme from '@/theme'

const { colors } = theme

export const surface = {
  page: '#f4f8f4',
  card: '#ffffff',
  hero: 'linear-gradient(135deg, rgba(0, 175, 65, 0.08) 0%, rgba(192, 108, 132, 0.06) 48%, rgba(108, 91, 123, 0.05) 100%)',
  heroBorder: 'rgba(108, 91, 123, 0.14)',
  muted: 'rgba(108, 91, 123, 0.72)',
  line: 'rgba(108, 91, 123, 0.12)',
  shadow: '0 20px 48px -28px rgba(108, 91, 123, 0.35)',
  shadowHover: '0 28px 56px -24px rgba(0, 175, 65, 0.22)',
}

export const PageContent = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 0.5rem 3rem;

  ${theme.above.med`
    padding: 2rem 0.75rem 3.5rem;
  `}
`

export const Stagger = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  width: 100%;
`

export const HeroPanel = styled(motion.section)`
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  padding: 1.75rem 1.5rem;
  background: ${surface.hero};
  border: 1px solid ${surface.heroBorder};
  box-shadow: ${surface.shadow};

  &::before {
    content: '';
    position: absolute;
    width: 220px;
    height: 220px;
    top: -80px;
    right: -40px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 175, 65, 0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    width: 160px;
    height: 160px;
    bottom: -60px;
    left: -20px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(192, 108, 132, 0.16) 0%, transparent 72%);
    pointer-events: none;
  }

  ${theme.above.med`
    padding: 2.25rem 2rem;
  `}
`

export const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 52ch;
`

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${colors.accentGreen};
  background: rgba(0, 175, 65, 0.1);
  border: 1px solid rgba(0, 175, 65, 0.22);
`

export const HeroTitle = styled.h1`
  margin: 0;
  font-size: clamp(1.75rem, 4vw, 2.35rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: ${colors.secondary};
  text-wrap: balance;
`

export const HeroLead = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.65;
  color: ${surface.muted};
  max-width: 48ch;
`

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;

  ${theme.above.small`
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  `}
`

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${colors.secondary};
`

export const SectionHint = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${surface.muted};
`

export const Panel = styled.section`
  border-radius: 1.25rem;
  padding: 1.25rem 1.25rem 1.5rem;
  background: ${surface.card};
  border: 1px solid ${surface.line};
  box-shadow: ${surface.shadow};

  ${theme.above.med`
    padding: 1.5rem 1.5rem 1.75rem;
  `}
`

export const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;

  ${theme.above.small`
    grid-template-columns: repeat(2, minmax(0, 1fr));
  `}

  ${theme.above.large`
    grid-template-columns: repeat(12, minmax(0, 1fr));
  `}
`

const actionTileMotion = css`
  transition:
    transform 0.28s cubic-bezier(0.32, 0.72, 0, 1),
    box-shadow 0.28s cubic-bezier(0.32, 0.72, 0, 1),
    border-color 0.28s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${surface.shadowHover};
    border-color: rgba(0, 175, 65, 0.28);
  }

  &:active {
    transform: translateY(0) scale(0.99);
  }

  &:focus-visible {
    outline: 2px solid ${colors.accentGreen};
    outline-offset: 3px;
  }
`

export const ActionTile = styled(motion.button).attrs({ type: 'button' })`
  ${actionTileMotion}
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  min-height: 148px;
  padding: 1.125rem 1.125rem 1rem;
  text-align: left;
  cursor: pointer;
  border-radius: 1rem;
  border: 1px solid ${surface.line};
  background: ${surface.card};
  box-shadow: 0 12px 32px -24px rgba(108, 91, 123, 0.4);

  ${({ $gridSpan }) => $gridSpan && css`
    ${theme.above.large`
      grid-column: span ${$gridSpan};
    `}
  `}

  ${({ $gridSpan, $featured }) => !$gridSpan && $featured && css`
    ${theme.above.large`
      grid-column: span 6;
      min-height: 168px;
      background: linear-gradient(145deg, rgba(0, 175, 65, 0.06), rgba(255, 255, 255, 0.98));
    `}
  `}

  ${({ $gridSpan, $featured, $wide }) => !$gridSpan && !$featured && $wide && css`
    ${theme.above.large`
      grid-column: span 6;
    `}
  `}

  ${({ $gridSpan, $featured, $wide }) => !$gridSpan && !$featured && !$wide && css`
    ${theme.above.large`
      grid-column: span 4;
    `}
  `}
`

export const ActionTileLink = styled(motion.a).attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  ${actionTileMotion}
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  min-height: 148px;
  padding: 1.125rem 1.125rem 1rem;
  text-align: left;
  cursor: pointer;
  border-radius: 1rem;
  border: 1px solid ${surface.line};
  background: ${surface.card};
  box-shadow: 0 12px 32px -24px rgba(108, 91, 123, 0.4);
  text-decoration: none;
  color: inherit;

  ${({ $gridSpan }) => $gridSpan && css`
    ${theme.above.large`
      grid-column: span ${$gridSpan};
    `}
  `}

  ${({ $gridSpan, $featured }) => !$gridSpan && $featured && css`
    ${theme.above.large`
      grid-column: span 6;
      min-height: 168px;
      background: linear-gradient(145deg, rgba(0, 175, 65, 0.06), rgba(255, 255, 255, 0.98));
    `}
  `}

  ${({ $gridSpan, $featured, $wide }) => !$gridSpan && !$featured && $wide && css`
    ${theme.above.large`
      grid-column: span 6;
    `}
  `}

  ${({ $gridSpan, $featured, $wide }) => !$gridSpan && !$featured && !$wide && css`
    ${theme.above.large`
      grid-column: span 4;
    `}
  `}
`

const navIconAccent = accent => {
  if (accent === 'green') {
    return {
      color: colors.accentGreen,
      background: 'rgba(0, 175, 65, 0.12)',
    }
  }
  if (accent === 'muted') {
    return {
      color: colors.secondaryLight,
      background: 'rgba(108, 91, 123, 0.1)',
    }
  }
  return {
    color: colors.primary,
    background: 'rgba(192, 108, 132, 0.12)',
  }
}

export const ActionIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  flex-shrink: 0;
  color: ${({ $accent }) => navIconAccent($accent).color};
  background: ${({ $accent }) => navIconAccent($accent).background};

  .anticon,
  svg {
    font-size: 1.125rem;
  }
`

export const SidebarIcon = styled(ActionIcon)``

export const ActionTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${colors.secondary};
`

export const ActionDescription = styled.span`
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${surface.muted};
  flex: 1;
`

export const ActionCta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: auto;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${colors.accentGreen};
`

export const StepsList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`

export const StepItem = styled.li`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.875rem;
  align-items: start;
  padding: 0.875rem 1rem;
  border-radius: 0.875rem;
  background: rgba(244, 248, 244, 0.85);
  border: 1px solid ${surface.line};
`

export const StepIndex = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${colors.white};
  background: ${colors.secondary};
`

export const StepText = styled.span`
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${colors.secondary};
`

export const ProfileShell = styled.div`
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
  padding: 1.25rem 0.5rem 3rem;

  ${theme.above.med`
    padding: 1.75rem 0.75rem 3.5rem;
  `}
`

export const ProfileHero = styled(motion.header)`
  display: grid;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem 1.25rem;
  border-radius: 1.5rem;
  background: ${surface.hero};
  border: 1px solid ${surface.heroBorder};
  box-shadow: ${surface.shadow};

  ${theme.above.med`
    grid-template-columns: auto 1fr;
    align-items: center;
    padding: 1.75rem 1.75rem;
  `}
`

export const AvatarMark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 1.25rem;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${colors.white};
  background: linear-gradient(145deg, ${colors.primary}, ${colors.secondary});
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
`

export const ProfileHeroCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
`

export const ProfileTitle = styled.h1`
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${colors.secondary};
`

export const ProfileSubtitle = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  color: ${surface.muted};
`

export const ProfileMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.35rem;
`

export const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${colors.secondary};
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid ${surface.line};
`

export const ProfileFormCard = styled(motion.div)`
  border-radius: 1.25rem;
  padding: 1.25rem 1.25rem 1.5rem;
  background: ${surface.card};
  border: 1px solid ${surface.line};
  box-shadow: ${surface.shadow};

  ${theme.above.med`
    padding: 1.5rem 1.75rem 1.75rem;
  `}

  .profile-form {
    max-width: 100%;
  }

  .profile-form .ant-form-item {
    margin-bottom: 1.125rem;
  }

  .profile-form .ant-form-item-label > label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${colors.secondary};
    height: auto;
  }

  .profile-form .ant-input,
  .profile-form .ant-select-selector {
    border-radius: 0.75rem !important;
    border-color: ${surface.line} !important;
    min-height: 2.75rem;
  }

  .profile-form .ant-input:focus,
  .profile-form .ant-select-focused .ant-select-selector {
    border-color: ${colors.accentGreen} !important;
    box-shadow: 0 0 0 2px rgba(0, 175, 65, 0.14) !important;
  }

  .profile-form .ant-form-item-control-input-content {
    font-size: 0.9375rem;
    color: ${colors.secondary};
  }
`

export const FormSection = styled.fieldset`
  border: 0;
  margin: 0 0 1.5rem;
  padding: 0 0 1.25rem;
  min-width: 0;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${surface.line};
  }

  &:last-of-type {
    margin-bottom: 0.75rem;
    padding-bottom: 0;
  }
`

export const FormSectionLegend = styled.legend`
  display: block;
  width: 100%;
  margin: 0 0 1rem;
  padding: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${colors.primary};
`

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0 0.25rem;

  ${theme.above.med`
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 1.25rem;
  `}

  .profile-form-span-full {
    ${theme.above.med`
      grid-column: 1 / -1;
    `}
  }
`

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
  margin-top: 0.25rem;
  border-top: 1px solid ${surface.line};

  .ant-btn-primary {
    min-width: 9rem;
    height: 2.75rem;
    border-radius: 999px;
    font-weight: 600;
    box-shadow: 0 10px 24px -12px rgba(0, 175, 65, 0.55);
  }
`

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 22 },
  },
}

export const ParentLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  align-items: start;

  ${theme.above.large`
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: 1.5rem;
  `}
`

export const ChildrenPanel = styled(Panel)`
  height: fit-content;
`

export const ChildrenListHeader = styled.h2`
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${colors.secondary};
`

export const SidebarShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  max-height: 100dvh;
  padding: 0.5rem 0.35rem 0.75rem;
  background: linear-gradient(180deg, #fafcfa 0%, #f4f8f4 100%);
  border-inline-end: 1px solid rgba(108, 91, 123, 0.1);
  overflow: hidden;
  box-sizing: border-box;

  ${({ $collapsed }) => $collapsed && css`
    padding: 0.5rem 0.375rem 0.65rem;
  `}
`

export const SidebarTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  padding: 0.35rem 0.4rem 0.55rem;
  flex-shrink: 0;

  ${({ $collapsed }) => $collapsed && css`
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 0.35rem;
    padding: 0.35rem 0.2rem 0.5rem;
  `}
`

export const SidebarTopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  order: 0;

  ${({ $collapsed }) => $collapsed && css`
    flex-direction: column;
    order: 2;
  `}
`

export const SidebarCollapseBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  margin: 0;
  margin-left: auto;
  padding: 0;
  border: none;
  border-radius: 0.65rem;
  background: rgba(0, 175, 65, 0.1);
  color: ${colors.secondary};
  cursor: pointer;
  flex-shrink: 0;
  order: 1;
  transition:
    background 0.22s cubic-bezier(0.32, 0.72, 0, 1),
    color 0.22s ease,
    transform 0.18s ease;

  ${({ $collapsed }) => $collapsed && css`
    margin-left: 0;
    order: 0;
  `}

  &:hover {
    background: rgba(0, 175, 65, 0.18);
    color: ${colors.accentGreen};
  }

  &:active {
    transform: scale(0.96);
  }

  .anticon {
    font-size: 1.05rem;
  }
`

export const SidebarFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
  padding: 0.65rem 0.35rem 0.25rem;
  flex-shrink: 0;
  border-top: 1px solid rgba(108, 91, 123, 0.1);
  background: #f4f8f4;
  position: relative;
  z-index: 2;

  ${({ $collapsed }) => $collapsed && css`
    padding: 0.5rem 0.15rem 0.2rem;
    align-items: stretch;
  `}
`

export const SidebarUtils = styled.div`
  display: none;
`

export const SidebarLogoutBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  gap: 0.65rem;
  width: 100%;
  min-height: 2.75rem;
  margin: 0;
  padding: ${({ $collapsed }) => ($collapsed ? '0.55rem' : '0.55rem 0.75rem')};
  border: 1px solid rgba(198, 40, 40, 0.22);
  border-radius: 0.875rem;
  background: rgba(198, 40, 40, 0.08);
  color: #b71c1c;
  font-family: inherit;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.22s cubic-bezier(0.32, 0.72, 0, 1),
    border-color 0.22s ease,
    color 0.22s ease,
    transform 0.18s ease;

  .anticon {
    font-size: 1.05rem;
    color: #c62828;
  }

  &:hover {
    background: rgba(198, 40, 40, 0.16);
    border-color: rgba(198, 40, 40, 0.38);
    color: #8b0000;
  }

  &:active {
    transform: scale(0.98);
  }
`

export const SidebarAdminActions = styled.div`
  padding: 0.75rem 0.5rem 0.35rem;
`

export const SidebarMenu = styled(Menu)`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background: transparent !important;
  border-inline-end: none !important;

  ${({ $collapsed }) => !$collapsed && css`
    padding: 0.25rem 0.35rem;

    .ant-menu-item {
      display: flex !important;
      align-items: center !important;
      gap: 0.75rem;
      height: auto !important;
      min-height: 2.75rem;
      margin: 0.2rem 0 !important;
      padding: 0.5rem 0.65rem !important;
      line-height: 1.35 !important;
      border-radius: 0.875rem;
      color: ${colors.secondary};
      transition:
        background 0.22s cubic-bezier(0.32, 0.72, 0, 1),
        color 0.22s ease;
    }

    .ant-menu-item .ant-menu-item-icon {
      width: auto !important;
      min-width: 2.5rem;
      margin-inline-end: 0 !important;
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
    }

    .ant-menu-title-content {
      font-size: 0.9375rem;
      font-weight: 500;
      overflow: visible;
      text-overflow: clip;
      white-space: nowrap;
    }

    .ant-menu-item:not(.ant-menu-item-selected):hover {
      background: rgba(192, 108, 132, 0.08) !important;
      color: ${colors.secondary} !important;
    }

    .ant-menu-item-selected {
      background: rgba(0, 175, 65, 0.1) !important;
      color: ${colors.secondary} !important;
      font-weight: 600;
    }

    .ant-menu-item-selected .ant-menu-title-content {
      font-weight: 600;
    }

    .ant-menu-item-selected ${SidebarIcon} {
      color: ${colors.accentGreen};
      background: rgba(0, 175, 65, 0.16);
    }

    .ant-menu-item-divider {
      margin: 0.65rem 0.5rem !important;
      border-block-start-color: rgba(108, 91, 123, 0.14) !important;
    }

  `}

  ${({ $collapsed }) => $collapsed && css`
    &&.ant-menu-inline-collapsed {
      width: 100% !important;
      padding: 0 !important;
      border-inline-end: none !important;
    }

    &&.ant-menu-inline-collapsed > .ant-menu-item {
      width: 100% !important;
      max-width: 100% !important;
      height: 2.5rem !important;
      min-height: 2.5rem !important;
      margin: 0.125rem 0 !important;
      padding: 0 !important;
      padding-inline: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0 !important;
      border-radius: 0.625rem;
      line-height: 1 !important;
      overflow: visible !important;
    }

    &&.ant-menu-inline-collapsed > .ant-menu-item .ant-menu-item-icon {
      width: auto !important;
      height: auto !important;
      min-width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      background: none !important;
      border-radius: 0 !important;
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem !important;
      line-height: 1 !important;
      color: ${colors.secondary} !important;
      opacity: 1 !important;
      transition: color 0.22s ease;
    }

    &&.ant-menu-inline-collapsed > .ant-menu-item .ant-menu-item-icon .anticon {
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem !important;
      line-height: 1 !important;
      color: inherit !important;
      opacity: 1 !important;
    }

    &&.ant-menu-inline-collapsed > .ant-menu-item .ant-menu-title-content {
      display: none !important;
      width: 0 !important;
      opacity: 0 !important;
    }

    &&.ant-menu-inline-collapsed > .ant-menu-item:not(.ant-menu-item-selected):hover {
      background: rgba(192, 108, 132, 0.1) !important;
    }

    &&.ant-menu-inline-collapsed > .ant-menu-item-selected {
      background: rgba(0, 175, 65, 0.14) !important;
    }

    &&.ant-menu-inline-collapsed > .ant-menu-item-selected .ant-menu-item-icon,
    &&.ant-menu-inline-collapsed > .ant-menu-item[data-icon-accent='green'] .ant-menu-item-icon {
      color: ${colors.accentGreen} !important;
    }

    &&.ant-menu-inline-collapsed > .ant-menu-item[data-icon-accent='muted'] .ant-menu-item-icon,
    &&.ant-menu-inline-collapsed > .ant-menu-item[data-menu-logout='true'] .ant-menu-item-icon {
      color: ${colors.secondaryLight} !important;
    }
  `}
`

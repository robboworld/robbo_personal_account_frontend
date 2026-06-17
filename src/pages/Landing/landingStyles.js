import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'

import robboGuestTokens from '@/theme/robboGuestTokens'

const t = robboGuestTokens
const easeOut = [0.16, 1, 0.3, 1]

const cardShell = css`
  background: ${t.white};
  border-radius: ${t.cardRadius};
  box-shadow: ${t.cardShadow};
  padding: clamp(1.5rem, 3vw, 2rem);
  border: 1px solid rgba(0, 0, 0, 0.05);
`

export const sectionReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px 0px' },
  transition: { duration: 0.45, ease: easeOut },
}

export const PageRoot = styled.div`
  min-height: 100dvh;
  width: 100%;
  background: ${t.pageBg};
  color: ${t.coal};
  font-family: ${t.fontFamily};
  display: flex;
  flex-direction: column;
`

export const Main = styled.main`
  flex: 1;
  width: 100%;
`

export const HeroInner = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1.5rem, 4vw, 2.5rem);
  align-items: start;

  @media (min-width: 920px) {
    grid-template-columns: 1.05fr 0.95fr;
    gap: clamp(1.5rem, 3vw, 2rem);
  }
`

export const HeroTitle = styled.h1`
  margin: 0 0 1rem;
  font-size: clamp(1.75rem, 3.8vw, 2.35rem);
  font-weight: 700;
  line-height: 1.15;
  color: ${t.coal};
  letter-spacing: -0.02em;
`

export const HeroLede = styled.p`
  margin: 0;
  font-size: clamp(1rem, 1.8vw, 1.125rem);
  line-height: 1.55;
  color: ${t.bodyMuted};
  max-width: 42ch;
`

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`

export const HeroBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: ${t.ctaHeight};
  padding: 0 1.5rem;
  border-radius: ${t.heroBtnRadius};
  font-family: inherit;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.2;
  text-decoration: none !important;
  transition: opacity 0.2s ease, transform 0.2s ease;
  cursor: pointer;

  &:hover {
    opacity: 0.92;
    text-decoration: none !important;
  }

  &:focus-visible {
    outline: 2px solid ${t.green};
    outline-offset: 2px;
  }
`

export const HeroBtnPrimary = styled(HeroBtn)`
  background: ${t.green};
  color: #fff !important;
  border: 1px solid ${t.green};
`

export const HeroBtnSecondary = styled(HeroBtn)`
  background: #fff;
  color: ${t.coal} !important;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: ${t.cardShadow};
`

export const AboutPanel = styled.article`
  margin: 0;
`

export const AboutTagline = styled.p`
  margin: 0 0 1rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${t.green};
`

export const AboutStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 1rem;
`

export const AboutStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`

export const StatValue = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
  color: ${t.coal};
`

export const StatLabel = styled.span`
  font-size: 0.8125rem;
  color: ${t.bodyMuted};
`

export const AboutIntro = styled.p`
  margin: 0 0 1rem;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${t.bodyMuted};
`

export const AboutHighlight = styled.li`
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${t.bodyMuted};
  list-style: none;
`

export const Accent = styled.span`
  color: ${t.green};
  font-weight: 600;
`

export const ContentWrap = styled.div`
  max-width: ${t.contentMax};
  margin: 0 auto;
  padding: ${t.sectionGap} ${t.sectionPadX};
  display: flex;
  flex-direction: column;
  gap: ${t.sectionGap};
`

export const SectionCard = styled(motion.section)`
  ${cardShell}
`

export const SectionTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-size: clamp(1.35rem, 2.8vw, 1.75rem);
  font-weight: 700;
  line-height: 1.2;
  color: ${t.coal};
`

export const Subtitle = styled.h3`
  margin: 1.5rem 0 0.5rem;
  font-size: 1.0625rem;
  font-weight: 600;
  color: ${t.coal};
`

export const Lead = styled.p`
  margin: 0 0 0.75rem;
  font-size: 0.9375rem;
  line-height: 1.58;
  color: ${t.bodyMuted};
  max-width: 72ch;
`

export const Eyebrow = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.8125rem;
  color: ${t.grey};
  line-height: 1.5;
`

export const MediaRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 1rem 0;
`

export const VideoCard = styled.div`
  flex: 1 1 240px;
  min-width: 220px;
  border-radius: ${t.cardRadius};
  overflow: hidden;
  background: #0e120e;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: ${t.cardShadow};

  video,
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }
`

export const FrameVideoCard = styled(VideoCard)`
  position: relative;

  .mainVideo {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }

  .frameVideo {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 44%;
    height: 44%;
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.9);
    object-fit: cover;
  }
`

export const CtaBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: ${t.ctaHeight};
  padding: 0 1.25rem;
  margin-top: 0.5rem;
  border-radius: ${t.heroBtnRadius};
  background: ${t.green};
  color: #fff !important;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none !important;
  text-align: center;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
    color: #fff !important;
    text-decoration: none !important;
  }

  &:focus-visible {
    outline: 2px solid ${t.greenDark};
    outline-offset: 2px;
  }

  &[aria-disabled='true'],
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    pointer-events: none;
  }
`

export const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1.25rem;
`

export const CtaGhost = styled(CtaBtn)`
  background: #fff;
  color: ${t.coal} !important;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: none;

  &:hover {
    color: ${t.coal} !important;
  }
`

export const StepStack = styled.div`
  margin: 1rem 0 0;
  border: 1px solid rgba(0, 175, 65, 0.12);
  border-radius: ${t.cardRadius};
  overflow: hidden;
  background: ${t.pageBg};
`

export const StepRow = styled.div`
  position: relative;
  padding: 0.875rem 1rem 0.875rem 3rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: ${t.bodyMuted};

  &:not(:first-child) {
    border-top: 1px solid rgba(0, 175, 65, 0.1);
  }
`

export const StepIndex = styled.span`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  background: ${t.green};
`

export const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const GalleryCard = styled.button`
  appearance: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  background: transparent;
  border-radius: ${t.cardRadius};

  img {
    width: 100%;
    height: 190px;
    object-fit: cover;
    border-radius: ${t.cardRadius};
    display: block;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  &:focus-visible {
    outline: 2px solid ${t.green};
    outline-offset: 3px;
  }
`

export const CopyCard = styled.div`
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${t.bodyMuted};
`

export const StyledRouterLink = styled.a`
  text-decoration: none;
`

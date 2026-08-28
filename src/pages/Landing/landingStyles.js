import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'

import robboGuestTokens from '@/theme/robboGuestTokens'

const t = robboGuestTokens
const easeOut = [0.16, 1, 0.3, 1]

export const sectionReveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px 0px' },
  transition: { duration: 0.5, ease: easeOut },
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

export const SkipLink = styled.a`
  position: absolute;
  left: 12px;
  top: -48px;
  z-index: 2000;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  background: ${t.white};
  color: ${t.greenDark};
  font-weight: 700;
  text-decoration: none;

  &:focus {
    top: 12px;
    outline: 2px solid ${t.white};
    outline-offset: 2px;
  }
`

const inner = css`
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 ${t.sectionPadX};
`

export const Intro = styled.section`
  position: relative;
  overflow: hidden;
  background: ${t.heroGreen};
  color: ${t.white};
`

export const IntroInner = styled.div`
  ${inner}
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(220px, 0.95fr);
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: center;
  min-height: min(34rem, 78dvh);
  padding-top: clamp(2.25rem, 5vw, 3.5rem);
  padding-bottom: clamp(2.5rem, 5vw, 3.75rem);

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
    min-height: 0;
    padding-top: 2rem;
    padding-bottom: 2.25rem;
  }
`

export const IntroCopy = styled.div`
  min-width: 0;
`

export const IntroTitle = styled.h1`
  margin: 0 0 0.85rem;
  max-width: 16ch;
  font-size: clamp(2rem, 4.6vw, 3.15rem);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: ${t.white};
  text-wrap: balance;
`

export const IntroLede = styled.p`
  margin: 0 0 1.5rem;
  max-width: 36ch;
  font-size: clamp(1.05rem, 1.8vw, 1.25rem);
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.92);
`

export const IntroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`

const introBtn = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 1.45rem;
  border-radius: ${t.heroBtnRadius};
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.2;
  text-decoration: none !important;
  cursor: pointer;
  transition:
    transform 0.2s cubic-bezier(0.32, 0.72, 0, 1),
    box-shadow 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    text-decoration: none !important;
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${t.white};
    outline-offset: 3px;
  }
`

export const IntroBtnPrimary = styled.a`
  ${introBtn}
  background: ${t.white};
  color: ${t.greenDark} !important;
  border: 1px solid ${t.white};
  box-shadow: 0 8px 20px rgba(0, 70, 28, 0.18);

  &:hover {
    color: ${t.greenDark} !important;
  }
`

export const IntroBtnGhost = styled.a`
  ${introBtn}
  background: transparent;
  color: ${t.white} !important;
  border: 1.5px solid rgba(255, 255, 255, 0.85);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${t.white} !important;
  }
`

export const IntroVisual = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;

  @media (max-width: 840px) {
    min-height: 200px;
    order: -1;
  }
`

export const IntroMascot = styled.img`
  display: block;
  width: min(100%, 420px);
  height: auto;
  filter: drop-shadow(0 12px 20px rgba(2, 147, 64, 0.18));
  pointer-events: none;
  user-select: none;
`

export const IntroLinks = styled.nav`
  ${inner}
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem 1.5rem;
  padding-top: 0.85rem;
  padding-bottom: 1.15rem;
  background: ${t.pageBg};

  a {
    color: ${t.green};
    font-size: 0.95rem;
    font-weight: 700;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    &:focus-visible {
      outline: 2px solid ${t.green};
      outline-offset: 3px;
      border-radius: 4px;
    }
  }
`

export const Band = styled(motion.section)`
  background: ${t.pageBg};
  padding: clamp(2.25rem, 5vw, 3.5rem) 0;
`

export const BandWhite = styled(Band)`
  background: ${t.white};
`

export const BandInner = styled.div`
  ${inner}
`

export const BandHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
`

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.45rem, 2.6vw, 1.85rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: ${t.coal};
  text-wrap: balance;
`

export const BandLink = styled.a`
  flex-shrink: 0;
  color: ${t.green};
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${t.green};
    outline-offset: 3px;
    border-radius: 4px;
  }
`

export const Lead = styled.p`
  margin: 0 0 1.25rem;
  max-width: 62ch;
  font-size: 1rem;
  line-height: 1.55;
  color: ${t.bodyMuted};
`

export const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.85rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    padding-bottom: 0.35rem;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;

    > * {
      flex: 0 0 min(220px, 72vw);
      scroll-snap-align: start;
    }
  }
`

export const ProjectTile = styled.button`
  appearance: none;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
  border: 1px solid rgba(0, 80, 32, 0.08);
  border-radius: 12px;
  background: ${t.white};
  box-shadow: ${t.cardShadow};
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.22s cubic-bezier(0.32, 0.72, 0, 1),
    box-shadow 0.22s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${t.cardShadowHover};
  }

  &:active {
    transform: translateY(-1px) scale(0.995);
  }

  &:focus-visible {
    outline: 2px solid ${t.green};
    outline-offset: 3px;
  }
`

export const ProjectTileMedia = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  background:
    linear-gradient(145deg, rgba(0, 175, 65, 0.18), rgba(0, 122, 46, 0.35)),
    ${t.pageBg};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

export const ProjectTileBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.7rem 0.8rem 0.85rem;
  min-width: 0;
`

export const ProjectTileTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.3;
  color: ${t.coal};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`

export const ProjectTileAuthor = styled.span`
  font-size: 0.75rem;
  color: ${t.grey};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ProjectTileMeta = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${t.green};
  font-variant-numeric: tabular-nums;
`

export const ProjectsEmpty = styled.p`
  margin: 0;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  border: 1px dashed rgba(0, 80, 32, 0.18);
  background: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${t.bodyMuted};
  text-align: center;
`

export const CreateGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.25rem, 3vw, 2rem);

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`

export const CreateCol = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

export const CreateKicker = styled.h3`
  margin: 0 0 0.4rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: ${t.coal};
`

export const CreateText = styled.p`
  margin: 0 0 0.9rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: ${t.bodyMuted};
`

export const CreateMedia = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.55rem;
  margin-bottom: 1rem;
`

export const MediaThumb = styled.div`
  overflow: hidden;
  border-radius: 10px;
  background: #122016;
  aspect-ratio: 4 / 3;
  border: 1px solid rgba(0, 80, 32, 0.08);

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

const pillBtn = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  min-height: ${t.ctaHeight};
  padding: 0 1.2rem;
  border-radius: ${t.heroBtnRadius};
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none !important;
  text-align: center;
  cursor: pointer;
  transition:
    opacity 0.2s ease,
    transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    text-decoration: none !important;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${t.greenDark};
    outline-offset: 3px;
  }
`

export const CtaBtn = styled.a`
  ${pillBtn}
  background: ${t.green};
  color: ${t.white} !important;
  border: 1px solid ${t.green};
`

export const CtaGhost = styled.a`
  ${pillBtn}
  background: ${t.white};
  color: ${t.greenDark} !important;
  border: 1.5px solid ${t.green};
`

export const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`

export const TariffGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  align-items: stretch;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`

export const TariffCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  min-height: 100%;
  padding: 1.25rem 1.2rem 1.3rem;
  border-radius: 14px;
  border: 1px solid ${({ $featured }) =>
    $featured ? 'rgba(0, 175, 65, 0.45)' : 'rgba(0, 80, 32, 0.08)'};
  background: ${t.white};
  box-shadow: ${({ $featured }) =>
    $featured
      ? '0 10px 28px rgba(0, 122, 46, 0.12)'
      : t.cardShadow};
`

export const TariffName = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${t.coal};
`

export const TariffPrice = styled.p`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${t.green};
  font-variant-numeric: tabular-nums;
`

export const TariffList = styled.ul`
  margin: 0.15rem 0 0.5rem;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;

  li {
    position: relative;
    padding-left: 1rem;
    font-size: 0.875rem;
    line-height: 1.45;
    color: ${t.bodyMuted};
  }

  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.55em;
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: ${t.green};
  }
`

export const StageTrack = styled.ol`
  position: relative;
  margin: 0 0 1.75rem;
  padding: 0;
  list-style: none;

  &::before {
    content: '';
    position: absolute;
    left: 19px;
    top: 12px;
    bottom: 12px;
    width: 2px;
    background: linear-gradient(
      180deg,
      ${t.green} 0%,
      rgba(0, 175, 65, 0.18) 100%
    );
  }
`

export const Stage = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  gap: 0.95rem 1.1rem;
  padding-bottom: 1.15rem;

  &:last-child {
    padding-bottom: 0;
  }
`

export const StageIndex = styled.span`
  position: relative;
  z-index: 1;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
  background: ${({ $highlight }) => ($highlight ? t.green : t.white)};
  color: ${({ $highlight }) => ($highlight ? t.white : t.green)};
  border: 2px solid ${t.green};
  box-shadow: 0 0 0 6px ${t.white};
`

export const StageCard = styled.div`
  min-width: 0;
  padding: 0.7rem 0.95rem 0.85rem;
  border-radius: 12px;
  background: ${({ $highlight }) =>
    $highlight ? 'rgba(0, 175, 65, 0.09)' : t.pageBg};
  border: 1px solid ${({ $highlight }) =>
    $highlight ? 'rgba(0, 175, 65, 0.28)' : 'transparent'};
`

export const StageDate = styled.span`
  display: block;
  margin-bottom: 0.2rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: ${t.green};
  font-variant-numeric: tabular-nums;
`

export const StageTitle = styled.span`
  display: block;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
  color: ${t.coal};
`

export const StageDetail = styled.span`
  display: block;
  margin-top: 0.28rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${t.bodyMuted};
`

export const OlympiadDests = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 0.85rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

export const DestCard = styled.a`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1.05rem 1.15rem 1.15rem;
  border-radius: 14px;
  text-decoration: none !important;
  background: ${({ $primary }) => ($primary ? t.green : t.pageBg)};
  color: ${({ $primary }) => ($primary ? t.white : t.coal)} !important;
  border: 1px solid ${({ $primary }) =>
    $primary ? t.green : 'rgba(0, 80, 32, 0.08)'};
  box-shadow: ${({ $primary }) =>
    $primary ? '0 10px 24px rgba(0, 122, 46, 0.18)' : t.cardShadow};
  transition:
    transform 0.22s cubic-bezier(0.32, 0.72, 0, 1),
    box-shadow 0.22s ease;

  &:hover {
    transform: translateY(-2px);
    text-decoration: none !important;
    color: ${({ $primary }) => ($primary ? t.white : t.coal)} !important;
  }

  &:active {
    transform: translateY(0) scale(0.99);
  }

  &:focus-visible {
    outline: 2px solid ${t.greenDark};
    outline-offset: 3px;
  }
`

export const DestKicker = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.78;
`

export const DestTitle = styled.span`
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.25;
`

export const DestText = styled.span`
  font-size: 0.8125rem;
  line-height: 1.45;
  opacity: 0.88;
`

export const EducatorsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(1.25rem, 3vw, 2.25rem);
  align-items: center;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`

export const EducatorsVisual = styled.div`
  overflow: hidden;
  border-radius: 16px;
  min-height: 220px;
  background: ${t.greenLight};

  img {
    width: 100%;
    height: 100%;
    min-height: 220px;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 800px) {
    order: -1;
  }
`

export const AboutStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, max-content));
  gap: 1.5rem 2.5rem;
  margin: 0 0 1.15rem;
`

export const AboutStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

export const StatValue = styled.span`
  font-size: clamp(2.25rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  color: ${t.green};
  font-variant-numeric: tabular-nums;
`

export const StatLabel = styled.span`
  font-size: 0.9rem;
  color: ${t.bodyMuted};
`

export const AboutIntro = styled.p`
  margin: 0 0 1rem;
  max-width: 62ch;
  font-size: 0.975rem;
  line-height: 1.55;
  color: ${t.bodyMuted};
`

export const AboutHighlight = styled.li`
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  margin: 0 0 0.65rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${t.bodyMuted};
  list-style: none;
`

export const Accent = styled.span`
  color: ${t.green};
  font-weight: 700;
`

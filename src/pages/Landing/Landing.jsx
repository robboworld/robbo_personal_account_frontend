import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Button, ConfigProvider, theme as antdThemeApi } from 'antd'
import styled, { createGlobalStyle } from 'styled-components'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TbBolt,
  TbCode,
  TbLayoutDashboard,
  TbRobot,
  TbRoute,
  TbSchool,
  TbStars,
} from 'react-icons/tb'

import appTheme from '@/theme'
import { useLandingTheme } from '@/helpers/landingTheme'

/** Логотип в шапке — локальный файл из `static/logo.png`. */
const HEADER_LOGO_URL = '/static/logo.png'

const ACCENT = appTheme.colors.accentGreen
const ACCENT_HOVER = appTheme.colors.accentGreenHover

const HERO_PILLS = [
  { Icon: TbLayoutDashboard, label: 'РОББО' },
  { Icon: TbRobot, label: 'Робототехника' },
  { Icon: TbSchool, label: 'LMS' },
  { Icon: TbCode, label: 'Scratch.ru' },
]

const SIGNAL_ROWS = [
  {
    Icon: TbStars,
    label: 'РОББО Класс',
    text:
      'Инженерный инновационный класс и методика преподавания — от цифровой среды до реального оборудования. Подробнее на innoclass.ru.',
  },
  {
    Icon: TbBolt,
    label: 'Инженерная траектория',
    text:
      'От первого проекта в Scratch до программирования роботов РОББО и участия в международных олимпиадах.',
  },
  {
    Icon: TbRoute,
    label: 'Единый аккаунт',
    text:
      'Личный кабинет объединяет профиль, обучение в LMS и Scratch-проекты: один вход — без повторной авторизации.',
  },
]

const easeOutExpo = [0.16, 1, 0.3, 1]

const headerMotion = {
  initial: { y: -16, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5, ease: easeOutExpo },
}

const heroBandMotion = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: easeOutExpo, delay: 0.06 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOutExpo },
  },
}

const sectionReveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px 0px' },
  transition: { duration: 0.5, ease: easeOutExpo },
}

/** Перекрывает глобальный градиент #root из globalStyles — иначе в тёмной теме половина экрана остаётся светлой. */
const LandingGlobal = createGlobalStyle`
  html.landing-page-active,
  html.landing-page-active body,
  html.landing-page-active #root {
    min-height: 100%;
  }

  html.landing-page-active[data-landing-theme='light'],
  html.landing-page-active[data-landing-theme='light'] body,
  html.landing-page-active[data-landing-theme='light'] #root {
    background: #f2f8f2 !important;
    background-image: none !important;
  }

  html.landing-page-active[data-landing-theme='dark'],
  html.landing-page-active[data-landing-theme='dark'] body,
  html.landing-page-active[data-landing-theme='dark'] #root {
    background: #0a0c0a !important;
    background-image: none !important;
  }
`

const PageRoot = styled.div`
  --robbo: ${ACCENT};
  --robbo-hover: ${ACCENT_HOVER};
  --landing-html-bg: #f2f8f2;
  --landing-page-bg: linear-gradient(
    158deg,
    #e6f0e6 0%,
    #fafcf9 42%,
    #edf4ed 100%
  );
  --landing-header-bg: rgba(252, 253, 252, 0.94);
  --landing-border: rgba(0, 175, 65, 0.14);
  --landing-surface: rgba(255, 255, 255, 0.96);
  --landing-surface-2: #f5fbf5;
  --landing-text: #141914;
  --landing-muted: #4a564a;
  --landing-accent: ${ACCENT};
  --landing-accent-hover: ${ACCENT_HOVER};
  --landing-glow: rgba(0, 175, 65, 0.12);
  --landing-grid: rgba(0, 175, 65, 0.045);
  --landing-video-bg: #0e120e;
  --landing-ring: rgba(0, 175, 65, 0.35);
  --landing-inset-line: rgba(255, 255, 255, 0.5);

  min-height: 100vh;
  width: 100%;
  color: var(--landing-text);
  background: var(--landing-page-bg);
  position: relative;
  font-family: 'DM Sans', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue',
    sans-serif;
  transition: color 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &::before {
    content: '';
    pointer-events: none;
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(var(--landing-grid) 1px, transparent 1px),
      linear-gradient(90deg, var(--landing-grid) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 75% 55% at 14% 0%, black 18%, transparent 70%);
    opacity: 0.85;
    z-index: 0;
  }

  &[data-theme='dark'] {
    --landing-html-bg: #0a0c0a;
    --landing-page-bg: linear-gradient(
      158deg,
      #070907 0%,
      #0c100c 45%,
      #080a08 100%
    );
    --landing-header-bg: rgba(10, 12, 10, 0.96);
    --landing-border: rgba(0, 175, 65, 0.22);
    --landing-surface: rgba(16, 20, 16, 0.97);
    --landing-surface-2: rgba(12, 16, 12, 0.92);
    --landing-text: #eef5ee;
    --landing-muted: #9cb09c;
    --landing-accent: ${ACCENT};
    --landing-accent-hover: ${ACCENT_HOVER};
    --landing-glow: rgba(0, 175, 65, 0.2);
    --landing-grid: rgba(0, 175, 65, 0.07);
    --landing-video-bg: #050805;
    --landing-ring: rgba(0, 175, 65, 0.45);
    --landing-inset-line: rgba(255, 255, 255, 0.07);
  }
`

const HeaderBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 14px 22px;
  border-bottom: 1px solid var(--landing-border);
  background: var(--landing-header-bg);
  box-shadow:
    0 1px 0 rgba(0, 0, 0, 0.04),
    0 8px 28px rgba(0, 0, 0, 0.06);

  [data-theme='dark'] & {
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.04),
      0 8px 28px rgba(0, 0, 0, 0.45);
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      ${ACCENT} 30%,
      ${ACCENT} 70%,
      transparent
    );
    opacity: 0.85;
    pointer-events: none;
  }
`

const BrandMark = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  line-height: 0;
`

const BrandLogoImg = styled.img`
  display: block;
  height: 38px;
  width: auto;
`

const NavCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-left: auto;
`

const StyledRouterLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
`

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 96px 20px 100px;
  position: relative;
  z-index: 1;
`

const HeroBand = styled.div`
  max-width: 1160px;
  margin: 0 auto 44px;
  padding: 40px 36px 36px;
  border-radius: 12px;
  border: 1px solid var(--landing-border);
  background: var(--landing-surface);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 18px 48px rgba(0, 175, 65, 0.08);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -32%;
    right: -16%;
    width: 58%;
    height: 125%;
    background: radial-gradient(
      closest-side,
      rgba(0, 175, 65, 0.09),
      transparent 72%
    );
    pointer-events: none;
  }
`

const HeroTitle = styled.h1`
  font-size: clamp(28px, 4.2vw, 44px);
  line-height: 1.08;
  margin: 0 0 18px;
  letter-spacing: -0.035em;
  font-weight: 700;
  position: relative;
  z-index: 1;
  max-width: 24ch;
  color: var(--landing-text);
  text-wrap: balance;

  &::after {
    content: '';
    display: block;
    width: min(88px, 26vw);
    height: 3px;
    margin-top: 18px;
    border-radius: 2px;
    background: ${ACCENT};
  }
`

const HeroTagline = styled.p`
  font-size: 16px;
  line-height: 1.62;
  color: var(--landing-muted);
  margin: 0;
  max-width: 48ch;
  position: relative;
  z-index: 1;
  text-wrap: pretty;
`

const HeroSplit = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  position: relative;
  z-index: 1;
  margin-top: 10px;
  align-items: start;

  @media (min-width: 920px) {
    grid-template-columns: 1.18fr 0.82fr;
    gap: 40px;
  }
`

const HeroMainCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const SignalColumn = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--landing-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--landing-surface-2);
  box-shadow: inset 0 1px 0 var(--landing-inset-line);
`

const SignalRow = styled.div`
  padding: 16px 18px;
  display: flex;
  gap: 14px;
  align-items: flex-start;

  &:first-child {
    padding: 20px 18px 18px;
  }

  &:not(:first-child) {
    border-top: 1px solid var(--landing-border);
  }

  svg {
    flex-shrink: 0;
    margin-top: 3px;
    color: var(--landing-accent);
    font-size: 20px;
  }
`

const SignalLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  color: var(--landing-muted);
  margin-bottom: 4px;
`

const SignalText = styled.div`
  font-size: 14px;
  line-height: 1.52;
  font-weight: 600;
  color: var(--landing-text);
`

const Section = styled.section`
  max-width: 1160px;
  margin: 0 auto 40px;
  padding: 32px 28px;
  background: var(--landing-surface);
  border-radius: 12px;
  border: 1px solid var(--landing-border);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 14px 40px rgba(0, 175, 65, 0.06);
  position: relative;
  z-index: 1;

  &:nth-of-type(2) {
    margin-bottom: 52px;
    padding: 34px 30px;
  }

  &:nth-of-type(4) {
    margin-bottom: 56px;
  }

  /* Ant Design: disabled primary на тёмных секциях не должен «пропадать» */
  .ant-btn-primary.ant-btn-disabled,
  a.ant-btn-primary.ant-btn-disabled {
    color: rgba(255, 255, 255, 0.94) !important;
    background: color-mix(in srgb, ${ACCENT} 48%, var(--landing-surface-2)) !important;
    border-color: color-mix(in srgb, ${ACCENT} 55%, var(--landing-border)) !important;
    opacity: 1 !important;
    cursor: not-allowed;
  }

  .ant-btn-primary.ant-btn-disabled span,
  a.ant-btn-primary.ant-btn-disabled span {
    color: inherit !important;
  }
`

const SectionTitle = styled.h2`
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.15;
  margin-bottom: 14px;
  letter-spacing: -0.028em;
  font-weight: 700;
  text-wrap: balance;
`

const Subtitle = styled.h3`
  font-size: 18px;
  line-height: 1.28;
  margin: 22px 0 10px;
  color: var(--landing-text);
  font-weight: 600;
`

const Lead = styled.p`
  font-size: 16px;
  line-height: 1.58;
  margin-bottom: 12px;
  color: var(--landing-muted);
  max-width: 72ch;
`

const MediaRow = styled.div`
  display: flex;
  gap: 18px;
  align-items: stretch;
  margin: 18px 0 20px;
  flex-wrap: wrap;
`

const VideoCard = styled.div`
  flex: 1 1 260px;
  min-width: 240px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--landing-video-bg);
  border: 1px solid var(--landing-border);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.12);

  video {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
  }
`

const FrameVideoCard = styled.div`
  flex: 1 1 260px;
  min-width: 240px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--landing-video-bg);
  position: relative;
  border: 1px solid var(--landing-border);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.12);

  .mainVideo {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
  }

  .frameVideo {
    position: absolute;
    right: 12px;
    top: 12px;
    width: 46%;
    height: 46%;
    border-radius: 10px;
    border: 2px solid rgba(255, 255, 255, 0.92);
    object-fit: cover;
    display: block;
  }
`

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const GalleryCard = styled.button`
  appearance: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  background: transparent;
  text-align: left;
  border-radius: 12px;

  img {
    width: 100%;
    height: 210px;
    object-fit: cover;
    border-radius: 12px;
    display: block;
    border: 1px solid var(--landing-border);
  }

  &:focus-visible {
    outline: 2px solid var(--landing-accent);
    outline-offset: 3px;
  }
`

const CopyCard = styled.div`
  font-size: 14px;
  line-height: 1.58;
  color: var(--landing-muted);
`

const ActionRow = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;

  .ant-btn-link {
    color: var(--landing-accent) !important;
  }

  .ant-btn-link.ant-btn-disabled,
  .ant-btn-link[disabled],
  a.ant-btn-link.ant-btn-disabled {
    color: var(--landing-text) !important;
    opacity: 1 !important;
    cursor: not-allowed;
    -webkit-text-fill-color: var(--landing-text);
  }

  .ant-btn-link.ant-btn-disabled span,
  a.ant-btn-link.ant-btn-disabled span {
    color: inherit !important;
  }
`

const StepStack = styled.div`
  margin: 18px 0 0;
  border: 1px solid var(--landing-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--landing-surface-2);
`

const StepRow = styled.div`
  position: relative;
  padding: 14px 18px 14px 52px;
  color: var(--landing-muted);
  font-size: 15px;
  line-height: 1.52;

  &:not(:first-child) {
    border-top: 1px solid var(--landing-border);
  }
`

const StepIndex = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  color: #f8fff8;
  background: ${ACCENT};
`

const TechStrip = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: 8px;
  margin: 12px 0 6px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: thin;

  @media (min-width: 960px) {
    overflow-x: visible;
  }
`

const TechPill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex: 0 0 auto;
  min-height: 36px;
  box-sizing: border-box;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1.15;
  white-space: nowrap;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--landing-accent) 32%, var(--landing-border));
  background: color-mix(in srgb, var(--landing-accent) 10%, var(--landing-surface-2));
  color: var(--landing-muted);
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;

  svg {
    flex-shrink: 0;
    width: 15px;
    height: 15px;
    color: var(--landing-accent);
    opacity: 0.9;
  }

  &:hover {
    border-color: color-mix(in srgb, var(--landing-accent) 48%, var(--landing-border));
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--landing-accent) 12%, transparent);
  }
`

const MotionHeaderBar = motion(HeaderBar)
const MotionHeroBand = motion(HeroBand)
const MotionHeroSplit = motion(HeroSplit)
const MotionHeroMainCol = motion(HeroMainCol)
const MotionSignalColumn = motion(SignalColumn)
const MotionSignalRow = motion(SignalRow)
const MotionSection = motion(Section)
const MotionGalleryCard = motion(GalleryCard)
const MotionVideoCard = motion(VideoCard)
const MotionFrameVideoCard = motion(FrameVideoCard)
const MotionTechPill = motion(TechPill)

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

const VideoLoop = ({ src, muted = true, className }) => (
  <video
    src={src}
    autoPlay
    muted={muted}
    loop
    playsInline
    preload='metadata'
    className={className}
  />
)

const Landing = () => {
  const { dark } = useLandingTheme()

  useEffect(() => {
    document.title = 'РОББО — личный кабинет и образовательная экосистема'
  }, [])

  useLayoutEffect(() => {
    document.documentElement.classList.add('landing-page-active')
    return () => {
      document.documentElement.classList.remove('landing-page-active')
      document.documentElement.removeAttribute('data-landing-theme')
    }
  }, [])

  useLayoutEffect(() => {
    document.documentElement.setAttribute(
      'data-landing-theme',
      dark ? 'dark' : 'light',
    )
  }, [dark])

  const staticBase = '/static'

  const [v1to3, setV1to3] = useState([])
  const [v4to6, setV4to6] = useState([])

  const galleryItems = useMemo(() => {
    const imgs = ['img1.jpg', 'img2.jpg', 'img3.jpg']
    return shuffle(imgs).map((file, idx) => ({
      file,
      url: `https://scratch.ru/example${idx + 1}`,
    }))
  }, [])

  useEffect(() => {
    setV1to3(shuffle(['vid1.mp4', 'vid2.mp4', 'vid3.mp4']))
    setV4to6(shuffle(['vid4.mp4', 'vid5.mp4', 'vid6.mp4']))
  }, [])

  const v7 = `${staticBase}/vid7.mp4`

  /** Всегда defaultAlgorithm: darkAlgorithm перекрашивает primary в более светлый оттенок. Цвет кнопок/ссылок — тот же #00AF41 в обеих темах. */
  const antdTheme = {
    algorithm: antdThemeApi.defaultAlgorithm,
    token: {
      colorPrimary: ACCENT,
      colorLink: ACCENT,
      colorInfo: ACCENT,
      borderRadius: 8,
    },
  }

  const videoReveal = {
    initial: { opacity: 0, y: 16, scale: 0.98 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: '-32px' },
    transition: { duration: 0.45, ease: easeOutExpo },
  }

  const signalHover = {
    whileHover: { backgroundColor: 'var(--landing-surface)' },
    transition: { duration: 0.2 },
  }

  return (
    <ConfigProvider theme={antdTheme}>
      <LandingGlobal />
      <PageRoot data-theme={dark ? 'dark' : 'light'}>
        <MotionHeaderBar {...headerMotion}>
          <NavCluster>
            <BrandMark>
              <BrandLogoImg
                src={HEADER_LOGO_URL}
                alt=''
                decoding='async'
              />
            </BrandMark>
          </NavCluster>
          <HeaderActions>
            <StyledRouterLink to='/login'>
              <Button>Войти</Button>
            </StyledRouterLink>
            <StyledRouterLink to='/register'>
              <Button type='default'>Регистрация</Button>
            </StyledRouterLink>
            <Button
              type='primary'
              href='https://scratch.ru'
              target='_blank'
              rel='noreferrer'
            >
              Создавать
            </Button>
          </HeaderActions>
        </MotionHeaderBar>

        <Container>
          <MotionHeroBand {...heroBandMotion}>
            <MotionHeroSplit
              variants={staggerContainer}
              initial='hidden'
              animate='show'
            >
              <MotionHeroMainCol variants={staggerItem}>
                <motion.div
                  variants={staggerContainer}
                  initial='hidden'
                  animate='show'
                >
                  <motion.div variants={staggerItem}>
                    <TechStrip>
                      {HERO_PILLS.map(({ Icon, label }) => (
                        <MotionTechPill
                          key={label}
                          whileHover={{ y: -2, transition: { duration: 0.2 } }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Icon size={15} aria-hidden />
                          {label}
                        </MotionTechPill>
                      ))}
                    </TechStrip>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <HeroTitle>
                      Личный кабинет РОББО — единая точка входа в экосистему
                    </HeroTitle>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <HeroTagline>
                      Профиль, обучение в LMS, Scratch-проекты на scratch.ru и
                      единый вход без повторной авторизации — всё в одном
                      портале для учеников, педагогов и родителей.
                    </HeroTagline>
                  </motion.div>
                </motion.div>
              </MotionHeroMainCol>
              <MotionSignalColumn variants={staggerItem}>
                {SIGNAL_ROWS.map(({ Icon, label, text }) => (
                  <MotionSignalRow key={label} {...signalHover}>
                    <Icon
                      size={21}
                      aria-hidden
                    />
                    <div>
                      <SignalLabel>{label}</SignalLabel>
                      <SignalText>{text}</SignalText>
                    </div>
                  </MotionSignalRow>
                ))}
              </MotionSignalColumn>
            </MotionHeroSplit>
          </MotionHeroBand>

          <MotionSection {...sectionReveal}>
            <CopyCard>
              Scratch.ru — российская суверенная онлайн-платформа для
              визуального программирования и язык программирования для детей и
              взрослых
            </CopyCard>
            <SectionTitle>
              Scratch.ru – визуальное программирование на русском языке!
            </SectionTitle>

            <Subtitle>1.1. о программировании Виртуальных исполнителей алгоритмов</Subtitle>
            <Lead>
              Scratch.ru - среда для создания проектов игр, викторин,
              мультфильмов, анимационных историй. (Это для взрослых, поэтому мы
              сознательно перечисляем типы проектов, которые мы ждем на
              Олимпиаде.)
            </Lead>

            <MediaRow>
              {v1to3.map(file => (
                <MotionVideoCard key={file} {...videoReveal}>
                  <VideoLoop src={`${staticBase}/${file}`} />
                </MotionVideoCard>
              ))}
            </MediaRow>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              style={{ display: 'inline-block' }}
            >
              <Button
                type='primary'
                size='large'
                href='https://scratch.ru/'
                target='_blank'
                rel='noreferrer'
              >
                НАЧАТЬ ПРОГРАММИРОВАТЬ
              </Button>
            </motion.div>

            <Subtitle>1.2. о программировании РОБОТОВ - реальных исполнителей алгоритмов</Subtitle>
            <Lead>Scratch.ru среда для программирования роботов РОББО</Lead>

            <MediaRow>
              {v4to6.map(file => (
                <MotionFrameVideoCard key={file} {...videoReveal}>
                  <VideoLoop
                    src={`${staticBase}/${file}`}
                    className='mainVideo'
                  />
                  <VideoLoop
                    src={`${staticBase}/${file}`}
                    className='frameVideo'
                  />
                </MotionFrameVideoCard>
              ))}
            </MediaRow>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              style={{ display: 'inline-block' }}
            >
              <Button
                type='primary'
                size='large'
                href='https://scratch.ru/'
                target='_blank'
                rel='noreferrer'
              >
                НАЧАТЬ ПРОГРАММИРОВАТЬ РОБОТА РОББО
              </Button>
            </motion.div>
          </MotionSection>

          <MotionSection {...sectionReveal}>
            <SectionTitle>2. LMS — обучение на платформе РОББО</SectionTitle>
            <Lead>
              Система дистанционного обучения на базе Open edX: курсы, прогресс,
              зачисления и сертификаты. Каталог курсов живёт в LMS — личный
              кабинет открывает его по единому входу (SSO), без дублирования
              списка курсов.
            </Lead>

            <Subtitle>2.1. Как это работает</Subtitle>
            <StepStack>
              <StepRow>
                <StepIndex>1</StepIndex>
                Войдите в личный кабинет РОББО — профиль и роль подтягиваются из
                единой учётной записи.
              </StepRow>
              <StepRow>
                <StepIndex>2</StepIndex>
                Нажмите «LMS» в меню — откроется платформа lms2.robbo.world с
                бесшовной авторизацией.
              </StepRow>
              <StepRow>
                <StepIndex>3</StepIndex>
                Проходите курсы, отслеживайте прогресс и возвращайтесь в ЛК за
                проектами и уведомлениями.
              </StepRow>
            </StepStack>

            <Subtitle style={{ marginTop: 26 }}>2.2. Примеры курсов</Subtitle>
            <Lead>
              «Секреты Scratch» — для детей от 7 лет: анимационная история и путь
              к Scratch-олимпиаде. Отдельные программы — для педагогов и членов
              жюри номинаций Scratch и RobboScratch.
            </Lead>

            <ActionRow>
              <StyledRouterLink to='/login'>
                <Button type='primary' size='large'>
                  Войти в личный кабинет
                </Button>
              </StyledRouterLink>
              <Button
                size='large'
                href='https://lms2.robbo.world'
                target='_blank'
                rel='noreferrer'
              >
                Открыть LMS
              </Button>
              <Button
                type='link'
                href='https://support.robbo.world/'
                target='_blank'
                rel='noreferrer'
              >
                Центр поддержки РОББО
              </Button>
            </ActionRow>
          </MotionSection>

          <MotionSection {...sectionReveal}>
            <SectionTitle>3. Scratch-олимпиада и сообщество</SectionTitle>

            <Subtitle>3.1. Scratch-олимпиада</Subtitle>
            <Lead>
              Ежегодная международная олимпиада по креативному программированию:
              две номинации — Scratch и RobboScratch. Участники создают игры,
              викторины, анимацию и проекты с роботами РОББО.
            </Lead>

            <Subtitle>Лента ключевых дат</Subtitle>
            <StepStack>
              <StepRow>
                <StepIndex>1</StepIndex>
                дата 1
              </StepRow>
              <StepRow>
                <StepIndex>2</StepIndex>
                дата 2
              </StepRow>
              <StepRow>
                <StepIndex>3</StepIndex>
                дата 3
              </StepRow>
              <StepRow>
                <StepIndex>4</StepIndex>
                дата 4
              </StepRow>
              <StepRow>
                <StepIndex>5</StepIndex>
                дата 5
              </StepRow>
            </StepStack>

            <CopyCard style={{ marginTop: 18 }}>
              прием заявок на российский межрегиональный отборочный тур
              <br />
              прием заявок на российский отборочный тур
              <br />
              прием заявок на международный этап
              <br />
              международный этап
              <br />
              награждение победителей международный этап
            </CopyCard>

            <ActionRow>
              <Button type='link' disabled>
                Подробнее
              </Button>
              <Button type='link' disabled>
                Подробнее
              </Button>
              <Button type='link' disabled>
                Подробнее
              </Button>
              <Button type='link' disabled>
                Подробнее
              </Button>
            </ActionRow>

            <Subtitle style={{ marginTop: 26 }}>3.2. Трейлер олимпиады</Subtitle>
            <MotionVideoCard style={{ margin: '14px 0 18px', maxWidth: 520 }} {...videoReveal}>
              <VideoLoop src={v7} />
            </MotionVideoCard>

            <ActionRow>
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type='primary'
                  href='https://creativeprogramming.org/'
                  target='_blank'
                  rel='noreferrer'
                >
                  УЗНАТЬ БОЛЬШЕ про МЕЖДУНАРОДНУЮ Scratch-Олимпиаду
                </Button>
              </motion.div>
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
                <Button
                  href='https://robbo.ru/olymp/'
                  target='_blank'
                  rel='noreferrer'
                >
                  УЗНАТЬ БОЛЬШЕ про Российский этап Scratch - ОЛИМПИАДЫ
                </Button>
              </motion.div>
            </ActionRow>

            <Subtitle style={{ marginTop: 26 }}>Примеры проектов</Subtitle>
            <Lead>
              Галерея с привлекательными картинками-скриншотами (гифками). При
              клике на картинку открывается проект.
            </Lead>
            <GalleryGrid>
              {galleryItems.map(({ file, url }) => (
                <MotionGalleryCard
                  key={file}
                  type='button'
                  onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                  whileHover={{ y: -5, transition: { duration: 0.22, ease: easeOutExpo } }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, ease: easeOutExpo }}
                >
                  <img src={`${staticBase}/${file}`} alt='Example project' />
                </MotionGalleryCard>
              ))}
            </GalleryGrid>

            <Subtitle style={{ marginTop: 32 }}>3.3. Педагогам и родителям</Subtitle>
            <Lead>
              Курс «Секреты Scratch» предназначен для детей от 7 лет и старше.
              Участники разработают анимационную историю и смогут отправить её
              на Scratch-олимпиаду. В основном дети проходят курс самостоятельно.
            </Lead>
            <Lead>
              Роль родителей и педагогов — помощь в соблюдении безопасности при
              работе за компьютером и при установке ROBBO Scratch на устройство
              ребёнка.
            </Lead>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              style={{ display: 'inline-block' }}
            >
              <Button
                type='primary'
                size='large'
                href='https://lms2.robbo.world/courses/course-v1:Robbo+AC002+June/about'
                target='_blank'
                rel='noreferrer'
              >
                НАЧНИ бесплатно ИЗУЧЕНИЕ Scratch
              </Button>
            </motion.div>

            <Subtitle>3.4. Критерии оценки работ в дисциплине Scratch</Subtitle>
            <Lead>
              Курс для членов жюри дисциплины Scratch в рамках Российского
              национального отборочного этапа Международной Scratch-Олимпиады по
              креативному программированию. В жюри — педагоги с опытом
              преподавания Scratch.
            </Lead>
            <ActionRow>
              <Button
                type='primary'
                href='#'
                disabled
              >
                СТАТЬ ЭКСПЕРТОМ ПРОВЕРКИ РАБОТ В дисциплине Scratch
              </Button>
            </ActionRow>

            <Subtitle>3.5. Критерии оценки работ в дисциплине RobboScratch</Subtitle>
            <Lead>
              Курс для членов жюри дисциплины RobboScratch — креативное
              программирование с мобильными роботами и цифровыми лабораториями
              РОББО. В жюри — педагоги с опытом работы на оборудовании РОББО.
            </Lead>
            <ActionRow>
              <Button
                type='primary'
                href='#'
                disabled
              >
                СТАТЬ ЭКСПЕРТОМ ПРОВЕРКИ РАБОТ В дисциплине RobboScratch
              </Button>
            </ActionRow>
          </MotionSection>
        </Container>
      </PageRoot>
    </ConfigProvider>
  )
}

export default Landing

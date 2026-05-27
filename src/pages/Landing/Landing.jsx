import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Button, ConfigProvider, theme as antdThemeApi } from 'antd'
import styled, { createGlobalStyle } from 'styled-components'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaMoon, FaSun } from 'react-icons/fa'
import {
  TbBolt,
  TbCode,
  TbLayoutDashboard,
  TbRobot,
  TbRoute,
  TbStars,
  TbTrophy,
} from 'react-icons/tb'

import appTheme from '@/theme'

/** Логотип в шапке — локальный файл из `static/logo.png`. */
const HEADER_LOGO_URL = '/static/logo.png'

const ACCENT = appTheme.colors.accentGreen
const ACCENT_HOVER = appTheme.colors.accentGreenHover

const LANDING_THEME_KEY = 'scratch-landing-theme'

const HERO_PILLS = [
  { Icon: TbCode, label: 'Визуальная среда' },
  { Icon: TbRobot, label: 'Робототехника' },
  { Icon: TbTrophy, label: 'Олимпиады' },
  { Icon: TbLayoutDashboard, label: 'Платформа' },
]

const SIGNAL_ROWS = [
  {
    Icon: TbBolt,
    label: 'Инженерный фокус',
    text:
      'От блок-схем к реальным исполнителям: цифровая среда и железо РОББО в одной цепочке.',
  },
  {
    Icon: TbStars,
    label: 'Развитие продукта',
    text:
      'Методики и среда обновляются под школы, олимпиады и STEM.',
  },
  {
    Icon: TbRoute,
    label: 'Траектория',
    text:
      'От первого проекта в Scratch до международных номинаций и экспертного жюри.',
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

const ThemeToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--landing-border);
  background: var(--landing-surface-2);
  color: var(--landing-text);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
`

const StyledRouterLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
`

const StyledExternalAnchor = styled.a`
  color: var(--landing-accent);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease, color 0.2s ease;

  &:hover {
    border-bottom-color: var(--landing-accent);
    color: var(--landing-accent-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--landing-accent);
    outline-offset: 2px;
    border-radius: 2px;
  }
`

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 96px 20px 80px;
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
  max-width: 17ch;
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
const MotionThemeToggle = motion(ThemeToggle)
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
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const v = localStorage.getItem(LANDING_THEME_KEY)
      if (v === 'dark' || v === 'light') return v === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch {
      return false
    }
  })

  useEffect(() => {
    document.title = 'Scratch.ru – визуальное программирование на русском языке!'
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(LANDING_THEME_KEY, dark ? 'dark' : 'light')
    } catch {
      /* ignore */
    }
  }, [dark])

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
          </NavCluster>
          <MotionThemeToggle
            type='button'
            onClick={() => setDark(d => !d)}
            aria-label={dark ? 'Светлая тема' : 'Тёмная тема'}
            whileHover={{ scale: 1.02, boxShadow: `0 0 0 3px var(--landing-glow)` }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          >
            {dark ? <FaSun size={16} /> : <FaMoon size={16} />}
            {dark ? 'Светлая тема' : 'Тёмная тема'}
          </MotionThemeToggle>
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
                      Scratch.ru — визуальное программирование на русском языке
                    </HeroTitle>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <HeroTagline>
                      Российская онлайн-платформа для творческих проектов: игры,
                      викторины, анимация и управление роботами РОББО в одной
                      образовательной экосистеме.
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
            <SectionTitle>2. Scratch-олимпиада</SectionTitle>
            <Lead>
              Ежегодная международная олимпиада, 2 номинации, даты и примеры
              работ в виде гифок победителей
            </Lead>

            <Subtitle>2.1. Краткая Лента времени с ключевыми датами</Subtitle>
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

            <Subtitle style={{ marginTop: 26 }}>2.2. Трейлер Олимпиады</Subtitle>
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
              Галерея с привлекательными картинками-скриншотами (гифками ). При
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
          </MotionSection>

          <MotionSection {...sectionReveal}>
            <SectionTitle>3. Педагогам</SectionTitle>

            <Subtitle>3.1 Изучаем Скретч</Subtitle>
            <Lead>
              Курс Секреты Scratch предназначен для детей от 7 лет и старше.
              Участники разработают свою анимационную историю и смогут отправить
              ее на Scratch Олимпиаду. В основном дети могут пройти курс
              самостоятельно.
            </Lead>
            <Lead>
              Роль родителей и педагогов заключается в помощи детям в соблюдении
              безопасности при работе за компьютером. Поддержка взрослых может
              понадобиться при установке ROBBO Scratch на устройство ребенка.
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

            <Subtitle>3.2 Изучаем критерии оценки олимпиадных работ в дисциплине Scratch</Subtitle>
            <Lead>
              Курс предназначен для членов жюри дисциплины Scratch в рамках
              Российского национального отборочного этапа Международной
              Scratch-Олимпиады по креативному программированию.
            </Lead>
            <Lead>В состав жюри могут войти только педагоги с опытом преподавания Scratch.</Lead>
            <ActionRow>
              <Button
                type='primary'
                href='#'
                disabled
              >
                СТАТЬ ЭКСПЕРТОМ ПРОВЕРКИ РАБОТ В дисциплине Scratch
              </Button>
            </ActionRow>

            <Subtitle>3.3 Изучаем критерии оценки олимпиадных работ в дисциплине RobboScratch</Subtitle>
            <Lead>
              Курс предназначен для членов жюри дисциплины RobboScratch —
              креативное программирование на RobboScratch с использованием
              мобильных роботов и цифровых лабораторий РОББО.
            </Lead>
            <Lead>В состав жюри могут войти только педагоги с опытом работы на оборудовании РОББО.</Lead>
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

          <MotionSection {...sectionReveal}>
            <SectionTitle>4. О РОББО</SectionTitle>

            <Subtitle>О компании</Subtitle>
            <Lead>
              Модернизация урока &quot;Технология&quot;. Инженерный инновационный
              РОББО Класс{' '}
              <StyledExternalAnchor
                href='https://innoclass.ru/'
                target='_blank'
                rel='noreferrer'
              >
                innoclass.ru
              </StyledExternalAnchor>
            </Lead>

            <Subtitle>4.2. Методика преподавания</Subtitle>
            <Lead>
              Тут еще раз говорим про то что скретч.ру поддерживает традиц
              ценности, потом напоминаем инструкцию по использованию, потом текст
              про уникальные возможности при обучении программированию и далее
              про ЭУМК РОББО.
            </Lead>
            <Lead>Квик-гайд</Lead>

            <Subtitle style={{ marginTop: 18 }}>Это первоначальный список:</Subtitle>
            <CopyCard>
              <div style={{ marginBottom: 10 }}>
                Инструкция для педагогов - как открыть, как сохранить
              </div>
              <div style={{ marginBottom: 10 }}>
                <StyledExternalAnchor
                  href='https://scratch.ru'
                  target='_blank'
                  rel='noreferrer'
                >
                  Начать работу
                </StyledExternalAnchor>{' '}
                — переход на нынешний scratch.ru
              </div>
              <div style={{ marginBottom: 10 }}>
                Кнопки как в футере - на Секреты Скретч, Заявки на покупку
                оборудования Иннокласс, заявка на участие в Scratch-Олимпиаде,
                заявка на обучение педагогов
              </div>
              <div style={{ marginBottom: 10 }}>Ссылки на Протокол с работами - #</div>
              <div style={{ marginBottom: 10 }}>
                Видео лучших работ в номинации RobboScratch - #
              </div>
            </CopyCard>
          </MotionSection>
        </Container>
      </PageRoot>
    </ConfigProvider>
  )
}

export default Landing

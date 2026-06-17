import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import { Link } from 'react-router-dom'

import {
  AboutHighlight,
  AboutIntro,
  AboutPanel,
  AboutStat,
  AboutStats,
  AboutTagline,
  Accent,
  ContentWrap,
  CopyCard,
  CtaBtn,
  CtaGhost,
  CtaRow,
  Eyebrow,
  FrameVideoCard,
  GalleryCard,
  GalleryGrid,
  HeroInner,
  HeroLede,
  HeroTitle,
  Lead,
  Main,
  MediaRow,
  PageRoot,
  SectionCard,
  SectionTitle,
  StatLabel,
  StatValue,
  StepIndex,
  StepRow,
  StepStack,
  Subtitle,
  VideoCard,
  sectionReveal,
} from './landingStyles'

import RobboGuestHeader from '@/components/RobboGuestHeader/RobboGuestHeader'
import RobboSiteFooter from '@/components/RobboSiteFooter/RobboSiteFooter'
import RobboGuestFonts from '@/theme/robboGuestFonts'
import robboGuestTokens from '@/theme/robboGuestTokens'


const LandingGlobal = createGlobalStyle`
  html.landing-page-active,
  html.landing-page-active body,
  html.landing-page-active #root {
    min-height: 100dvh;
    background: ${robboGuestTokens.pageBg} !important;
    background-image: none !important;
  }
`

const ABOUT_HIGHLIGHTS = [
  {
    accent: 'Институты развития:',
    text: 'лидерский проект АСИ, Лидер НТИ, резидент «Сколково» и кластера «Ломоносов».',
  },
  {
    accent: 'При поддержке:',
    text: 'Минпромторг, Минцифры, Минобрнауки, Минэкономразвития.',
  },
]

const OFFICIAL_IMGS = [
  'official_img_1.png',
  'official_img2.jpg',
  'official_img3.jpg',
  'official_img4.jpg',
]

function pickOfficial(n) {
  return Array.from(
    { length: n },
    () => OFFICIAL_IMGS[Math.floor(Math.random() * OFFICIAL_IMGS.length)],
  )
}

const MediaImage = ({ src, className }) => (
  <img src={src} alt=''
className={className} />
)

const Landing = () => {
  useEffect(() => {
    document.title = 'РОББО — личный кабинет и образовательная экосистема'
  }, [])

  useLayoutEffect(() => {
    document.documentElement.classList.add('landing-page-active')
    return () => {
      document.documentElement.classList.remove('landing-page-active')
    }
  }, [])

  const staticBase = '/static'
  const [v1to3, setV1to3] = useState([])
  const [v4to6, setV4to6] = useState([])

  const galleryItems = useMemo(
    () =>
      pickOfficial(3).map((file, idx) => ({
        file,
        url: `https://scratch.ru/example${idx + 1}`,
      })),
    [],
  )

  const [trailerImg, setTrailerImg] = useState('')

  useEffect(() => {
    setV1to3(pickOfficial(3))
    setV4to6(pickOfficial(3))
    setTrailerImg(pickOfficial(1)[0])
  }, [])

  return (
    <PageRoot>
      <RobboGuestFonts />
      <LandingGlobal />
      <RobboGuestHeader />
      <Main id='content'>
        <ContentWrap>
          <SectionCard {...sectionReveal}>
            <HeroInner>
              <div>
                <HeroTitle>
                  Личный кабинет РОББО — единая точка входа в экосистему
                </HeroTitle>
                <HeroLede>
                  Профиль, обучение в LMS, Scratch-проекты на scratch.ru и единый
                  вход без повторной авторизации — для учеников, педагогов и
                  родителей.
                </HeroLede>
              </div>
              <AboutPanel aria-labelledby='about-robbo'>
                <AboutTagline id='about-robbo'>Открытые технологии будущего</AboutTagline>
                <AboutStats role='list'>
                  <AboutStat role='listitem'>
                    <StatValue>19</StatValue>
                    <StatLabel>лет на рынке</StatLabel>
                  </AboutStat>
                  <AboutStat role='listitem'>
                    <StatValue>44</StatValue>
                    <StatLabel>стран мира</StatLabel>
                  </AboutStat>
                </AboutStats>
                <AboutIntro>
                  Уже 19 лет мы внедряем технологии на базе открытого кода (Open
                  Source), развиваем робототехнику и занимаемся системной
                  интеграцией сложных инженерных систем. Наши продукты и методики
                  востребованы в <Accent>44 странах мира</Accent>.
                </AboutIntro>
                <ul style={{ margin: 0, padding: 0 }}>
                  {ABOUT_HIGHLIGHTS.map(({ accent, text }) => (
                    <AboutHighlight key={accent}>
                      <span aria-hidden>•</span>
                      <span>
                        <Accent>{accent}</Accent> {text}
                      </span>
                    </AboutHighlight>
                  ))}
                </ul>
              </AboutPanel>
            </HeroInner>
          </SectionCard>

          <SectionCard {...sectionReveal}>
            <Eyebrow>
              Scratch.ru — российская суверенная онлайн-платформа для визуального
              программирования
            </Eyebrow>
            <SectionTitle>
              Scratch.ru – визуальное программирование на русском языке!
            </SectionTitle>
            <Subtitle>1.1. о программировании Виртуальных исполнителей алгоритмов</Subtitle>
            <Lead>
              Scratch.ru — среда для создания проектов игр, викторин, мультфильмов,
              анимационных историй.
            </Lead>
            <MediaRow>
              {v1to3.map((file, idx) => (
                <VideoCard key={`${file}-${idx}`}>
                  <MediaImage src={`${staticBase}/${file}`} />
                </VideoCard>
              ))}
            </MediaRow>
            <CtaBtn href='https://scratch.ru/' target='_blank'
rel='noreferrer'>
              НАЧАТЬ ПРОГРАММИРОВАТЬ
            </CtaBtn>

            <Subtitle>1.2. о программировании РОБОТОВ - реальных исполнителей алгоритмов</Subtitle>
            <Lead>Scratch.ru среда для программирования роботов РОББО</Lead>
            <MediaRow>
              {v4to6.map((file, idx) => (
                <FrameVideoCard key={`${file}-${idx}`}>
                  <MediaImage src={`${staticBase}/${file}`} className='mainVideo' />
                  <MediaImage src={`${staticBase}/${file}`} className='frameVideo' />
                </FrameVideoCard>
              ))}
            </MediaRow>
            <CtaBtn href='https://scratch.ru/' target='_blank'
rel='noreferrer'>
              НАЧАТЬ ПРОГРАММИРОВАТЬ РОБОТА РОББО
            </CtaBtn>
          </SectionCard>

          <SectionCard {...sectionReveal}>
            <SectionTitle>2. LMS — обучение на платформе РОББО</SectionTitle>
            <Lead>
              Система дистанционного обучения на базе Open edX: курсы, прогресс,
              зачисления и сертификаты. Каталог курсов живёт в LMS — личный кабинет
              открывает его по единому входу (SSO).
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
                Нажмите «LMS» в меню — откроется платформа online.robbo.ru с
                бесшовной авторизацией.
              </StepRow>
              <StepRow>
                <StepIndex>3</StepIndex>
                Проходите курсы, отслеживайте прогресс и возвращайтесь в ЛК за
                проектами и уведомлениями.
              </StepRow>
            </StepStack>
            <Subtitle>2.2. Примеры курсов</Subtitle>
            <Lead>
              «Секреты Scratch» — для детей от 7 лет. Отдельные программы — для
              педагогов и членов жюри номинаций Scratch и RobboScratch.
            </Lead>
            <CtaRow>
              <CtaBtn as={Link} to='/login'>
                Войти в личный кабинет
              </CtaBtn>
              <CtaGhost href='https://online.robbo.ru' target='_blank'
rel='noreferrer'>
                Открыть LMS
              </CtaGhost>
              <CtaGhost href='https://support.robbo.world/' target='_blank'
rel='noreferrer'>
                Центр поддержки РОББО
              </CtaGhost>
            </CtaRow>
          </SectionCard>

          <SectionCard {...sectionReveal}>
            <SectionTitle>3. Scratch-олимпиада и сообщество</SectionTitle>
            <Subtitle>3.1. Scratch-олимпиада</Subtitle>
            <Lead>
              Ежегодная международная олимпиада по креативному программированию:
              две номинации — Scratch и RobboScratch.
            </Lead>
            <Subtitle>Лента ключевых дат</Subtitle>
            <StepStack>
              {['дата 1', 'дата 2', 'дата 3', 'дата 4', 'дата 5'].map((label, i) => (
                <StepRow key={label}>
                  <StepIndex>{i + 1}</StepIndex>
                  {label}
                </StepRow>
              ))}
            </StepStack>
            <CopyCard style={{ marginTop: '1rem' }}>
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
            <Subtitle>3.2. Трейлер олимпиады</Subtitle>
            {trailerImg && (
              <VideoCard style={{ maxWidth: 520, margin: '0.75rem 0' }}>
                <MediaImage src={`${staticBase}/${trailerImg}`} />
              </VideoCard>
            )}
            <CtaRow>
              <CtaBtn href='https://creativeprogramming.org/' target='_blank'
rel='noreferrer'>
                УЗНАТЬ БОЛЬШЕ про МЕЖДУНАРОДНУЮ Scratch-Олимпиаду
              </CtaBtn>
              <CtaGhost href='https://robbo.ru/olymp/' target='_blank'
rel='noreferrer'>
                УЗНАТЬ БОЛЬШЕ про Российский этап
              </CtaGhost>
            </CtaRow>
            <Subtitle>Примеры проектов</Subtitle>
            <Lead>
              Галерея с привлекательными картинками-скриншотами. При клике
              открывается проект.
            </Lead>
            <GalleryGrid>
              {galleryItems.map(({ file, url }, idx) => (
                <GalleryCard
                  key={`${file}-${idx}`}
                  type='button'
                  onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                >
                  <img src={`${staticBase}/${file}`} alt='Example project' />
                </GalleryCard>
              ))}
            </GalleryGrid>
            <Subtitle>3.3. Педагогам и родителям</Subtitle>
            <Lead>
              Курс «Секреты Scratch» — для детей от 7 лет. Участники разработают
              анимационную историю и смогут отправить её на Scratch-олимпиаду.
            </Lead>
            <CtaBtn
              href='https://online.robbo.ru/courses/course-v1:Robbo+AC002+June/about'
              target='_blank'
              rel='noreferrer'
            >
              НАЧНИ бесплатно ИЗУЧЕНИЕ Scratch
            </CtaBtn>
            <Subtitle>3.4. Критерии оценки работ в дисциплине Scratch</Subtitle>
            <Lead>
              Курс для членов жюри дисциплины Scratch в рамках Российского
              национального отборочного этапа.
            </Lead>
            <CtaBtn href='#' aria-disabled='true'>
              СТАТЬ ЭКСПЕРТОМ ПРОВЕРКИ РАБОТ В дисциплине Scratch
            </CtaBtn>
            <Subtitle>3.5. Критерии оценки работ в дисциплине RobboScratch</Subtitle>
            <Lead>
              Курс для членов жюри дисциплины RobboScratch — креативное
              программирование с роботами РОББО.
            </Lead>
            <CtaBtn href='#' aria-disabled='true'>
              СТАТЬ ЭКСПЕРТОМ ПРОВЕРКИ РАБОТ В дисциплине RobboScratch
            </CtaBtn>
          </SectionCard>
        </ContentWrap>
      </Main>
      <RobboSiteFooter />
    </PageRoot>
  )
}

export default Landing

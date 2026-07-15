import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'

import {
  AboutHighlight,
  AboutIntro,
  AboutPanel,
  AboutStat,
  AboutStats,
  AboutTagline,
  Accent,
  ContentWrap,
  CourseCard,
  CourseCardBody,
  CourseCardCta,
  CourseCardDesc,
  CourseCardImage,
  CourseCardMedia,
  CourseCardMediaShade,
  CourseCardMeta,
  CourseCardTitle,
  CourseGrid,
  CtaBtn,
  CtaGhost,
  CtaRow,
  Eyebrow,
  GalleryGrid,
  HeroInner,
  HeroLede,
  HeroTitle,
  Lead,
  Main,
  MediaRow,
  PageRoot,
  ProjectTile,
  ProjectTileAuthor,
  ProjectTileBody,
  ProjectTileGlyph,
  ProjectTileMedia,
  ProjectTileMeta,
  ProjectTileTitle,
  ProjectTileTop,
  ProjectsEmpty,
  SectionCard,
  SectionTitle,
  StatLabel,
  StatValue,
  StepIndex,
  StepRow,
  StepStack,
  Subtitle,
  Timeline,
  TimelineBody,
  TimelineDate,
  TimelineDetail,
  TimelineRow,
  TimelineTitle,
  VideoCard,
  sectionReveal,
} from './landingStyles'

import { projectPageAPI } from '@/api/projectPage'
import config from '@/config'
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

const LANDING_PROJECTS_LIMIT = 3

const getAuthorInitials = name => {
  if (!name) {
    return '?'
  }
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

const resolvePreviewUrl = preview => {
  if (!preview) {
    return ''
  }
  if (/^https?:\/\//i.test(preview) || preview.startsWith('data:')) {
    return preview
  }
  const base = (config.backendURL?.[0] || '').replace(/\/?$/, '/')
  return `${base}${preview.replace(/^\//, '')}`
}

const LMS_COURSE_EXAMPLES = [
  {
    id: 'course-v1:ROBBO+C4+November',
    title: 'Дистанционные образовательные технологии в преподавании робототехники',
    startLabel: 'Старт: 28.02.2022',
    description:
      'Курс для педагогов: дистанционные занятия по программированию роботов и 3D-моделированию, доступ к базе учебных проектов РОББО.',
    imageUrl:
      'https://online.robbo.ru/asset-v1:ROBBO+C4+November+type@asset+block@WLmgY3KijMg1.jpg',
    aboutUrl: 'https://online.robbo.ru/courses/course-v1:ROBBO+C4+November/about',
  },
  {
    id: 'course-v1:Robbo+AC002+June',
    title: 'Секреты Scratch',
    startLabel: 'Старт: 05.07.2023',
    description:
      'Курс для новичков в программировании. Вы разработаете свою анимационную историю и сможете отправить её на Scratch-олимпиаду.',
    imageUrl:
      'https://online.robbo.ru/asset-v1:Robbo+AC002+June+type@asset+block@%D0%97%D0%90%D0%A1%D0%A2%D0%90%D0%92%D0%9A%D0%90.jpg',
    aboutUrl: 'https://online.robbo.ru/courses/course-v1:Robbo+AC002+June/about',
  },
]

const OLYMPIAD_TIMELINE = [
  {
    period: 'дек 2025 — фев 2026',
    title: 'Региональные туры',
    detail:
      'В отдельных инициативных регионах. Победители получают дополнительные баллы на межрегиональном этапе.',
  },
  {
    period: 'март — май 2026',
    title: 'Приём заявок на межрегиональные туры',
    detail:
      'Подача заявок открывается на страницах туров по федеральным округам — конкретные даты определяет оргкомитет каждого межрегиона.',
  },
  {
    period: 'фев — июнь 2026',
    title: 'Межрегиональные туры',
    detail:
      'Заочный конкурс в каждом федеральном округе России по дисциплинам Scratch и RobboScratch.',
  },
  {
    period: '19 июня 2026',
    title: 'Предварительные результаты межрегиональных туров',
    detail: 'Публикация на страницах соответствующих межрегиональных туров.',
    highlight: true,
  },
  {
    period: 'июнь — июль 2026',
    title: 'Общероссийский отбор',
    detail:
      'Проекты-победители межрегиональных туров выходят в национальный отбор; лучшие формируют российскую команду.',
  },
  {
    period: 'сентябрь 2026',
    title: 'Финал Scratch-Олимпиады',
    detail: 'Международный этап и награждение победителей.',
  },
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

const LandingProjectCard = ({ project, onOpen }) => {
  const title = project.title || 'Без названия'
  const authorName = project.authorName || project.authorUserId || 'Автор'
  const previewUrl = resolvePreviewUrl(project.preview)
  return (
    <ProjectTile
      type='button'
      onClick={() => onOpen(project.projectPageId)}
      aria-label={`Открыть проект «${title}»`}
    >
      <ProjectTileMedia>
        {previewUrl ? <img src={previewUrl} alt='' loading='lazy' /> : null}
      </ProjectTileMedia>
      <ProjectTileTop>
        <ProjectTileGlyph aria-hidden>{getAuthorInitials(authorName)}</ProjectTileGlyph>
        <ProjectTileBody>
          <ProjectTileTitle>{title}</ProjectTileTitle>
          <ProjectTileMeta>Открыть проект →</ProjectTileMeta>
        </ProjectTileBody>
      </ProjectTileTop>
      <ProjectTileAuthor>{authorName}</ProjectTileAuthor>
    </ProjectTile>
  )
}

const Landing = () => {
  const navigate = useNavigate()

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
  const [galleryProjects, setGalleryProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [trailerImg, setTrailerImg] = useState('')

  useEffect(() => {
    setV1to3(pickOfficial(3))
    setV4to6(pickOfficial(3))
    setTrailerImg(pickOfficial(1)[0])
  }, [])

  useEffect(() => {
    let cancelled = false
    setProjectsLoading(true)
    projectPageAPI
      .fetchPublicProjectPages('1', String(LANDING_PROJECTS_LIMIT), { featured: 'landing' })
      .then(data => {
        if (!cancelled) {
          setGalleryProjects(data?.projectPages || [])
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGalleryProjects([])
        }
      })
      .finally(() => {
        if (!cancelled) {
          setProjectsLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const openProject = useCallback(projectPageId => {
    if (!projectPageId) {
      return
    }
    navigate(`/projects/${projectPageId}`)
  }, [navigate])

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
                <VideoCard key={`${file}-${idx}`}>
                  <MediaImage src={`${staticBase}/${file}`} />
                </VideoCard>
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
            <CourseGrid>
              {LMS_COURSE_EXAMPLES.map(
                ({ id, title, startLabel, description, imageUrl, aboutUrl }, index) => (
                  <CourseCard
                    key={id}
                    href={aboutUrl}
                    target='_blank'
                    rel='noreferrer'
                    aria-label={`${title} — открыть курс в LMS`}
                  >
                    <CourseCardMedia>
                      <CourseCardImage
                        src={imageUrl}
                        alt=''
                        loading={index === 0 ? 'eager' : 'lazy'}
                        fetchPriority={index === 0 ? 'high' : 'auto'}
                      />
                      <CourseCardMediaShade aria-hidden='true' />
                    </CourseCardMedia>
                    <CourseCardBody>
                      <CourseCardTitle>{title}</CourseCardTitle>
                      <CourseCardMeta>{startLabel}</CourseCardMeta>
                      <CourseCardDesc>{description}</CourseCardDesc>
                      <CourseCardCta>Подробнее о курсе →</CourseCardCta>
                    </CourseCardBody>
                  </CourseCard>
                ),
              )}
            </CourseGrid>
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
              Всероссийская Scratch-Олимпиада по креативному программированию —
              ежегодный заочный конкурс в дисциплинах Scratch и RobboScratch.
              Участники создают оригинальные проекты без единственно верного
              решения; жюри оценивает идею, качество воплощения и проектное
              мышление. Сезон 2026 стартовал.
            </Lead>
            <Subtitle>Лента ключевых дат</Subtitle>
            <Timeline>
              {OLYMPIAD_TIMELINE.map(({ period, title, detail, highlight }) => (
                <TimelineRow key={period + title} $highlight={highlight}>
                  <TimelineDate>{period}</TimelineDate>
                  <TimelineBody>
                    <TimelineTitle>{title}</TimelineTitle>
                    <TimelineDetail>{detail}</TimelineDetail>
                  </TimelineBody>
                </TimelineRow>
              ))}
            </Timeline>
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
              Избранные публичные Scratch-проекты — анимированные истории, игры и
              робототехнические работы. Нажмите на карточку, чтобы открыть проект
              без входа в личный кабинет.
            </Lead>
            {projectsLoading ? (
              <GalleryGrid aria-busy='true'>
                {Array.from({ length: 3 }, (_, idx) => (
                  <ProjectTile
                    key={`gallery-skeleton-${idx}`}
                    as='div'
                    aria-hidden
                    style={{ minHeight: 220, opacity: 0.55, pointerEvents: 'none' }}
                  />
                ))}
              </GalleryGrid>
            ) : galleryProjects.length === 0 ? (
              <ProjectsEmpty>
                Избранных проектов для лендинга пока нет. Администратор может отметить
                публичный проект флагом landing_featured.
              </ProjectsEmpty>
            ) : (
              <GalleryGrid>
                {galleryProjects.map((project, idx) => (
                  <LandingProjectCard
                    key={`${project.projectPageId}-g-${idx}`}
                    project={project}
                    onOpen={openProject}
                  />
                ))}
              </GalleryGrid>
            )}
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
            <CtaBtn href='https://robbo.ru/olymp/expert/' target='_blank'
rel='noreferrer'>
              СТАТЬ ЭКСПЕРТОМ ПРОВЕРКИ РАБОТ В дисциплине Scratch
            </CtaBtn>
            <Subtitle>3.5. Критерии оценки работ в дисциплине RobboScratch</Subtitle>
            <Lead>
              Курс для членов жюри дисциплины RobboScratch — креативное
              программирование с роботами РОББО.
            </Lead>
            <CtaBtn href='https://robbo.ru/olymp/expert/' target='_blank'
rel='noreferrer'>
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

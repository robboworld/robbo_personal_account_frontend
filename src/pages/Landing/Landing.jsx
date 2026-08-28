import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'

import {
  AboutHighlight,
  AboutIntro,
  AboutStat,
  AboutStats,
  Accent,
  Band,
  BandHead,
  BandInner,
  BandLink,
  BandWhite,
  CreateCol,
  CreateGrid,
  CreateKicker,
  CreateMedia,
  CreateText,
  CtaBtn,
  CtaGhost,
  CtaRow,
  EducatorsGrid,
  EducatorsVisual,
  FeaturedGrid,
  Intro,
  IntroActions,
  IntroBtnGhost,
  IntroBtnPrimary,
  IntroCopy,
  IntroInner,
  IntroLede,
  IntroLinks,
  IntroMascot,
  IntroTitle,
  IntroVisual,
  Lead,
  Main,
  MediaThumb,
  DestCard,
  DestKicker,
  DestText,
  DestTitle,
  OlympiadDests,
  PageRoot,
  ProjectTile,
  ProjectTileAuthor,
  ProjectTileBody,
  ProjectTileMedia,
  ProjectTileTitle,
  ProjectsEmpty,
  SectionTitle,
  SkipLink,
  StatLabel,
  StatValue,
  Stage,
  StageCard,
  StageDate,
  StageDetail,
  StageIndex,
  StageTitle,
  StageTrack,
  TariffCard,
  TariffGrid,
  TariffList,
  TariffName,
  TariffPrice,
  sectionReveal,
} from './landingStyles'

import { projectPageAPI } from '@/api/projectPage'
import { resolveProjectPreviewUrl } from '@/helpers/projectPreview'
import RobboGuestHeader from '@/components/RobboGuestHeader/RobboGuestHeader'
import RobboSiteFooter from '@/components/RobboSiteFooter/RobboSiteFooter'
import RobboGuestFonts from '@/theme/robboGuestFonts'
import robboGuestTokens from '@/theme/robboGuestTokens'
import { getScratchEditorUrl } from '@/utils/scratchEditor'
import { EXPLORE_ROUTE, MY_LICENSES_ROUTE, REGISTER_PAGE_ROUTE } from '@/constants'

const LandingGlobal = createGlobalStyle`
  html.landing-page-active {
    scroll-behavior: smooth;
  }

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

const STORY_MEDIA = ['vid1.mp4', 'vid2.mp4', 'vid3.mp4']
const ROBOT_MEDIA = ['official_img2.jpg', 'official_img3.jpg', 'official_img4.jpg']

const LANDING_PROJECTS_LIMIT = 5

const OLYMPIAD_TIMELINE = [
  {
    period: 'дек 2025 — фев 2026',
    title: 'Региональные туры',
    detail:
      'Прошли в инициативных регионах. Победители получали дополнительные баллы в межрегионе.',
  },
  {
    period: 'март — июнь 2026',
    title: 'Приём заявок на межрегиональные туры',
    detail:
      'Даты задавал оргкомитет каждого федерального округа на странице своего тура.',
  },
  {
    period: 'фев — июнь 2026',
    title: 'Межрегиональные туры',
    detail:
      'Заочный конкурс по округам в дисциплинах Scratch и RobboScratch.',
  },
  {
    period: 'июнь — июль 2026',
    title: 'Общероссийский отбор',
    detail:
      'Победители межрегионов вышли в национальный отбор; лучшие вошли в команду России.',
  },
  {
    period: 'август 2026',
    title: 'Российский этап завершён',
    detail:
      'X Всероссийская Scratch-Олимпиада 2026 закрыта. Победители приглашены на международный финал.',
  },
  {
    period: 'сентябрь 2026',
    title: 'Международный финал',
    detail: 'Финал X Международной Scratch-Олимпиады и награждение.',
    highlight: true,
  },
]

const TARIFFS = [
  {
    id: 'free',
    name: 'Free',
    price: '0 ₽',
    featured: false,
    items: [
      '10 МБ на один проект, не общее облако',
      '1 устройство и 1 веб-сессия',
      'До 20 проектов',
      'Без автообновления RS3',
    ],
    cta: 'Начать бесплатно',
    to: REGISTER_PAGE_ROUTE,
    ghost: true,
  },
  {
    id: 'individual',
    name: 'Individual',
    price: '1 990 ₽ / год',
    featured: true,
    items: [
      '100 МБ облака под все проекты',
      '2 устройства и 2 сессии',
      'Автообновление RS3',
      '365 дней',
    ],
    cta: 'Купить',
    to: `${MY_LICENSES_ROUTE}#buy`,
    ghost: false,
  },
  {
    id: 'class',
    name: 'Class',
    price: '4 990 ₽ / год',
    featured: false,
    items: [
      '500 МБ облака под все проекты',
      '20 устройств и 20 сессий',
      'Автообновление RS3',
      'Один аккаунт на текущем этапе',
    ],
    cta: 'Купить',
    to: `${MY_LICENSES_ROUTE}#buy`,
    ghost: false,
  },
]

const LandingProjectCard = ({ project, onOpen }) => {
  const title = project.title || 'Без названия'
  const authorName = project.authorName || project.authorUserId || 'Автор'
  const previewUrl = resolveProjectPreviewUrl(project.preview, project.lastModified)
  return (
    <ProjectTile
      type='button'
      onClick={() => onOpen(project.projectPageId)}
      aria-label={`Открыть проект «${title}»`}
    >
      <ProjectTileMedia>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt=''
            loading='lazy'
          />
        ) : null}
      </ProjectTileMedia>
      <ProjectTileBody>
        <ProjectTileTitle>{title}</ProjectTileTitle>
        <ProjectTileAuthor>{authorName}</ProjectTileAuthor>
      </ProjectTileBody>
    </ProjectTile>
  )
}

const Landing = () => {
  const navigate = useNavigate()
  const createHref = getScratchEditorUrl()
  const staticBase = '/static'

  useEffect(() => {
    document.title = 'РОББО — придумывай истории, игры и анимации'
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search || '')
    const loggedOut = params.get('logged_out') === '1'
    const sessionExpired = params.get('session_expired') === '1'
    if (!loggedOut && !sessionExpired) {
      return undefined
    }
    localStorage.removeItem('token')
    params.delete('logged_out')
    params.delete('session_expired')
    const next = params.toString()
    navigate({ pathname: '/', search: next ? `?${next}` : '' }, { replace: true })
    return undefined
  }, [navigate])

  useLayoutEffect(() => {
    document.documentElement.classList.add('landing-page-active')
    return () => {
      document.documentElement.classList.remove('landing-page-active')
    }
  }, [])

  const [galleryProjects, setGalleryProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)

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
    navigate(`/projects/${projectPageId}`, {
      state: { selectedNavBarKey: 'public_projects' },
    })
  }, [navigate])

  return (
    <PageRoot>
      <RobboGuestFonts />
      <LandingGlobal />
      <SkipLink href='#content'>К содержанию</SkipLink>
      <RobboGuestHeader />
      <Main id='content'>
        <Intro>
          <IntroInner>
            <IntroCopy>
              <IntroTitle>Придумывай истории, игры и анимации</IntroTitle>
              <IntroLede>
                Делись проектами и программируй роботов РОББО
              </IntroLede>
              <IntroActions>
                <IntroBtnPrimary href={createHref}>Начать создавать</IntroBtnPrimary>
                <IntroBtnGhost as={Link} to={EXPLORE_ROUTE}>Смотреть проекты</IntroBtnGhost>
              </IntroActions>
            </IntroCopy>
            <IntroVisual>
              <IntroMascot
                src={`${staticBase}/robbo-hero-mascot.webp`}
                alt='Робот РОББО'
                width='420'
                height='420'
              />
            </IntroVisual>
          </IntroInner>
        </Intro>

        <IntroLinks aria-label='Кому это полезно'>
          <a href='#about'>О РОББО</a>
          <a href='#educators'>Педагогам</a>
          <a href='#educators'>Родителям</a>
        </IntroLinks>

        <Band id='featured' {...sectionReveal}>
          <BandInner>
            <BandHead>
              <SectionTitle>Избранные проекты</SectionTitle>
              <BandLink as={Link} to={EXPLORE_ROUTE}>Все проекты</BandLink>
            </BandHead>
            <Lead>
              Истории, игры и работы с роботами — открываются без входа
            </Lead>
            {projectsLoading ? (
              <FeaturedGrid aria-busy='true'>
                {Array.from({ length: 5 }, (_, idx) => (
                  <ProjectTile
                    key={`gallery-skeleton-${idx}`}
                    as='div'
                    aria-hidden
                    style={{ minHeight: 180, opacity: 0.5, pointerEvents: 'none' }}
                  />
                ))}
              </FeaturedGrid>
            ) : galleryProjects.length === 0 ? (
              <ProjectsEmpty>
                Пока нет избранных проектов. Загляните в обзор.
              </ProjectsEmpty>
            ) : (
              <FeaturedGrid>
                {galleryProjects.map((project, idx) => (
                  <LandingProjectCard
                    key={`${project.projectPageId}-g-${idx}`}
                    project={project}
                    onOpen={openProject}
                  />
                ))}
              </FeaturedGrid>
            )}
          </BandInner>
        </Band>

        <BandWhite id='create' {...sectionReveal}>
          <BandInner>
            <SectionTitle>Создавай на Scratch.ru</SectionTitle>
            <Lead>
              Одна среда на русском: игры, викторины, мультфильмы — и те же
              блоки для реальных роботов РОББО.
            </Lead>
            <CreateGrid>
              <CreateCol>
                <CreateKicker>Истории, игры и анимации</CreateKicker>
                <CreateText>
                  Собирайте проекты на экране и делитесь ими в галерее.
                </CreateText>
                <CreateMedia>
                  {STORY_MEDIA.map(file => (
                    <MediaThumb key={file}>
                      <video
                        src={`${staticBase}/${file}`}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload='metadata'
                      />
                    </MediaThumb>
                  ))}
                </CreateMedia>
                <CtaBtn href={createHref}>Начать программировать</CtaBtn>
              </CreateCol>
              <CreateCol>
                <CreateKicker>Роботы РОББО</CreateKicker>
                <CreateText>
                  Та же среда — для реальных исполнителей, не только спрайтов.
                </CreateText>
                <CreateMedia>
                  {ROBOT_MEDIA.map(file => (
                    <MediaThumb key={file}>
                      <img
                        src={`${staticBase}/${file}`}
                        alt=''
                        loading='lazy'
                      />
                    </MediaThumb>
                  ))}
                </CreateMedia>
              </CreateCol>
            </CreateGrid>
          </BandInner>
        </BandWhite>

        <Band id='tariffs' {...sectionReveal}>
          <BandInner>
            <SectionTitle>Тарифы RS3</SectionTitle>
            <Lead>
              Лицензия задаёт облако, число устройств и одновременных входов в
              ЛК и веб-редактор. Покупка — в личном кабинете, после входа.
            </Lead>
            <TariffGrid>
              {TARIFFS.map(plan => (
                <TariffCard key={plan.id} $featured={plan.featured}>
                  <TariffName>{plan.name}</TariffName>
                  <TariffPrice>{plan.price}</TariffPrice>
                  <TariffList>
                    {plan.items.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </TariffList>
                  {plan.ghost ? (
                    <CtaGhost as={Link} to={plan.to}>{plan.cta}</CtaGhost>
                  ) : (
                    <CtaBtn as={Link} to={plan.to}>{plan.cta}</CtaBtn>
                  )}
                </TariffCard>
              ))}
            </TariffGrid>
          </BandInner>
        </Band>

        <BandWhite id='olympiad' {...sectionReveal}>
          <BandInner>
            <SectionTitle>Scratch-олимпиада</SectionTitle>
            <Lead>
              Ежегодный конкурс креативного программирования: Scratch и
              RobboScratch. Сейчас август 2026: российский этап сезона уже
              завершён, идёт подготовка к международному финалу в сентябре.
            </Lead>
            <StageTrack>
              {OLYMPIAD_TIMELINE.map(({ period, title, detail, highlight }, idx) => (
                <Stage key={period + title}>
                  <StageIndex $highlight={highlight}>
                    {String(idx + 1).padStart(2, '0')}
                  </StageIndex>
                  <StageCard $highlight={highlight}>
                    <StageDate>{period}</StageDate>
                    <StageTitle>{title}</StageTitle>
                    <StageDetail>{detail}</StageDetail>
                  </StageCard>
                </Stage>
              ))}
            </StageTrack>
            <OlympiadDests>
              <DestCard
                href='https://creativeprogramming.org/'
                target='_blank'
                rel='noreferrer'
                $primary
              >
                <DestKicker>Сейчас</DestKicker>
                <DestTitle>Международный финал</DestTitle>
                <DestText>
                  Сентябрь 2026. Победители российского этапа приглашены.
                </DestText>
              </DestCard>
              <DestCard
                href='https://robbo.ru/olymp/'
                target='_blank'
                rel='noreferrer'
              >
                <DestKicker>Россия</DestKicker>
                <DestTitle>Результаты российского этапа</DestTitle>
                <DestText>
                  X Всероссийская Scratch-Олимпиада 2026 завершена
                </DestText>
              </DestCard>
            </OlympiadDests>
          </BandInner>
        </BandWhite>

        <Band id='educators' {...sectionReveal}>
          <BandInner>
            <EducatorsGrid>
              <div>
                <SectionTitle>Педагогам и родителям</SectionTitle>
                <Lead>
                  Дети от 7 лет собирают анимационные истории и могут подать
                  работу на олимпиаду. Жюри — отдельные критерии для Scratch и
                  RobboScratch.
                </Lead>
                <CtaRow>
                  <CtaGhost
                    href='https://robbo.ru/olymp/expert/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Стать экспертом Scratch
                  </CtaGhost>
                  <CtaGhost
                    href='https://robbo.ru/olymp/expert/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Стать экспертом RobboScratch
                  </CtaGhost>
                </CtaRow>
              </div>
              <EducatorsVisual>
                <img
                  src={`${staticBase}/official_img_1.png`}
                  alt=''
                />
              </EducatorsVisual>
            </EducatorsGrid>
          </BandInner>
        </Band>

        <BandWhite id='about' {...sectionReveal}>
          <BandInner>
            <SectionTitle>Открытые технологии будущего</SectionTitle>
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
              С 19 лет внедряем технологии на открытом коде, развиваем
              робототехнику и инженерные системы. Продукты и методики используют
              в <Accent>44 странах</Accent>.
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
          </BandInner>
        </BandWhite>
      </Main>
      <RobboSiteFooter />
    </PageRoot>
  )
}

export default Landing

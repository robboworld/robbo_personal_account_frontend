import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { message } from 'antd'

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
import { broadcastAuthLogout, clearLocalAuthArtifacts } from '@/helpers/authEcosystemSync'
import { resolveProjectPreviewUrl } from '@/helpers/projectPreview'
import RobboGuestHeader from '@/components/RobboGuestHeader/RobboGuestHeader'
import RobboSiteFooter from '@/components/RobboSiteFooter/RobboSiteFooter'
import RobboGuestFonts from '@/theme/robboGuestFonts'
import robboGuestTokens from '@/theme/robboGuestTokens'
import { getScratchEditorUrl } from '@/utils/scratchEditor'
import {
  EXPLORE_ROUTE,
  MY_LICENSES_ROUTE,
  REGISTER_PAGE_ROUTE,
  LK_SSO_WITH_LMS_ENABLED,
} from '@/constants'
import { lmsRegisterUrl, takeAfterLogout } from '@/helpers/oidcSession'
import {
  devicesSessionsLine,
  formatTariffPrice,
  projectLimitLines,
  useTariffs,
} from '@/helpers/tariffs'
import { currentOlympiadStage } from '@/helpers/olympiad'
import { clearAccessToken } from '@/helpers/accessTokenMemory'

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
    accent: { id: 'landing.about.institutions_accent' },
    text: { id: 'landing.about.institutions_text' },
  },
  {
    accent: { id: 'landing.about.support_accent' },
    text: { id: 'landing.about.support_text' },
  },
]

const ROBOT_MEDIA = ['official_img2.jpg', 'official_img3.jpg', 'official_img4.jpg']

const LANDING_PROJECTS_LIMIT = 5

// Each stage ends on `end` (inclusive). The current stage is derived from today's date,
// so the section never claims "now it is August" in October.
const OLYMPIAD_TIMELINE = [
  {
    period: { id: 'landing.olympiad.stage1.period' },
    title: { id: 'landing.olympiad.stage1.title' },
    detail: { id: 'landing.olympiad.stage1.detail' },
    end: '2026-02-28',
  },
  {
    period: { id: 'landing.olympiad.stage2.period' },
    title: { id: 'landing.olympiad.stage2.title' },
    detail: { id: 'landing.olympiad.stage2.detail' },
    end: '2026-06-30',
  },
  {
    period: { id: 'landing.olympiad.stage3.period' },
    title: { id: 'landing.olympiad.stage3.title' },
    detail: { id: 'landing.olympiad.stage3.detail' },
    end: '2026-06-30',
  },
  {
    period: { id: 'landing.olympiad.stage4.period' },
    title: { id: 'landing.olympiad.stage4.title' },
    detail: { id: 'landing.olympiad.stage4.detail' },
    end: '2026-07-31',
  },
  {
    period: { id: 'landing.olympiad.stage5.period' },
    title: { id: 'landing.olympiad.stage5.title' },
    detail: { id: 'landing.olympiad.stage5.detail' },
    end: '2026-08-31',
  },
  {
    period: { id: 'landing.olympiad.stage6.period' },
    title: { id: 'landing.olympiad.stage6.title' },
    detail: { id: 'landing.olympiad.stage6.detail' },
    end: '2026-09-30',
  },
]

const FREE_REGISTER_TARGET = LK_SSO_WITH_LMS_ENABLED ? lmsRegisterUrl() : REGISTER_PAGE_ROUTE
const FREE_REGISTER_EXTERNAL = LK_SSO_WITH_LMS_ENABLED

const TARIFFS = [
  {
    id: 'free',
    name: 'Free',
    featured: false,
    extra: [{ id: 'landing.tariffs.free.item4' }],
    cta: { id: 'landing.tariffs.free.cta' },
    to: FREE_REGISTER_TARGET,
    external: FREE_REGISTER_EXTERNAL,
    ghost: true,
  },
  {
    // Paid editions are not on sale while tariffs are not approved: the card lists what is
    // being prepared and opens the interest survey in "My licenses".
    id: 'clubs',
    name: { id: 'landing.tariffs.clubs.name' },
    featured: true,
    lines: [
      { id: 'interest.feature.parent_progress' },
      { id: 'interest.feature.club_showcase' },
      { id: 'interest.feature.club_scenarios' },
      { id: 'interest.feature.work_review' },
      { id: 'interest.feature.competitions' },
    ],
    price: { id: 'landing.tariffs.clubs.price' },
    cta: { id: 'landing.tariffs.clubs.cta' },
    to: `${MY_LICENSES_ROUTE}?from=landing#interest`,
    ghost: false,
  },
]

// Card lines come from the limits the backend enforces, so the landing cannot promise more.
const limitLines = (intl, plan, limits) => [
  ...projectLimitLines(intl, limits),
  devicesSessionsLine(intl, limits),
  ...(limits.durationDays
    ? [intl.formatMessage({ id: 'tariff.duration_days' }, { days: limits.durationDays })]
    : []),
  ...plan.extra.map(item => intl.formatMessage(item)),
]

// A card with its own lines (paid editions in preparation) does not show limits.
const tariffLines = (intl, plan, limits) =>
  plan.lines ? plan.lines.map(item => intl.formatMessage(item)) : limitLines(intl, plan, limits)

const tariffPrice = (intl, plan, limits) =>
  plan.price
    ? intl.formatMessage(plan.price)
    : limits.amount > 0
    ? intl.formatMessage(
        { id: 'tariff.price_year' },
        { price: formatTariffPrice(intl, limits.amount) },
      )
    : formatTariffPrice(intl, 0)

const LandingProjectCard = ({ project, onOpen }) => {
  const intl = useIntl()
  const title = project.title || intl.formatMessage({ id: 'project_card.untitled' })
  const authorName =
    project.authorName || project.authorUserId || intl.formatMessage({ id: 'project_card.author' })
  const previewUrl = resolveProjectPreviewUrl(project.preview, project.lastModified)
  return (
    <ProjectTile
      type='button'
      onClick={() => onOpen(project.projectPageId)}
      aria-label={intl.formatMessage({ id: 'project_card.open_aria' }, { title })}>
      <ProjectTileMedia>
        {previewUrl ? <img src={previewUrl} alt='' loading='lazy' /> : null}
      </ProjectTileMedia>
      <ProjectTileBody>
        <ProjectTileTitle>{title}</ProjectTileTitle>
        <ProjectTileAuthor>{authorName}</ProjectTileAuthor>
      </ProjectTileBody>
    </ProjectTile>
  )
}

const Landing = () => {
  const intl = useIntl()
  const t = descriptor => intl.formatMessage(descriptor)
  const navigate = useNavigate()
  const createHref = getScratchEditorUrl()
  const tariffs = useTariffs()
  const olympiadStage = currentOlympiadStage(OLYMPIAD_TIMELINE)
  const staticBase = '/static'

  useEffect(() => {
    document.title = intl.formatMessage({ id: 'landing.document_title' })
  }, [intl])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search || '')
    const loggedOut = params.get('logged_out') === '1'
    const sessionExpired = params.get('session_expired') === '1'
    if (!loggedOut && !sessionExpired) {
      return undefined
    }
    clearLocalAuthArtifacts()
    broadcastAuthLogout()
    clearAccessToken()
    const afterLogout = loggedOut ? takeAfterLogout() : null
    if (afterLogout) {
      // e.g. /login with ban details, or /?session_expired=1
      navigate(afterLogout, { replace: true })
      return undefined
    }
    if (sessionExpired) {
      message.info(intl.formatMessage({ id: 'login.session_expired' }))
    }
    params.delete('logged_out')
    params.delete('session_expired')
    const next = params.toString()
    navigate({ pathname: '/', search: next ? `?${next}` : '' }, { replace: true })
    return undefined
  }, [navigate, intl])

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

  const openProject = useCallback(
    projectPageId => {
      if (!projectPageId) {
        return
      }
      navigate(`/projects/${projectPageId}`, {
        state: { selectedNavBarKey: 'public_projects' },
      })
    },
    [navigate],
  )

  return (
    <PageRoot>
      <RobboGuestFonts />
      <LandingGlobal />
      <SkipLink href='#content'>
        <FormattedMessage id='landing.skip_to_content' />
      </SkipLink>
      <RobboGuestHeader />
      <Main id='content'>
        <Intro>
          <IntroInner>
            <IntroCopy>
              <IntroTitle>
                <FormattedMessage id='landing.intro.title' />
              </IntroTitle>
              <IntroLede>
                <FormattedMessage id='landing.intro.lede' />
              </IntroLede>
              <IntroActions>
                <IntroBtnPrimary href={createHref}>
                  <FormattedMessage id='landing.intro.start' />
                </IntroBtnPrimary>
                <IntroBtnGhost as={Link} to={EXPLORE_ROUTE}>
                  <FormattedMessage id='landing.intro.explore' />
                </IntroBtnGhost>
              </IntroActions>
            </IntroCopy>
            <IntroVisual>
              <IntroMascot
                src={`${staticBase}/robbo-hero-mascot.webp`}
                alt={intl.formatMessage({ id: 'landing.intro.mascot_alt' })}
                width='420'
                height='420'
              />
            </IntroVisual>
          </IntroInner>
        </Intro>

        <IntroLinks aria-label={intl.formatMessage({ id: 'landing.links.aria' })}>
          <a href='#about'>
            <FormattedMessage id='landing.links.about' />
          </a>
          <a href='#educators'>
            <FormattedMessage id='landing.links.educators' />
          </a>
          <a href='#educators'>
            <FormattedMessage id='landing.links.parents' />
          </a>
        </IntroLinks>

        <Band id='featured' {...sectionReveal}>
          <BandInner>
            <BandHead>
              <SectionTitle>
                <FormattedMessage id='landing.featured.title' />
              </SectionTitle>
              <BandLink as={Link} to={EXPLORE_ROUTE}>
                <FormattedMessage id='landing.featured.all' />
              </BandLink>
            </BandHead>
            <Lead>
              <FormattedMessage id='landing.featured.lead' />
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
                <FormattedMessage id='landing.featured.empty' />
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
            <SectionTitle>
              <FormattedMessage id='landing.create.title' />
            </SectionTitle>
            <Lead>
              <FormattedMessage id='landing.create.lead' />
            </Lead>
            <CreateGrid>
              <CreateCol>
                <CreateKicker>
                  <FormattedMessage id='landing.create.stories_kicker' />
                </CreateKicker>
                <CreateText>
                  <FormattedMessage id='landing.create.stories_text' />
                </CreateText>
                <CtaBtn href={createHref}>
                  <FormattedMessage id='landing.create.stories_cta' />
                </CtaBtn>
              </CreateCol>
              <CreateCol>
                <CreateKicker>
                  <FormattedMessage id='landing.create.robots_kicker' />
                </CreateKicker>
                <CreateText>
                  <FormattedMessage id='landing.create.robots_text' />
                </CreateText>
                <CreateMedia>
                  {ROBOT_MEDIA.map(file => (
                    <MediaThumb key={file}>
                      <img src={`${staticBase}/${file}`} alt='' loading='lazy' />
                    </MediaThumb>
                  ))}
                </CreateMedia>
              </CreateCol>
            </CreateGrid>
          </BandInner>
        </BandWhite>

        <Band id='tariffs' {...sectionReveal}>
          <BandInner>
            <SectionTitle>
              <FormattedMessage id='landing.tariffs.title' />
            </SectionTitle>
            <Lead>
              <FormattedMessage id='landing.tariffs.lead' />
            </Lead>
            <TariffGrid>
              {TARIFFS.map(plan => (
                <TariffCard key={plan.id} $featured={plan.featured}>
                  <TariffName>{typeof plan.name === 'string' ? plan.name : t(plan.name)}</TariffName>
                  <TariffPrice>{tariffPrice(intl, plan, tariffs[plan.id])}</TariffPrice>
                  <TariffList>
                    {tariffLines(intl, plan, tariffs[plan.id]).map(line => (
                      <li key={line}>{line}</li>
                    ))}
                  </TariffList>
                  {plan.ghost ? (
                    plan.external ? (
                      <CtaGhost as='a' href={plan.to}>
                        {t(plan.cta)}
                      </CtaGhost>
                    ) : (
                      <CtaGhost as={Link} to={plan.to}>
                        {t(plan.cta)}
                      </CtaGhost>
                    )
                  ) : (
                    <CtaBtn as={Link} to={plan.to}>
                      {t(plan.cta)}
                    </CtaBtn>
                  )}
                </TariffCard>
              ))}
            </TariffGrid>
          </BandInner>
        </Band>

        <BandWhite id='olympiad' {...sectionReveal}>
          <BandInner>
            <SectionTitle>
              <FormattedMessage id='landing.olympiad.title' />
            </SectionTitle>
            <Lead>
              <FormattedMessage id='landing.olympiad.lead' />{' '}
              {olympiadStage >= 0
                ? intl.formatMessage(
                    { id: 'landing.olympiad.now_stage' },
                    { stage: t(OLYMPIAD_TIMELINE[olympiadStage].title) },
                  )
                : intl.formatMessage({ id: 'landing.olympiad.season_over' })}
            </Lead>
            <StageTrack>
              {OLYMPIAD_TIMELINE.map(({ period, title, detail }, idx) => {
                const highlight = idx === olympiadStage
                return (
                  <Stage key={title.id} aria-current={highlight ? 'step' : undefined}>
                    <StageIndex $highlight={highlight}>
                      {String(idx + 1).padStart(2, '0')}
                    </StageIndex>
                    <StageCard $highlight={highlight}>
                      <StageDate>{t(period)}</StageDate>
                      <StageTitle>{t(title)}</StageTitle>
                      <StageDetail>{t(detail)}</StageDetail>
                    </StageCard>
                  </Stage>
                )
              })}
            </StageTrack>
            <OlympiadDests>
              <DestCard
                href='https://creativeprogramming.org/'
                target='_blank'
                rel='noreferrer'
                $primary>
                <DestKicker>
                  <FormattedMessage
                    id={
                      olympiadStage === OLYMPIAD_TIMELINE.length - 1
                        ? 'landing.olympiad.dest_final.kicker'
                        : olympiadStage < 0
                          ? 'landing.olympiad.dest_final.kicker_past'
                          : 'landing.olympiad.dest_final.kicker_next'
                    }
                  />
                </DestKicker>
                <DestTitle>
                  <FormattedMessage id='landing.olympiad.dest_final.title' />
                </DestTitle>
                <DestText>
                  <FormattedMessage id='landing.olympiad.dest_final.text' />
                </DestText>
              </DestCard>
              <DestCard href='https://robbo.ru/olymp/' target='_blank' rel='noreferrer'>
                <DestKicker>
                  <FormattedMessage id='landing.olympiad.dest_russia.kicker' />
                </DestKicker>
                <DestTitle>
                  <FormattedMessage id='landing.olympiad.dest_russia.title' />
                </DestTitle>
                <DestText>
                  <FormattedMessage id='landing.olympiad.dest_russia.text' />
                </DestText>
              </DestCard>
            </OlympiadDests>
          </BandInner>
        </BandWhite>

        <Band id='educators' {...sectionReveal}>
          <BandInner>
            <EducatorsGrid>
              <div>
                <SectionTitle>
                  <FormattedMessage id='landing.educators.title' />
                </SectionTitle>
                <Lead>
                  <FormattedMessage id='landing.educators.lead' />
                </Lead>
                <CtaRow>
                  <CtaGhost href='https://robbo.ru/olymp/expert/' target='_blank' rel='noreferrer'>
                    <FormattedMessage id='landing.educators.expert_scratch' />
                  </CtaGhost>
                  <CtaGhost href='https://robbo.ru/olymp/expert/' target='_blank' rel='noreferrer'>
                    <FormattedMessage id='landing.educators.expert_robboscratch' />
                  </CtaGhost>
                </CtaRow>
              </div>
              <EducatorsVisual>
                <img src={`${staticBase}/official_img_1.png`} alt='' />
              </EducatorsVisual>
            </EducatorsGrid>
          </BandInner>
        </Band>

        <BandWhite id='about' {...sectionReveal}>
          <BandInner>
            <SectionTitle>
              <FormattedMessage id='landing.about.title' />
            </SectionTitle>
            <AboutStats role='list'>
              <AboutStat role='listitem'>
                <StatValue>19</StatValue>
                <StatLabel>
                  <FormattedMessage id='landing.about.years' />
                </StatLabel>
              </AboutStat>
              <AboutStat role='listitem'>
                <StatValue>44</StatValue>
                <StatLabel>
                  <FormattedMessage id='landing.about.countries' />
                </StatLabel>
              </AboutStat>
            </AboutStats>
            <AboutIntro>
              <FormattedMessage
                id='landing.about.intro'
                values={{ accent: chunks => <Accent>{chunks}</Accent> }}
              />
            </AboutIntro>
            <ul style={{ margin: 0, padding: 0 }}>
              {ABOUT_HIGHLIGHTS.map(({ accent, text }) => (
                <AboutHighlight key={accent.id}>
                  <span aria-hidden>•</span>
                  <span>
                    <Accent>{t(accent)}</Accent> {t(text)}
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

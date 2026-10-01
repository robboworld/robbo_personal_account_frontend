import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'

import {
  Avatar,
  Banner,
  BannerInner,
  BannerTitle,
  Card,
  CardAuthor,
  CardCopy,
  CardMeta,
  CardTitle,
  Empty,
  ExploreGlobal,
  Filters,
  Grid,
  Inner,
  LoadMore,
  Main,
  PageRoot,
  Pill,
  SkeletonBar,
  SkeletonCard,
  SortHint,
  Tab,
  TabBar,
  TabIcon,
  Tabs,
  Thumb,
} from './styles'

import { projectPageAPI } from '@/api/projectPage'
import { getAvatarSrc, isValidAvatarId } from '@/constants/avatars'
import { resolveProjectPreviewUrl } from '@/helpers/projectPreview'
import RobboGuestHeader from '@/components/RobboGuestHeader/RobboGuestHeader'
import RobboSiteFooter from '@/components/RobboSiteFooter/RobboSiteFooter'
import RobboGuestFonts from '@/theme/robboGuestFonts'

const PAGE_SIZE = 16

const CATEGORIES = [
  { key: 'all', label: { id: 'explore.category.all' }, tag: '' },
  { key: 'animations', label: { id: 'explore.category.animations' }, tag: 'animations' },
  { key: 'art', label: { id: 'explore.category.art' }, tag: 'art' },
  { key: 'games', label: { id: 'explore.category.games' }, tag: 'games' },
  { key: 'music', label: { id: 'explore.category.music' }, tag: 'music' },
]

const initials = name => {
  const source = String(name || '').trim()
  if (!source) {
    return '?'
  }
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

const ProjectFlag = () => (
  <svg width='24' height='24'
viewBox='0 0 24 24' aria-hidden>
    <path
      fill='currentColor'
      d='M4.2 3h1.1v18H4.2zm2.4 0h8.2l.9 1.35L18.4 3H21.8v11.4h-4.7l-.9-1.35-2.8 1.35H6.6z'
    />
  </svg>
)

const StudioIcon = () => (
  <svg width='24' height='24'
viewBox='0 0 24 24' aria-hidden>
    <path
      fill='currentColor'
      d='M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z'
    />
  </svg>
)

const ExploreCard = ({ project, onOpen }) => {
  const intl = useIntl()
  const title = project.title || intl.formatMessage({ id: 'project_card.untitled' })
  const authorName = project.authorName || project.authorUserId || intl.formatMessage({ id: 'project_card.author' })
  const previewUrl = resolveProjectPreviewUrl(project.preview)
  const avatarSrc = isValidAvatarId(project.authorAvatarId)
    ? getAvatarSrc(project.authorAvatarId)
    : null
  return (
    <Card
      type='button'
      onClick={() => onOpen(project.projectPageId)}
      aria-label={intl.formatMessage({ id: 'project_card.open_aria' }, { title })}
    >
      <Thumb>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt=''
            loading='lazy'
          />
        ) : null}
      </Thumb>
      <CardMeta>
        <Avatar aria-hidden>
          {avatarSrc ? <img src={avatarSrc} alt='' /> : initials(authorName)}
        </Avatar>
        <CardCopy>
          <CardTitle>{title}</CardTitle>
          <CardAuthor>{authorName}</CardAuthor>
        </CardCopy>
      </CardMeta>
    </Card>
  )
}

const Explore = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTag = String(searchParams.get('tag') || '').trim().toLowerCase()
  const [projects, setProjects] = useState([])
  const [countRows, setCountRows] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    document.title = intl.formatMessage({ id: 'explore.document_title' })
  }, [intl])

  useLayoutEffect(() => {
    document.documentElement.classList.add('explore-page-active')
    return () => {
      document.documentElement.classList.remove('explore-page-active')
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setPage(1)
    setProjects([])
    const options = { sort: 'popular' }
    if (activeTag) {
      options.tags = [activeTag]
    }
    projectPageAPI
      .fetchPublicProjectPages('1', String(PAGE_SIZE), options)
      .then(data => {
        if (cancelled) {
          return
        }
        setCountRows(Number(data?.countRows) || 0)
        setProjects(data?.projectPages || [])
      })
      .catch(() => {
        if (!cancelled) {
          setProjects([])
          setCountRows(0)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [activeTag])

  const hasMore = projects.length < countRows

  const loadMore = () => {
    if (loadingMore || !hasMore) {
      return
    }
    const nextPage = page + 1
    setLoadingMore(true)
    const options = { sort: 'popular' }
    if (activeTag) {
      options.tags = [activeTag]
    }
    projectPageAPI
      .fetchPublicProjectPages(String(nextPage), String(PAGE_SIZE), options)
      .then(data => {
        const next = data?.projectPages || []
        setCountRows(Number(data?.countRows) || 0)
        setProjects(prev => [...prev, ...next])
        setPage(nextPage)
      })
      .finally(() => {
        setLoadingMore(false)
      })
  }

  const setTag = tag => {
    if (tag) {
      setSearchParams({ tag })
    } else {
      setSearchParams({})
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openProject = useCallback(projectPageId => {
    if (!projectPageId) {
      return
    }
    navigate(`/projects/${projectPageId}`)
  }, [navigate])

  return (
    <PageRoot>
      <RobboGuestFonts />
      <ExploreGlobal />
      <RobboGuestHeader />
      <Main>
        <Banner>
          <BannerInner>
            <BannerTitle><FormattedMessage id='explore.title' /></BannerTitle>
          </BannerInner>
        </Banner>
        <TabBar>
          <Tabs aria-label={intl.formatMessage({ id: 'explore.tabs_aria' })}>
            <Tab $active>
              <TabIcon>
                <ProjectFlag />
              </TabIcon>
              <FormattedMessage id='explore.tab_projects' />
            </Tab>
            <Tab aria-disabled='true'>
              <TabIcon $muted>
                <StudioIcon />
              </TabIcon>
              <FormattedMessage id='explore.tab_studios' />
            </Tab>
          </Tabs>
        </TabBar>
        <Inner>
          <Filters>
            {CATEGORIES.map(cat => (
              <Pill
                key={cat.key}
                type='button'
                $active={(cat.tag || '') === activeTag}
                onClick={() => setTag(cat.tag)}
              >
                {intl.formatMessage(cat.label)}
              </Pill>
            ))}
            <SortHint><FormattedMessage id='explore.sort_popular' /></SortHint>
          </Filters>
          {loading ? (
            <Grid aria-busy='true'>
              {Array.from({ length: 8 }, (_, idx) => (
                <SkeletonCard key={`explore-skeleton-${idx}`} aria-hidden>
                  <Thumb />
                  <CardMeta>
                    <Avatar />
                    <CardCopy>
                      <SkeletonBar $w='80%' />
                      <SkeletonBar $w='45%' $h='0.55rem'
$mt='0.35rem' />
                    </CardCopy>
                  </CardMeta>
                </SkeletonCard>
              ))}
            </Grid>
          ) : projects.length === 0 ? (
            <Empty><FormattedMessage id='explore.empty' /></Empty>
          ) : (
            <Grid>
              {projects.map((project, idx) => (
                <ExploreCard
                  key={`${project.projectPageId}-e-${idx}`}
                  project={project}
                  onOpen={openProject}
                />
              ))}
            </Grid>
          )}
          {!loading && hasMore ? (
            <LoadMore
              type='button'
              disabled={loadingMore}
              onClick={loadMore}
            >
              {intl.formatMessage({ id: loadingMore ? 'explore.loading' : 'explore.load_more' })}
            </LoadMore>
          ) : null}
        </Inner>
      </Main>
      <RobboSiteFooter />
    </PageRoot>
  )
}

export default Explore

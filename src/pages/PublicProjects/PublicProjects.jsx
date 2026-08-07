import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowRightOutlined,
  DeleteOutlined,
  GlobalOutlined,
  PushpinOutlined,
} from '@ant-design/icons'
import { Button, Input, InputNumber, Modal, Pagination, Select, Space, Tag, message } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  moderateDeleteProjectPage,
  projectPageAPI,
  setLandingFeatured,
} from '@/api/projectPage'
import { SUPER_ADMIN } from '@/constants'
import { useAuthRole } from '@/helpers'
import { displayProjectTitle } from '@/helpers/intl'
import { resolveProjectPreviewUrl } from '@/helpers/projectPreview'
import {
  ActiveFilterChip,
  AuthorAvatar,
  AuthorName,
  AuthorRow,
  CatalogCount,
  CatalogToolbar,
  EmptyIcon,
  EmptyState,
  EmptyText,
  ModerationActions,
  ModerationBadge,
  ModerationRow,
  OpenButton,
  PageSizeControl,
  PaginationWrap,
  ProjectCard,
  ProjectCardBody,
  ProjectCardContent,
  ProjectCardCover,
  ProjectCardCoverPlaceholder,
  ProjectCardTop,
  ProjectGlyph,
  ProjectGrid,
  ProjectTag,
  ProjectTagList,
  ProjectTitleButton,
  SearchBar,
  SkeletonCard,
  SkeletonGrid,
} from '@/components/ProjectCatalog/styles'
import {
  HeroInner,
  HeroLead,
  HeroPanel,
  HeroTitle,
  PageContent,
  Panel,
  SectionHeader,
  SectionHint,
  SectionTitle,
  Stagger,
  staggerContainer,
  staggerItem,
} from '@/components/AccountShell'

const SKELETON_COUNT = 6
const PAGE_SIZE_OPTIONS = [6, 12, 24]
const DEFAULT_PAGE_SIZE = 12
const MAX_FILTER_TAGS = 5
const MAX_TAG_LEN = 25
const { TextArea, Search } = Input

const parsePage = value => {
  const n = Number.parseInt(String(value || ''), 10)
  return Number.isFinite(n) && n >= 1 ? n : 1
}

const parsePageSize = value => {
  const n = Number.parseInt(String(value || ''), 10)
  return PAGE_SIZE_OPTIONS.includes(n) ? n : DEFAULT_PAGE_SIZE
}

const parseQuery = value => String(value || '').trim()

const parseTag = value => {
  const raw = String(value || '').trim().toLowerCase()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
  if (!raw) {
    return ''
  }
  const cleaned = raw.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
  if (!cleaned || cleaned.length > MAX_TAG_LEN) {
    return ''
  }
  return cleaned
}

const parseTagsFromSearchParams = params => {
  const rawParts = [
    ...params.getAll('tag'),
    ...(params.get('tags') ? [params.get('tags')] : []),
  ]
  const seen = new Set()
  const out = []
  rawParts.forEach(raw => {
    String(raw || '').split(',').forEach(part => {
      const tag = parseTag(part)
      if (!tag || seen.has(tag) || out.length >= MAX_FILTER_TAGS) {
        return
      }
      seen.add(tag)
      out.push(tag)
    })
  })
  return out
}

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

export default function PublicProjects() {
  const navigate = useNavigate()
  const intl = useIntl()
  const [searchParams, setSearchParams] = useSearchParams()
  const authRole = useAuthRole()
  const isSuperAdmin = Number(authRole) === SUPER_ADMIN
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [totalRows, setTotalRows] = useState(0)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteReason, setDeleteReason] = useState('')
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [featureTarget, setFeatureTarget] = useState(null)
  const [featureOrder, setFeatureOrder] = useState(1)
  const [featureBusy, setFeatureBusy] = useState(false)
  const [orderDrafts, setOrderDrafts] = useState({})
  const [orderBusyId, setOrderBusyId] = useState(null)

  const currentPage = useMemo(
    () => parsePage(searchParams.get('page')),
    [searchParams],
  )
  const pageSize = useMemo(
    () => parsePageSize(searchParams.get('pageSize')),
    [searchParams],
  )
  const searchQuery = useMemo(
    () => parseQuery(searchParams.get('q')),
    [searchParams],
  )
  const activeTags = useMemo(
    () => parseTagsFromSearchParams(searchParams),
    [searchParams],
  )
  const [searchDraft, setSearchDraft] = useState(searchQuery)
  const hasActiveFilters = Boolean(searchQuery || activeTags.length)

  useEffect(() => {
    setSearchDraft(searchQuery)
  }, [searchQuery])

  const writeCatalogParams = useCallback(({
    page = currentPage,
    size = pageSize,
    q = searchQuery,
    tags = activeTags,
  } = {}) => {
    const next = new URLSearchParams()
    next.set('page', String(page))
    next.set('pageSize', String(size))
    const query = parseQuery(q)
    if (query) {
      next.set('q', query)
    }
    ;(tags || []).forEach(tag => {
      const normalized = parseTag(tag)
      if (normalized) {
        next.append('tag', normalized)
      }
    })
    setSearchParams(next, { replace: true })
  }, [currentPage, pageSize, searchQuery, activeTags, setSearchParams])

  const updatePaging = useCallback((page, size) => {
    writeCatalogParams({ page, size })
  }, [writeCatalogParams])

  const onSearchSubmit = useCallback(value => {
    writeCatalogParams({
      page: 1,
      q: parseQuery(value),
    })
  }, [writeCatalogParams])

  const onTagFilter = useCallback(tag => {
    const normalized = parseTag(tag)
    if (!normalized) {
      return
    }
    if (activeTags.includes(normalized)) {
      return
    }
    if (activeTags.length >= MAX_FILTER_TAGS) {
      message.warning(intl.formatMessage(
        { id: 'project_page.tags_max_count' },
        { max: MAX_FILTER_TAGS },
      ))
      return
    }
    writeCatalogParams({
      page: 1,
      tags: [...activeTags, normalized],
    })
  }, [activeTags, writeCatalogParams, intl])

  const removeTagFilter = useCallback(tag => {
    writeCatalogParams({
      page: 1,
      tags: activeTags.filter(item => item !== tag),
    })
  }, [activeTags, writeCatalogParams])

  const clearAllFilters = useCallback(() => {
    writeCatalogParams({
      page: 1,
      q: '',
      tags: [],
    })
  }, [writeCatalogParams])

  const nextFeatureSortOrder = useCallback(list => {
    const featured = (list || []).filter(item => item.landingFeatured)
    if (featured.length === 0) {
      return 1
    }
    return Math.max(...featured.map(item => Number(item.landingSortOrder) || 0)) + 1
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    projectPageAPI.fetchPublicProjectPages(String(currentPage), String(pageSize), {
      q: searchQuery || undefined,
      tags: activeTags,
    })
      .then(data => {
        if (cancelled) {
          return
        }
        const pages = data?.projectPages || []
        const total = Number(data?.countRows) || 0
        setProjects(pages)
        setTotalRows(total)

        const maxPage = Math.max(1, Math.ceil(total / pageSize) || 1)
        if (currentPage > maxPage) {
          writeCatalogParams({ page: maxPage })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProjects([])
          setTotalRows(0)
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
  }, [currentPage, pageSize, searchQuery, activeTags, writeCatalogParams])

  const openProject = useCallback(projectPageId => {
    navigate(`/projects/${projectPageId}`, {
      state: { selectedNavBarKey: 'public_projects' },
    })
  }, [navigate])

  const openDeleteModal = project => {
    setDeleteTarget(project)
    setDeleteReason('')
  }

  const closeDeleteModal = () => {
    if (deleteBusy) {
      return
    }
    setDeleteTarget(null)
    setDeleteReason('')
  }

  const confirmDelete = async () => {
    const reason = deleteReason.trim()
    if (reason.length < 3) {
      message.warning(intl.formatMessage({ id: 'project_page.moderate_reason_required' }))
      return
    }
    if (!deleteTarget?.projectPageId) {
      return
    }
    setDeleteBusy(true)
    try {
      await moderateDeleteProjectPage(deleteTarget.projectPageId, reason)
      const nextTotal = Math.max(0, totalRows - 1)
      const nextProjects = projects.filter(item => item.projectPageId !== deleteTarget.projectPageId)
      setProjects(nextProjects)
      setTotalRows(nextTotal)
      if (nextProjects.length === 0 && currentPage > 1) {
        updatePaging(currentPage - 1, pageSize)
      }
      message.success(intl.formatMessage({ id: 'project_page.moderate_delete_ok' }))
      setDeleteTarget(null)
      setDeleteReason('')
    } catch (e) {
      message.error(e.message || intl.formatMessage({ id: 'project_page.moderate_delete_error' }))
    } finally {
      setDeleteBusy(false)
    }
  }

  const openFeatureModal = project => {
    setFeatureTarget(project)
    setFeatureOrder(nextFeatureSortOrder(projects))
  }

  const closeFeatureModal = () => {
    if (featureBusy) {
      return
    }
    setFeatureTarget(null)
  }

  const confirmFeature = async () => {
    if (!featureTarget?.projectPageId) {
      return
    }
    setFeatureBusy(true)
    try {
      const data = await setLandingFeatured(featureTarget.projectPageId, {
        featured: true,
        sortOrder: Number(featureOrder) || 1,
      })
      const updated = data?.projectPage
      setProjects(prev => prev.map(item => {
        if (item.projectPageId !== featureTarget.projectPageId) {
          return item
        }
        return {
          ...item,
          landingFeatured: updated?.landingFeatured ?? true,
          landingSortOrder: updated?.landingSortOrder ?? (Number(featureOrder) || 1),
        }
      }))
      message.success(intl.formatMessage({ id: 'project_page.landing_add_ok' }))
      setFeatureTarget(null)
    } catch (e) {
      message.error(e.message || intl.formatMessage({ id: 'project_page.landing_error' }))
    } finally {
      setFeatureBusy(false)
    }
  }

  const removeFromLanding = async project => {
    if (!project?.projectPageId) {
      return
    }
    setFeatureBusy(true)
    try {
      await setLandingFeatured(project.projectPageId, { featured: false, sortOrder: 0 })
      setProjects(prev => prev.map(item => {
        if (item.projectPageId !== project.projectPageId) {
          return item
        }
        return { ...item, landingFeatured: false, landingSortOrder: 0 }
      }))
      setOrderDrafts(prev => {
        const next = { ...prev }
        delete next[project.projectPageId]
        return next
      })
      message.success(intl.formatMessage({ id: 'project_page.landing_remove_ok' }))
    } catch (e) {
      message.error(e.message || intl.formatMessage({ id: 'project_page.landing_error' }))
    } finally {
      setFeatureBusy(false)
    }
  }

  const saveSortOrder = async project => {
    const draft = orderDrafts[project.projectPageId]
    const sortOrder = draft === undefined ? Number(project.landingSortOrder) || 0 : Number(draft)
    setOrderBusyId(project.projectPageId)
    try {
      const data = await setLandingFeatured(project.projectPageId, {
        featured: true,
        sortOrder,
      })
      const updated = data?.projectPage
      setProjects(prev => prev.map(item => {
        if (item.projectPageId !== project.projectPageId) {
          return item
        }
        return {
          ...item,
          landingFeatured: true,
          landingSortOrder: updated?.landingSortOrder ?? sortOrder,
        }
      }))
      message.success(intl.formatMessage({ id: 'project_page.landing_order_ok' }))
    } catch (e) {
      message.error(e.message || intl.formatMessage({ id: 'project_page.landing_error' }))
    } finally {
      setOrderBusyId(null)
    }
  }

  const projectCountLabel = intl.formatMessage(
    { id: 'project_page.public_catalog_count' },
    { count: totalRows },
  )

  const onPaginationChange = page => {
    updatePaging(parsePage(page), pageSize)
  }

  const onPageSizeChange = value => {
    updatePaging(1, parsePageSize(value))
  }

  return (
    <PageContent>
      <Stagger variants={staggerContainer} initial='hidden'
animate='show'>
        <HeroPanel variants={staggerItem}>
          <HeroInner>
            <HeroTitle>
              <FormattedMessage id='project_page.public_catalog_title' />
            </HeroTitle>
            <HeroLead>
              <FormattedMessage id='home.action.public_projects.description' />
            </HeroLead>
          </HeroInner>
        </HeroPanel>

        <motion.div variants={staggerItem}>
          <Panel>
            <SectionHeader>
              <SectionTitle>
                <FormattedMessage id='project_page.public_catalog_list_title' />
              </SectionTitle>
              <CatalogToolbar>
                {!loading && totalRows > 0 && (
                  <CatalogCount>{projectCountLabel}</CatalogCount>
                )}
                <PageSizeControl htmlFor='public-projects-page-size'>
                  <FormattedMessage id='project_page.public_catalog_page_size' />
                  <Select
                    id='public-projects-page-size'
                    size='small'
                    value={pageSize}
                    onChange={onPageSizeChange}
                    options={PAGE_SIZE_OPTIONS.map(size => ({
                      value: size,
                      label: String(size),
                    }))}
                    style={{ width: 72 }}
                    aria-label={intl.formatMessage({ id: 'project_page.public_catalog_page_size' })}
                  />
                </PageSizeControl>
              </CatalogToolbar>
              {!loading && totalRows === 0 && !hasActiveFilters && (
                <SectionHint>
                  <FormattedMessage id='project_page.public_catalog_empty_hint' />
                </SectionHint>
              )}
            </SectionHeader>

            <SearchBar>
              <Search
                allowClear
                value={searchDraft}
                onChange={e => setSearchDraft(e.target.value)}
                onSearch={onSearchSubmit}
                enterButton
                placeholder={intl.formatMessage({ id: 'project_page.public_catalog_search_placeholder' })}
                aria-label={intl.formatMessage({ id: 'project_page.public_catalog_search_placeholder' })}
              />
              {activeTags.length > 0 && activeTags.map(tag => (
                <ActiveFilterChip key={tag}>
                  <FormattedMessage
                    id='project_page.public_catalog_tag_filter'
                    values={{ tag }}
                  />
                  <Tag
                    closable
                    onClose={e => {
                      if (e && typeof e.preventDefault === 'function') {
                        e.preventDefault()
                      }
                      removeTagFilter(tag)
                    }}
                    style={{ margin: 0, border: 0, background: 'transparent' }}
                  />
                </ActiveFilterChip>
              ))}
              {hasActiveFilters && (
                <Button type='link' size='small'
onClick={clearAllFilters}>
                  <FormattedMessage id='project_page.public_catalog_clear_filters' />
                </Button>
              )}
            </SearchBar>

            {loading ? (
              <SkeletonGrid aria-busy='true' aria-label={intl.formatMessage({ id: 'project_page.public_catalog_loading' })}>
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </SkeletonGrid>
            ) : projects.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <GlobalOutlined />
                </EmptyIcon>
                <EmptyText>
                  <FormattedMessage
                    id={hasActiveFilters
                      ? 'project_page.public_catalog_search_empty'
                      : 'project_page.public_catalog_empty'}
                  />
                </EmptyText>
              </EmptyState>
            ) : (
              <React.Fragment>
                <ProjectGrid>
                  {projects.map(item => {
                    const authorName = item.authorName || item.authorUserId || '?'
                    const orderValue = orderDrafts[item.projectPageId] !== undefined
                      ? orderDrafts[item.projectPageId]
                      : (item.landingSortOrder ?? 0)
                    const previewUrl = resolveProjectPreviewUrl(item.preview)

                    return (
                      <ProjectCard
                        key={item.projectPageId}
                        whileTap={{ scale: 0.995 }}
                      >
                        <ProjectCardCover
                          type='button'
                          aria-label={displayProjectTitle(item.title, intl)}
                          onClick={() => openProject(item.projectPageId)}
                        >
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt=''
                              loading='lazy'
                            />
                          ) : (
                            <ProjectCardCoverPlaceholder>
                              <GlobalOutlined />
                            </ProjectCardCoverPlaceholder>
                          )}
                        </ProjectCardCover>
                        <ProjectCardContent>
                          <ProjectCardTop>
                            <ProjectGlyph>
                              <GlobalOutlined />
                            </ProjectGlyph>
                            <ProjectCardBody>
                              <ProjectTitleButton
                                type='button'
                                onClick={() => openProject(item.projectPageId)}
                              >
                                {displayProjectTitle(item.title, intl)}
                              </ProjectTitleButton>
                              <OpenButton
                                type='button'
                                onClick={() => openProject(item.projectPageId)}
                              >
                                <FormattedMessage id='project_page.open_project' />
                                <ArrowRightOutlined style={{ fontSize: 12 }} />
                              </OpenButton>
                            </ProjectCardBody>
                          </ProjectCardTop>
                          <AuthorRow>
                            <AuthorAvatar>{getAuthorInitials(authorName)}</AuthorAvatar>
                            <AuthorName>
                              <FormattedMessage
                                id='project_page.author_label'
                                values={{ name: authorName }}
                              />
                            </AuthorName>
                          </AuthorRow>
                          {Array.isArray(item.tags) && item.tags.length > 0 && (
                            <ProjectTagList>
                              {item.tags.map(tag => (
                                <ProjectTag
                                  key={tag}
                                  type='button'
                                  onClick={() => onTagFilter(tag)}
                                >
                                  {tag}
                                </ProjectTag>
                              ))}
                            </ProjectTagList>
                          )}
                          {isSuperAdmin && (
                            <ModerationRow>
                              {item.landingFeatured && (
                                <ModerationBadge>
                                  <PushpinOutlined />
                                  <FormattedMessage
                                    id='project_page.landing_on_badge'
                                    values={{ order: item.landingSortOrder ?? 0 }}
                                  />
                                </ModerationBadge>
                              )}
                              <ModerationActions>
                                {item.landingFeatured ? (
                                  <Space size={4} wrap>
                                    <InputNumber
                                      size='small'
                                      min={0}
                                      value={orderValue}
                                      onChange={value => setOrderDrafts(prev => ({
                                        ...prev,
                                        [item.projectPageId]: value,
                                      }))}
                                      aria-label={intl.formatMessage({ id: 'project_page.landing_order_label' })}
                                    />
                                    <Button
                                      size='small'
                                      loading={orderBusyId === item.projectPageId}
                                      onClick={() => saveSortOrder(item)}
                                    >
                                      <FormattedMessage id='project_page.landing_order_save' />
                                    </Button>
                                    <Button
                                      size='small'
                                      disabled={featureBusy}
                                      onClick={() => removeFromLanding(item)}
                                    >
                                      <FormattedMessage id='project_page.landing_remove' />
                                    </Button>
                                  </Space>
                                ) : (
                                  <Button
                                    size='small'
                                    icon={<PushpinOutlined />}
                                    onClick={() => openFeatureModal(item)}
                                  >
                                    <FormattedMessage id='project_page.landing_add' />
                                  </Button>
                                )}
                                <Button
                                  size='small'
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => openDeleteModal(item)}
                                >
                                  <FormattedMessage id='project_page.moderate_delete' />
                                </Button>
                              </ModerationActions>
                            </ModerationRow>
                          )}
                        </ProjectCardContent>
                      </ProjectCard>
                    )
                  })}
                </ProjectGrid>

                {totalRows > pageSize && (
                  <PaginationWrap>
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={totalRows}
                      onChange={onPaginationChange}
                      showSizeChanger={false}
                      responsive
                    />
                  </PaginationWrap>
                )}
              </React.Fragment>
            )}
          </Panel>
        </motion.div>
      </Stagger>

      <Modal
        open={Boolean(deleteTarget)}
        title={intl.formatMessage({ id: 'project_page.moderate_delete_title' })}
        okText={intl.formatMessage({ id: 'project_page.moderate_delete_confirm' })}
        cancelText={intl.formatMessage({ id: 'project_page.moderate_cancel' })}
        okButtonProps={{ danger: true, loading: deleteBusy, disabled: deleteReason.trim().length < 3 }}
        onOk={confirmDelete}
        onCancel={closeDeleteModal}
        destroyOnClose
      >
        <p>
          <FormattedMessage
            id='project_page.moderate_delete_body'
            values={{ title: displayProjectTitle(deleteTarget?.title, intl) }}
          />
        </p>
        <TextArea
          rows={4}
          value={deleteReason}
          onChange={e => setDeleteReason(e.target.value)}
          placeholder={intl.formatMessage({ id: 'project_page.moderate_reason_placeholder' })}
        />
      </Modal>

      <Modal
        open={Boolean(featureTarget)}
        title={intl.formatMessage({ id: 'project_page.landing_add_title' })}
        okText={intl.formatMessage({ id: 'project_page.landing_add_confirm' })}
        cancelText={intl.formatMessage({ id: 'project_page.moderate_cancel' })}
        okButtonProps={{ loading: featureBusy }}
        onOk={confirmFeature}
        onCancel={closeFeatureModal}
        destroyOnClose
      >
        <p>
          <FormattedMessage
            id='project_page.landing_add_body'
            values={{ title: displayProjectTitle(featureTarget?.title, intl) }}
          />
        </p>
        <label htmlFor='landing-sort-order'>
          <FormattedMessage id='project_page.landing_order_label' />
        </label>
        <InputNumber
          id='landing-sort-order'
          style={{ width: '100%', marginTop: 8 }}
          min={0}
          value={featureOrder}
          onChange={value => setFeatureOrder(value)}
        />
      </Modal>
    </PageContent>
  )
}

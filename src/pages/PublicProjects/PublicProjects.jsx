import React, { useCallback, useEffect, useState } from 'react'
import {
  ArrowRightOutlined,
  DeleteOutlined,
  GlobalOutlined,
  PushpinOutlined,
} from '@ant-design/icons'
import { Button, Input, InputNumber, Modal, Space, message } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  moderateDeleteProjectPage,
  projectPageAPI,
  setLandingFeatured,
} from '@/api/projectPage'
import { SUPER_ADMIN } from '@/constants'
import { useAuthRole } from '@/helpers'
import { displayProjectTitle } from '@/helpers/intl'
import {
  AuthorAvatar,
  AuthorName,
  AuthorRow,
  CatalogCount,
  EmptyIcon,
  EmptyState,
  EmptyText,
  ModerationBadge,
  ModerationRow,
  OpenButton,
  ProjectCard,
  ProjectCardBody,
  ProjectCardTop,
  ProjectGlyph,
  ProjectGrid,
  ProjectTitleButton,
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
const { TextArea } = Input

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
  const authRole = useAuthRole()
  const isSuperAdmin = Number(authRole) === SUPER_ADMIN
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteReason, setDeleteReason] = useState('')
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [featureTarget, setFeatureTarget] = useState(null)
  const [featureOrder, setFeatureOrder] = useState(1)
  const [featureBusy, setFeatureBusy] = useState(false)
  const [orderDrafts, setOrderDrafts] = useState({})
  const [orderBusyId, setOrderBusyId] = useState(null)

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

    projectPageAPI.fetchPublicProjectPages()
      .then(data => {
        if (!cancelled) {
          setProjects(data?.projectPages || [])
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProjects([])
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
  }, [])

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
      setProjects(prev => prev.filter(item => item.projectPageId !== deleteTarget.projectPageId))
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
    { count: projects.length },
  )

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
              {!loading && projects.length > 0 && (
                <CatalogCount>{projectCountLabel}</CatalogCount>
              )}
              {!loading && projects.length === 0 && (
                <SectionHint>
                  <FormattedMessage id='project_page.public_catalog_empty_hint' />
                </SectionHint>
              )}
            </SectionHeader>

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
                  <FormattedMessage id='project_page.public_catalog_empty' />
                </EmptyText>
              </EmptyState>
            ) : (
              <ProjectGrid>
                {projects.map(item => {
                  const authorName = item.authorName || item.authorUserId || '?'
                  const orderValue = orderDrafts[item.projectPageId] !== undefined
                    ? orderDrafts[item.projectPageId]
                    : (item.landingSortOrder ?? 0)

                  return (
                    <ProjectCard
                      key={item.projectPageId}
                      whileTap={{ scale: 0.995 }}
                    >
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
                      {isSuperAdmin && (
                        <ModerationRow>
                          {item.landingFeatured ? (
                            <ModerationBadge>
                              <PushpinOutlined />
                              <FormattedMessage
                                id='project_page.landing_on_badge'
                                values={{ order: item.landingSortOrder ?? 0 }}
                              />
                            </ModerationBadge>
                          ) : (
                            <span style={{ marginRight: 'auto' }} />
                          )}
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
                        </ModerationRow>
                      )}
                    </ProjectCard>
                  )
                })}
              </ProjectGrid>
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

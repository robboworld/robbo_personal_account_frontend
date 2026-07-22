import React, { useCallback } from 'react'
import {
  ArrowRightOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  ProjectOutlined,
} from '@ant-design/icons'
import { Modal, Pagination } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  CreateButton,
  DeleteButton,
  HeroRow,
  PaginationWrap,
} from './styles'

import {
  CardMeta,
  CatalogCount,
  EmptyIcon,
  EmptyState,
  EmptyText,
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
  Eyebrow,
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


const { confirm } = Modal
const SKELETON_COUNT = 6

const formatLastModified = (value, intl) => {
  if (!value) {
    return null
  }

  try {
    return intl.formatDate(new Date(value), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return value
  }
}

const MyProjects = ({
  GetProjectPages,
  DeleteProjectPage,
  CreateProjectPage,
  pageSize,
  currentPage,
  onChangePage,
}) => {
  const navigate = useNavigate()
  const intl = useIntl()

  const loading = GetProjectPages?.loading
  const projectData = GetProjectPages?.GetAllProjectPagesByAccessToken
  const projects = projectData?.projectPages || []
  const totalRows = projectData?.countRows || 0
  const creating = CreateProjectPage?.loading

  const openProject = useCallback(projectPageId => {
    navigate(`/projects/${projectPageId}`, {
      state: { selectedNavBarKey: '2' },
    })
  }, [navigate])

  const confirmDelete = useCallback(projectPageId => {
    confirm({
      title: intl.formatMessage({ id: 'modal_window.delete_confirm' }),
      icon: <ExclamationCircleOutlined />,
      okText: intl.formatMessage({ id: 'modal_window.delete_confirm_ok' }),
      okType: 'danger',
      cancelText: intl.formatMessage({ id: 'modal_window.delete_confirm_cancel_text' }),
      onOk() {
        DeleteProjectPage({ variables: { projectID: projectPageId } })
      },
    })
  }, [DeleteProjectPage, intl])

  const projectCountLabel = intl.formatMessage(
    { id: 'my_projects.count' },
    { count: totalRows },
  )

  return (
    <PageContent>
      <Stagger variants={staggerContainer} initial='hidden'
animate='show'>
        <HeroPanel variants={staggerItem}>
          <HeroRow>
            <HeroInner>
              <Eyebrow>
                <FormattedMessage id='my_projects.eyebrow' />
              </Eyebrow>
              <HeroTitle>
                <FormattedMessage id='my_projects.title' />
              </HeroTitle>
              <HeroLead>
                <FormattedMessage id='home.action.projects.description' />
              </HeroLead>
            </HeroInner>
            <CreateButton
              type='button'
              disabled={creating}
              onClick={() => CreateProjectPage()}
            >
              <PlusOutlined />
              <FormattedMessage id='my_projects.create_new' />
            </CreateButton>
          </HeroRow>
        </HeroPanel>

        <motion.div variants={staggerItem}>
          <Panel>
            <SectionHeader>
              <SectionTitle>
                <FormattedMessage id='my_projects.list_title' />
              </SectionTitle>
              {!loading && totalRows > 0 && (
                <CatalogCount>{projectCountLabel}</CatalogCount>
              )}
              {!loading && totalRows === 0 && (
                <SectionHint>
                  <FormattedMessage id='my_projects.empty_hint' />
                </SectionHint>
              )}
            </SectionHeader>

            {loading ? (
              <SkeletonGrid aria-busy='true' aria-label={intl.formatMessage({ id: 'my_projects.loading' })}>
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </SkeletonGrid>
            ) : projects.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <ProjectOutlined />
                </EmptyIcon>
                <EmptyText>
                  <FormattedMessage id='my_projects.empty' />
                </EmptyText>
                <CreateButton
                  type='button'
                  disabled={creating}
                  onClick={() => CreateProjectPage()}
                >
                  <PlusOutlined />
                  <FormattedMessage id='my_projects.create_new' />
                </CreateButton>
              </EmptyState>
            ) : (
              <React.Fragment>
                <ProjectGrid>
                  {projects.map(projectPage => {
                    const lastModified = formatLastModified(projectPage.lastModified, intl)

                    return (
                      <ProjectCard
                        key={projectPage.projectPageId}
                        whileTap={{ scale: 0.995 }}
                      >
                        <DeleteButton
                          type='button'
                          aria-label={intl.formatMessage({ id: 'project_page.delete' })}
                          onClick={() => confirmDelete(projectPage.projectPageId)}
                        >
                          <DeleteOutlined />
                        </DeleteButton>
                        <ProjectCardTop>
                          <ProjectGlyph>
                            <ProjectOutlined />
                          </ProjectGlyph>
                          <ProjectCardBody>
                            <ProjectTitleButton
                              type='button'
                              onClick={() => openProject(projectPage.projectPageId)}
                            >
                              {projectPage.title || intl.formatMessage({ id: 'project_page.untitled' })}
                            </ProjectTitleButton>
                            {lastModified && (
                              <CardMeta>
                                <FormattedMessage id='project_page.last_change' />
                                {': '}
                                {lastModified}
                              </CardMeta>
                            )}
                            <OpenButton
                              type='button'
                              onClick={() => openProject(projectPage.projectPageId)}
                            >
                              <FormattedMessage id='project_page.open_project' />
                              <ArrowRightOutlined style={{ fontSize: 12 }} />
                            </OpenButton>
                          </ProjectCardBody>
                        </ProjectCardTop>
                      </ProjectCard>
                    )
                  })}
                </ProjectGrid>

                {totalRows > Number(pageSize) && (
                  <PaginationWrap>
                    <Pagination
                      current={+currentPage}
                      pageSize={+pageSize}
                      total={totalRows}
                      onChange={onChangePage}
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
    </PageContent>
  )
}

export default MyProjects

import React, { useCallback, useEffect, useState } from 'react'
import { ArrowRightOutlined, GlobalOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { projectPageAPI } from '@/api/projectPage'
import {
  AuthorAvatar,
  AuthorName,
  AuthorRow,
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

const SKELETON_COUNT = 6

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
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    projectPageAPI.getPublicProjectPages(token)
      .then(res => {
        setProjects(res.data?.projectPages || [])
      })
      .finally(() => setLoading(false))
  }, [])

  const openProject = useCallback(projectPageId => {
    navigate(`/projects/${projectPageId}`)
  }, [navigate])

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
            <Eyebrow>
              <FormattedMessage id='project_page.public_catalog_eyebrow' />
            </Eyebrow>
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
                            {item.title || intl.formatMessage({ id: 'project_page.untitled' })}
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
                    </ProjectCard>
                  )
                })}
              </ProjectGrid>
            )}
          </Panel>
        </motion.div>
      </Stagger>
    </PageContent>
  )
}

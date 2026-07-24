import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import config from '@/config'
import { MY_PROJECTS_ROUTE, PROJECT_PAGE_ROUTE } from '@/constants'
import { RequireAuth } from '@/helpers'


const Shell = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  min-height: 100dvh;
  background: #111;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  height: 40px;
  padding: 0 0.75rem;
  background: #1f1f1f;
  color: #fff;
  font-size: 0.875rem;
`

const TopLink = styled(Link)`
  color: #9ad29a;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const FrameWrap = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
`

const EditorFrame = styled.iframe`
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: #fff;
`

function buildEditorSrc(projectPageId) {
  const base = (config.scratchURL || '').replace(/\/?$/, '/')
  const params = new URLSearchParams()
  params.set('projectPageId', projectPageId)
  return `${base}?${params.toString()}`
}

function ProjectEditorView() {
  const { projectPageId } = useParams()
  const src = useMemo(() => buildEditorSrc(projectPageId), [projectPageId])
  const projectPagePath = PROJECT_PAGE_ROUTE.replace(':projectPageId', projectPageId)

  return (
    <Shell>
      <TopBar>
        <TopLink to={MY_PROJECTS_ROUTE}>
          <FormattedMessage id='project_page.back_to_projects' defaultMessage='К проектам' />
        </TopLink>
        <span aria-hidden='true'>·</span>
        <TopLink to={projectPagePath}>
          <FormattedMessage id='gui.menuBar.seeProjectPage' defaultMessage='Страница проекта' />
        </TopLink>
      </TopBar>
      <FrameWrap>
        <EditorFrame
          title='Robbo Scratch Editor'
          src={src}
          allow='autoplay; fullscreen; clipboard-read; clipboard-write'
        />
      </FrameWrap>
    </Shell>
  )
}

export default function ProjectEditorPage() {
  return (
    <RequireAuth>
      <ProjectEditorView />
    </RequireAuth>
  )
}

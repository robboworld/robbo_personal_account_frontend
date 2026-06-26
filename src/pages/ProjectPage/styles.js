import styled, { css } from 'styled-components'
import { Button } from 'antd'

import theme from '@/theme'

const { colors } = theme

export const PageShell = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 0 2rem;
`

export const BackRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`

export const BackButton = styled(Button)`
  border-radius: 8px;
`

export const AuthorText = styled.span`
  color: rgba(87, 94, 117, 0.85);
  font-size: 0.875rem;
`

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 992px) {
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
    gap: 1.75rem;
  }
`

export const PlayerCard = styled.section`
  background: #fff;
  border: 1px solid rgba(87, 94, 117, 0.12);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 16px -8px rgba(87, 94, 117, 0.2);
`

export const MetaCard = styled.section`
  background: #fff;
  border: 1px solid rgba(87, 94, 117, 0.12);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 16px -8px rgba(87, 94, 117, 0.2);
`

export const ProjectTitle = styled.h1`
  margin: 0 0 1rem;
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 700;
  line-height: 1.25;
  color: #383838;
  word-break: break-word;
`

export const SectionTitle = styled.h2`
  margin: 0 0 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(87, 94, 117, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export const ViewOnlyNote = styled.p`
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  color: rgba(87, 94, 117, 0.75);
`

export const MetaRow = styled.div`
  margin-bottom: 1rem;
`

export const MetaLabel = styled.div`
  margin-bottom: 0.35rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(87, 94, 117, 0.85);
`

export const MetaValue = styled.div`
  font-size: 0.9375rem;
  color: #383838;
`

export const ProjectForm = styled.div`
  .project-page-form .ant-form-item-label > label {
    font-weight: 500;
    color: rgba(87, 94, 117, 0.85);
  }

  .project-page-form .ant-input,
  .project-page-form .ant-input-affix-wrapper,
  .project-page-form textarea.ant-input {
    border-radius: 8px;
  }
`

export const ActionsSection = styled.div`
  margin-top: 0.5rem;
`

export const ActionsGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const ActionButton = styled(Button)`
  border-radius: 8px;
`

export const PrimaryAction = styled(ActionButton)`
  &.ant-btn-primary {
    background: ${colors.accentGreen};
    border-color: ${colors.accentGreen};

    &:hover,
    &:focus {
      background: ${colors.accentGreenHover};
      border-color: ${colors.accentGreenHover};
    }
  }
`

export const ScratchAction = styled(ActionButton)`
  &.ant-btn-primary {
    background: #4c97ff;
    border-color: #4c97ff;

    &:hover,
    &:focus {
      background: #3373cc;
      border-color: #3373cc;
    }
  }
`

export const UploadHint = styled.div`
  margin-top: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #855f2a;
  background: rgba(255, 140, 26, 0.12);
  border: 1px solid rgba(255, 140, 26, 0.35);
`

export const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 0;
`

export const PlayerControls = styled.div`
  display: flex;
  margin-top: 0.75rem;
`

const scratchControlBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0.375rem;
  border: none;
  background: transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  box-sizing: content-box;
  user-select: none;

  svg {
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
  }
`

export const GreenFlagControl = styled.button`
  ${scratchControlBase}

  &:hover {
    background-color: rgba(0, 175, 65, 0.15);
  }

  ${props => props.$active && `
    background-color: rgba(0, 175, 65, 0.35);
  `}
`

export const StopAllControl = styled.button`
  ${scratchControlBase}
  opacity: ${props => (props.$active ? 1 : 0.5)};

  &:hover {
    background-color: rgba(0, 175, 65, 0.15);
  }
`

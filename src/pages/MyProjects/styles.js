import styled from 'styled-components'

import theme from '@/theme'
import { surface } from '@/components/AccountShell'
import { ProjectCard } from '@/components/ProjectCatalog/styles'

const { colors } = theme

export const HeroRow = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  ${theme.above.med`
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
  `}
`

export const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  flex-shrink: 0;
  min-height: 2.75rem;
  padding: 0.65rem 1.25rem;
  border: 0;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.white};
  cursor: pointer;
  background: ${colors.accentGreen};
  box-shadow: 0 10px 24px -12px rgba(0, 175, 65, 0.55);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;

  &:hover {
    background: #009a47;
    box-shadow: 0 14px 28px -10px rgba(0, 175, 65, 0.6);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${colors.accentGreen};
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`

export const DeleteButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: 0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${surface.muted};
  background: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  opacity: 0;
  transition:
    opacity 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;

  article:hover &,
  ${ProjectCard}:hover &,
  ${ProjectCard}:focus-within & {
    opacity: 1;
  }

  &:hover {
    color: #c0392b;
    background: rgba(192, 57, 43, 0.08);
  }

  &:focus-visible {
    opacity: 1;
    outline: 2px solid ${colors.accentGreen};
    outline-offset: 2px;
  }
`

export const PaginationWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  padding-top: 0.25rem;

  .ant-pagination-item-active {
    border-color: ${colors.accentGreen};
  }

  .ant-pagination-item-active a {
    color: ${colors.accentGreen};
  }
`

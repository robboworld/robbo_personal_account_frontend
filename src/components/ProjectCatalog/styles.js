import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'

import theme from '@/theme'
import { surface } from '@/components/AccountShell'

const { colors } = theme

export const CatalogCount = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${colors.secondary};
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid ${surface.line};
`

export const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;

  ${theme.above.small`
    grid-template-columns: repeat(2, minmax(0, 1fr));
  `}

  ${theme.above.large`
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  `}
`

const cardMotion = css`
  transition:
    transform 0.28s cubic-bezier(0.32, 0.72, 0, 1),
    box-shadow 0.28s cubic-bezier(0.32, 0.72, 0, 1),
    border-color 0.28s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${surface.shadowHover};
    border-color: rgba(0, 175, 65, 0.28);
  }

  &:active {
    transform: translateY(-1px) scale(0.995);
  }
`

export const ProjectCard = styled(motion.article)`
  ${cardMotion}
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  min-height: 148px;
  padding: 1.125rem 1.125rem 1rem;
  border-radius: 1rem;
  border: 1px solid ${surface.line};
  background: ${surface.card};
  box-shadow: 0 12px 32px -24px rgba(108, 91, 123, 0.4);
`

export const ProjectCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`

export const ProjectGlyph = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  flex-shrink: 0;
  font-size: 1.125rem;
  color: ${colors.accentGreen};
  background: rgba(0, 175, 65, 0.12);
`

export const ProjectCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
  flex: 1;
`

export const ProjectTitleButton = styled.button`
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.35;
  color: ${colors.secondary};
  text-wrap: balance;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.accentGreen};
  }

  &:focus-visible {
    outline: 2px solid ${colors.accentGreen};
    outline-offset: 3px;
    border-radius: 0.25rem;
  }
`

export const CardMeta = styled.span`
  font-size: 0.8125rem;
  color: ${surface.muted};
`

export const OpenButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  margin-top: 0.15rem;
  padding: 0;
  border: 0;
  background: none;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${colors.accentGreen};
  cursor: pointer;
  transition: color 0.2s ease, gap 0.2s ease;

  &:hover {
    color: #009a47;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${colors.accentGreen};
    outline-offset: 3px;
    border-radius: 0.25rem;
  }
`

export const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;

  ${theme.above.small`
    grid-template-columns: repeat(2, minmax(0, 1fr));
  `}

  ${theme.above.large`
    grid-template-columns: repeat(3, minmax(0, 1fr));
  `}
`

export const SkeletonCard = styled.div`
  min-height: 148px;
  border-radius: 1rem;
  border: 1px solid ${surface.line};
  background: linear-gradient(
    110deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(244, 248, 244, 0.95) 45%,
    rgba(255, 255, 255, 0.9) 90%
  );
  background-size: 200% 100%;
  animation: projectCatalogShimmer 1.4s ease-in-out infinite;

  @keyframes projectCatalogShimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2.5rem 1.5rem;
  text-align: center;
  border-radius: 1rem;
  background: rgba(244, 248, 244, 0.85);
  border: 1px dashed ${surface.line};
`

export const EmptyIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  font-size: 1.25rem;
  color: ${colors.secondaryLight};
  background: rgba(108, 91, 123, 0.1);
`

export const EmptyText = styled.p`
  margin: 0;
  max-width: 36ch;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${surface.muted};
`

export const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.25rem;
`

export const AuthorAvatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  flex-shrink: 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: ${colors.white};
  background: linear-gradient(145deg, ${colors.primary}, ${colors.secondary});
`

export const AuthorName = styled.span`
  font-size: 0.8125rem;
  color: ${surface.muted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ModerationRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  padding-top: 0.5rem;
  border-top: 1px solid ${surface.line};
`

export const ModerationBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-right: auto;
  padding: 0.15rem 0.45rem;
  border-radius: 0.35rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${colors.secondary};
  background: rgba(0, 175, 65, 0.1);
  border: 1px solid rgba(0, 175, 65, 0.22);
`

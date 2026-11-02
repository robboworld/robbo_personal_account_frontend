import styled from 'styled-components'

import { surface } from '@/components/AccountShell/styles'
import theme from '@/theme'

const { colors } = theme

export const UsageMeter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 0;
  padding: 0.85rem 0.9rem 0.95rem;
  border-radius: 0.95rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid ${surface.line};
`

export const UsageMeterTop = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
`

export const UsageMeterLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${colors.secondary};
`

export const UsageMeterValue = styled.span`
  font-size: 0.8125rem;
  color: ${surface.muted};
  white-space: nowrap;
`
